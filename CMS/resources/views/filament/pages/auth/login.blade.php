<x-filament-panels::page.simple>
    <x-slot name="card">
        <div class="flex justify-center mb-4">
            <img src="{{ asset('assets/images/logo.png') }}" alt="Logo" class="h-12">
        </div>

        <h2 class="text-center text-2xl font-bold tracking-tight">
            {{ __('filament-panels::pages/auth/login.title') }}
        </h2>

        {{ $this->form }}

        <x-filament::button
            type="submit"
            form="mountedActionForm"
            class="w-full"
        >
            {{ __('filament-panels::pages/auth/login.actions.submit.label') }}
        </x-filament::button>
    </x-slot>
</x-filament-panels::page.simple>
