(function () {
  "use strict";

  // Prevent multiple initializations
  if (document.getElementById("spiro-cursor-follower")) return;

  // Injected HTML for the follower containing SVG eyes and a text label
  const followerHtml = `
    <div id="spiro-cursor-follower" style="display: none;">
      <svg viewBox="0 0 100 60" style="width: 80%; height: 80%; pointer-events: none;">
        <!-- Left Eye Sclera -->
        <ellipse cx="32" cy="30" rx="15" ry="22" fill="#ffffff" stroke="#000000" stroke-width="4.5" />
        <!-- Left Pupil Group -->
        <g id="spiro-pupil-l">
          <circle cx="32" cy="30" r="7.5" fill="#000000" />
          <circle cx="29.5" cy="27.5" r="2.2" fill="#ffffff" />
        </g>
        
        <!-- Right Eye Sclera -->
        <ellipse cx="68" cy="30" rx="15" ry="22" fill="#ffffff" stroke="#000000" stroke-width="4.5" />
        <!-- Right Pupil Group -->
        <g id="spiro-pupil-r">
          <circle cx="68" cy="30" r="7.5" fill="#000000" />
          <circle cx="65.5" cy="27.5" r="2.2" fill="#ffffff" />
        </g>
      </svg>
      <span class="spiro-cursor-label" style="display: none; pointer-events: none;"></span>
    </div>
  `;

  // Initialize cursor tracker once DOM is ready
  function init() {
    // Append the tracker div to the body
    const div = document.createElement("div");
    div.innerHTML = followerHtml.trim();
    const follower = div.firstChild;
    document.body.appendChild(follower);

    const pupilL = document.getElementById("spiro-pupil-l");
    const pupilR = document.getElementById("spiro-pupil-r");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let isVisible = false;
    let isMoving = false;
    let moveTimeout;

    // Track real mouse position
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        follower.style.display = "flex";
        isVisible = true;
      }

      if (!isMoving) {
        isMoving = true;
        follower.classList.add("is-moving");
      }

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(function () {
        isMoving = false;
        follower.classList.remove("is-moving");
      }, 350); // Decay to idle state 350ms after stopping
    });

    // Handle cursor leaving the screen
    document.addEventListener("mouseleave", function () {
      follower.style.display = "none";
      isVisible = false;
      isMoving = false;
      follower.classList.remove("is-moving");
    });

    document.addEventListener("mouseover", function (e) {
      var target = e.target;
      if (!target) return;
      var slider = target.closest(".hz-slider");
      var isNav = target.closest(".hz-slider__nav") || target.closest(".hz-slider__dots");
      var thumb = target.closest(".thumb-slide");
      
      if ((slider && !isNav) || thumb) {
        var label = follower.querySelector(".spiro-cursor-label");
        if (label) {
          label.textContent = "View case study \u2192";
        }
        follower.classList.add("is-pill");
      }
    });

    document.addEventListener("mouseout", function (e) {
      var target = e.target;
      if (!target) return;
      var related = e.relatedTarget;
      
      var slider = target.closest(".hz-slider");
      var relatedSlider = related ? related.closest(".hz-slider") : null;
      var relatedIsNav = related ? (related.closest(".hz-slider__nav") || related.closest(".hz-slider__dots")) : null;
      
      var thumb = target.closest(".thumb-slide");
      var relatedThumb = related ? related.closest(".thumb-slide") : null;
      
      if (slider && (!relatedSlider || relatedIsNav)) {
        follower.classList.remove("is-pill");
      }
      if (thumb && !relatedThumb) {
        follower.classList.remove("is-pill");
      }
    });

    // Main animation loop
    function update() {
      if (isVisible) {
        // LERP position of the follower (smooth lag effect)
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;

        // Position the follower (centered dynamically using translate3d(-50%, -50%, 0))
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate3d(-50%, -50%, 0)`;

        // Calculate eyeball angle toward the target mouse
        const dx = mouseX - followerX;
        const dy = mouseY - followerY;
        const distance = Math.hypot(dx, dy);

        if (distance > 0.5) {
          const angle = Math.atan2(dy, dx);
          // Limit maximum pupil offset inside the white eyeball
          const maxOffset = 6.5;
          const offset = Math.min(maxOffset, distance * 0.18);
          const pupilX = Math.cos(angle) * offset;
          const pupilY = Math.sin(angle) * offset;

          // Apply translates to left and right pupil SVG groups
          pupilL.style.transform = `translate3d(${pupilX}px, ${pupilY}px, 0)`;
          pupilR.style.transform = `translate3d(${pupilX}px, ${pupilY}px, 0)`;
        } else {
          // If cursor is resting, recenter pupils smoothly
          pupilL.style.transform = "translate3d(0, 0, 0)";
          pupilR.style.transform = "translate3d(0, 0, 0)";
        }
      }

      requestAnimationFrame(update);
    }

    // Start animation loop
    requestAnimationFrame(update);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
