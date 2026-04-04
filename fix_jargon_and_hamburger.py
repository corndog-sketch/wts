#!/usr/bin/env python3
"""
Fix jargon occurrences and remove inline hamburger scripts from all HTML files.
"""

import os
import re
import glob

HTML_DIR = '/home/user/wts'

# Order matters: more specific patterns first
JARGON_REPLACEMENTS = [
    # Multi-word specific phrases first
    ("in plain English, with no rushing and no jargon", "in plain English, at your pace"),
    ("no rushing and no jargon", "in plain English, no rushing"),
    ("no rushing, no jargon", "no rushing, plain English"),
    ("No technical jargon. I explain things the way a friendly family member would.", "I explain things simply — the way a friendly family member would."),
    ("no jargon, no fluff", "no fluff, just practical advice"),
    ("no jargon, no judgment", "plain English, no judgment"),
    ("no jargon, no surprises", "plain English, no surprises"),
    ("No pressure, no jargon", "No pressure, straight answer"),
    ("No commitment, no jargon", "No commitment, straight talk"),
    ("no tech jargon", "plain talk"),
    ("jargon-free", "plain English"),
    # Case-insensitive standalone "no jargon"
    ("no jargon", "plain English"),
    # Any remaining "jargon" (case-sensitive last resort)
    ("No jargon", "Plain English"),
    ("jargon", "plain language"),
]

# The exact inline hamburger script block to remove
HAMBURGER_SCRIPT = """  <script>
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
      });
    }
  </script>"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original

    # Apply jargon replacements (in order, case-sensitive)
    for old, new in JARGON_REPLACEMENTS:
        content = content.replace(old, new)

    # Remove inline hamburger script block
    content = content.replace(HAMBURGER_SCRIPT, '')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    html_files = glob.glob(os.path.join(HTML_DIR, '**/*.html'), recursive=True)
    html_files += glob.glob(os.path.join(HTML_DIR, '*.html'))
    # Deduplicate
    html_files = list(set(html_files))

    changed = []
    for fp in sorted(html_files):
        if process_file(fp):
            changed.append(fp)

    print(f"Processed {len(html_files)} files, modified {len(changed)}:")
    for f in changed:
        print(f"  {f}")

    # Verify no jargon remains
    print("\n--- Verifying no 'jargon' remains ---")
    remaining = []
    for fp in sorted(html_files):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'jargon' in content.lower():
            remaining.append(fp)
            lines = content.split('\n')
            for i, line in enumerate(lines, 1):
                if 'jargon' in line.lower():
                    print(f"  {fp}:{i}: {line.strip()}")

    if not remaining:
        print("  CLEAN — no 'jargon' found in any HTML file.")
    else:
        print(f"  WARNING: {len(remaining)} files still contain 'jargon'!")

    # Verify no hamburger scripts remain
    print("\n--- Verifying no inline hamburger scripts remain ---")
    burger_remaining = []
    for fp in sorted(html_files):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'hamburger.addEventListener' in content:
            burger_remaining.append(fp)

    if not burger_remaining:
        print("  CLEAN — no inline hamburger scripts found.")
    else:
        print(f"  WARNING: {len(burger_remaining)} files still have hamburger scripts!")
        for f in burger_remaining:
            print(f"  {f}")

if __name__ == '__main__':
    main()
