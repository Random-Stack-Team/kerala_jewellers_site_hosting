# Phase 6: CSS Ownership Audit Report

| Selector | Current File | Recommended Owner | Status | Reason |
|---|---|---|---|---|
| `nav` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-chevron:before` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.content-container` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-main` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-medium` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-1` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-3` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-4` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-5` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-6` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-7` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-8` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-9` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-10` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-11` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-medium-12` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-stack` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-main` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-medium` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-small` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-row` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.content-container .w-row` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-1` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-2` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-3` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-4` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-5` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-6` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-7` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-8` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-9` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-10` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-11` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-small-12` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.content-container` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-main` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-medium` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-small` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-hidden-tiny` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-1` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-2` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-3` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-4` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-5` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-6` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-7` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-8` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-9` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-10` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-11` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.w-col-tiny-12` | style.css (screen and (max-width: 479px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.slider-nav-invert` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.slider-nav-invert>div` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.slider-nav-invert>div.is-active` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-btn` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-toggle` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-link` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-toggle` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-toggle:focus` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-chevron` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-list` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-list.is-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-link` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-link.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-link:focus` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__brand` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.site-nav` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav:before` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav:after` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav:after` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__brand` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-menu-link` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-menu-link.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `[data-nav-menu-open]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.w--nav-link-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-overlay` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-overlay [data-nav-menu-open]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav[data-animation="over-left"] .nav-overlay` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav[data-animation="over-left"] .nav-overlay` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav[data-animation="over-left"] [data-nav-menu-open]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav[data-animation="over-right"] .nav-overlay` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav[data-animation="over-right"] .nav-overlay` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav[data-animation="over-right"] [data-nav-menu-open]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.w--nav-dropdown-list-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__brand` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.layout-container` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.layout-container` | style.css (screen and (max-width: 767px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.navigation-items` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-item` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-item:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-item:active` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-item.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-item.is-current:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-item.is-current:active` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-wrap` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-pages-wrapper-v1---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-pages-wrapper-v1---brix.last---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-menu-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-item---brix-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__container` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-menu` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav---brix-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.header-navigation---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.header-navigation---brix-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link:active` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link:focus` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link:focus-visible` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link[data-wf-focus-visible]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link:visited` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.login-2.nav-link` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-content-wrapper---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-menu-v1---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-link---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-link---brix:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-link---brix.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-link` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-link:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-link.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-content---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-wrap` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-pages-content---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-menu-text---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-list` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-toggle-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-container---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__actions` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-link---brix-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-link---brix-copy:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-link---brix-copy.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__right` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-main-wrapper-v1---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__inner` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-icon---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-item-wrapper---brix-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.title---brix.dropdown-nav-title-v1---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-item---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-nav-item---brix.last---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-item-wrapper---brix-copy-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-left` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-link---brix:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown-list-v1---brix` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-right-1` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-right-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav__slider` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.sort_by-dropdown` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown_wrap-center` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.dropdown_wrap` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_dropdown-list` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_dropdown-list.is-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_dropdown-toggle` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.uui-dropdown-icon` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.uui-dropdown-icon.white` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_menu-dropdown` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-link-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-link-2:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-link-2.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-right-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-left-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav-item-wrapper---brix-copy-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdownlink-1` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-list.is-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle.is-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-container-1` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdownlink-1-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-container-1-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle-2.is-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-2-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdownlink-1-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdownlink-1-4` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle-3.is-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-1-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle-4` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-toggle-4.is-open` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.silverlink` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.silverlink.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.goldlink` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.goldlink.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.diamondlink` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.diamondlink.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-2-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.diamondlink-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.diamondlink-2.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.goldlink-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.goldlink-2.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.silverlink-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.silverlink-2.is-current` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-1-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.navigation-right-3` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-header__wrap` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.site-nav` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.slide-nav-2` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-1-3121` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__link` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__link:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__link:focus-visible` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__link[data-wf-focus-visible]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__link.is-mobile` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__toggler` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__toggler:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__toggler:focus-visible` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__toggler[data-wf-focus-visible]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__btn__icon` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__btn` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__btn:hover` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__btn:focus-visible` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.nav__btn[data-wf-focus-visible]` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_menu-dropdown212` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_menu-dropdown-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_menu-dropdown121` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.filter_menu-dropdown-copy-copy` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.bko-dropdown-2-3-co1111py` | style.css | navbar.css | **RISKY** | Navbar specific selector found in global style.css (risky if it overrides global UI) |
| `.section-1.cc-product-detail` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.styleguide-block` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.button` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.paragraph-light.cc-subscribe-paragraph` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.heading-jumbo` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.logo-link.is-current` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-icon` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.navigation-items` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.cart` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.navigation` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.text-field.cc-quantity-field` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.navigation-item` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.navigation-item:hover` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.navigation-item:active` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-button` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-button.is-open` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.collection-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.collection-item` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.intro-text` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.picture-placeholder.cc-about-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.contact-name-field-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.email-name-field-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.get-in-touch-form-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.get-in-touch-form` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.credentials-inputs-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.grid` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.number-contact-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.blog-item` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.blog-preview-image` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.blog-summary-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.product-details-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.product-image` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.product-detail-cta-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.full-width-form` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.blog-detail-header-wrap` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.blog-header-image` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.order-summary` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.navigation-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav-pages-wrapper-v1---brix` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav-item---brix-copy` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.nav-menu` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav---brix-copy` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.header-navigation---brix` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.header-navigation---brix-copy` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.nav-link` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.login-2.nav-link` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-mob` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-mob.is-open` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.primary-btn` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav-pages-content---brix` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-icon-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav-container---brix.adjust-this-for-your-container-size` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.site-header__right` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.site-header__brand-area` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav-main-wrapper-v1---brix` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.site-header__inner` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav---brix` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-nav-item---brix` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-button-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-button-2.is-open` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.menu-line` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.search-bar` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.search-bar-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.container-4` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.dropdown-list-v1---brix` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.text-block-70` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.intro-content-2.cc-homepage` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.intro-content-2.cc-homepage-copy` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.intro-text-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.intro-header-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.heading-jumbo-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.paragraph-bigger-2` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.banner` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.text-block-71` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |
| `.border-box` | style.css (screen and (max-width: 991px)) | responsive.css | **SAFE** | Mobile/tablet media query found outside responsive.css |

*Note: Report truncated, found 1840 total issues.*