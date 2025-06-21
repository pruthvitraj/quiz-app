const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function startSlideshow() {
  showSlide(currentSlide);
  currentSlide = (currentSlide + 1) % slides.length;
}

// Change image every 5 seconds
setInterval(startSlideshow, 5000);

// Initialize the first slide
startSlideshow();

