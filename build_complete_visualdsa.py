# -*- coding: utf-8 -*-
"""
VisualDSA Unified Suite Builder
Builds the complete single-file interactive VisualDSA platform
Fully modular architecture: Every component is loaded from app_parts/
100% idempotent, zero duplication on repeat runs.
"""
import os, sys

BASE_DIR = r"D:\Nandini\Work Space\VisualDSA"
PARTS_DIR = os.path.join(BASE_DIR, "app_parts")
HTML_PATH = os.path.join(BASE_DIR, "index.html")
PREVIEW_PATH = os.path.join(BASE_DIR, "preview.html")

with open(HTML_PATH, "r", encoding="utf-8") as f:
    text = f.read()

DIAGNOSTIC_TRAP = """  <!-- Instant Algorithmic Diagnostics & Crash Reporter -->
  <script>
    (function() {
      function showStartupError(title, msg, stack) {
        var root = document.getElementById('root');
        if (!root) return;
        root.innerHTML = '<div style="background:#090d16;color:#f87171;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:monospace;">' +
          '<div style="max-width:800px;width:100%;background:#131c2e;border:1px solid #ef4444;border-radius:12px;padding:24px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);">' +
          '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
          '<span style="font-size:24px;">\\u26a0\\ufe0f</span>' +
          '<h2 style="font-size:18px;font-weight:bold;color:#f87171;margin:0;">VisualDSA Startup Error</h2>' +
          '</div>' +
          '<p style="color:#e2e8f0;font-size:13px;margin:0 0 12px 0;"><strong>' + title + ':</strong> ' + (msg || 'Unknown issue') + '</p>' +
          (stack ? '<pre style="background:#0b1120;color:#fca5a5;padding:14px;border-radius:8px;font-size:11px;overflow-x:auto;max-height:300px;line-height:1.5;border:1px solid rgba(239,68,68,0.2);">' + stack + '</pre>' : '') +
          '<div style="margin-top:16px;text-align:right;">' +
          '<button onclick="location.reload()" style="background:#ef4444;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:12px;">\\u21bb Reload Page</button>' +
          '</div>' +
          '</div></div>';
      }

      window.onerror = function(message, source, lineno, colno, error) {
        showStartupError("Runtime Exception", message + " (" + source + ":" + lineno + ":" + colno + ")", error && error.stack);
      };

      window.addEventListener('unhandledrejection', function(event) {
        showStartupError("Unhandled Promise Rejection", event.reason ? (event.reason.message || event.reason) : "Unknown", event.reason && event.reason.stack);
      });

      var origConsoleError = console.error;
      console.error = function() {
        var args = Array.prototype.slice.call(arguments);
        var text = args.map(function(a) { return (a && a.stack) ? a.stack : String(a); }).join(' ');
        if (text.indexOf('Babel') !== -1 || text.indexOf('SyntaxError') !== -1 || text.indexOf('ReferenceError') !== -1 || text.indexOf('TypeError') !== -1) {
          showStartupError("Script / Compilation Failure", text.slice(0, 400), text);
        }
        origConsoleError.apply(console, arguments);
      };
    })();
  </script>
"""

# Section 1: Pre-style & Head (everything before <style>)
p_style_start = text.find("<style>")
pre_style = text[:p_style_start]
if "Instant Algorithmic Diagnostics" not in pre_style:
    pre_style = pre_style + DIAGNOSTIC_TRAP

# Section 2: CSS styling (Cyber Neon + Bright Mode)
with open(os.path.join(PARTS_DIR, "new_style.css"), "r", encoding="utf-8") as f:
    new_style = f.read()

# Section 3: HTML body, root element, and Babel script opening with React hooks
target_hooks = "const { useState, useEffect, useRef, useMemo, useCallback } = React;\n"
p_style_end = text.find("</style>")
p_hooks = text.find(target_hooks, p_style_end)
style_to_code_start = text[p_style_end + len("</style>"):p_hooks + len(target_hooks)] + "\n"

# Section 4: Master Categories & Topics definitions (31 topics across 11 categories)
with open(os.path.join(PARTS_DIR, "categories_topics.js"), "r", encoding="utf-8") as f:
    categories_topics = f.read()

# Section 5: Python Code Library for all 31 topics
with open(os.path.join(PARTS_DIR, "code_library_full.js"), "r", encoding="utf-8") as f:
    code_library_full = f.read()

# Section 6: Sorting & Searching generators (including Heap Sort)
with open(os.path.join(PARTS_DIR, "sorting_searching.js"), "r", encoding="utf-8") as f:
    sorting_searching_code = f.read()

# Section 7: Step Generators for Pointers, Stack, Queue, Trees, Graphs, DP, Greedy, Count/Bucket/Radix
with open(os.path.join(PARTS_DIR, "generators_full.js"), "r", encoding="utf-8") as f:
    generators_full = f.read()

# Section 8: VisualDSAIntroSplash
with open(os.path.join(PARTS_DIR, "intro_splash.jsx"), "r", encoding="utf-8") as f:
    intro_splash_code = f.read()

# Section 9: VisualDSAMasterApp parts
with open(os.path.join(PARTS_DIR, "part1_head_state.jsx"), "r", encoding="utf-8") as f:
    app_part1 = f.read()
with open(os.path.join(PARTS_DIR, "part2_header_nav.jsx"), "r", encoding="utf-8") as f:
    app_part2 = f.read()
with open(os.path.join(PARTS_DIR, "part3_stages.jsx"), "r", encoding="utf-8") as f:
    app_part3 = f.read()
with open(os.path.join(PARTS_DIR, "part4_footer_modals.jsx"), "r", encoding="utf-8") as f:
    app_part4 = f.read()

full_app = (
    "    // =========================================================================\n"
    "    // 4. MAIN APP COMPONENT (PROFESSIONAL DEVELOPER DASHBOARD)\n"
    "    // =========================================================================\n"
    + app_part1 + "\n"
    + app_part2 + "\n"
    + app_part3 + "\n"
    + app_part4
)

# Section 10: Mount to DOM
post_app = """// Mount to DOM
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<VisualDSAMasterApp />);
  </script>
</body>
</html>
"""

# Assemble Clean HTML
clean_html = (
    pre_style
    + new_style
    + style_to_code_start
    + categories_topics + "\n\n"
    + code_library_full + "\n\n"
    + sorting_searching_code + "\n\n"
    + generators_full + "\n\n"
    + intro_splash_code + "\n\n"
    + full_app + "\n\n"
    + post_app
)

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(clean_html)

with open(PREVIEW_PATH, "w", encoding="utf-8") as f:
    f.write(clean_html)

print("VisualDSA Unified Suite Successfully Built!")
print(f"Total HTML Document Size: {len(clean_html):,} bytes")
