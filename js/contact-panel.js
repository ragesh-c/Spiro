/* ═══════════════════════════════════════════════════════════════
   SPIRO CREATIVES — Contact Panel JS
   Injects panel HTML, handles open/close and 5-step form logic
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Inject panel HTML into <body> ─────────────────────────── */
  var panelHTML = `
    <div class="cp-backdrop" id="cp-backdrop" aria-hidden="true"></div>

    <aside class="contact-panel" id="contact-panel" role="dialog" aria-modal="true" aria-label="Start a project">

      <!-- Header -->
      <div class="cp-header">
        <span class="cp-header__label">Start a project</span>
        <button class="cp-close" id="cp-close" aria-label="Close panel">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M1 1l12 12M13 1L1 13"/>
          </svg>
        </button>
      </div>

      <!-- Scrollable body -->
      <div class="cp-body">

        <!-- Contact details -->
        <div class="cp-details">
          <div class="cp-details__eyebrow">Rather talk to someone?</div>
          <div class="cp-details__heading">Let's make something worth talking about.</div>
          <div class="cp-locations">
            <div class="cp-location">
              <div class="cp-location__city">London</div>
              <div class="cp-location__time cp-live-time" aria-live="polite"></div>
            </div>
            <div class="cp-location">
              <div class="cp-location__city">Guildford</div>
              <div class="cp-location__time cp-live-time" aria-live="polite"></div>
            </div>
          </div>
          <a href="mailto:hello@spirocreatives.com" class="cp-details__email">hello@spirocreatives.com</a>
        </div>

        <div class="cp-divider"></div>

        <!-- Multi-step form -->
        <div class="cp-form" id="cp-form">

          <!-- Progress -->
          <div class="cp-progress" aria-label="Form progress">
            <span class="cp-progress__dot is-active" data-step="1"></span>
            <span class="cp-progress__dot" data-step="2"></span>
            <span class="cp-progress__dot" data-step="3"></span>
            <span class="cp-progress__dot" data-step="4"></span>
            <span class="cp-progress__dot" data-step="5"></span>
            <span class="cp-progress__label" id="cp-progress-label">Step 1 of 5</span>
          </div>

          <!-- Step 1: About you -->
          <div class="cp-step is-active" data-step="1">
            <div class="cp-step__heading">Tell us about you.</div>
            <div class="cp-field-row">
              <div class="cp-field">
                <label for="cp-name">Your name *</label>
                <input type="text" id="cp-name" name="name" placeholder="Jane Smith" autocomplete="name" required>
              </div>
              <div class="cp-field">
                <label for="cp-email">Email *</label>
                <input type="email" id="cp-email" name="email" placeholder="jane@brand.com" autocomplete="email" required>
              </div>
            </div>
            <div class="cp-field-row">
              <div class="cp-field">
                <label for="cp-company">Company</label>
                <input type="text" id="cp-company" name="company" placeholder="Brand Co." autocomplete="organization">
              </div>
              <div class="cp-field">
                <label for="cp-website">Website or social</label>
                <input type="text" id="cp-website" name="website" placeholder="instagram.com/brand">
              </div>
            </div>
            <div class="cp-nav">
              <div></div>
              <button class="cp-btn-next" data-next="2">
                Next
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 7h12M8 2l5 5-5 5"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 2: What are you looking for -->
          <div class="cp-step" data-step="2">
            <div class="cp-step__heading">What are you looking for?</div>
            <div class="cp-checkbox-grid">
              <label class="cp-checkbox-item">
                <input type="checkbox" name="services" value="Brand Film">
                <span>Brand Film</span>
              </label>
              <label class="cp-checkbox-item">
                <input type="checkbox" name="services" value="Social Content">
                <span>Social Content</span>
              </label>
              <label class="cp-checkbox-item">
                <input type="checkbox" name="services" value="Photography">
                <span>Photography</span>
              </label>
              <label class="cp-checkbox-item">
                <input type="checkbox" name="services" value="Strategy & Direction">
                <span>Strategy &amp; Direction</span>
              </label>
              <label class="cp-checkbox-item">
                <input type="checkbox" name="services" value="Social Media Management">
                <span>Social Media Mgmt</span>
              </label>
              <label class="cp-checkbox-item">
                <input type="checkbox" name="services" value="Not sure yet">
                <span>Not sure yet</span>
              </label>
            </div>
            <div class="cp-nav">
              <button class="cp-btn-back" data-prev="1">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M13 7H1M6 12L1 7l5-5"/>
                </svg>
                Back
              </button>
              <button class="cp-btn-next" data-next="3">
                Next
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 7h12M8 2l5 5-5 5"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 3: Help us understand -->
          <div class="cp-step" data-step="3">
            <div class="cp-step__heading">Help us understand.</div>
            <div class="cp-field">
              <label for="cp-challenge">What's the challenge your brand is facing right now?</label>
              <textarea id="cp-challenge" name="challenge" placeholder="Tell us what's not working, or what you're trying to achieve…"></textarea>
            </div>
            <div class="cp-field">
              <label for="cp-success-field">What would success look like after working with us?</label>
              <textarea id="cp-success-field" name="success" placeholder="Paint us a picture of the outcome you're after…"></textarea>
            </div>
            <div class="cp-nav">
              <button class="cp-btn-back" data-prev="2">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M13 7H1M6 12L1 7l5-5"/>
                </svg>
                Back
              </button>
              <button class="cp-btn-next" data-next="4">
                Next
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 7h12M8 2l5 5-5 5"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 4: The practical bits -->
          <div class="cp-step" data-step="4">
            <div class="cp-step__heading">The practical bits.</div>
            <div class="cp-field">
              <label>Budget range</label>
              <div class="cp-pills" id="cp-budget-pills">
                <span class="cp-pill-option" data-value="Under £2k">Under £2k</span>
                <span class="cp-pill-option" data-value="£2k – £5k">£2k – £5k</span>
                <span class="cp-pill-option" data-value="£5k – £10k">£5k – £10k</span>
                <span class="cp-pill-option" data-value="£10k+">£10k+</span>
                <span class="cp-pill-option" data-value="Let's discuss">Let's discuss</span>
              </div>
            </div>
            <div class="cp-field">
              <label for="cp-timeline">Ideal start date or timeline</label>
              <div class="cp-select-wrap">
                <select id="cp-timeline" name="timeline">
                  <option value="" disabled selected>Select a window…</option>
                  <option>ASAP</option>
                  <option>Within a month</option>
                  <option>1–3 months</option>
                  <option>3–6 months</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
            <div class="cp-nav">
              <button class="cp-btn-back" data-prev="3">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M13 7H1M6 12L1 7l5-5"/>
                </svg>
                Back
              </button>
              <button class="cp-btn-next" data-next="5">
                Next
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 7h12M8 2l5 5-5 5"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Step 5: One last thing -->
          <div class="cp-step" data-step="5">
            <div class="cp-step__heading">One last thing.</div>
            <div class="cp-field">
              <label for="cp-brand-known">If your brand could be known for one thing, what would it be?</label>
              <textarea id="cp-brand-known" name="brand_known" placeholder="This one's for us — take your time…"></textarea>
            </div>
            <div class="cp-nav">
              <button class="cp-btn-back" data-prev="4">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M13 7H1M6 12L1 7l5-5"/>
                </svg>
                Back
              </button>
              <button class="cp-btn-next" id="cp-submit">
                Send it
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 7h12M8 2l5 5-5 5"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Success state -->
          <div class="cp-success" id="cp-success">
            <div class="cp-success__mark"></div>
            <div class="cp-success__heading">You're in the diary.</div>
            <p class="cp-success__sub">We'll be in touch within one working day. In the meantime, have a look at our work.</p>
          </div>

        </div><!-- /cp-form -->
      </div><!-- /cp-body -->
    </aside>
  `;

  document.body.insertAdjacentHTML('beforeend', panelHTML);

  /* ── 2. Live clock inside panel ───────────────────────────────── */
  function updatePanelClock() {
    var time = new Date().toLocaleString('en-GB', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/London',
      hour12: true
    });
    document.querySelectorAll('.cp-live-time').forEach(function (el) {
      el.textContent = time;
    });
  }
  updatePanelClock();
  setInterval(updatePanelClock, 60000);

  /* ── 3. Open / close logic ────────────────────────────────────── */
  var panel    = document.getElementById('contact-panel');
  var backdrop = document.getElementById('cp-backdrop');
  var closeBtn = document.getElementById('cp-close');

  function openPanel() {
    panel.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    panel.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      var first = panel.querySelector('input, textarea, select');
      if (first) first.focus();
    }, 300);
  }

  function closePanel() {
    panel.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    panel.setAttribute('aria-hidden', 'true');
  }

  // All [data-panel="contact"] triggers
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-panel="contact"]');
    if (trigger) {
      e.preventDefault();
      openPanel();
    }
  });

  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
    }
  });

  /* ── 4. Step navigation ───────────────────────────────────────── */
  var currentStep = 1;
  var totalSteps  = 5;

  function goToStep(n) {
    var current = panel.querySelector('.cp-step.is-active');
    if (current) current.classList.remove('is-active');

    var target = panel.querySelector('.cp-step[data-step="' + n + '"]');
    if (target) target.classList.add('is-active');

    panel.querySelectorAll('.cp-progress__dot').forEach(function (dot) {
      var s = parseInt(dot.dataset.step);
      dot.classList.remove('is-active', 'is-done');
      if (s === n) dot.classList.add('is-active');
      if (s < n)   dot.classList.add('is-done');
    });

    document.getElementById('cp-progress-label').textContent = 'Step ' + n + ' of ' + totalSteps;
    currentStep = n;
  }

  function showError(id, message) {
    var input = document.getElementById(id);
    if (!input) return;
    var field = input.closest('.cp-field');
    if (!field) return;
    field.classList.add('cp-field--error');
    var existing = field.querySelector('.cp-field__error');
    if (!existing) {
      var err = document.createElement('span');
      err.className = 'cp-field__error';
      err.textContent = message;
      field.appendChild(err);
    }
  }

  function clearError(id) {
    var input = document.getElementById(id);
    if (!input) return;
    var field = input.closest('.cp-field');
    if (!field) return;
    field.classList.remove('cp-field--error');
    var existing = field.querySelector('.cp-field__error');
    if (existing) existing.remove();
  }

  // Clear errors as the user types
  ['cp-name', 'cp-email'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { clearError(id); });
  });

  function validateStep1() {
    var name  = document.getElementById('cp-name').value.trim();
    var email = document.getElementById('cp-email').value.trim();
    var valid = true;

    if (!name) {
      showError('cp-name', 'Please enter your name.');
      valid = false;
    } else {
      clearError('cp-name');
    }

    if (!email) {
      showError('cp-email', 'Please enter your email address.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('cp-email', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('cp-email');
    }

    if (!valid) {
      var firstError = panel.querySelector('.cp-field--error input, .cp-field--error textarea');
      if (firstError) firstError.focus();
    }
    return valid;
  }

  panel.addEventListener('click', function (e) {
    var nextBtn = e.target.closest('[data-next]');
    if (nextBtn) {
      if (currentStep === 1 && !validateStep1()) return;
      goToStep(parseInt(nextBtn.dataset.next));
      return;
    }

    var prevBtn = e.target.closest('[data-prev]');
    if (prevBtn) {
      goToStep(parseInt(prevBtn.dataset.prev));
      return;
    }

    if (e.target.closest('#cp-submit')) {
      handleSubmit();
    }
  });

  /* ── 5. Budget pill selection ─────────────────────────────────── */
  var budgetSelected = '';
  document.getElementById('cp-budget-pills').addEventListener('click', function (e) {
    var pill = e.target.closest('.cp-pill-option');
    if (!pill) return;
    document.querySelectorAll('.cp-pill-option').forEach(function (p) { p.classList.remove('is-selected'); });
    pill.classList.add('is-selected');
    budgetSelected = pill.dataset.value;
  });

  /* ── 6. Form submission ───────────────────────────────────────── */
  function handleSubmit() {
    var formData = {
      name:        document.getElementById('cp-name').value.trim(),
      email:       document.getElementById('cp-email').value.trim(),
      company:     document.getElementById('cp-company').value.trim(),
      website:     document.getElementById('cp-website').value.trim(),
      services:    Array.from(panel.querySelectorAll('input[name="services"]:checked')).map(function(c){ return c.value; }),
      challenge:   document.getElementById('cp-challenge').value.trim(),
      success:     document.getElementById('cp-success-field').value.trim(),
      budget:      budgetSelected,
      timeline:    document.getElementById('cp-timeline').value,
      brand_known: document.getElementById('cp-brand-known').value.trim()
    };

    console.log('Spiro contact form submission:', formData);

    // TODO: Wire to your backend / Formspree / Netlify Forms
    // fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: JSON.stringify(formData), headers:{'Content-Type':'application/json'} })

    panel.querySelectorAll('.cp-step').forEach(function (s) { s.classList.remove('is-active'); });
    panel.querySelector('.cp-progress').style.display = 'none';
    document.getElementById('cp-success').classList.add('is-active');
  }

}());
