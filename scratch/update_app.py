import re

with open(r'E:\Kerala-Jewellers-final\js\app.js', 'r', encoding='utf-8') as f:
    app = f.read()

# 1. Add guard to wireMenus
app = app.replace('const wireMenus = () => {', 'let _menusWired = false;\n  const wireMenus = () => {\n    if (_menusWired) return;\n    _menusWired = true;')

# 2. Add guard to wireRateSelection
app = app.replace('const wireRateSelection = () => {', 'let _rateWired = false;\n  const wireRateSelection = () => {\n    if (_rateWired) return;\n    _rateWired = true;')

# 3. Create window.initKeralaHeader
init_func = """
  window.initKeralaHeader = () => {
    injectNavbarThemeStyles();
    wireMenus();
    wireMegamenuHover();
    normalizePlatinumNavState();
    renderRateLabelForCurrentPage();
    ensureSimpleMegamenus();
  };
"""
app = app.replace("document.addEventListener('DOMContentLoaded', () => {", init_func + "\n  document.addEventListener('DOMContentLoaded', () => {\n    window.initKeralaHeader();")

# 4. Remove the individual calls from DOMContentLoaded
app = app.replace('    injectNavbarThemeStyles();\n', '')
app = app.replace('    wireMenus();\n', '')
app = app.replace('    wireMegamenuHover();\n', '')
app = app.replace('    normalizePlatinumNavState();\n', '')
app = app.replace('    renderRateLabelForCurrentPage();\n', '')

# (Wait, ensureSimpleMegamenus is not in DOMContentLoaded? Wait, I saw it in my python script output! Oh, maybe I didn't see it because it was further down.)
# Let's just remove it if it's there.
app = app.replace('    ensureSimpleMegamenus();\n', '')

with open(r'E:\Kerala-Jewellers-final\js\app.js', 'w', encoding='utf-8') as f:
    f.write(app)
print("app.js updated.")
