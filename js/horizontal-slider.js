(function () {
  "use strict";

  var VERTEX_SRC = [
    "attribute vec2 a_position;",
    "varying vec2 v_uv;",
    "void main() {",
    "  v_uv = a_position * 0.5 + 0.5;",
    "  gl_Position = vec4(a_position, 0.0, 1.0);",
    "}"
  ].join("\n");

  // Radial ripple: a ring of distortion expands from the slide's centre
  // and fades out as the crossfade to the next image completes.
  var FRAGMENT_SRC = [
    "precision mediump float;",
    "uniform sampler2D u_from;",
    "uniform sampler2D u_to;",
    "uniform float u_progress;",
    "varying vec2 v_uv;",
    "void main() {",
    "  vec2 center = vec2(0.5, 0.5);",
    "  vec2 toCenter = v_uv - center;",
    "  float dist = length(toCenter);",
    "  float ripple = sin(dist * 30.0 - u_progress * 20.0) * u_progress * (1.0 - u_progress) * 0.15;",
    "  vec2 dir = toCenter / max(dist, 0.0001);",
    "  vec2 offset = dir * ripple;",
    "  vec4 fromColor = texture2D(u_from, v_uv + offset);",
    "  vec4 toColor = texture2D(u_to, v_uv + offset);",
    "  gl_FragColor = mix(fromColor, toColor, u_progress);",
    "}"
  ].join("\n");

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function setupGl(canvas, images) {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return null;

    var vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return null;

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);

    var posLoc = gl.getAttribLocation(program, "a_position");
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var textures = images.map(function (img) {
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      return tex;
    });

    return {
      gl: gl,
      textures: textures,
      uFrom: gl.getUniformLocation(program, "u_from"),
      uTo: gl.getUniformLocation(program, "u_to"),
      uProgress: gl.getUniformLocation(program, "u_progress"),
      resize: function (w, h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      },
      draw: function (fromIndex, toIndex, progress) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[fromIndex]);
        gl.uniform1i(this.uFrom, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[toIndex]);
        gl.uniform1i(this.uTo, 1);
        gl.uniform1f(this.uProgress, progress);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
  }

  function loadImages(imgs) {
    return Promise.all(imgs.map(function (img) {
      if (img.complete && img.naturalWidth) return Promise.resolve(img);
      return new Promise(function (resolve) {
        img.addEventListener("load", function () { resolve(img); }, { once: true });
        img.addEventListener("error", function () { resolve(img); }, { once: true });
      });
    }));
  }

  function initHzSlider(section) {
    var imgs = Array.prototype.slice.call(section.querySelectorAll(".hz-slide__img"));
    var canvas = section.querySelector(".hz-slider__canvas");
    var captions = Array.prototype.slice.call(section.querySelectorAll(".hz-slide-caption"));
    var dots = Array.prototype.slice.call(section.querySelectorAll(".hz-slider__dot"));
    var prevBtn = section.querySelector(".hz-slider__nav--prev");
    var nextBtn = section.querySelector(".hz-slider__nav--next");
    if (!imgs.length) return;

    var count = imgs.length;
    var index = 0;
    var animating = false;
    var ripple = null;
    var TRANSITION_MS = 1100;

    var isSliding = false;
    var snapping = false;

    // Check if slider is already aligned on load
    var initialRect = section.getBoundingClientRect();
    if (Math.abs(initialRect.top) <= 5) {
      isSliding = true;
    }

    function checkSnap() {
      var rect = section.getBoundingClientRect();
      
      // If already perfectly aligned, make sure sliding is engaged
      if (Math.abs(rect.top) <= 5) {
        isSliding = true;
        return;
      }

      if (isSliding || snapping || animating) return;

      // 1. Entering from the top (scrolling down)
      if (rect.top > 5 && rect.top < 100) {
        snapping = true;
        if (window.lenis) {
          window.lenis.scrollTo(section, {
            immediate: false,
            duration: 0.6,
            onComplete: function () {
              snapping = false;
              isSliding = true;
              goTo(0);
            }
          });
        } else {
          window.scrollTo({ top: window.scrollY + rect.top, behavior: "smooth" });
          isSliding = true;
          goTo(0);
          snapping = false;
        }
      }
      // 2. Entering from the bottom (scrolling up)
      else if (rect.top < -5 && rect.top > -100) {
        snapping = true;
        if (window.lenis) {
          window.lenis.scrollTo(section, {
            immediate: false,
            duration: 0.6,
            onComplete: function () {
              snapping = false;
              isSliding = true;
              goTo(count - 1);
            }
          });
        } else {
          window.scrollTo({ top: window.scrollY + rect.top, behavior: "smooth" });
          isSliding = true;
          goTo(count - 1);
          snapping = false;
        }
      }
    }

    window.addEventListener("scroll", checkSnap, { passive: true });

    function updateChrome() {
      captions.forEach(function (cap, i) { cap.classList.toggle("is-active", i === index); });
      dots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === index); });
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === count - 1;
    }

    updateChrome();

    // ── WebGL ripple, falling back to a plain CSS crossfade ───────
    if (canvas && window.WebGLRenderingContext) {
      loadImages(imgs).then(function () {
        try {
          ripple = setupGl(canvas, imgs);
        } catch (err) {
          ripple = null;
        }
        if (ripple) {
          resizeCanvas();
          ripple.draw(0, 0, 0);
          window.addEventListener("resize", resizeCanvas);
        } else {
          useCssFallback();
        }
      });
    } else {
      useCssFallback();
    }

    function resizeCanvas() {
      if (!ripple) return;
      ripple.resize(section.clientWidth, section.clientHeight);
      ripple.draw(index, index, 0);
    }

    function useCssFallback() {
      if (canvas) canvas.style.display = "none";
      imgs.forEach(function (img, i) { img.classList.toggle("is-active", i === index); });
    }

    function animateTransition(fromIndex, toIndex) {
      if (!ripple) {
        imgs.forEach(function (img, i) { img.classList.toggle("is-active", i === toIndex); });
        return;
      }
      var start = performance.now();
      function step(now) {
        var progress = Math.min(1, (now - start) / TRANSITION_MS);
        ripple.draw(fromIndex, toIndex, progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    function goTo(next) {
      var clamped = Math.max(0, Math.min(count - 1, next));
      if (clamped === index || animating) return;
      var from = index;
      index = clamped;
      animating = true;
      section.classList.add("has-interacted");
      animateTransition(from, index);
      updateChrome();
      setTimeout(function () { animating = false; }, TRANSITION_MS);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });
    dots.forEach(function (dot, i) { dot.addEventListener("click", function () { goTo(i); }); });

    // ── Open a case study: shrink the hero back, then navigate ────
    // stopPropagation keeps the site-wide #page-transition fade from
    // also firing for this click — this custom animation replaces it.
    var OPEN_TRANSITION_MS = 700;
    var links = Array.prototype.slice.call(section.querySelectorAll(".hz-slide-caption__link"));
    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var href = link.href;
        section.classList.add("is-opening");
        setTimeout(function () {
          window.location.href = href;
        }, OPEN_TRANSITION_MS);
      });
    });

    // Make the entire slider stage clickable to navigate to the active case study
    var stage = section.querySelector(".hz-slider__stage");
    if (stage) {
      stage.style.cursor = "pointer";
      stage.addEventListener("click", function (e) {
        var activeLink = section.querySelector(".hz-slide-caption.is-active .hz-slide-caption__link");
        if (activeLink && !animating) {
          activeLink.click();
        }
      });
    }

    // ── Wheel scroll-jacking ────────────────────────────────────
    // Only the specific wheel events that should advance a slide are
    // swallowed (preventDefault + stopImmediatePropagation, so Lenis's
    // own wheel listener never sees them). Everything else — including
    // scrolling past the first/last slide — reaches Lenis untouched,
    // so normal page scroll resumes automatically at the edges.
    var WHEEL_THRESHOLD = 10;

    window.addEventListener("wheel", function (e) {
      if (!isSliding) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      var goingForward = e.deltaY > 0;
      var canAdvance = goingForward ? index < count - 1 : index > 0;

      if (canAdvance) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!animating) goTo(goingForward ? index + 1 : index - 1);
      } else {
        // Exiting the slider, allow normal scroll
        isSliding = false;
      }
    }, { passive: false, capture: true });

    // ── Drag / touch swipe ──────────────────────────────────────
    var dragStartX = null;

    section.addEventListener("pointerdown", function (e) {
      if (!isSliding) return;
      dragStartX = e.clientX;
    });

    window.addEventListener("pointerup", function (e) {
      if (dragStartX === null) return;
      var delta = e.clientX - dragStartX;
      dragStartX = null;
      if (Math.abs(delta) > 80) {
        goTo(delta < 0 ? index + 1 : index - 1);
      }
    });

    // ── Keyboard ──────────────────────────────────────────────────
    window.addEventListener("keydown", function (e) {
      if (!isSliding) return;
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    });
  }

  function init() {
    document.querySelectorAll(".hz-slider").forEach(initHzSlider);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
