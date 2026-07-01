(function () {
  "use strict";

  // Prevent multiple initializations
  if (document.getElementById("spiro-cursor-follower")) return;

  // Injected HTML for the follower containing SVG eyes and idle circle
  const followerHtml = `
    <div id="spiro-cursor-follower" style="display: none;">
      <!-- Inner circle outline for idle state -->
      <div class="spiro-cursor-circle"></div>
      
      <!-- SVG cartoon eyes for moving state -->
      <svg class="spiro-eyes-svg" viewBox="0 0 100 60" style="pointer-events: none;">
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
    let idleTimeout = null;

    // Track real mouse position
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        follower.style.display = "flex";
        isVisible = true;
      }

      // Add movement class
      follower.classList.add("is-moving");

      // Reset idle timeout
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(function () {
        follower.classList.remove("is-moving");
      }, 500); // 500ms of inactivity resets cursor to idle outline
    });

    // Handle cursor leaving the screen
    document.addEventListener("mouseleave", function () {
      follower.style.display = "none";
      isVisible = false;
      follower.classList.remove("is-moving");
      if (idleTimeout) clearTimeout(idleTimeout);
    });

    // Main animation loop
    function update() {
      if (isVisible) {
        // LERP position of the follower (smooth lag effect)
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;

        // Position the follower (offset by half its width/height: 33px)
        follower.style.transform = `translate3d(${followerX - 33}px, ${followerY - 33}px, 0)`;

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
