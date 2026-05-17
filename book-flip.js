(function () {
    "use strict";

    const STYLES = `
book-flip:not(:defined) {
    display: none;
}
book-flip .book-stage {
    margin: 24px auto 8px;
    padding: 24px;
    background: rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(178, 102, 255, 0.4);
    border-radius: 4px;
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
}
book-flip [data-book] {
    background: #2a1a05;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}
book-flip [data-book] .page {
    background: #fff;
    overflow: hidden;
}
book-flip [data-book] .page img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
}
book-flip .book-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin: 12px 0 8px;
    font-family: "Special Elite", Georgia, serif;
}
book-flip .book-controls button {
    font-family: inherit;
    font-size: 14px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.85);
    color: #000;
    border: 1px solid #b266ff;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transition:
        background-color 0.2s ease,
        color 0.2s ease;
}
book-flip .book-controls button:hover,
book-flip .book-controls button:focus {
    background: #b266ff;
    color: #fff;
    outline: none;
}
book-flip .book-controls button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
book-flip .book-page-info {
    font-size: 14px;
    color: #000;
    min-width: 8ch;
    text-align: center;
}
book-flip .book-hint {
    margin: 8px 0 0;
    text-align: center;
    font-size: 13px;
    font-style: italic;
    color: #555;
}
@media (max-width: 600px) {
    book-flip .book-stage {
        margin-top: 16px;
        padding: 8px;
    }
}
`;

    const TEMPLATE = `
<div class="book-stage">
    <div data-book></div>
</div>
<div class="book-controls" role="group" aria-label="Πλοήγηση βιβλίου">
    <button type="button" data-prev aria-label="Προηγούμενη σελίδα">‹ Προηγούμενη</button>
    <span class="book-page-info" data-page-info aria-live="polite">— / —</span>
    <button type="button" data-next aria-label="Επόμενη σελίδα">Επόμενη ›</button>
</div>
<p class="book-hint">
    Σύρετε τη γωνία της σελίδας για να την γυρίσετε.
</p>`;

    let stylesInjected = false;
    function injectStyles() {
        if (stylesInjected) return;
        const style = document.createElement("style");
        style.setAttribute("data-book-flip-styles", "");
        style.textContent = STYLES;
        document.head.appendChild(style);
        stylesInjected = true;
    }

    class BookFlip extends HTMLElement {
        connectedCallback() {
            injectStyles();

            const base = this.getAttribute("base") || "";
            const ariaLabel = this.getAttribute("aria-label") || "";
            const files = this.textContent
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);

            this.innerHTML = TEMPLATE;
            this.removeAttribute("aria-label");

            const bookEl = this.querySelector("[data-book]");
            const prevBtn = this.querySelector("[data-prev]");
            const nextBtn = this.querySelector("[data-next]");
            const pageInfo = this.querySelector("[data-page-info]");
            if (ariaLabel) bookEl.setAttribute("aria-label", ariaLabel);

            const imageUrls = files.map((f) => base + f);

            const pageFlip = new St.PageFlip(bookEl, {
                width: 550,
                height: 733,
                size: "stretch",
                minWidth: 240,
                maxWidth: 1000,
                minHeight: 320,
                maxHeight: 1350,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: false,
                usePortrait: true,
            });

            pageFlip.loadFromImages(imageUrls);

            function updateInfo() {
                const current = pageFlip.getCurrentPageIndex() + 1;
                const total = pageFlip.getPageCount();
                pageInfo.textContent = current + " / " + total;
                prevBtn.disabled = current <= 1;
                nextBtn.disabled = current >= total;
            }

            pageFlip.on("flip", updateInfo);
            pageFlip.on("init", updateInfo);

            prevBtn.addEventListener("click", function () {
                pageFlip.flipPrev();
            });
            nextBtn.addEventListener("click", function () {
                pageFlip.flipNext();
            });

            document.addEventListener("keydown", function (e) {
                if (e.key === "ArrowLeft") {
                    pageFlip.flipPrev();
                } else if (e.key === "ArrowRight") {
                    pageFlip.flipNext();
                }
            });
        }
    }

    if (!customElements.get("book-flip")) {
        customElements.define("book-flip", BookFlip);
    }
})();
