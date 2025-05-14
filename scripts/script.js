function handleClickMenu() {
    let menuIcon = document.querySelector("#menu-button > i");

    let menuBox = document.querySelector(".mobile-side-menu");

    if (menuIcon != null && menuBox != null) {
        if (menuIcon.classList[1].includes("closed")) {
            menuIcon.classList.add("opened");
            menuBox.classList.add("opened");

            menuIcon.classList.remove("closed");
            menuBox.classList.remove("closed");

            menuIcon.style.backgroundImage = "url(./assets/svg/opened-menu-icon.svg)";
        } else if (menuIcon.classList[1].includes("opened")) {
            menuIcon.classList.add("closed");
            menuBox.classList.add("closed");

            menuIcon.classList.remove("opened");
            menuBox.classList.remove("opened");

            menuIcon.style.backgroundImage = "url(./assets/svg/closed-menu-icon.svg)";
        } else {
            console.log("Ha ocurrido un error con el menu")
        }
    }
}

function closeNav() {
    let menuIcon = document.querySelector("#menu-button > i");

    let menuBox = document.querySelector(".mobile-side-menu");

    if (menuIcon.classList[1].includes("opened")) {
        menuIcon.classList.add("closed");
        menuBox.classList.add("closed");

        menuIcon.classList.remove("opened");
        menuBox.classList.remove("opened");

        menuIcon.style.backgroundImage = "url(./assets/svg/closed-menu-icon.svg)";
    } else {
        console.log("Ha ocurrido un error con el menu")
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    function initCarousel() {
        let track = document.getElementById("carousel-track");
        let autoSlideInterval;
        let visibleCount;
        let gap = 32;
        let originalSlides = [];
        let currentIndex;
        let slideWidth;

        let isDragging = false;
        let startPos = 0;
        let startTranslate = 0;

        function initCarouselInner() {
            if (originalSlides.length === 0) {
                originalSlides = Array.from(track.querySelectorAll(".slide"));
            }
            // track.innerHTML = "";
            visibleCount = window.innerWidth >= 768 ? 3 : 1;
            let clonesBefore = originalSlides
                .slice(-visibleCount)
                .map((slide) => slide.cloneNode(true));
            let clonesAfter = originalSlides
                .slice(0, visibleCount)
                .map((slide) => slide.cloneNode(true));
            clonesBefore.forEach((clone) => track.appendChild(clone));
            originalSlides.forEach((slide) => track.appendChild(slide));
            clonesAfter.forEach((clone) => track.appendChild(clone));
            currentIndex = visibleCount;
            setSlideWidth();
            track.style.transition = "none";
            track.style.transform =
                "translateX(" + -((slideWidth + gap) * currentIndex) + "px)";
            if (autoSlideInterval) clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(moveToNextSlide, 3000);
        }

        function setSlideWidth() {
            let slides = Array.from(track.children);
            if (slides.length === 0) return;
            slideWidth = slides[0].getBoundingClientRect().width;
        }

        function moveToNextSlide() {
            currentIndex++;
            track.style.transition = "transform 0.5s ease";
            track.style.transform =
                "translateX(" + -((slideWidth + gap) * currentIndex) + "px)";
        }

        track.addEventListener("transitionend", () => {
            let totalOriginal = originalSlides.length;
            if (currentIndex >= totalOriginal + visibleCount) {
                track.style.transition = "none";
                currentIndex = visibleCount;
                track.style.transform =
                    "translateX(" + -((slideWidth + gap) * currentIndex) + "px)";
            }
            if (currentIndex < visibleCount) {
                track.style.transition = "none";
                currentIndex = totalOriginal + currentIndex;
                track.style.transform =
                    "translateX(" + -((slideWidth + gap) * currentIndex) + "px)";
            }
        });

        // Funciones para el arrastre
        function dragStart(e) {
            isDragging = true;
            startPos = e.clientX;
            startTranslate = -((slideWidth + gap) * currentIndex);
            clearInterval(autoSlideInterval);
            track.style.transition = "none";
        }

        function dragAction(e) {
            if (!isDragging) return;
            let currentPos = e.clientX;
            let diff = currentPos - startPos;
            let newTranslate = startTranslate + diff;
            track.style.transform = `translateX(${newTranslate}px)`;
        }

        function dragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            let diff = e.clientX - startPos;
            // Si se arrastra más de 1/4 del ancho de la slide, se cambia de slide
            if (Math.abs(diff) > slideWidth / 3) {
                if (diff < 0) {
                    currentIndex++;
                } else {
                    currentIndex--;
                }
            }
            track.style.transition = "transform 0.5s ease";
            track.style.transform =
                "translateX(" + -((slideWidth + gap) * currentIndex) + "px)";
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(moveToNextSlide, 3000);
        }

        track.addEventListener("mousedown", dragStart);
        track.addEventListener("mousemove", dragAction);
        track.addEventListener("mouseup", dragEnd);
        track.addEventListener("mouseleave", dragEnd);

        window.addEventListener("resize", () => {
            let newVisibleCount = window.innerWidth >= 768 ? 3 : 1;
            if (newVisibleCount !== visibleCount) {
                initCarouselInner();
            } else {
                setSlideWidth();
                track.style.transition = "none";
                track.style.transform =
                    "translateX(" + -((slideWidth + gap) * currentIndex) + "px)";
            }
        });

        initCarouselInner();
    }

    initCarousel();
});
