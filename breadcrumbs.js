(function () {
    "use strict";

    class SiteBreadcrumbs extends HTMLElement {
        connectedCallback() {
            const items = this.innerHTML;
            this.innerHTML = `<nav class="breadcrumbs" aria-label="Διαδρομή"><ol>${items}</ol></nav>`;
        }
    }

    if (!customElements.get("site-breadcrumbs")) {
        customElements.define("site-breadcrumbs", SiteBreadcrumbs);
    }
})();
