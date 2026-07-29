// Randomizes the four "Spiro Difference" fan cards on every page load,
// pulling from case-study photography and a small pool of lightweight
// case-study video clips so every visitor sees a different mix.
(function () {
  var IMAGES = [
    // Assembly Coffee
    'assets/img/web/Assembly/assembly-bag-detail.jpg',
    'assets/img/web/Assembly/assembly-boxes-stacked.jpg',
    'assets/img/web/Assembly/assembly-elemental-serving-box.jpg',
    'assets/img/web/Assembly/assembly-journal-portrait-kitchen.jpg',
    'assets/img/web/Assembly/assembly-journal-portrait-library.jpg',
    'assets/img/web/Assembly/assembly-pouch-standing.jpg',
    'assets/img/web/Assembly/assembly-unboxing.jpg',
    'assets/img/web/Assembly/DSC05319-Edit.jpg',
    'assets/img/web/Assembly/ticker/Ay_Cal_56-Edit.jpg',
    'assets/img/web/Assembly/ticker/DSC04137-Edit.jpg',
    // Cezara Hertanu
    'assets/img/web/Cezara/HSM00503-scaled.jpg',
    'assets/img/web/Cezara/cezara-dark.jpg',
    'assets/img/web/Cezara/cezara-pose-1.jpg',
    'assets/img/web/Cezara/cezara-pose-2.jpg',
    'assets/img/web/Cezara/cezara-pose-4.jpg',
    'assets/img/web/Cezara/cezara-pose-5.png',
    'assets/img/web/Cezara/cezara-pose-6.jpg',
    'assets/img/web/Cezara/cezara-pose-7.jpg',
    'assets/img/web/Cezara/cezara-pose-8.jpg',
    // Sorrel Restaurant
    'assets/img/web/Sorrel/DSC01211-Edit.jpg',
    'assets/img/web/Sorrel/DSC01490-Edit.jpg',
    'assets/img/web/Sorrel/DSC01570-Edit.jpg',
    'assets/img/web/Sorrel/DSC01196-Edit.jpg',
    'assets/img/web/Sorrel/DSC01529.jpg',
    'assets/img/web/Sorrel/DSC01588-final.jpg',
    'assets/img/web/Sorrel/sorrel-dish-ring.jpg',
    'assets/img/web/Sorrel/sorrel-scallop-caviar.jpg',
    'assets/img/web/Sorrel/alex-kitchen.png',
    // Clubhouse PT
    'assets/img/web/Clubhouse/HSM04202-scaled.jpg'
  ];

  // Kept deliberately small — these autoplay muted on load, so only the
  // lightweight clips (10-17MB) are eligible. The multi-hundred-MB case
  // study masters are excluded on purpose.
  var VIDEOS = [
    'assets/videos/assembly/Grinder_1x1_V001_web.mp4',
    'assets/videos/assembly/Grinder_9x16_V001_web.mp4',
    'assets/videos/assembly/Grinder_16x9_V001_web.mp4'
  ];

  var MAX_VIDEOS = 2; // cap simultaneous autoplaying videos per pageview

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pickMedia(count) {
    var videoPicks = shuffle(VIDEOS).slice(0, MAX_VIDEOS).map(function (src) {
      return { type: 'video', src: src };
    });
    var imagePicks = shuffle(IMAGES).map(function (src) {
      return { type: 'image', src: src };
    });
    return shuffle(videoPicks.concat(imagePicks)).slice(0, count);
  }

  function buildMediaEl(item, reduceMotion) {
    if (item.type === 'video') {
      var video = document.createElement('video');
      video.className = 'bts-card__img';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-hidden', 'true');
      if (reduceMotion) video.autoplay = false;
      var source = document.createElement('source');
      source.src = item.src;
      source.type = item.src.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4';
      video.appendChild(source);
      return video;
    }
    var img = document.createElement('img');
    img.className = 'bts-card__img';
    img.src = item.src;
    img.loading = 'lazy';
    img.alt = 'Spiro Creatives behind the scenes';
    return img;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cards = document.querySelectorAll('.spiro-difference__image .bts-card');
    if (!cards.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var picks = pickMedia(cards.length);
    var videos = [];

    cards.forEach(function (card, i) {
      var item = picks[i];
      if (!item) return;
      var el = buildMediaEl(item, reduceMotion);
      var existing = card.querySelector('.bts-card__img');
      if (existing) existing.replaceWith(el);
      else card.insertBefore(el, card.firstChild);
      if (item.type === 'video' && !reduceMotion) videos.push(el);
    });

    if (!videos.length) return;

    var wrap = document.querySelector('.spiro-difference__image');
    if (!wrap || !('IntersectionObserver' in window)) {
      videos.forEach(function (v) { v.play().catch(function () {}); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          videos.forEach(function (v) { v.play().catch(function () {}); });
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(wrap);
  });
}());
