document.addEventListener("DOMContentLoaded", function () {
  // ========== FAQ аккордеон ==========
  // ========== FAQ аккордеон с плавной анимацией ==========
  function initFaq() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      const icon = item.querySelector(".faq-icon");

      if (!button || !answer) return;

      button.addEventListener("click", () => {
        // Переключаем текущий
        answer.classList.toggle("active");
        if (icon) {
          icon.classList.toggle("active");
        }
      });
    });
  }

  // Запускаем FAQ
  initFaq();

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

  // ========== Слайдер отзывов (2 карточки видимы) ==========
  function initReviewsSlider() {
    const track = document.querySelector(".reviews-slider-track");
    const slides = document.querySelectorAll(".review-card");
    const prevBtn = document.querySelector(".reviews-prev-btn");
    const nextBtn = document.querySelector(".reviews-next-btn");
    const dotsContainer = document.querySelector(".reviews-dots");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    const totalSlides = slides.length;
    const totalDots = Math.ceil(totalSlides / slidesPerView);

    // Функция определения количества видимых слайдов
    function getSlidesPerView() {
      if (window.innerWidth <= 900) return 1;
      return 2;
    }

    // Создание точек пагинации
    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("div");
        dot.classList.add("reviews-dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i * slidesPerView));
        dotsContainer.appendChild(dot);
      }
    }

    // Обновление активной точки
    function updateActiveDot() {
      const dots = document.querySelectorAll(".reviews-dot");
      const activeDotIndex = Math.floor(currentIndex / slidesPerView);
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeDotIndex);
      });
    }

    // Обновление слайдера
    function updateSlider() {
      const slideWidth = slides[0].offsetWidth;
      const gap = 24; // gap между слайдами
      const offset = -currentIndex * (slideWidth + gap);
      track.style.transform = `translateX(${offset}px)`;
      updateActiveDot();
    }

    // Переключение на следующий слайд
    function nextSlide() {
      const maxIndex = totalSlides - slidesPerView;
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    }

    // Переключение на предыдущий слайд
    function prevSlide() {
      const maxIndex = totalSlides - slidesPerView;
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex;
      }
      updateSlider();
    }

    function goToSlide(index) {
      currentIndex = Math.min(index, totalSlides - slidesPerView);
      if (currentIndex < 0) currentIndex = 0;
      updateSlider();
    }

    // Обработчики кнопок
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    // Обновление при ресайзе
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
          slidesPerView = newSlidesPerView;
          currentIndex = 0;
          createDots();
          updateSlider();
        } else {
          updateSlider();
        }
      }, 150);
    });

    // Свайп для мобильных
    let touchStartX = 0;
    let touchEndX = 0;
    const container = document.querySelector(".reviews-slider-container");

    if (container) {
      container.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      container.addEventListener("touchend", (e) => {
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

    createDots();
    updateSlider();
  }

  // Запускаем слайдер отзывов
  setTimeout(initReviewsSlider, 100);
});
