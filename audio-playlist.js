(function () {
    "use strict";

    const STYLES = `
audio-playlist:not(:defined) {
    display: none;
}
audio-playlist .audio-section {
    margin-top: 2em;
}
audio-playlist .plyr {
    --plyr-color-main: #b266ff;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
audio-playlist ol.audio-playlist {
    list-style: none;
    margin: 1.25em 0 0;
    padding: 0;
    border: 1px solid rgba(178, 102, 255, 0.4);
    border-radius: 4px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.6);
}
audio-playlist ol.audio-playlist li {
    margin: 0;
}
audio-playlist ol.audio-playlist button {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(178, 102, 255, 0.2);
    font-family: "Special Elite", Georgia, serif;
    font-size: 15px;
    color: #1a1a1a;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
}
audio-playlist ol.audio-playlist li:last-child button {
    border-bottom: none;
}
audio-playlist ol.audio-playlist button:hover,
audio-playlist ol.audio-playlist button:focus {
    background-color: rgba(178, 102, 255, 0.12);
    color: #6f2dbd;
    outline: none;
}
audio-playlist ol.audio-playlist button[aria-current="true"] {
    background-color: rgba(178, 102, 255, 0.2);
    color: #6f2dbd;
    font-weight: bold;
}
audio-playlist ol.audio-playlist .track-number {
    display: inline-block;
    min-width: 2.25em;
    color: #b266ff;
    font-weight: bold;
}
audio-playlist ol.audio-playlist .track-title {
    flex: 1;
}
`;

    const PLYR_OPTS = {
        controls: [
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
        ],
        settings: ["speed"],
        speed: { selected: 1, options: [0.75, 1, 1.25, 1.5, 1.75, 2] },
        i18n: {
            play: "Αναπαραγωγή",
            pause: "Παύση",
            mute: "Σίγαση",
            unmute: "Άρση σίγασης",
            volume: "Ένταση",
            settings: "Ρυθμίσεις",
            speed: "Ταχύτητα",
            normal: "Κανονική",
        },
    };

    let stylesInjected = false;
    function injectStyles() {
        if (stylesInjected) return;
        const style = document.createElement("style");
        style.setAttribute("data-audio-playlist-styles", "");
        style.textContent = STYLES;
        document.head.appendChild(style);
        stylesInjected = true;
    }

    class AudioPlaylist extends HTMLElement {
        connectedCallback() {
            injectStyles();

            const base = this.getAttribute("base") || "";
            const ariaLabel = this.getAttribute("aria-label") || "";
            const tracks = this.textContent
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((line, idx) => {
                    const sep = line.indexOf("|");
                    const file = sep < 0 ? line : line.slice(0, sep).trim();
                    const title =
                        sep < 0 ? "Μέρος " + (idx + 1) : line.slice(sep + 1).trim();
                    return { file, title };
                });

            const section = document.createElement("section");
            section.className = "audio-section";
            if (ariaLabel) section.setAttribute("aria-label", ariaLabel);

            const audio = document.createElement("audio");
            audio.controls = true;
            audio.preload = "none";
            audio.appendChild(
                document.createTextNode(
                    "Ο φυλλομετρητής σας δεν υποστηρίζει την αναπαραγωγή ήχου."
                )
            );

            const ol = document.createElement("ol");
            ol.className = "audio-playlist";

            tracks.forEach((track, idx) => {
                const i = idx + 1;
                const li = document.createElement("li");
                const btn = document.createElement("button");
                btn.type = "button";
                btn.setAttribute("data-src", base + encodeURIComponent(track.file));
                if (i === 1) btn.setAttribute("aria-current", "true");
                const num = document.createElement("span");
                num.className = "track-number";
                num.textContent = i + ".";
                const title = document.createElement("span");
                title.className = "track-title";
                title.textContent = track.title;
                btn.appendChild(num);
                btn.appendChild(title);
                li.appendChild(btn);
                ol.appendChild(li);
            });

            const firstBtn = ol.querySelector("button[data-src]");
            if (firstBtn) {
                const srcEl = document.createElement("source");
                srcEl.src = firstBtn.getAttribute("data-src");
                srcEl.type = "audio/mpeg";
                audio.insertBefore(srcEl, audio.firstChild);
            }

            section.appendChild(audio);
            section.appendChild(ol);

            this.innerHTML = "";
            this.removeAttribute("aria-label");
            this.appendChild(section);

            if (typeof Plyr === "undefined") return;

            const player = new Plyr(audio, PLYR_OPTS);

            const buttons = ol.querySelectorAll("button[data-src]");
            buttons.forEach(function (btn) {
                btn.addEventListener("click", function () {
                    const src = btn.getAttribute("data-src");
                    buttons.forEach(function (b) {
                        b.removeAttribute("aria-current");
                    });
                    btn.setAttribute("aria-current", "true");
                    player.source = {
                        type: "audio",
                        sources: [{ src: src, type: "audio/mpeg" }],
                    };
                    player.play();
                });
            });

            player.on("ended", function () {
                const current = ol.querySelector('button[aria-current="true"]');
                if (!current) return;
                const next = current.parentElement.nextElementSibling;
                if (!next) return;
                const nextBtn = next.querySelector("button[data-src]");
                if (nextBtn) nextBtn.click();
            });
        }
    }

    if (!customElements.get("audio-playlist")) {
        customElements.define("audio-playlist", AudioPlaylist);
    }
})();
