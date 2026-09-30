// ======================================================
// main.js — punto de entrada: clase Main que orquesta
// todos los componentes de la página
// ======================================================

import { Stars } from "./stars.js";
import { Comets } from "./comets.js";
import { Phrases } from "./phrases.js";
import { Photos } from "./photos.js";
import { StartButtons } from "./buttons.js";
import { Galaxy } from "./galaxy.js";
import { loadStylesheet } from "./load-stylesheet.js";

const stylesReady = Promise.all([
    Stars.stylesReady,
    Comets.stylesReady,
    Phrases.stylesReady,
    Photos.stylesReady,
    StartButtons.stylesReady,
    Galaxy.stylesReady,
    loadStylesheet(new URL("../css/universe.css", import.meta.url))
]);

class Main {
    constructor() {
        // Referencias al DOM
        this.dom = {
            frases: document.getElementById("frases"),
            fotos: document.getElementById("fotos"),
            inicio: document.getElementById("inicio"),
            si: document.getElementById("si"),
            no: document.getElementById("no"),
            respuestaNo: document.getElementById("respuestaNo"),
            estrellas: document.getElementById("estrellas"),
            estrellasFugaces: document.getElementById("estrellasFugaces"),
            universo: document.getElementById("universo")
        };

        this.validarDOM();
        this.init();
    }

    validarDOM() {
        const faltantes = Object.entries(this.dom)
            .filter(([, el]) => !el)
            .map(([nombre]) => nombre);

        if (faltantes.length) {
            console.warn(`[Main] Elementos no encontrados en el HTML: ${faltantes.join(", ")}`);
        }
    }

    init() {
        // Fondo: estrellas con profundidad + cometas
        new Stars(this.dom.estrellas);
        new Comets(this.dom.estrellasFugaces);

        // Contenido flotante: frases y fotos
        this.frases = new Phrases(this.dom.frases);
        new Photos(this.dom.fotos);

        // Botones de la pantalla inicial
        new StartButtons({ ...this.dom, frases: this.frases });

        // La galaxia se anima cuando el universo llega a su fase final.
        new Galaxy(this.dom.universo);
    }
}

// Arrancar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    stylesReady
        .then(() => new Main())
        .catch(error => {
            console.error("[Main] No se pudo iniciar la página porque faltan estilos.", error);
        });
});
