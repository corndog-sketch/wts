#!/usr/bin/env python3
"""
Remove inline hamburger menu scripts from all HTML files.
The hamburger code appears either:
  1. As the ONLY content in a <script> block (remove the whole block)
  2. Mixed with other code in a <script> block (remove just the hamburger portion)
"""

import os
import re
import glob

HTML_DIR = '/home/user/wts'

# The hamburger block pattern (with optional comment)
HAMBURGER_PATTERN = re.compile(
    r'([ \t]*// Hamburger menu\n)?'
    r'[ \t]*const hamburger = document\.getElementById\(\'hamburger\'\);\n'
    r'[ \t]*const mobileMenu = document\.getElementById\(\'mobile-menu\'\);\n'
    r'[ \t]*if \(hamburger && mobileMenu\) \{\n'
    r'[ \t]*hamburger\.addEventListener\(\'click\', \(\) => \{\n'
    r'[ \t]*const open = mobileMenu\.classList\.toggle\(\'open\'\);\n'
    r'[ \t]*hamburger\.classList\.toggle\(\'open\', open\);\n'
    r'[ \t]*hamburger\.setAttribute\(\'aria-expanded\', open\);\n'
    r'[ \t]*\}\);\n'
    r'[ \t]*\}\n',
    re.MULTILINE
)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = HAMBURGER_PATTERN.sub('', original)

    # Clean up empty <script> blocks that might remain (just whitespace)
    # e.g. <script>\n  \n</script> or <script>\n</script>
    content = re.sub(r'\n\s*<script>\s*</script>\s*\n', '\n', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    html_files = glob.glob(os.path.join(HTML_DIR, '**/*.html'), recursive=True)
    html_files += glob.glob(os.path.join(HTML_DIR, '*.html'))
    html_files = list(set(html_files))

    changed = []
    for fp in sorted(html_files):
        if process_file(fp):
            changed.append(fp)

    print(f"Processed {len(html_files)} files, modified {len(changed)}:")
    for f in changed:
        print(f"  {f}")

    # Verify
    print("\n--- Verifying no inline hamburger scripts remain ---")
    remaining = []
    for fp in sorted(html_files):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'hamburger.addEventListener' in content:
            remaining.append(fp)

    if not remaining:
        print("  CLEAN — no inline hamburger scripts found.")
    else:
        print(f"  WARNING: {len(remaining)} files still have hamburger scripts!")
        for f in remaining:
            print(f"  {f}")

    # Also verify no jargon
    print("\n--- Re-verifying no 'jargon' remains ---")
    jargon_remaining = []
    for fp in sorted(html_files):
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'jargon' in content.lower():
            jargon_remaining.append(fp)
    if not jargon_remaining:
        print("  CLEAN — no 'jargon' found in any HTML file.")
    else:
        print(f"  WARNING: {len(jargon_remaining)} files still contain 'jargon'!")
        for f in jargon_remaining:
            print(f"  {f}")

if __name__ == '__main__':
    main()
