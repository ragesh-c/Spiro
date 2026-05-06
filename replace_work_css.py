import sys

with open('css/work.css', 'r') as f:
    lines = f.readlines()

new_css = """
.work-grid-inner {
  max-width: var(--max-wide);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
}

.work-card {
  width: 100%;
  max-width: var(--max-wide);
  border-radius: 24px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  text-decoration: none;
  position: relative;
  background: #111111;
}

.kettle-card__content {
  flex: 0 0 40%;
  padding: 80px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
}

.kettle-card__client {
  font-family: var(--font-body);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
}

.kettle-card__title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(2rem, 3.5vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0;
}

.kettle-card__title span {
  color: rgba(255, 255, 255, 0.6);
}

.kettle-card__media {
  flex: 0 0 60%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
}

.kettle-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Slideshow specific */
.kettle-card__media .slideshow-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s ease-in-out, transform 1.2s ease-in-out;
  transform: scale(1.05);
}
.kettle-card__media .slideshow-slide.slideshow-slide--active {
  opacity: 1;
  transform: scale(1);
}

.kettle-card__pill {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: #a9b5df;
  color: #111;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 16px;
  padding: 16px 32px;
  border-radius: 40px;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Hover states */
.work-card:hover .kettle-card__media > img:not(.slideshow-slide) {
  transform: scale(1.03);
}

.work-card:hover .slideshow-slide.slideshow-slide--active {
  transform: scale(1.03);
}

.work-card:hover .kettle-card__pill {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.work-card.hidden {
  display: none;
}
"""

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if ".work-grid-inner {" in line:
        start_idx = i
        break

for i in range(start_idx, len(lines)):
    line = lines[i]
    if "@media (max-width: 768px) {" in line:
        end_idx = i - 1
        break

if start_idx != -1 and end_idx != -1:
    print(f"Replacing lines {start_idx} to {end_idx}")
    new_lines = lines[:start_idx] + [new_css + "\n"] + lines[end_idx+1:]
    
    # Also fix the media query to flex-direction: column-reverse
    media_query_fix = """@media (max-width: 768px) {
  section#work-grid {
    padding: 48px 24px 80px;
  }
  .work-grid-inner {
    gap: 40px;
  }
  .work-card {
    flex-direction: column-reverse;
    border-radius: 16px;
  }
  .kettle-card__content {
    flex: none;
    padding: 40px 24px;
  }
  .kettle-card__media {
    flex: none;
    aspect-ratio: 4/3;
  }
  .kettle-card__pill {
    display: none;
  }
}
"""
    # Replace from @media (max-width: 768px) to end of file
    for i, line in enumerate(new_lines):
        if "@media (max-width: 768px) {" in line and "section#work-grid" in "".join(new_lines[i:i+5]):
            new_lines = new_lines[:i] + [media_query_fix]
            break
            
    with open('css/work.css', 'w') as f:
        f.writelines(new_lines)
else:
    print(f"Failed. start_idx: {start_idx}, end_idx: {end_idx}")

