import re

# 1. Fix navbar width and underline in navbar.css
with open(r'E:\Kerala-Jewellers-final\css\navbar.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix layout container width overriding
css = re.sub(
    r'\.desktop-header \.content-container\s*\{[^}]+\}',
    '''
/* Ensure the inner container uses proper max-width and layout */
header.site-header .desktop-header .site-header__inner .layout-container.content-container {
  width: min(100%, 1440px) !important;
  max-width: 1440px !important;
  margin: 0 auto !important;
  padding: 0 !important;
}
    '''.strip(),
    css
)

# Fix link targeting for hover colors and underlines
# Change `> a` to `a` or `.bko-link-111-2` to catch nested elements
css = css.replace(
    '.site-nav__panel > .bko-wrap-111-2 > a,',
    '.site-nav__panel .bko-wrap-111-2 > a,\n.site-nav__panel .bko-wrap-111-2 .div2 > a,'
)
css = css.replace(
    '.site-nav__panel > .bko-wrap-111-2 > a:hover,',
    '.site-nav__panel .bko-wrap-111-2 > a:hover,\n.site-nav__panel .bko-wrap-111-2 .div2 > a:hover,'
)
css = css.replace(
    '.site-nav__panel > .bko-wrap-111-2 > a::after,',
    '.site-nav__panel .bko-wrap-111-2 > a::after,\n.site-nav__panel .bko-wrap-111-2 .div2 > a::after,'
)
css = css.replace(
    '.site-nav__panel > .bko-wrap-111-2 > a:hover::after,',
    '.site-nav__panel .bko-wrap-111-2 > a:hover::after,\n.site-nav__panel .bko-wrap-111-2 .div2 > a:hover::after,'
)

with open(r'E:\Kerala-Jewellers-final\css\navbar.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Fix mobile dropdown width and hamburger animation in responsive.css
with open(r'E:\Kerala-Jewellers-final\css\responsive.css', 'r', encoding='utf-8') as f:
    resp = f.read()

# Add the expected dropdown width and hamburger CSS
mobile_fixes = '''
/* ==========================================
   MOBILE NAVBAR & HAMBURGER OVERRIDES
   ========================================== */
@media (max-width: 991px) {
  header.site-header.header .mobile-nav.site-nav__panel {
    left: 16px !important;
    right: 16px !important;
    width: auto !important;
    max-width: none !important;
    box-sizing: border-box !important;
    margin-left: 0 !important;
    transform: none !important;
  }

  header.site-header.header .mobile-menu-toggle.mobile-menu-button {
    display: inline-flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    width: 48px !important;
    height: 48px !important;
    background: transparent !important;
    border: 0 !important;
    padding: 0 !important;
    cursor: pointer !important;
  }

  header.site-header.header .mobile-menu-toggle__line {
    display: block !important;
    width: 28px !important;
    height: 3px !important;
    background: #ffffff !important;
    border-radius: 2px !important;
    transition: transform 0.25s ease, opacity 0.2s ease !important;
    transform-origin: center !important;
  }

  header.site-header.header .mobile-menu-toggle.mobile-menu-button.is-open .mobile-menu-toggle__line:nth-child(1) {
    transform: translateY(9px) rotate(45deg) !important;
  }

  header.site-header.header .mobile-menu-toggle.mobile-menu-button.is-open .mobile-menu-toggle__line:nth-child(2) {
    opacity: 0 !important;
  }

  header.site-header.header .mobile-menu-toggle.mobile-menu-button.is-open .mobile-menu-toggle__line:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg) !important;
  }
}

@media (max-width: 425px) {
  header.site-header.header .mobile-nav.site-nav__panel {
    left: 12px !important;
    right: 12px !important;
  }
}
'''
if 'MOBILE NAVBAR & HAMBURGER OVERRIDES' not in resp:
    resp += '\n' + mobile_fixes

# 3. Search and remove old hamburger CSS
# Remove pseudo element lines
resp = re.sub(r'\.mobile-menu-toggle::before[^{]*\{[^}]+\}', '', resp)
resp = re.sub(r'\.mobile-menu-toggle::after[^{]*\{[^}]+\}', '', resp)
resp = re.sub(r'\.mobile-menu-toggle__icon[^{]*\{[^}]+\}', '', resp)
resp = re.sub(r'\.hamburger-icon[^{]*\{[^}]+\}', '', resp)
resp = re.sub(r'\.mobile-menu-toggle\.is-open::before[^{]*\{[^}]+\}', '', resp)
resp = re.sub(r'\.mobile-menu-toggle\.is-open::after[^{]*\{[^}]+\}', '', resp)
# Also remove any centered left:50% from mobile-nav
resp = re.sub(r'left:\s*50%;\s*transform:\s*translateX\(-50%\);', '', resp)

with open(r'E:\Kerala-Jewellers-final\css\responsive.css', 'w', encoding='utf-8') as f:
    f.write(resp)

print('Applied fixes for navbar width, hover underlines, mobile dropdown width, and hamburger animation.')
