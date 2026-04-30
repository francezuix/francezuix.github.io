const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = motionQuery.matches;
const currencyToggle = document.querySelector("#currency-toggle");
const priceValues = [...document.querySelectorAll("[data-usd][data-robux]")];
const typewriterItems = [...document.querySelectorAll("[data-typewriter]")];

const updateCurrency = (animate = false) => {
  const key = currencyToggle?.checked ? "robux" : "usd";

  priceValues.forEach((price, index) => {
    price.textContent = price.dataset[key];

    if (animate && !prefersReducedMotion) {
      price.style.setProperty("--price-stagger", `${index * 35}ms`);
      price.classList.remove("price-changing");
      void price.offsetWidth;
      price.classList.add("price-changing");
    }
  });
};

const prepareTypewriters = () => {
  typewriterItems.forEach((item) => {
    item.dataset.typewriterText = item.textContent.trim();
    item.setAttribute("aria-label", item.dataset.typewriterText);
    item.textContent = "";
  });
};

const typeText = (item) => {
  if (item.dataset.typed === "true") {
    return;
  }

  const text = item.dataset.typewriterText || "";
  item.dataset.typed = "true";
  item.classList.add("is-typing");
  item.textContent = "";

  [...text].forEach((letter, index) => {
    window.setTimeout(() => {
      item.textContent += letter;

      if (index === text.length - 1) {
        item.classList.remove("is-typing");
        item.classList.add("typing-done");
      }
    }, index * 34);
  });
};

const setupScrollMotion = () => {
  document.body.classList.add("motion-ready");
  prepareTypewriters();

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  const revealItems = [
    ...document.querySelectorAll(".session > h3"),
    ...document.querySelectorAll(".work"),
    ...document.querySelectorAll(".service"),
    ...document.querySelectorAll(".price-heading"),
    ...document.querySelectorAll(".price-card"),
    ...document.querySelectorAll(".testimonial"),
    document.querySelector(".eunaosei"),
    document.querySelector(".content h3"),
    document.querySelector(".content h4"),
    document.querySelector(".content a"),
  ].filter(Boolean);

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--stagger", `${Math.min(index * 55, 420)}ms`);

    if (item.classList.contains("service") && index % 2 === 0) {
      item.classList.add("from-left");
    }

    if (item.classList.contains("service") && index % 2 !== 0) {
      item.classList.add("from-right");
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          entry.target.classList.remove("is-visible");
          return;
        }

        entry.target.classList.add("is-visible");

        if (entry.target.matches("[data-typewriter]")) {
          typeText(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));

  const header = document.querySelector("header");
  const heroText = document.querySelector(".text");
  const aboutImage = document.querySelector(".about-franca img");
  const contactContent = document.querySelector(".content");

  let ticking = false;

  const updateScrollMotion = () => {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const progressScale = scrollY / maxScroll;

    progress.style.transform = `scaleX(${progressScale})`;

    if (header) {
      header.style.backgroundPosition = `center calc(50% + ${scrollY * 0.16}px)`;
    }

    if (heroText) {
      heroText.style.setProperty("--parallax-text", `${scrollY * 0.09}px`);
    }

    if (aboutImage) {
      const rect = aboutImage.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight * 0.5) * -0.045;
      aboutImage.style.setProperty("--parallax-about", `${offset}px`);
    }

    if (contactContent) {
      const rect = contactContent.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight * 0.5) * -0.08;
      contactContent.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    }

    ticking = false;
  };

  const requestScrollMotion = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollMotion);
      ticking = true;
    }
  };

  updateScrollMotion();
  window.addEventListener("scroll", requestScrollMotion, { passive: true });
  window.addEventListener("resize", requestScrollMotion);
};

if (currencyToggle) {
  currencyToggle.addEventListener("change", () => updateCurrency(true));
  updateCurrency();
}

if (!prefersReducedMotion) {
  setupScrollMotion();
}
