(function () {
    "use strict";

    const MENU_HTML = `
<nav class="site-nav" aria-label="Κύριο μενού">
    <div class="container">
        <ul class="menu">
            <li>
                <a class="menu-link" href="index.html">Αρχική</a>
            </li>
            <li class="cross" aria-hidden="true"></li>
            <li class="has-submenu">
                <a class="menu-link" href="#paidika">Παιδικά</a>
                <ul class="submenu">
                    <li class="has-submenu">
                        <a class="menu-link" href="vioi_agion.html">Βίοι Αγίων</a>
                        <ul class="submenu">
                            <li>
                                <a class="menu-link" href="agios_panteleimonas.html">Ο Άγιος Παντελεήμονας ο Ιατρός</a>
                            </li>
                            <li>
                                <a class="menu-link" href="agia_matrona.html">Η Αγία Ματρώνα η Ρωσίδα</a>
                            </li>
                            <li>
                                <a class="menu-link" href="agios_symeon_agios_ioannis.html">Άγιος Συμεών ο δια Χριστόν Σαλός και Άγιος Ιωάννης</a>
                            </li>
                        </ul>
                    </li>
                    <li class="has-submenu">
                        <a class="menu-link" href="vioi_agion_audio.html">Βίοι Αγίων (Audio)</a>
                        <ul class="submenu">
                            <li>
                                <a class="menu-link" href="pes_mou_mama_kati_gia_ta_xristougenna.html">Πες μου μαμά κάτι για τα Χριστούγεννα</a>
                            </li>
                            <li>
                                <a class="menu-link" href="ta_thavmata_tou_christou.html">Τα Θαύματα του Χριστού</a>
                            </li>
                        </ul>
                    </li>
                    <li class="has-submenu">
                        <a class="menu-link" href="paidika_paramythia.html">Παραμύθια</a>
                        <ul class="submenu">
                            <li>
                                <a class="menu-link" href="to_smaragdenio_staxy.html">Το σμαραγδένιο στάχυ</a>
                            </li>
                            <li>
                                <a class="menu-link" href="o_likos_o_bibis.html">Ο λύκος ο Μπιμπίς</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a class="menu-link" href="paidika_tragoudia.html">Τραγούδια</a>
                    </li>
                </ul>
            </li>
            <li class="cross" aria-hidden="true"></li>
            <li class="has-submenu">
                <a class="menu-link" href="#agia-grafi">Αγία Γραφή</a>
                <ul class="submenu">
                    <li>
                        <a class="menu-link" href="palaia_diathiki.html">Παλαιά Διαθήκη</a>
                    </li>
                    <li class="has-submenu">
                        <a class="menu-link" href="kaini_diathiki.html">Καινή Διαθήκη</a>
                        <ul class="submenu">
                            <li>
                                <a class="menu-link" href="kata_matthaion.html">Κατά Ματθαίον Ευαγγέλιον</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="cross" aria-hidden="true"></li>
            <li>
                <a class="menu-link" href="ekklisiastika_vivlia.html">Εκκλησιαστικά Βιβλία</a>
            </li>
            <li class="cross" aria-hidden="true"></li>
            <li>
                <a class="menu-link" href="apokalypseis_erevnes.html">Αποκαλύψεις / Έρευνες</a>
            </li>
            <li class="cross" aria-hidden="true"></li>
            <li>
                <a class="menu-link" href="epikoinonia.html">Επικοινωνία</a>
            </li>
        </ul>
    </div>
</nav>`;

    const ACTIVE_STYLES = `
.menu a.menu-link[aria-current="page"] {
    color: #b266ff;
    background-color: rgba(255, 255, 255, 0.4);
    border-bottom-color: #b266ff;
    font-weight: bold;
}
.menu .has-submenu.has-active-descendant > .menu-link {
    color: #b266ff;
    border-bottom-color: #b266ff;
}
`;

    let stylesInjected = false;
    function injectStyles() {
        if (stylesInjected) return;
        const style = document.createElement("style");
        style.setAttribute("data-site-menu-styles", "");
        style.textContent = ACTIVE_STYLES;
        document.head.appendChild(style);
        stylesInjected = true;
    }

    function getCurrentPageName() {
        const path = window.location.pathname;
        const last = path.substring(path.lastIndexOf("/") + 1);
        return last === "" ? "index.html" : last;
    }

    class SiteMenu extends HTMLElement {
        connectedCallback() {
            injectStyles();
            this.innerHTML = MENU_HTML;

            const currentPage = getCurrentPageName();
            const links = this.querySelectorAll("a.menu-link");

            links.forEach((link) => {
                const href = link.getAttribute("href") || "";
                if (href === currentPage) {
                    link.setAttribute("aria-current", "page");
                    let submenu = link.closest(".submenu");
                    while (submenu) {
                        const parentItem = submenu.parentElement;
                        if (parentItem && parentItem.classList.contains("has-submenu")) {
                            parentItem.classList.add("has-active-descendant");
                        }
                        submenu = parentItem ? parentItem.closest(".submenu") : null;
                    }
                }
            });
        }
    }

    if (!customElements.get("site-menu")) {
        customElements.define("site-menu", SiteMenu);
    }
})();
