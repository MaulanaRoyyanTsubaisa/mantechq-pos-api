<!-- Instagram Feed Section -->
<section class="w-full py-10 bg-white md:hidden" data-aos="fade-up" id="feed">
    <div class="max-w-md mx-auto px-3 sm:px-4">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6" data-aos="fade-up" data-aos-delay="100">follow our instagram</h2>
        <div class="grid grid-cols-2 gap-4 mb-8">
            <img src="{{ asset('assets/images/ig1.jpg') }}" alt="Instagram 1" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" data-aos="fade-up" data-aos-delay="200" />
            <img src="{{ asset('assets/images/ig2.jpg') }}" alt="Instagram 2" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" data-aos="fade-up" data-aos-delay="300" />
            <img src="{{ asset('assets/images/ig3.jpg') }}" alt="Instagram 3" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" data-aos="fade-up" data-aos-delay="400" />
            <img src="{{ asset('assets/images/ig4.jpg') }}" alt="Instagram 4" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" data-aos="fade-up" data-aos-delay="500" />
            <img src="{{ asset('assets/images/ig5.jpg') }}" alt="Instagram 5" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" data-aos="fade-up" data-aos-delay="600" />
            <img src="{{ asset('assets/images/ig6.jpg') }}" alt="Instagram 6" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" data-aos="fade-up" data-aos-delay="700" />
        </div>
        <div class="flex flex-col items-center justify-center">
            <svg class="w-8 h-8 text-gray-800 mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5zm8.75 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 6.5A5.5 5.5 0 1 0 12 17.5a5.5 5.5 0 0 0 0-11zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"></path>
            </svg>
            <span class="text-xl sm:text-2xl font-bold text-gray-800 text-center">@colour_byutie</span>
        </div>
    </div>
</section>
<section class="w-full py-20 bg-white hidden md:block" data-aos="fade-up" id="feed">
    <div class="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center">
        <h2 class="text-4xl lg:text-5xl font-bold text-center mb-4">follow our instagram</h2>
        <div class="flex items-center justify-center mb-4">
            <span class="text-2xl font-semibold text-gray-800 mr-2">@colour_byutie</span>
            <svg class="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5zm8.75 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 6.5A5.5 5.5 0 1 0 12 17.5a5.5 5.5 0 0 0 0-11zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"></path>
            </svg>
        </div>
        <div class="grid grid-cols-3 gap-6">
            <img src="{{ asset('assets/images/ig1.jpg') }}" alt="Instagram 1" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" />
            <img src="{{ asset('assets/images/ig2.jpg') }}" alt="Instagram 2" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" />
            <img src="{{ asset('assets/images/ig3.jpg') }}" alt="Instagram 3" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" />
            <img src="{{ asset('assets/images/ig4.jpg') }}" alt="Instagram 4" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" />
            <img src="{{ asset('assets/images/ig5.jpg') }}" alt="Instagram 5" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" />
            <img src="{{ asset('assets/images/ig6.jpg') }}" alt="Instagram 6" class="w-full aspect-square object-cover rounded-none ig-gallery-img feed-img" />
        </div>
    </div>
</section>

@push('scripts')
<script>
// Simple modal gallery slider
const feedImages = [
    "{{ asset('assets/images/ig1.jpg') }}",
    "{{ asset('assets/images/ig2.jpg') }}",
    "{{ asset('assets/images/ig3.jpg') }}",
    "{{ asset('assets/images/ig4.jpg') }}",
    "{{ asset('assets/images/ig5.jpg') }}",
    "{{ asset('assets/images/ig6.jpg') }}"
];
let feedIndex = 0;
function showFeedModal(idx) {
    feedIndex = idx;
    let modal = document.getElementById('feedModal');
    let modalImg = document.getElementById('feedModalImg');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'feedModal';
        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
        modal.innerHTML = `
            <button id="feedModalClose" class="absolute top-4 right-4 text-white text-3xl">&times;</button>
            <button id="feedModalPrev" class="absolute left-4 text-white text-4xl">&#8592;</button>
            <img id="feedModalImg" src="" class="max-h-[80vh] max-w-[90vw] rounded shadow-lg" />
            <button id="feedModalNext" class="absolute right-4 text-white text-4xl">&#8594;</button>
        `;
        document.body.appendChild(modal);
        modalImg = document.getElementById('feedModalImg');
        document.getElementById('feedModalClose').onclick = closeFeedModal;
        document.getElementById('feedModalPrev').onclick = () => feedSlide(-1);
        document.getElementById('feedModalNext').onclick = () => feedSlide(1);
        modal.onclick = function(e) { if (e.target === modal) closeFeedModal(); };
    }
    modalImg.src = feedImages[feedIndex];
    modal.style.display = 'flex';
}
function closeFeedModal() {
    const modal = document.getElementById('feedModal');
    if (modal) modal.style.display = 'none';
}
function feedSlide(dir) {
    feedIndex = (feedIndex + dir + feedImages.length) % feedImages.length;
    const modalImg = document.getElementById('feedModalImg');
    if (modalImg) modalImg.src = feedImages[feedIndex];
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feed-img').forEach((img, i) => {
        img.style.cursor = 'pointer';
        img.onclick = () => showFeedModal(i);
    });
});
</script>
@endpush
