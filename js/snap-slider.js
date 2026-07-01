(function () {
  "use strict";

  function initSnapSlider() {
    const heroSection = document.querySelector(".hero");
    const heroVideoBg = document.querySelector(".hero__video-bg");
    const heroYearTag = document.querySelector(".hero__year-tag");
    const heroHeadline = document.querySelector(".hero__headline");

    const resizeHeroCard = () => {
      if (window.innerWidth > 767 && heroHeadline && heroVideoBg) {
        // Temporarily clear transform to get the unscaled layout width
        const currentTransform = heroHeadline.style.transform;
        heroHeadline.style.transform = "none";
        const headlineWidth = heroHeadline.getBoundingClientRect().width;
        heroHeadline.style.transform = currentTransform;
        
        const targetLayoutWidth = headlineWidth / 0.65;
        const targetLayoutHeight = targetLayoutWidth / 1.578;
        
        gsap.set(heroVideoBg, {
          width: targetLayoutWidth,
          height: targetLayoutHeight
        });
        
        const heroVideoSideInfo = document.querySelector(".hero__video-side-info");
        if (heroVideoSideInfo) {
          const spaceSide = heroHeadline.offsetLeft;
          const targetSideLeft = spaceSide + headlineWidth + 32;
          gsap.set(heroVideoSideInfo, {
            left: targetSideLeft
          });
        }
      } else if (heroVideoBg) {
        gsap.set(heroVideoBg, { clearProps: "width,height" });
        const heroVideoSideInfo = document.querySelector(".hero__video-side-info");
        if (heroVideoSideInfo) {
          gsap.set(heroVideoSideInfo, { clearProps: "left" });
        }
      }
    };

    if (heroSection && heroVideoBg) {
      resizeHeroCard();
      window.addEventListener("resize", resizeHeroCard);
      // Autoplay glitch-out on load
      if (heroYearTag) {
        gsap.timeline({ delay: 1.2 })
          .to(heroYearTag, { duration: 0.05, opacity: 0.7, x: -8, skewX: 15, ease: "none" })
          .to(heroYearTag, { duration: 0.05, opacity: 0.3, x: 10, y: -4, skewX: -20, ease: "none" })
          .to(heroYearTag, { duration: 0.05, opacity: 0.8, x: -14, y: 6, skewX: 25, ease: "none" })
          .to(heroYearTag, { duration: 0.05, opacity: 0.15, x: 12, y: -6, skewX: -25, scale: 0.9, ease: "none" })
          .to(heroYearTag, { duration: 0.05, opacity: 0, x: 0, y: 0, skewX: 0, scale: 0.8, ease: "power2.in", onComplete: () => {
            heroYearTag.style.display = "none";
          }});
      }

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Expand to full screen viewport coverage
      heroTl.to(heroVideoBg, {
        left: "0px",
        top: "0px",
        bottom: "0px",
        width: "100vw",
        height: "100vh",
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        borderRadius: "0px",
        duration: 0.95,
        ease: "power2.inOut"
      }, 0);

      // Scale down and tuck the brand title to the bottom-left corner
      if (heroHeadline) {
        heroTl.to(heroHeadline, {
          scale: 0.55,
          left: "40px",
          bottom: "40px",
          transformOrigin: "left bottom",
          duration: 0.95,
          ease: "power2.inOut"
        }, 0);
      }
    }

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
      scrub: 1,
    });

    const thumbHeight = snapThumbs[0].offsetHeight;
    gsap.fromTo(
      snapThumbs,
      { y: 0 },
      {
        y: -thumbHeight * (snapThumbs.length - 1),
        scrollTrigger: {
          trigger: snapSliderHolder,
          scrub: 1,
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
      scrub: 1,
    });

    const captionHeight = snapCaptions[0].offsetHeight;
    gsap.fromTo(
      snapCaptions,
      { y: 0 },
      {
        y: -captionHeight * (snapCaptions.length - 1),
        scrollTrigger: {
          trigger: snapSliderHolder,
          scrub: 1,
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
        delay: 0.15, /* Allow Lenis scrolling easing to finish before snap triggers */
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
  const runInit = () => {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      initSnapSlider();
      
      // Dispatch resize and refresh ScrollTrigger once custom fonts are fully loaded
      if (document.fonts) {
        document.fonts.ready.then(() => {
          window.dispatchEvent(new Event("resize"));
          ScrollTrigger.refresh();
        });
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runInit);
  } else {
    runInit();
  }
})();
