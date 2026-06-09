@php $bookings = $this->getBookings(); @endphp
<x-filament-panels::page>
    <h2 class="text-xl font-bold mb-4">Today's Bookings ({{ $bookings->count() }})</h2>    <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                @forelse($bookings as $booking)
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{{ $loop->iteration }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{{ $booking->name ?? '-' }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{{ $booking->email ?? '-' }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{{ $booking->service ?? '-' }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{{ $booking->created_at->format('H:i') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No bookings today.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</x-filament-panels::page>
