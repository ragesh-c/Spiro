(function () {
  "use strict";

  function initSnapSlider() {
    const snapSliderHolder = document.querySelector(".snap-slider-holder");
    if (!snapSliderHolder) return;

    const snapSlides = gsap.utils.toArray(".snap-slide");
    const snapCaptions = gsap.utils.toArray(".snap-slide-caption");

    if (snapSlides.length === 0) return;

    const slidesCount = snapSlides.length;

    // Dynamically size height and set absolute stack order z-indexes
    const setupLayout = () => {
      gsap.set(snapSlides, { height: window.innerHeight });
      snapSlides.forEach((slide, i) => {
        gsap.set(slide, { zIndex: i + 1 });
      });
    };
    setupLayout();
    window.addEventListener("resize", setupLayout);

    // Initial opacity reveal of the slider on scroll entrance
    gsap.fromTo(
      ".snap-slider-images",
      { opacity: 0.15 },
      {
        duration: 1,
        opacity: 1,
        ease: "sine.out",
        scrollTrigger: {
          trigger: snapSliderHolder,
          start: "top 100%",
          end: "+=60%",
          scrub: true,
        },
      }
    );

    // Set initial caption active states
    snapCaptions.forEach((cap, i) => {
      if (i === 0) cap.classList.add("in-view");
      else cap.classList.remove("in-view");
    });

    // Caption active states toggle based on scroll segments
    snapSlides.forEach((slide, index) => {
      ScrollTrigger.create({
        trigger: snapSliderHolder,
        start: () => "top+=" + window.innerHeight * (index - 0.5) + " top",
        end: () => "top+=" + window.innerHeight * (index + 0.5) + " top",
        onEnter: () => {
          snapCaptions.forEach((cap, i) => {
            if (i === index) cap.classList.add("in-view");
            else cap.classList.remove("in-view");
          });
        },
        onEnterBack: () => {
          snapCaptions.forEach((cap, i) => {
            if (i === index) cap.classList.add("in-view");
            else cap.classList.remove("in-view");
          });
        },
      });
    });

    const captionHeight = snapCaptions[0].offsetHeight;

    // ── Build Single Pin & Transition Timeline ───────────────────
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: snapSliderHolder,
        start: "top top",
        end: () => "+=" + window.innerHeight * (slidesCount - 1),
        pin: true,
        scrub: true,
        snap: {
          snapTo: 1 / (slidesCount - 1),
          duration: { min: 0.25, max: 0.6 },
          delay: 0,
          ease: "power2.out",
        },
      },
    });

    // Animate captions translation inside master timeline
    masterTimeline.to(
      ".snap-slider-captions-wrapper",
      {
        y: -captionHeight * (slidesCount - 1),
        ease: "none",
      },
      0
    );

    // Set initial position of slide masks
    snapSlides.forEach((slide, i) => {
      if (i === 0) return;
      const mask = slide.querySelector(".img-mask");
      const img = slide.querySelector(".section-image");
      if (mask) gsap.set(mask, { y: window.innerHeight });
      if (img) gsap.set(img, { y: -window.innerHeight });
    });

    // Slide transition triggers (only transition background images during active scrolls)
    snapSlides.forEach((slide, index) => {
      if (index === 0) return;

      const mask = slide.querySelector(".img-mask");
      const img = slide.querySelector(".section-image");

      ScrollTrigger.create({
        trigger: snapSliderHolder,
        start: () => "top+=" + window.innerHeight * (index - 0.4) + " top",
        end: () => "top+=" + window.innerHeight * (index + 0.6) + " top",
        onEnter: () => {
          gsap.to(mask, { y: 0, duration: 0.75, ease: "power2.out" });
          gsap.to(img, { y: 0, duration: 0.75, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(mask, { y: window.innerHeight, duration: 0.75, ease: "power2.out" });
          gsap.to(img, { y: -window.innerHeight, duration: 0.75, ease: "power2.out" });
        }
      });
    });

    // No thumbnail cursors since thumbnails were removed
  }

  function initHeroZoom() {
    const section = document.querySelector(".hero-zoom-section");
    const box = document.querySelector(".hero-zoom-box");
    const title = document.querySelector(".hero-zoom-title");
    if (!section || !box || !title) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    // Zoom the box to full screen
    tl.to(box, {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "none"
    }, 0);

    // Calculate final Y position dynamically
    const getTargetY = () => {
      const startTop = window.innerHeight * 0.73;
      const finalBottom = window.innerWidth <= 767 ? 40 : 80;
      const titleHeight = title.offsetHeight;
      return window.innerHeight - startTop - finalBottom - titleHeight;
    };

    // Calculate dynamic scale factor
    const getTargetScale = () => {
      if (window.innerWidth <= 767) return 0.75;
      if (window.innerWidth <= 1024) return 0.65;
      return 0.55;
    };

    tl.to(title, {
      y: () => getTargetY(),
      scale: () => getTargetScale(),
      ease: "none"
    }, 0);
  }

  // Safely initialize GSAP after load
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    initSnapSlider();
    initHeroZoom();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        initSnapSlider();
        initHeroZoom();
      }
    });
  }
})();
