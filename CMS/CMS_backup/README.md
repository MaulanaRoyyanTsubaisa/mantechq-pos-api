# 🎨 Color Beauty CMS

[![Laravel](https://img.shields.io/badge/Laravel-v8.x-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-v7.4+-777BB4?style=flat-square&logo=php)](https://php.net)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Empower your beauty business with a sleek, efficient content management system.

Color Beauty CMS is a robust backend system designed for beauty service providers to manage bookings, customer data, and content effortlessly. Built with Laravel and integrated with Filament, it offers a user-friendly interface for both administrators and clients.

📚 *Estimated reading time: 10 minutes*

## 🎯 Project Overview

Color Beauty CMS is tailored for beauty salons, makeup artists, and color consultants who want to streamline their booking process and manage their online presence effectively. Key features include:

- 📅 Booking management system
- 👤 Customer profile management
- 📊 Analytics dashboard for daily bookings
- 🖼️ Dynamic content management for services and blog posts
- 💳 Integrated payment processing

**Target Audience:** Beauty professionals, salon owners, and administrators looking for an all-in-one solution to manage their beauty services online.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Development](#️-development)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors & Acknowledgments](#-authors--acknowledgments)
- [Support](#-support)

## 🚀 Quick Start

Prerequisites:
- PHP 8.1
- Composer
- Node.js & NPM
- MySQL

```bash
# Clone the repository
git clone https://github.com/yourusername/color-beauty-cms.git
cd color-beauty-cms

# Install dependencies
composer install
npm install

# Set up environment
cp .env.example .env
php artisan key:generate


Setup database

Buat database baru di MySQL:

sqlCREATE DATABASE nama_database_baru;

Import database dump:

mysql -u username -p nama_database_baru < database/dumps/full_database.sql

Edit file .env sesuai konfigurasi database Anda:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_baru
DB_USERNAME=username_anda
DB_PASSWORD=password_anda

Create storage link
bashphp artisan storage:link

# Compile assets
npm run dev

# Start the server
php artisan serve