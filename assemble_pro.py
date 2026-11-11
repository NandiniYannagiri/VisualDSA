# -*- coding: utf-8 -*-
import os
import sys

BASE_DIR = r"D:\Nandini\Work Space\VisualDSA"
PARTS_DIR = os.path.join(BASE_DIR, "app_parts")
HTML_PATH = os.path.join(BASE_DIR, "index.html")
PREVIEW_PATH = os.path.join(BASE_DIR, "preview.html")

with open(HTML_PATH, "r", encoding="utf-8") as f:
    text = f.read()

# Locate split points
p_style_start = text.find("<style>")
p_style_end = text.find("</style>")
p_app_start = text.find("function VisualDSAMasterApp(")
p_mount = text.find("// Mount to DOM")

if -1 in [p_style_start, p_style_end, p_app_start, p_mount]:
    print("Error: Could not locate split markers in index.html!")
    print(f"p_style_start: {p_style_start}, p_style_end: {p_style_end}, p_app_start: {p_app_start}, p_mount: {p_mount}")
    sys.exit(1)

pre_style = text[:p_style_start]
post_style_to_app = text[p_style_end + len("</style>"):p_app_start]
post_app = text[p_mount:]

# Load parts
with open(os.path.join(PARTS_DIR, "new_style.css"), "r", encoding="utf-8") as f:
    new_style = f.read()

with open(os.path.join(PARTS_DIR, "part1_head_state.jsx"), "r", encoding="utf-8") as f:
    part1 = f.read()

with open(os.path.join(PARTS_DIR, "part2_header_nav.jsx"), "r", encoding="utf-8") as f:
    part2 = f.read()

with open(os.path.join(PARTS_DIR, "part3_stages.jsx"), "r", encoding="utf-8") as f:
    part3 = f.read()

with open(os.path.join(PARTS_DIR, "part4_footer_modals.jsx"), "r", encoding="utf-8") as f:
    part4 = f.read()

full_app = part1 + "\n" + part2 + "\n" + part3 + "\n" + part4

# Verify syntax balance
open_c = full_app.count('{')
close_c = full_app.count('}')
open_p = full_app.count('(')
close_p = full_app.count(')')
open_s = full_app.count('[')
close_s = full_app.count(']')

print(f"Brace check in VisualDSAMasterApp: curlies={open_c - close_c}, parens={open_p - close_p}, brackets={open_s - close_s}")

if (open_c - close_c != 0) or (open_p - close_p != 0) or (open_s - close_s != 0):
    print("Warning: Unbalanced brackets detected! Halting write.")
    sys.exit(1)

full_html = pre_style + new_style + post_style_to_app + full_app + "\n" + post_app

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(full_html)

with open(PREVIEW_PATH, "w", encoding="utf-8") as f:
    f.write(full_html)

print("VisualDSA Pro successfully built and written to:")
print(" -", HTML_PATH)
print(" -", PREVIEW_PATH)
print("Total document size:", len(full_html))
