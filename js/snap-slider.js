(function () {
  "use strict";

  function initSnapSlider() {
    const snapSliderHolder = document.querySelector(".snap-slider-holder");
    if (!snapSliderHolder) return;

    const snapSlides = gsap.utils.toArray(".snap-slide");
    const snapCaptions = gsap.utils.toArray(".snap-slide-caption");
    const snapThumbs = gsap.utils.toArray(".thumb-slide");

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

    const thumbHeight = snapThumbs[0].offsetHeight;
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

    // Animate thumbs translation inside master timeline
    masterTimeline.to(
      ".snap-slider-thumbs-wrapper",
      {
        y: -thumbHeight * (slidesCount - 1),
        ease: "none",
      },
      0
    );

    // Animate captions translation inside master timeline
    masterTimeline.to(
      ".snap-slider-captions-wrapper",
      {
        y: -captionHeight * (slidesCount - 1),
        ease: "none",
      },
      0
    );

    // Animate stacked slide reveals inside master timeline
    snapSlides.forEach((slide, i) => {
      if (i === 0) return; // Slide 1 is at the bottom and stays static

      const mask = slide.querySelector(".img-mask");
      const img = slide.querySelector(".section-image");
      if (!mask || !img) return;

      const startTime = i - 1; // Slide i reveals during segment (i-1) to i

      // Slide i mask slides up from 100vh (bottom) to 0
      masterTimeline.fromTo(
        mask,
        { y: window.innerHeight },
        { y: 0, ease: "none" },
        startTime
      );

      // Slide i image slides down from -100vh (top) to 0, canceling out parallax
      masterTimeline.fromTo(
        img,
        { y: -window.innerHeight },
        { y: 0, ease: "none" },
        startTime
      );
    });

    // Interactive custom cursor behavior on hovering thumbnails
    const tracker = document.getElementById("spiro-cursor-follower");
    if (tracker) {
      snapThumbs.forEach((thumb) => {
        thumb.addEventListener("mouseenter", () => {
          // Add custom zoom / scaling look on the follower
          tracker.style.width = "88px";
          tracker.style.height = "88px";
          tracker.style.backgroundColor = "rgba(245, 172, 69, 0.95)";
          // Squeeze pupils
          const leftP = document.getElementById("spiro-pupil-l");
          const rightP = document.getElementById("spiro-pupil-r");
          if (leftP) leftP.style.transform = "scale(1.2)";
          if (rightP) rightP.style.transform = "scale(1.2)";
        });

        thumb.addEventListener("mouseleave", () => {
          // Restore original sizes
          tracker.style.width = "66px";
          tracker.style.height = "66px";
          tracker.style.backgroundColor = "transparent";
          const leftP = document.getElementById("spiro-pupil-l");
          const rightP = document.getElementById("spiro-pupil-r");
          if (leftP) leftP.style.transform = "none";
          if (rightP) rightP.style.transform = "none";
        });
      });
    }
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
