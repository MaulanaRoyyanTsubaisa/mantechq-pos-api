<!-- Image Slider Section -->
<section class="w-full relative overflow-hidden" data-aos="fade-up">
    <div class="relative w-full flex flex-col items-center justify-center h-[250px] md:h-[350px] lg:h-[550px]">
        <button id="sliderPrev" class="absolute left-4 z-20 bg-white/70 hover:bg-white rounded-full p-2 text-3xl text-gray-800 flex items-center justify-center focus:outline-none" data-aos="fade-up" data-aos-delay="100">
            <span>&lt;</span>
        </button>
        <div class="w-full h-full flex items-center justify-center">
            <img id="sliderImage" src="{{ asset('assets/images/slider1.jpg') }}" alt="Slider" class="object-cover w-full h-full max-w-full transition-all duration-700" />
        </div>
        <button id="sliderNext" class="absolute right-4 z-20 bg-white/70 hover:bg-white rounded-full p-2 text-3xl text-gray-800 flex items-center justify-center focus:outline-none" data-aos="fade-up" data-aos-delay="100">
            <span>&gt;</span>
        </button>
    </div>
    <div class="flex justify-center mt-4 gap-2" data-aos="fade-up" data-aos-delay="150">
        <span class="slider-dot w-3 h-3 rounded-full bg-gray-400 inline-block cursor-pointer" data-index="0"></span>
        <span class="slider-dot w-3 h-3 rounded-full bg-gray-300 inline-block cursor-pointer" data-index="1"></span>
        <span class="slider-dot w-3 h-3 rounded-full bg-gray-300 inline-block cursor-pointer" data-index="2"></span>
        <span class="slider-dot w-3 h-3 rounded-full bg-gray-300 inline-block cursor-pointer" data-index="3"></span>
        <span class="slider-dot w-3 h-3 rounded-full bg-gray-300 inline-block cursor-pointer" data-index="4"></span>
    </div>
</section>

@push('scripts')
<script>
// Simple slider logic
const sliderImages = [
    "{{ asset('assets/images/slider1.jpg') }}",
    "{{ asset('assets/images/slider2.jpg') }}",
    "{{ asset('assets/images/slider3.jpg') }}",
    "{{ asset('assets/images/slider4.jpg') }}",
    "{{ asset('assets/images/slider5.jpg') }}"
];
let sliderIndex = 0;
let sliderInterval = null;

function showSlider(idx) {
    sliderIndex = (idx + sliderImages.length) % sliderImages.length;
    const sliderImage = document.getElementById("sliderImage");
    const sliderDots = document.querySelectorAll(".slider-dot");
    if (sliderImage) sliderImage.src = sliderImages[sliderIndex];
    sliderDots.forEach((dot, i) => {
        dot.classList.toggle('bg-gray-400', i === sliderIndex);
        dot.classList.toggle('bg-gray-300', i !== sliderIndex);
    });
}
function nextSlider() { showSlider(sliderIndex + 1); }
function prevSlider() { showSlider(sliderIndex - 1); }
function startSlider() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => nextSlider(), 4000);
}
document.addEventListener('DOMContentLoaded', function() {
    showSlider(sliderIndex);
    startSlider();
    const sliderPrev = document.getElementById("sliderPrev");
    const sliderNext = document.getElementById("sliderNext");
    const sliderDots = document.querySelectorAll(".slider-dot");
    if (sliderPrev) sliderPrev.onclick = () => { prevSlider(); startSlider(); };
    if (sliderNext) sliderNext.onclick = () => { nextSlider(); startSlider(); };
    sliderDots.forEach((dot, i) => {
        dot.onclick = () => { showSlider(i); startSlider(); };
    });
});
</script>
@endpush
