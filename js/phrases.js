// ======================================================
// phrases.js — frases que viajan por las trayectorias
// ======================================================

import { loadStylesheet } from "./load-stylesheet.js";
import { phrases, trayectorias, FRASES_POR_TRAYECTORIA } from "./config.js";
import { rand } from "./utils.js";

export const stylesReady = loadStylesheet(new URL("../css/phrases.css", import.meta.url));

const DURACION_FRENADO = 36000;
const PUNTOS_OPACIDAD = [
    [0, 0],
    [0.1, 0.45],
    [0.25, 0.85],
    [0.65, 1],
    [0.82, 0.9],
    [1, 0]
];

export class Phrases {
    constructor(container) {
        this.container = container;
        this.frenadoIniciado = false;
        this.inicioFrenado = null;
        this.recorridoFinal = false;
        this.alFinalizarRecorrido = null;
        this.ultimoFrame = null;
        this.velocidad = 1;
        this.recorridos = [];
        this.render();
        requestAnimationFrame(tiempo => this.animar(tiempo));
    }

    crearFrase({ texto, trayectoria }) {
        const frase = document.createElement("div");
        frase.className = "frase " + trayectoria[2];
        frase.textContent = texto;

        // Punto de partida
        frase.style.setProperty("--startX", "0px");
        frase.style.setProperty("--startY", "0px");

        // Trayectoria
        frase.style.setProperty("--endX", trayectoria[0] + "vw");
        frase.style.setProperty("--endY", trayectoria[1] + "vh");

        // Rotación
        frase.style.setProperty("--rot", trayectoria[3] + "deg");

        return frase;
    }

    render() {
        const frag = document.createDocumentFragment();

        trayectorias.forEach((trayectoria, trayectoriaIndex) => {
            // 3 frases por trayectoria
            for (let variante = 0; variante < FRASES_POR_TRAYECTORIA; variante++) {
                const indiceFrase =
                    (trayectoriaIndex * FRASES_POR_TRAYECTORIA + variante) % phrases.length;

                const frase = this.crearFrase({
                    texto: phrases[indiceFrase],
                    trayectoria
                });

                // Velocidad
                const duracion = rand(2.8, 3.6);

                // Aparición escalonada
                const separacion = duracion / 2;
                const faseInicial = Math.random() * duracion;
                this.recorridos.push({
                    elemento: frase,
                    duracion,
                    finX: trayectoria[0],
                    finY: trayectoria[1],
                    rotacion: trayectoria[3],
                    progreso: ((faseInicial + variante * separacion) % duracion) / duracion,
                    finalizado: false
                });

                frag.appendChild(frase);
            }
        });

        this.container.appendChild(frag);
    }

    iniciarFrenado() {
        if (this.frenadoIniciado) return;
        this.frenadoIniciado = true;
        this.inicioFrenado = performance.now();
    }

    iniciarRecorridoFinal(alTerminar = () => {}) {
        if (this.recorridoFinal) return;
        this.recorridoFinal = true;
        this.alFinalizarRecorrido = alTerminar;

        this.recorridos.forEach(recorrido => {
            recorrido.progreso = 0;
            recorrido.finalizado = false;
        });
    }

    animar(tiempo) {
        const delta = this.ultimoFrame === null
            ? 0
            : Math.min((tiempo - this.ultimoFrame) / 1000, 0.1);
        this.ultimoFrame = tiempo;

        if (this.inicioFrenado !== null) {
            const progresoFrenado = Math.min(
                (tiempo - this.inicioFrenado) / DURACION_FRENADO,
                1
            );
            this.velocidad = 1 - 0.82 * progresoFrenado;
        }

        let quedanRecorridos = false;

        this.recorridos.forEach(recorrido => {
            if (recorrido.finalizado) return;

            recorrido.progreso += delta * this.velocidad / recorrido.duracion;

            if (this.recorridoFinal && recorrido.progreso >= 1) {
                recorrido.progreso = 1;
                recorrido.finalizado = true;
            } else {
                recorrido.progreso %= 1;
            }

            this.actualizarFrase(recorrido);
            if (!recorrido.finalizado) quedanRecorridos = true;
        });

        if (quedanRecorridos) {
            requestAnimationFrame(siguienteTiempo => this.animar(siguienteTiempo));
        } else if (this.alFinalizarRecorrido) {
            const alTerminar = this.alFinalizarRecorrido;
            this.alFinalizarRecorrido = null;
            alTerminar();
        }
    }

    actualizarFrase({ elemento, progreso, finX, finY, rotacion }) {
        const escala = 0.18 + (1.35 - 0.18) * progreso;

        const punto = PUNTOS_OPACIDAD.findIndex(([posicion]) => posicion > progreso);
        const indiceFinal = punto === -1 ? PUNTOS_OPACIDAD.length - 1 : punto;
        const [posicionInicial, opacidadInicial] = PUNTOS_OPACIDAD[indiceFinal - 1];
        const [posicionFinal, opacidadFinal] = PUNTOS_OPACIDAD[indiceFinal];
        const avance = (progreso - posicionInicial) / (posicionFinal - posicionInicial);
        const opacidad = opacidadInicial + (opacidadFinal - opacidadInicial) * avance;
        const desplazamientoX = finX / 100 * window.innerWidth * progreso;
        const desplazamientoY = finY / 100 * window.innerHeight * progreso;

        elemento.style.opacity = String(opacidad);
        elemento.style.transform = `translate3d(-50%, -50%, 0) translate(${desplazamientoX}px, ${desplazamientoY}px) scale(${escala}) rotate(${rotacion}deg)`;
    }
}
