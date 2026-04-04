#!/usr/bin/env python3
"""
Fix HTML files:
1. Replace all "jargon" occurrences with natural alternatives
2. Remove inline hamburger script blocks
"""

import os
import re
import glob

# Order matters — more specific patterns first
JARGON_REPLACEMENTS = [
    # Multi-word phrases first (most specific)
    ("in plain English, with no rushing and no jargon", "in plain English, at your pace"),
    ("No technical jargon. I explain things the way a friendly family member would.", "I explain things simply — the way a friendly family member would."),
    ("no jargon, no fluff", "no fluff, just practical advice"),
    ("no jargon, no judgment", "plain English, no judgment"),
    ("no jargon, no surprises", "plain English, no surprises"),
    ("no rushing and no jargon", "in plain English, no rushing"),
    ("no rushing, no jargon", "no rushing, plain English"),
    ("No pressure, no jargon", "No pressure, straight answer"),
    ("No commitment, no jargon", "No commitment, straight talk"),
    ("no tech jargon", "plain talk"),
    ("no jargon", "plain English"),
    ("jargon-free", "plain English"),
    # Case variants
    ("No Jargon", "Plain English"),
    ("Jargon-Free", "Plain English"),
    ("Honest &amp; Jargon-Free", "Honest &amp; Plain English"),
]

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

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Apply jargon replacements
    for old, new in JARGON_REPLACEMENTS:
        content = content.replace(old, new)

    # Remove inline hamburger script
    content = content.replace(HAMBURGER_SCRIPT, '')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated: {filepath}")
    else:
        print(f"  No changes: {filepath}")

    return content != original


def main():
    base = '/home/user/wts'
    html_files = glob.glob(os.path.join(base, '*.html')) + glob.glob(os.path.join(base, 'shared', '*.html'))
    html_files.sort()

    print(f"Processing {len(html_files)} HTML files...")
    changed = 0
    for f in html_files:
        if fix_file(f):
            changed += 1

    print(f"\nDone. {changed} files updated.")

    # Verify no jargon remains
    print("\nVerifying no 'jargon' remains...")
    found = False
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read()
        if 'jargon' in content.lower():
            print(f"  WARNING: 'jargon' still found in {f}")
            # Show context
            for i, line in enumerate(content.splitlines(), 1):
                if 'jargon' in line.lower():
                    print(f"    Line {i}: {line.strip()}")
            found = True
    if not found:
        print("  All clear — no 'jargon' found in any HTML file.")

    # Verify no hamburger scripts remain
    print("\nVerifying no inline hamburger scripts remain...")
    ham_found = False
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read()
        if 'hamburger.addEventListener' in content:
            print(f"  WARNING: inline hamburger script still found in {f}")
            ham_found = True
    if not ham_found:
        print("  All clear — no inline hamburger scripts found.")


if __name__ == '__main__':
    main()
