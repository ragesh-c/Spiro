import re

with open('work.html', 'r') as f:
    html = f.read()

# We need to extract each <a class="work-card ..."> block and replace its contents.
# A regex is perfect for this.

pattern = re.compile(
    r'<a href="([^"]*)" class="work-card ([^"]*)" data-pillar="([^"]*)"(?: style="([^"]*)")?>\s*'
    r'<div class="work-card-image"(?: style="([^"]*)")?>\s*'
    r'<img src="([^"]*)" alt="([^"]*)"(?: style="([^"]*)")?>\s*'
    r'</div>\s*'
    r'<div class="work-card-info">\s*'
    r'<span class="work-card-title">([^<]*)</span>\s*'
    r'<span class="work-card-client">([^<]*)</span>\s*'
    r'</div>\s*'
    r'</a>',
    re.DOTALL
)

def replacer(match):
    href = match.group(1)
    classes = match.group(2)
    pillar = match.group(3)
    a_style = match.group(4)
    div_style = match.group(5)
    img_src = match.group(6)
    img_alt = match.group(7)
    img_style = match.group(8)
    title = match.group(9).strip()
    client = match.group(10).strip()
    
    # Format the title (bold first word, light the rest)
    parts = title.split(" ", 1)
    if len(parts) > 1:
        formatted_title = f'{parts[0]} <span>{parts[1]}</span>'
    else:
        formatted_title = title

    # Build the <a ...>
    a_tag = f'<a href="{href}" class="work-card {classes}" data-pillar="{pillar}"'
    if a_style:
        a_tag += f' style="{a_style}"'
    a_tag += '>'
    
    # Build the media block
    if 'assembly-coffee' in href:
        media_id = ' id="assembly-slideshow"'
        # Assembly uses the slideshow images
        media_inner = f'''
        <img src="assets/img/Assembly/DSC05314-Edit.jpg" alt="{client}" class="slideshow-slide slideshow-slide--active">
        <img src="assets/img/Assembly/DSC05319-Edit.jpg" alt="{client}" class="slideshow-slide">
        <img src="assets/img/Assembly/DSC05334-Edit.jpg" alt="{client}" class="slideshow-slide">
        <div class="kettle-card__pill">View case study &rarr;</div>'''
    else:
        media_id = ''
        media_inner = ""
        if img_src and "display:none" not in (img_style or ""):
            media_inner += f'\n        <img src="{img_src}" alt="{img_alt}">'
        media_inner += '\n        <div class="kettle-card__pill">View case study &rarr;</div>'

    media_div = f'<div class="kettle-card__media"{media_id}'
    if div_style:
        media_div += f' style="{div_style}"'
    media_div += f'>{media_inner}\n      </div>'

    # Combine into the new card
    replacement = f'''{a_tag}
      <div class="kettle-card__content">
        <span class="kettle-card__client">{client}</span>
        <h2 class="kettle-card__title">{formatted_title}</h2>
      </div>
      {media_div}
    </a>'''
    return replacement

new_html = pattern.sub(replacer, html)

with open('work.html', 'w') as f:
    f.write(new_html)

print("Replacement complete.")
