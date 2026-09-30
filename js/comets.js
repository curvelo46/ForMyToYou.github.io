// ======================================================
// comets.js — estrellas fugaces (cometas)
// ======================================================

import { loadStylesheet } from "./load-stylesheet.js";
import { rand } from "./utils.js";

export const stylesReady = loadStylesheet(new URL("../css/comets.css", import.meta.url));

export class Comets {
    constructor(container, cantidad = 8) {
        this.container = container;
        this.cantidad = cantidad;
        this.render();
    }

    render() {
        const frag = document.createDocumentFragment();

        for (let i = 0; i < this.cantidad; i++) {
            const fugaz = document.createElement("span");
            fugaz.className = "estrella-fugaz";

            // Posición inicial
            const startX = rand(-15, 100);
            const startY = rand(-20, 5);

            // Posición final (viajan de arriba/derecha a abajo/izquierda)
            const endX = startX - (75 + Math.random() * 35);
            const endY = 105 + Math.random() * 25;

            fugaz.style.left = startX + "vw";
            fugaz.style.top = startY + "vh";

            fugaz.style.setProperty("--startX", "0px");
            fugaz.style.setProperty("--startY", "0px");
            fugaz.style.setProperty("--endX", (endX - startX) + "vw");
            fugaz.style.setProperty("--endY", (endY - startY) + "vh");

            // Velocidad y separación
            fugaz.style.setProperty("--cometDuration", rand(3.0, 4.5) + "s");
            fugaz.style.setProperty("--cometDelay", (-Math.random() * 7) + "s");

            frag.appendChild(fugaz);
        }

        this.container.appendChild(frag);
    }
}
