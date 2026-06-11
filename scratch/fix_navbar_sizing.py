import re

with open(r'E:\Kerala-Jewellers-final\css\navbar.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Restore desktop navbar sizing
# height, padding
css = re.sub(
    r'\.desktop-header\s*\{[^}]+\}',
    '''
.desktop-header {
  z-index: 9;
  background-color: #991f23;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-left: 0;
  padding: 0;
  display: flex;
  box-shadow: 0 4px 4px rgba(142, 142, 142, 0.58);
}

.desktop-header .site-header__inner {
  width: 100%;
  padding: 24px 28px !important;
  min-height: 112px !important;
  display: flex;
  align-items: center;
}
    '''.strip(),
    css
)

# 2. logo size
if '.site-header__brand img' not in css:
    css += '''
.site-header__brand img {
  display: block !important;
  height: auto !important;
  max-width: 210px !important;
  width: min(210px, 48vw) !important;
}
'''

# 3. Restore nav link spacing, font, rate dropdown size, and hover animation
# The nav links need larger font, weight, and hover animation
css = re.sub(
    r'\.site-nav__panel > \.bko-wrap-111-2 > a,\s*\.site-nav__panel > \.bko-wrap-111-2 > \.dropdown > \.dropdown-toggle > a\s*\{[^}]+\}',
    '''
.site-nav__panel > .bko-wrap-111-2 > a,
.site-nav__panel > .bko-wrap-111-2 > .dropdown > .dropdown-toggle > a {
  padding: 10px 20px;
  display: inline-block;
  font-family: Mulish, Arial, sans-serif;
  font-size: 1.3em;
  font-weight: 700;
  text-transform: capitalize;
  color: #fff;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}
    '''.strip(),
    css
)

css = re.sub(
    r'\.site-nav__panel > \.bko-wrap-111-2 > a:hover,\s*\.site-nav__panel > \.bko-wrap-111-2 > \.dropdown > \.dropdown-toggle > a:hover\s*\{[^}]+\}',
    '''
.site-nav__panel > .bko-wrap-111-2 > a:hover,
.site-nav__panel > .bko-wrap-111-2 > .dropdown > .dropdown-toggle > a:hover {
  color: #fff5d8;
}

.site-nav__panel > .bko-wrap-111-2 > a::after,
.site-nav__panel > .bko-wrap-111-2 > .dropdown > .dropdown-toggle > a::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #d4af37;
  transition: width 0.3s ease, left 0.3s ease;
}

.site-nav__panel > .bko-wrap-111-2 > a:hover::after,
.site-nav__panel > .bko-wrap-111-2 > .dropdown > .dropdown-toggle > a:hover::after {
  width: 80%;
  left: 10%;
}
    '''.strip(),
    css
)

# Fix rate dropdown size and font
if '.rate-toggle span' not in css:
    css += '''
.rate-toggle span {
  font-family: Mulish, Arial, sans-serif;
  font-size: 20px !important;
  font-weight: 700;
  letter-spacing: -0.8px;
  white-space: nowrap;
}
'''

# 4. Fix mega menu disappearing (add bridge)
if '.kj-megamenu-dropdown::before' not in css:
    css += '''
/* Bridge to fix hover gap */
.kj-megamenu-dropdown::before {
  content: "";
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 20px;
  background: transparent;
}
'''

# 6. Fix category font to match live site
css = re.sub(
    r'\.kj-megamenu-heading\s*\{[^}]+\}',
    '''
.kj-megamenu-heading {
  color: #991f23 !important;
  font-family: Mulish, Arial, sans-serif !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  margin-bottom: 16px;
  position: relative;
}
    '''.strip(),
    css
)

css = re.sub(
    r'\.kj-megamenu-link\s*\{[^}]+\}',
    '''
.kj-megamenu-link {
  color: #222 !important;
  font-family: Mulish, Arial, sans-serif !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  padding: 6px 0;
  transition: color 0.2s ease, transform 0.2s ease;
  text-decoration: none !important;
}
    '''.strip(),
    css
)

with open(r'E:\Kerala-Jewellers-final\css\navbar.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Applied comprehensive fixes to navbar.css')
