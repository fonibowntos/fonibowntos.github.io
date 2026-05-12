(function () {
    "use strict";

    const FOOTER_HTML = `
<footer class="site-footer">
    <div class="container">
        <nav aria-label="Δευτερεύον μενού">
            <div class="footer-nav">
                <section class="footer-nav-group">
                    <h2 class="footer-nav-heading">Παιδικά</h2>
                    <ul>
                        <li><a href="vioi_agion.html">Βίοι Αγίων</a></li>
                        <li><a href="paidika_paramythia.html">Παραμύθια</a></li>
                        <li><a href="paidika_tragoudia.html">Τραγούδια</a></li>
                    </ul>
                </section>
                <section class="footer-nav-group">
                    <h2 class="footer-nav-heading">Αγία Γραφή</h2>
                    <ul>
                        <li><a href="palaia_diathiki.html">Παλαιά Διαθήκη</a></li>
                        <li><a href="kaini_diathiki.html">Καινή Διαθήκη</a></li>
                    </ul>
                </section>
                <section class="footer-nav-group">
                    <ul>
                        <li>
                            <a href="ekklisiastika_vivlia.html">Εκκλησιαστικά Βιβλία</a>
                        </li>
                        <li>
                            <a href="apokalypseis_erevnes.html">Αποκαλύψεις / Έρευνες</a>
                        </li>
                        <li><a href="epikoinonia.html">Επικοινωνία</a></li>
                    </ul>
                </section>
            </div>
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
