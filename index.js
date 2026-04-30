document.addEventListener("DOMContentLoaded", function () {
  // ========== FAQ аккордеон ==========
  const faqButtons = document.querySelectorAll(".faq-question");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const span = btn.querySelector("span");
      if (answer.classList.contains("active")) {
        answer.classList.remove("active");
        if (span) span.innerText = "+";
      } else {
        answer.classList.add("active");
        if (span) span.innerText = "−";
      }
    });
  });

  // ========== Отправка формы ==========
  const form = document.getElementById("landingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get("name");
      alert(
        `Спасибо, ${name}! Ваша заявка принята. Менеджер свяжется с вами в ближайшее время.`,
      );
      if (typeof ym !== "undefined") {
        ym(98765432, "reachGoal", "zayavka_s_formy");
      }
      form.reset();
    });
  }

  // ========== Плавный скролл для всех якорных ссылок ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ========== Слайдер для решений Cudy ==========
  // Ждём немного, чтобы DOM полностью отрисовался
  setTimeout(() => {
    initSlider();
  }, 100);

  function initSlider() {
    const track = document.querySelector(".slider-track");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dots = document.querySelectorAll(".dot");

    // Проверяем, есть ли слайдер на странице
    if (!track || slides.length === 0) {
      console.log("Слайдер не найден на странице");
      return;
    }

    console.log(`Слайдер инициализирован, найдено слайдов: ${slides.length}`);

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Функция обновления слайдера
    function updateSlider() {
      if (slides.length === 0 || !slides[0]) return;

      const slideWidth = slides[0].offsetWidth;
      const offset = -currentIndex * slideWidth;
      track.style.transform = `translateX(${offset}px)`;

      // Обновляем активную точку
      if (dots.length) {
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentIndex);
        });
      }
    }

    // Переключение на следующий слайд
    function nextSlide() {
      if (currentIndex < totalSlides - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // Зацикливание
      }
      updateSlider();
    }

    // Переключение на предыдущий слайд
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = totalSlides - 1; // Зацикливание
      }
      updateSlider();
    }

    // Обработчики кнопок
    if (nextBtn) {
      nextBtn.removeEventListener("click", nextSlide);
      nextBtn.addEventListener("click", nextSlide);
    }
    if (prevBtn) {
      prevBtn.removeEventListener("click", prevSlide);
      prevBtn.addEventListener("click", prevSlide);
    }

    // Обработчики точек
    if (dots.length) {
      dots.forEach((dot, index) => {
        dot.removeEventListener("click", () => {});
        dot.addEventListener("click", () => {
          currentIndex = index;
          updateSlider();
        });
      });
    }

    // Обновление при изменении размера окна
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateSlider();
      }, 100);
    });

    // Свайп для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderContainer = document.querySelector(".slider-container");

    if (sliderContainer) {
      sliderContainer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      sliderContainer.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            prevSlide();
          } else {
            nextSlide();
          }
        }
      });
    }

    // Клавиатурная навигация
    function handleKeydown(e) {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    }
    document.removeEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", handleKeydown);

    // Первоначальное обновление
    updateSlider();
  }
});
