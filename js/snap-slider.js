(function () {
  "use strict";

  function initSnapSlider() {
    const snapSliderHolder = document.querySelector(".snap-slider-holder");
    if (!snapSliderHolder) return;

    const snapSlides = gsap.utils.toArray(".snap-slide");
    const snapSlidesImgMask = gsap.utils.toArray(".snap-slide .img-mask");
    const snapCaptionWrapper = document.querySelector(".snap-slider-captions");
    const snapCaptions = gsap.utils.toArray(".snap-slide-caption");
    const snapThumbsWrapper = document.querySelector(".snap-slider-thumbs");
    const snapThumbs = gsap.utils.toArray(".thumb-slide");

    if (snapSlides.length === 0) return;

    // Set height of slides to 100vh dynamically
    const setHeight = () => {
      gsap.set(snapSlides, { height: window.innerHeight });
    };
    setHeight();
    window.addEventListener("resize", setHeight);

    // Initial opacity reveal on enter
    gsap.fromTo(
      snapSlidesImgMask,
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

    // Set initial caption state
    snapCaptions.forEach((cap, i) => {
      if (i === 0) cap.classList.add("in-view");
      else cap.classList.remove("in-view");
    });

    // Caption active states toggle
    snapSlides.forEach((slide, index) => {
      ScrollTrigger.create({
        trigger: slide,
        start: "top 50%",
        end: "bottom 50%",
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

    // Pin and translate thumbnails vertical stack
    ScrollTrigger.create({
      trigger: snapSlides,
      start: "top top",
      end: () => "+=" + window.innerHeight * (snapSlides.length - 1),
      pin: snapThumbsWrapper,
      scrub: true,
    });

    const thumbHeight = snapThumbs[0].offsetHeight;
    gsap.fromTo(
      snapThumbs,
      { y: 0 },
      {
        y: -thumbHeight * (snapThumbs.length - 1),
        scrollTrigger: {
          trigger: snapSliderHolder,
          scrub: true,
          start: "top top",
          end: () => "+=" + window.innerHeight * (snapSlides.length - 1),
        },
        ease: "none",
      }
    );

    // Pin and translate captions vertical stack
    ScrollTrigger.create({
      trigger: snapCaptionWrapper,
      start: "top top",
      end: () => "+=" + window.innerHeight * (snapSlides.length - 1),
      pin: true,
      scrub: true,
    });

    const captionHeight = snapCaptions[0].offsetHeight;
    gsap.fromTo(
      snapCaptions,
      { y: 0 },
      {
        y: -captionHeight * (snapCaptions.length - 1),
        scrollTrigger: {
          trigger: snapSliderHolder,
          scrub: true,
          start: "top top",
          end: () => "+=" + window.innerHeight * (snapSlides.length - 1),
        },
        ease: "none",
      }
    );

    // Snapping scroll trigger between slides
    const snapPoints = gsap.utils.snap(1 / (snapSlides.length - 1));
    ScrollTrigger.create({
      trigger: snapSlides,
      start: "top top",
      end: () => "+=" + window.innerHeight * (snapSlides.length - 1),
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.25, max: 0.6 },
        delay: 0,
        ease: "power2.out",
      },
    });

    // Background image blind slider reveal translations
    snapSlides.forEach((slide, i) => {
      const imageWrappers = slide.querySelectorAll(".img-mask");
      const isLastSlide = i === snapSlides.length - 1;
      const isFirstSlide = i === 0;

      gsap.fromTo(
        imageWrappers,
        { y: isFirstSlide ? 0 : -window.innerHeight },
        {
          y: isLastSlide ? 0 : window.innerHeight,
          scrollTrigger: {
            trigger: slide,
            scrub: true,
            start: isFirstSlide ? "top top" : "top bottom",
            end: isLastSlide ? "top top" : undefined,
          },
          ease: "none",
        }
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

  // Safely initialize GSAP after load
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    initSnapSlider();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
        initSnapSlider();
      }
    });
  }
})();
