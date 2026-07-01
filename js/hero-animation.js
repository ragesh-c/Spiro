(function () {
  "use strict";

  function initHeroAnimation() {
    const hero = document.querySelector(".hero");
    const pinnedWrap = document.querySelector(".hero__pinned-wrap");
    const zoomCard = document.querySelector(".hero__zoom-card");
    const yearLabel = document.querySelector(".hero__year");
    const bigTitle = document.querySelector(".hero__big-title");
    const videoDot = document.querySelector(".hero__video-dot");

    if (!hero || !pinnedWrap || !zoomCard) return;

    // Register ScrollTrigger if not done
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Create pinning & zooming ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => "+=" + window.innerHeight * 1.2, // Pinned for 120vh scroll distance
          pin: true,
          scrub: true,
          anticipatePin: 1,
        }
      });

      // Animate card scale-up, border-radius reduction, year fade-out, and dot reveal
      tl.fromTo(
        zoomCard,
        {
          transform: "translate(-50%, -50%) scale(0.01)",
          borderRadius: "32px",
        },
        {
          transform: "translate(-50%, -50%) scale(1.0)",
          borderRadius: "0px",
          ease: "none",
        },
        0
      );

      // Fade out the year badge as card scales
      tl.fromTo(
        yearLabel,
        { opacity: 1, x: 0 },
        { opacity: 0, x: -50, ease: "none" },
        0
      );

      // Control white dot visibility: fade in early, fade out as card goes full bleed
      tl.fromTo(
        videoDot,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, ease: "none" },
        0.1
      );

      tl.to(
        videoDot,
        { opacity: 0, scale: 0, ease: "none" },
        0.85
      );

      // Keep the big title overlay readable: translate slightly or scale
      tl.fromTo(
        bigTitle,
        { scale: 1, y: 0 },
        { scale: 0.95, y: -10, ease: "none" },
        0
      );
    }
  }

  // Initialize after GSAP loaded
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    initHeroAnimation();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        initHeroAnimation();
      }
    });
  }
})();
