document.addEventListener("DOMContentLoaded", () => {
  // 0. Splash Video Loader
  const splashLoader = document.getElementById("splash-loader");
  const splashVideo = document.getElementById("splash-video");
  const enterBtn = document.getElementById("enter-btn");

  // Add loading class to body immediately to prevent scrolling
  document.body.classList.add("loading");

  let isSplashFinished = false;

  const finishSplash = () => {
    isSplashFinished = true;
    splashLoader.classList.add("fade-out");
    setTimeout(() => {
      splashLoader.style.display = "none";
      document.body.classList.remove("loading");
      // Start background music after splash is gone
      if (typeof window.startBackgroundMusic === "function") {
        window.startBackgroundMusic();
      }
      // Start hero slider after splash is gone
      if (typeof window.initHeroSlider === "function") {
        window.initHeroSlider();
      }
    }, 1000); // Matches CSS transition time
  };

  if (splashLoader && splashVideo && enterBtn) {

    enterBtn.addEventListener("click", () => {
      // Hide the button
      enterBtn.style.display = "none";
      // Play video with sound
      splashVideo.play().catch((e) => {
        console.log("Splash Play prevented:", e);
        finishSplash();
      });
    });

    // When the video ends naturally
    splashVideo.addEventListener("ended", finishSplash);
  }
  // 1. Mobile Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links li a");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    // Toggle icon
    const icon = hamburger.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close mobile menu when link is clicked
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.querySelector("i").classList.remove("fa-times");
      hamburger.querySelector("i").classList.add("fa-bars");
    });
  });

  // 2. Scroll Spy (Highlight Active Menu Item)
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-links a");

  const sectionObserverOptions = {
    root: null,
    rootMargin: "-100px 0px -40% 0px",
    threshold: 0.1,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active from all
        navItems.forEach((link) => link.classList.remove("active"));

        // If we are at the very top (hero section), don't highlight any section link
        if (window.scrollY < 400) {
          return;
        }

        // Add active to current
        const activeId = entry.target.getAttribute("id");
        const activeLink = document.querySelector(
          `.nav-links a[href="#${activeId}"]`,
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, sectionObserverOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // 3. Sticky Navbar & Background Change on Scroll
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Generate initial state in case of page refresh down the page
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  }

  // Safety check for scroll reset
  window.addEventListener("scroll", () => {
    if (window.scrollY < 400) {
      navItems.forEach((link) => link.classList.remove("active"));
    }
  });

  // 3. Scroll Reveal Animations using Intersection Observer
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-up, .slide-left, .reveal",
  );

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15, // Trigger when 15% of the element is visible
  };

  const animateOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: Stop observing once animated
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => {
    animateOnScroll.observe(el);
  });

  // 4. Hero Slider (Mixed Images and Videos)
  const slides = [
    {
      type: "image",
      src: "assets/images/hero-bg.png",
      tagline: "At your Service since 1989",
      title: "Crafting Elite World-Class Event Experiences",
      motto: '"Come as a Guest and go as a friend"',
    },
    {
      type: "video",
      src: "assets/videos/Slide 2.mp4",
      tagline: "Impeccable Details",
      title: "Exquisite Decor & Arrangements",
      motto: "Setting the stage for perfection",
    },
    {
      type: "video",
      src: "assets/videos/slide3.mp4",
      tagline: "Culinary Excellence",
      title: "Luxurious Dining & Catering",
      motto: "A feast for your senses",
    },
    {
      type: "video",
      src: "assets/videos/slide4.mp4",
      tagline: "Vibrant Celebrations",
      title: "Unforgettable Music & Entertainment",
      motto: "Dance the night away",
    },
    {
      type: "video",
      src: "assets/videos/Slide5.mp4",
      tagline: "Flawless Execution",
      title: "Seamless Event Management",
      motto: "We deliver everything, except Excuses.",
    },
    {
      type: "video",
      src: "assets/videos/slide6.mp4",
      tagline: "Unparalleled Grandeur",
      title: "A Legacy of Elite Celebrations",
      motto: "Invoking blessings from the Almighty",
    },
  ];

  const slots = [
    document.getElementById("slot-0"),
    document.getElementById("slot-1"),
  ];
  const taglineEl = document.querySelector(".slide-tagline");
  const titleEl = document.querySelector(".slide-title");
  const mottoEl = document.querySelector(".slide-motto");

  const loadMediaIntoSlot = (slot, slideConfig) => {
    if (!slot) return;
    if (slideConfig.type === "image") {
      slot.innerHTML = `<img class="slide-media" src="${slideConfig.src}" alt="">`;
    } else {
      slot.innerHTML = `<video class="slide-media" src="${slideConfig.src}" muted playsinline></video>`;
      const vid = slot.querySelector("video");
      if (vid) vid.currentTime = 2; // Preload from 2 seconds
    }
  };

  window.initHeroSlider = () => {
    if (slots[0] && slots[1]) {
      let currentSlide = 0;
      let activeSlotIndex = 0;

      // Initialize first slide (Image)
      loadMediaIntoSlot(slots[0], slides[0]);
      // Set initial text
      taglineEl.innerHTML = slides[0].tagline;
      titleEl.innerHTML = slides[0].title;
      mottoEl.innerHTML = slides[0].motto;

      // Preload second slide
      loadMediaIntoSlot(slots[1], slides[1]);

      setInterval(() => {
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        const currentSlot = slots[activeSlotIndex];
        const nextSlotIndex = activeSlotIndex === 0 ? 1 : 0;
        const nextSlot = slots[nextSlotIndex];

        // Animate text out
        taglineEl.style.transition = "opacity 0.4s ease";
        titleEl.style.transition = "opacity 0.4s ease";
        mottoEl.style.transition = "opacity 0.4s ease";

        taglineEl.style.opacity = "0";
        titleEl.style.opacity = "0";
        mottoEl.style.opacity = "0";

        setTimeout(() => {
          // Update text
          taglineEl.innerHTML = slides[nextSlideIndex].tagline;
          titleEl.innerHTML = slides[nextSlideIndex].title;
          mottoEl.innerHTML = slides[nextSlideIndex].motto;

          // Animate text in
          taglineEl.style.opacity = "1";
          titleEl.style.opacity = "1";
          mottoEl.style.opacity = "1";
        }, 400);

        // Play video if the upcoming slide is a video
        const upcomingVideo = nextSlot.querySelector("video");
        if (upcomingVideo) {
          upcomingVideo.currentTime = 2;
          upcomingVideo.play().catch((e) => console.log("Autoplay issue:", e));
        }

        // Crossfade slots
        currentSlot.classList.remove("active");
        nextSlot.classList.add("active");

        // Pause the previous video (if it was one) and preload the slide after next
        setTimeout(() => {
          const previousVideo = currentSlot.querySelector("video");
          if (previousVideo) {
            previousVideo.pause();
          }
          const afterNextSlideIndex = (nextSlideIndex + 1) % slides.length;
          loadMediaIntoSlot(currentSlot, slides[afterNextSlideIndex]);
        }, 1000); // Wait for CSS crossfade to finish

        currentSlide = nextSlideIndex;
        activeSlotIndex = nextSlotIndex;
      }, 3000); // 3 seconds interval
    }
  };

  // --- Background Music Logic ---
  const bgMusic = document.getElementById("bg-music");
  const soundToggle = document.getElementById("sound-toggle");
  let musicIsPlaying = false;

  if (bgMusic && soundToggle) {
    bgMusic.volume = 0.75;
    const icon = soundToggle.querySelector("i");

    const updateUI = (playing) => {
      if (playing) {
        icon.classList.replace("fa-volume-mute", "fa-volume-up");
        soundToggle.classList.add("playing");
      } else {
        icon.classList.replace("fa-volume-up", "fa-volume-mute");
        soundToggle.classList.remove("playing");
      }
    };

    window.startBackgroundMusic = () => {
      // ONLY start if splash is done AND music isn't already playing
      if (!isSplashFinished || musicIsPlaying) return;

      bgMusic
        .play()
        .then(() => {
          musicIsPlaying = true;
          updateUI(true);
        })
        .catch(() => {
          // Still blocked - interaction listener will catch it eventually
        });
    };

    // Listen for interactions to "unlock" audio after splash
    ["click", "scroll", "touchstart", "keydown"].forEach((ev) => {
      window.addEventListener(ev, window.startBackgroundMusic, { once: true });
    });

    const toggleMusic = () => {
      if (musicIsPlaying) {
        bgMusic.pause();
        musicIsPlaying = false;
        updateUI(false);
      } else {
        bgMusic.play().then(() => {
          musicIsPlaying = true;
          updateUI(true);
        });
      }
    };

    soundToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMusic();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        bgMusic.pause();
      } else if (musicIsPlaying) {
        bgMusic.play().catch(() => { });
      }
    });
  }
});
