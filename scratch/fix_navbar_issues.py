import re

with open(r'E:\Kerala-Jewellers-final\css\navbar.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Fix the white backside by forcing the outer `.site-header` to be transparent and 0 padding.
# This prevents the duplicate white header from showing behind our red `.desktop-header`.
# The user's Task 2 & 1
override_outer_header = '''
/* Override outer duplicate header wrappers to prevent white backside */
header.site-header {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
}
'''
if 'Override outer duplicate header wrappers' not in css:
    css = override_outer_header + '\n' + css

# 2. Ensure desktop header container uses proper max-width and full layout
# Task 3
# The `.desktop-header` is our main red navbar. We need to make sure the `.site-header__inner` 
# or `.container-9` inside it spans fully.
# The user asked: 
# "Ensure desktop header container uses proper max-width and full layout:
# - width: min(100%, 1440px)
# - margin: 0 auto
# - display flex
# - align center
# - justify space-between"

# Let's add a specific rule for `.site-header__container` and `.content-container` inside `.desktop-header`
container_fix = '''
/* Ensure the inner container uses proper max-width and layout */
.desktop-header .content-container {
  width: min(100%, 1440px) !important;
  max-width: 1440px !important;
  margin: 0 auto !important;
}

.desktop-header .site-header__container {
  width: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}
'''
if 'proper max-width and layout' not in css:
    css += '\n' + container_fix

# 3. Fix mega menu category title and links
# Task 4 & 5
# Replace `.kj-megamenu-heading` block
new_heading = '''
.kj-megamenu-heading {
  color: #991f23 !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  margin-bottom: 16px;
  position: relative;
}
'''
css = re.sub(r'\.kj-megamenu-heading\s*\{[^}]+\}', new_heading.strip(), css)

# Replace `.kj-megamenu-link` block
new_link = '''
.kj-megamenu-link {
  color: #222 !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  padding: 5px 0;
  transition: color 0.2s, transform 0.2s;
  text-decoration: none !important;
}

.kj-megamenu-link:hover {
  color: #991f23 !important;
  transform: translateX(4px);
}
'''
css = re.sub(r'\.kj-megamenu-link\s*\{[^}]+\}', new_link.strip(), css)
css = re.sub(r'\.kj-megamenu-link:hover\s*\{[^}]+\}', '', css) # remove old hover since it's merged

with open(r'E:\Kerala-Jewellers-final\css\navbar.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated navbar.css with fixes for white backside, container width, and mega menu links.')
