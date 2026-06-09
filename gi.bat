@echo off
setlocal EnableDelayedExpansion
cls
echo.
echo.
echo.

if "%1"=="" (
    echo.
    echo "Mulai proses looping setiap 15 menit nge push ke git"
    echo.
    echo.

    for /l %%x in (1, 1, 10000) do (
        echo.
        echo.
        echo Hide in %%x
        call :prosescek %%x
        timeout /T 1800 /NOBREAK
    )
) else ( 
    echo.
    echo "Proses upload ke git"
    echo.
    echo.
    echo.
    call :prosescek %1
)

exit /b

:prosescek
set "commit_needed=0"
for /f "tokens=1,* delims=:" %%A in ('git status') do (
    set "line=%%A"
    echo !line! 
    if "!line!"=="nothing to commit, working tree clean" (
        set "commit_needed=0"
    ) else (
        set "commit_needed=1"
    )
)
cls

    echo.
    echo.
    echo. loop ke %1 sd 100000
    echo.
    echo.
    echo.
if %commit_needed% equ 0 (
    echo Tidak ada yang perlu di-commit. Melewati proses.
    echo.
    echo.
    exit /b
) else (
    echo menjalankan git push.
    echo.
    echo.
    goto :proses_push %1
)

:proses_push

set commite=%1
echo %commite%
rem git pull
set tbt=%date:~10,4%%date:~4,2%%date:~7,2%
set xxtime=%time:~0,2%%time:~3,2%
set xxdate=%date:~10,4%%date:~4,2%%date:~7,2%
set comit="commit %username% %tbt% %xxtime% %commite%"
git add *
git commit -m %comit%
git push
git status

exit /b
