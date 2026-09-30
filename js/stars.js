// ======================================================
// stars.js — campo de estrellas con profundidad
// ======================================================

import { loadStylesheet } from "./load-stylesheet.js";
import { rand } from "./utils.js";

export const stylesReady = loadStylesheet(new URL("../css/stars.css", import.meta.url));

export class Stars {
    constructor(container) {
        this.container = container;
        this.render();
    }

    crearEstrella({ size, blink, delay, opacity, glow }) {
        const estrella = document.createElement("span");
        estrella.className = "estrella";
        estrella.style.left = rand(0, 100) + "%";
        estrella.style.top = rand(0, 100) + "%";
        estrella.style.width = size + "px";
        estrella.style.height = size + "px";
        estrella.style.setProperty("--blink", blink + "s");
        estrella.style.animationDelay = delay + "s";
        estrella.style.opacity = opacity;
        if (glow) {
            estrella.style.boxShadow = "0 0 7px rgba(255,255,255,.65)";
        }
        return estrella;
    }

    /**
     * @param {number} cantidad
     * @param {number} sizeMin tamaño mínimo en px
     * @param {number} sizeMax rango extra de tamaño
     * @param {number} blinkMin
     * @param {number} blinkMax
     * @param {number} delayMax
     * @param {number} opMin opacidad mínima
     * @param {number} opRango rango extra de opacidad
     * @param {boolean} glow sombra brillante
     */
    capa({ cantidad, sizeMin, sizeMax, blinkMin, blinkMax, delayMax, opMin, opRango, glow = false }) {
        const frag = document.createDocumentFragment();
        for (let i = 0; i < cantidad; i++) {
            frag.appendChild(this.crearEstrella({
                size: rand(sizeMin, sizeMin + sizeMax),
                blink: rand(blinkMin, blinkMax),
                delay: rand(0, delayMax),
                opacity: opMin + Math.random() * opRango,
                glow
            }));
        }
        this.container.appendChild(frag);
    }

    render() {
        // Lejanas: muchas, pequeñas y suaves
        this.capa({
            cantidad: 500, sizeMin: 0.35, sizeMax: 1.1,
            blinkMin: 3.5, blinkMax: 8.5, delayMax: 6,
            opMin: 0.25, opRango: 0.35
        });

        // Medias: un poco más visibles
        this.capa({
            cantidad: 100, sizeMin: 0.7, sizeMax: 1.5,
            blinkMin: 2.5, blinkMax: 6.5, delayMax: 5,
            opMin: 0.45, opRango: 0.35
        });

        // Cercanas: pocas, grandes y brillantes
        this.capa({
            cantidad: 25, sizeMin: 1.2, sizeMax: 2.2,
            blinkMin: 2, blinkMax: 5, delayMax: 4,
            opMin: 0.65, opRango: 0.35,
            glow: true
        });
    }
}
