import sys

with open('services.html', 'r') as f:
    lines = f.readlines()

with open('kettle_css.txt', 'r') as f:
    new_css = f.read()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "/* FEATURED WORK" in line:
        start_idx = i - 1
        break

for i in range(start_idx, len(lines)):
    line = lines[i]
    if "/* ── Page transition overlay" in line:
        end_idx = i - 1
        break

if start_idx != -1 and end_idx != -1:
    print(f"Replacing lines {start_idx} to {end_idx}")
    new_lines = lines[:start_idx] + [new_css + "\n\n"] + lines[end_idx+1:]
    with open('services.html', 'w') as f:
        f.writelines(new_lines)
else:
    print(f"Failed. start_idx: {start_idx}, end_idx: {end_idx}")
