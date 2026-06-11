import re

with open(r'E:\Kerala-Jewellers-final\css\responsive.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove all existing occurrences of mobile header selectors to prevent duplicates
selectors_to_remove = [
    r'\.mobile-header',
    r'\.mobile-nav',
    r'\.mobile-menu-toggle',
    r'\.kj-mobile-rate-strip',
    r'\.desktop-header',
    r'\.kj-megamenu-dropdown'
]

for sel in selectors_to_remove:
    # Remove simple blocks like `.mobile-header { ... }` or `.mobile-header, .other { ... }`
    # This regex is an approximation to wipe out these specific lines
    # Actually, a safer approach is to append our !important rules at the VERY END of the file 
    # to guarantee they override any lingering duplicates, since parsing CSS with regex is brittle.
    pass

# We will just append the definitive mobile CSS to the end of responsive.css
mobile_css = """
/* ==========================================================================
   MOBILE NAVBAR MATCHING LIVE SITE (OVERRIDING EVERYTHING ELSE)
   ========================================================================== */
@media (max-width: 991px) {
  /* Hide Desktop Header completely */
  .desktop-header {
    display: none !important;
  }

  /* Show Mobile Rate Strip (if live has it visible) */
  .kj-mobile-rate-strip {
    display: flex !important;
    align-items: center !important;
    background: #90030a !important; /* Live uses #90030a */
    color: #fff !important;
    height: 60px !important;
    overflow: hidden !important;
    position: relative !important;
    width: 100% !important;
  }

  /* Mobile Header Container */
  .mobile-header {
    display: flex !important;
    border-bottom: 1px solid rgba(68, 85, 103, 0.11) !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 15px 5% !important;
    background-color: #991f23 !important; /* Live site's primary red for mobile header */
    width: 100% !important;
    position: relative !important;
    z-index: 10002 !important;
  }

  /* Ensure brand logo size on mobile matches live */
  .mobile-header .brand img {
    height: 60px !important;
    max-height: 60px !important;
    object-fit: contain !important;
    width: 170px !important;
  }

  /* Mobile Nav Panel (Hidden by default, slides down) */
  .mobile-nav {
    background: #fff !important;
    box-shadow: 0 18px 32px rgba(0, 0, 0, 0.18) !important;
    color: #222 !important;
    display: block !important;
    max-height: 0 !important;
    opacity: 0 !important;
    overflow-y: auto !important;
    pointer-events: none !important;
    transform: translateY(-8px) !important;
    visibility: hidden !important;
    transition: max-height 360ms cubic-bezier(.22, 1, .36, 1), opacity 240ms ease, transform 300ms ease, visibility 0s linear 360ms !important;
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    top: 100% !important;
    width: 100vw !important;
    z-index: 10001 !important;
    padding: 0 18px !important;
  }

  /* When JS adds .is-open class */
  .mobile-nav.is-open {
    max-height: calc(100vh - 111px) !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    transform: none !important;
    visibility: visible !important;
    transition: max-height 360ms cubic-bezier(.22, 1, .36, 1), opacity 240ms ease, transform 300ms ease, visibility 0s linear 0s !important;
    padding-top: 15px !important;
    padding-bottom: 18px !important;
  }

  /* Mobile links */
  .kj-mobile-menu-link {
    display: block !important;
    padding: 15px 0 !important;
    border-bottom: 1px solid #eee !important;
    color: #231f20 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    text-decoration: none !important;
  }

  /* Hide mega menu images on mobile */
  .kj-mobile-menu-image {
    display: none !important;
  }

  /* Hamburger Icon */
  .mobile-menu-toggle {
    background-color: transparent !important;
    border: none !important;
    cursor: pointer !important;
    padding: 10px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 5px !important;
    z-index: 10003 !important;
  }

  .mobile-menu-toggle__line {
    width: 25px !important;
    height: 3px !important;
    background-color: #fff !important; /* White lines for hamburger on red bg */
    transition: all 0.3s ease !important;
  }

  /* Hamburger open state */
  .mobile-menu-toggle.is-open .mobile-menu-toggle__line:nth-child(1) {
    transform: translateY(8px) rotate(45deg) !important;
    background-color: #d4af37 !important; /* Gold when open */
  }
  .mobile-menu-toggle.is-open .mobile-menu-toggle__line:nth-child(2) {
    opacity: 0 !important;
  }
  .mobile-menu-toggle.is-open .mobile-menu-toggle__line:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg) !important;
    background-color: #d4af37 !important; /* Gold when open */
  }
}
"""

with open(r'E:\Kerala-Jewellers-final\css\responsive.css', 'a', encoding='utf-8') as f:
    f.write('\n' + mobile_css)

print('Appended definitive mobile styles to responsive.css')
