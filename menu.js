(function () {
    "use strict";

    const MENU_HTML = `
<nav class="site-nav" aria-label="Κύριο μενού">
    <div class="container">
        <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="primary-menu" aria-label="Άνοιγμα μενού">
            <span class="menu-toggle-bar" aria-hidden="true"></span>
            <span class="menu-toggle-bar" aria-hidden="true"></span>
            <span class="menu-toggle-bar" aria-hidden="true"></span>
        </button>
        <ul class="menu" id="primary-menu">
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
                        <a class="menu-link" href="vioi_agion_audio.html">Βίοι Αγίων (Audio) 🎧</a>
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
                    <li>
                        <a class="menu-link" href="drastiriotites.html">Δραστηριότητες - Quiz</a>
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

            // Mobile hamburger: toggles the whole nav open/closed.
            const nav = this.querySelector(".site-nav");
            const toggle = this.querySelector(".menu-toggle");
            if (nav && toggle) {
                toggle.addEventListener("click", () => {
                    const open = nav.classList.toggle("nav-open");
                    toggle.setAttribute("aria-expanded", String(open));
                    toggle.setAttribute(
                        "aria-label",
                        open ? "Κλείσιμο μενού" : "Άνοιγμα μενού",
                    );
                });
            }

            // Hover can't open submenus on touch devices. Add a disclosure
            // button next to every parent link; on mobile it expands the
            // submenu in place (CSS hides the button on desktop, where hover
            // still works). The branch leading to the current page starts
            // expanded so visitors see where they are.
            const mobileQuery = window.matchMedia("(max-width: 900px)");

            this.querySelectorAll(".has-submenu").forEach((item) => {
                const link = item.querySelector(":scope > .menu-link");
                const startOpen =
                    item.classList.contains("has-active-descendant");
                if (startOpen) item.classList.add("submenu-open");

                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "submenu-toggle";
                btn.setAttribute("aria-expanded", String(startOpen));
                const label = link ? link.textContent.trim() : "υπομενού";
                btn.setAttribute("aria-label", "Εμφάνιση υπομενού: " + label);
                btn.innerHTML =
                    '<span class="submenu-caret" aria-hidden="true">▾</span>';

                // Keep the caret button and the parent label in sync: both
                // drive the same open state and the same aria-expanded.
                function toggleSubmenu() {
                    const isOpen = item.classList.toggle("submenu-open");
                    btn.setAttribute("aria-expanded", String(isOpen));
                }

                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSubmenu();
                });

                // On mobile, parents whose link is a placeholder anchor
                // (e.g. "Παιδικά" -> #paidika, "Αγία Γραφή" -> #agia-grafi)
                // go nowhere, so tapping the label itself should open the
                // submenu. Real page links (Βίοι Αγίων, Καινή Διαθήκη, ...)
                // keep navigating and still expand via the caret.
                if (link && (link.getAttribute("href") || "").charAt(0) === "#") {
                    link.addEventListener("click", (e) => {
                        if (mobileQuery.matches) {
                            e.preventDefault();
                            toggleSubmenu();
                        }
                    });
                }

                if (link) {
                    link.insertAdjacentElement("afterend", btn);
                } else {
                    item.insertBefore(btn, item.firstChild);
                }
            });
        }
    }

    if (!customElements.get("site-menu")) {
        customElements.define("site-menu", SiteMenu);
    }
})();
