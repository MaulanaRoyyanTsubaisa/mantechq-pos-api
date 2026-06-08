param(
  [string]$HostName = "localhost",
  [int]$Port = 5432,
  [string]$SuperUser = "postgres",
  [string]$Database = "mantechq_pos",
  [string]$AppUser = "pos_dev",
  [string]$AppPassword = "pos_dev_123",
  [string]$SuperPassword = "",
  [string]$PsqlPath = ""
)

$ErrorActionPreference = "Stop"

function Find-Psql {
  param([string]$ExplicitPath)

  if ($ExplicitPath -and (Test-Path -LiteralPath $ExplicitPath)) {
    return (Resolve-Path -LiteralPath $ExplicitPath).Path
  }

  $command = Get-Command psql -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $candidates = @(
    "C:\Program Files\PostgreSQL\18\bin\psql.exe",
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return $candidate
    }
  }

  throw "psql.exe tidak ditemukan. Install PostgreSQL Command Line Tools atau isi -PsqlPath."
}

function Quote-SqlLiteral {
  param([string]$Value)
  return "'" + $Value.Replace("'", "''") + "'"
}

function Quote-SqlIdentifier {
  param([string]$Value)
  return '"' + $Value.Replace('"', '""') + '"'
}

function Write-Utf8NoBom {
  param(
    [string]$Path,
    [string]$Value
  )
  $encoding = [System.Text.UTF8Encoding]::new($false)
  [System.IO.File]::WriteAllText($Path, $Value, $encoding)
}

$repoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
$schemaPath = Join-Path $repoRoot "postgres\migrations\001_initial_pos_core.sql"
$seedPath = Join-Path $repoRoot "postgres\seeds\001_dev_dummy_data.sql"
$psql = Find-Psql -ExplicitPath $PsqlPath

if (-not (Test-Path -LiteralPath $schemaPath)) {
  throw "Schema tidak ditemukan: $schemaPath"
}

Write-Host "psql: $psql"
Write-Host "Database: $Database"
Write-Host "App user: $AppUser"

if (-not $SuperPassword) {
  $SuperPassword = $env:POSTGRES_SUPERUSER_PASSWORD
}

if (-not $SuperPassword) {
  $securePassword = Read-Host "Password superuser PostgreSQL ($SuperUser)" -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
  $SuperPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}

$previousPgPassword = $env:PGPASSWORD
$env:PGPASSWORD = $SuperPassword

try {
  $dbIdent = Quote-SqlIdentifier $Database
  $appUserIdent = Quote-SqlIdentifier $AppUser
  $appUserLiteral = Quote-SqlLiteral $AppUser
  $appPasswordLiteral = Quote-SqlLiteral $AppPassword
  $dbLiteral = Quote-SqlLiteral $Database

  $bootstrapSql = @"
do `$`$
begin
  if not exists (select 1 from pg_roles where rolname = $appUserLiteral) then
    create role $appUserIdent login password $appPasswordLiteral;
  else
    alter role $appUserIdent with login password $appPasswordLiteral;
  end if;
end
`$`$;

select format('create database %I owner %I', $dbLiteral, $appUserLiteral)
where not exists (select 1 from pg_database where datname = $dbLiteral)\gexec

grant all privileges on database $dbIdent to $appUserIdent;
"@

  $bootstrapFile = Join-Path $env:TEMP "mantechq-pos-bootstrap.sql"
  Write-Utf8NoBom -Path $bootstrapFile -Value $bootstrapSql

  & $psql -h $HostName -p $Port -U $SuperUser -d postgres -v ON_ERROR_STOP=1 -f $bootstrapFile
  if ($LASTEXITCODE -ne 0) {
    throw "Bootstrap database gagal."
  }

  & $psql -h $HostName -p $Port -U $SuperUser -d $Database -v ON_ERROR_STOP=1 -f $schemaPath
  if ($LASTEXITCODE -ne 0) {
    throw "Apply schema gagal."
  }

  if (Test-Path -LiteralPath $seedPath) {
    & $psql -h $HostName -p $Port -U $SuperUser -d $Database -v ON_ERROR_STOP=1 -f $seedPath
    if ($LASTEXITCODE -ne 0) {
      throw "Seed data gagal."
    }
  }

  $grantSql = @"
grant usage on schema public to $appUserIdent;
grant select, insert, update, delete on all tables in schema public to $appUserIdent;
grant usage, select on all sequences in schema public to $appUserIdent;
grant execute on all functions in schema public to $appUserIdent;
alter default privileges in schema public grant select, insert, update, delete on tables to $appUserIdent;
alter default privileges in schema public grant usage, select on sequences to $appUserIdent;
alter default privileges in schema public grant execute on functions to $appUserIdent;
"@

  $grantFile = Join-Path $env:TEMP "mantechq-pos-grants.sql"
  Write-Utf8NoBom -Path $grantFile -Value $grantSql
  & $psql -h $HostName -p $Port -U $SuperUser -d $Database -v ON_ERROR_STOP=1 -f $grantFile
  if ($LASTEXITCODE -ne 0) {
    throw "Grant privilege gagal."
  }

  Write-Host ""
  Write-Host "PostgreSQL POS siap."
  Write-Host "DATABASE_URL=postgresql://$AppUser`:$AppPassword@$HostName`:$Port/$Database"
  Write-Host ""
  Write-Host "Test:"
  Write-Host "& `"$psql`" -h $HostName -p $Port -U $AppUser -d $Database -c `"select count(*) from st_mast;`""
}
finally {
  $env:PGPASSWORD = $previousPgPassword
}
