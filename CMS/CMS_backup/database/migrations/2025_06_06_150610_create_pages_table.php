<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('pages', function (Blueprint $table) {
        $table->id();
        $table->string('slug')->unique()->comment('Contoh: home, about-us, analyze-page'); // Pengidentifikasi unik untuk URL
        $table->string('title')->nullable(); // Judul halaman atau bagian
        $table->string('subtitle')->nullable(); // Subjudul jika ada
        $table->longText('content')->nullable(); // Konten utama, bisa berisi HTML dari RichEditor
        $table->string('banner_image_url')->nullable(); // Gambar banner/utama halaman
        $table->string('seo_title')->nullable(); // Untuk SEO: Judul meta
        $table->text('seo_description')->nullable(); // Untuk SEO: Deskripsi meta
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
