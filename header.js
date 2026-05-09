(function () {
    "use strict";

    const HEADER_HTML = `
<div class="container">
    <header class="site-header">
        <div class="logo">
            <div class="logo-text">
                <h1 class="logo-title">
                    <a href="index.html">Agathoniki.com</a>
                </h1>
                <span class="logo-subtitle">Orthodox resource</span>
            </div>
        </div>
    </header>
</div>`;

    class SiteHeader extends HTMLElement {
        connectedCallback() {
            this.innerHTML = HEADER_HTML;
        }
    }

    if (!customElements.get("site-header")) {
        customElements.define("site-header", SiteHeader);
    }
})();
