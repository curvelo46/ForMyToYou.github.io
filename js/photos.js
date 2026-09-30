// ======================================================
// photos.js — fotos flotantes
// ======================================================

import { loadStylesheet } from "./load-stylesheet.js";
import { fotosConfig } from "./config.js";
import { rand } from "./utils.js";

export const stylesReady = Promise.all([
    loadStylesheet(new URL("../css/photos.css", import.meta.url)),
    loadStylesheet(new URL("../css/memory.css", import.meta.url))
]);

export class Photos {
    constructor(container) {
        this.container = container;
        this.render();
    }

    render() {
        const frag = document.createDocumentFragment();

        fotosConfig.forEach(([archivo, endX, endY, size, rot], i) => {
            const foto = document.createElement("img");
            foto.className = "foto" + (i === 2 || i === 3 ? " luna" : "");
            foto.src = "assets/" + archivo;
            foto.loading = "lazy";
            foto.alt = archivo.replace(/\.jpg$/, "").replace(/_/g, " ");

            // Punto de partida
            foto.style.setProperty("--startX", "0px");
            foto.style.setProperty("--startY", "0px");

            // Trayectoria
            foto.style.setProperty("--endX", endX + "vw");
            foto.style.setProperty("--endY", endY + "vh");

            // Tamaño y rotación
            foto.style.setProperty("--size", size + "px");
            foto.style.setProperty("--rot", rot + "deg");

            // Velocidad y distribución
            foto.style.setProperty("--photoDuration", rand(4.0, 4.8) + "s");
            foto.style.setProperty("--photoDelay", (-Math.random() * 9) + "s");

            frag.appendChild(foto);
        });

        this.container.appendChild(frag);
    }
}
