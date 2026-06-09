<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('pages', 'layout')) {
            Schema::table('pages', function (Blueprint $table) {
                $table->renameColumn('layout', 'template');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('pages', 'template')) {
            Schema::table('pages', function (Blueprint $table) {
                $table->renameColumn('template', 'layout');
            });
        }
    }
};
