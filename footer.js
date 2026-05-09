(function () {
    "use strict";

    const FOOTER_HTML = `
<footer class="site-footer">
    <div class="container">
        <nav aria-label="Δευτερεύον μενού">
            <ul class="footer-nav">
                <li>
                    <a href="paidika_paramythia.html">Παιδικά Παραμύθια</a>
                </li>
                <li>
                    <a href="paidika_tragoudia.html">Παιδικά Τραγούδια</a>
                </li>
                <li><a href="vioi_agion.html">Βίοι Αγίων</a></li>
                <li><a href="palaia_diathiki.html">Παλαιά Διαθήκη</a></li>
                <li><a href="kaini_diathiki.html">Καινή Διαθήκη</a></li>
                <li>
                    <a href="ekklisiastika_vivlia.html">Εκκλησιαστικά Βιβλία</a>
                </li>
                <li>
                    <a href="apokalypseis_erevnes.html">Αποκαλύψεις / Έρευνες</a>
                </li>
            </ul>
        </nav>
        <p>Agathoniki.com © 2026</p>
        <p>
            Επικοινωνία:
            <a href="mailto:a@agathoniki.com">a@agathoniki.com</a>
        </p>
    </div>
</footer>`;

    class SiteFooter extends HTMLElement {
        connectedCallback() {
            this.innerHTML = FOOTER_HTML;
        }
    }

    if (!customElements.get("site-footer")) {
        customElements.define("site-footer", SiteFooter);
    }
})();
