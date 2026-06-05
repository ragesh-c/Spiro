import os
from pathlib import Path
from PIL import Image

base_dir = Path("/Users/bindurajesh/spiro-creatives")
assets_dir = base_dir / "assets"

print("Starting image conversion to WebP...")

# Supported extensions
extensions = (".jpg", ".jpeg", ".png")

converted_count = 0
total_saved_bytes = 0

for root, dirs, files in os.walk(assets_dir):
    for file in files:
        if file.lower().endswith(extensions):
            orig_path = Path(root) / file
            webp_path = orig_path.with_suffix(".webp")
            
            # Skip if webp already exists and is newer than original
            if webp_path.exists() and webp_path.stat().st_mtime >= orig_path.stat().st_mtime:
                continue
                
            try:
                with Image.open(orig_path) as img:
                    if orig_path.suffix.lower() == ".png":
                        img.save(webp_path, "WEBP", quality=85, lossless=False)
                    else:
                        img.save(webp_path, "WEBP", quality=82)
                        
                orig_size = orig_path.stat().st_size
                webp_size = webp_path.stat().st_size
                saved = orig_size - webp_size
                total_saved_bytes += max(0, saved)
                converted_count += 1
                print(f"Converted: {orig_path.relative_to(base_dir)} -> {webp_path.relative_to(base_dir)}")
                print(f"  Size reduced: {orig_size/1024:.1f}KB -> {webp_size/1024:.1f}KB ({saved/1024:.1f}KB saved)")
            except Exception as e:
                print(f"Failed to convert {orig_path}: {e}")

print(f"\nImage conversion complete! Converted {converted_count} images.")
print(f"Total space saved: {total_saved_bytes / (1024 * 1024):.2f} MB")
