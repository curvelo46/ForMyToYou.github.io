// ======================================================
// buttons.js — botones SÍ / NO de la pantalla inicial
// ======================================================

import { loadStylesheet } from "./load-stylesheet.js";

export const stylesReady = loadStylesheet(new URL("../css/buttons.css", import.meta.url));

const RUTA_CANCION = "./assets/sound.mp3";
const RUTA_SONIDO_EXPLOSION = "./assets/deltarune-explosion.mp3";
const TOTAL_FOTOGRAMAS_EXPLOSION = 16;
const ANCHO_FOTOGRAMA_EXPLOSION = 433 / 6;
const ALTO_FOTOGRAMA_EXPLOSION = 101;
const DURACION_FOTOGRAMA_EXPLOSION = 60;
const INICIO_FRENADO_FRASES = 0;
const INICIO_TRAYECTO_FINAL = 36000;
const INICIO_GALAXIA_FINAL = 60000;
const DURACION_GALAXIA = 30000;
const DURACION_DESVANECIMIENTO_MUSICA = 4000;
const DURACION_DESVANECIMIENTO_GALAXIA = 5000;
const ESPERA_MENSAJE_CIERRE = 6500;
const ESPERA_SUPERVIVENCIA = 30000;
const DURACION_AVISO_SUPERVIVENCIA = 30000;
const FRASE_SECRETA = "pene pene escroto pene";

export class StartButtons {
    constructor({ si, no, respuestaNo, inicio, universo, frases }) {
        this.si = si;
        this.no = no;
        this.respuestaNo = respuestaNo;
        this.inicio = inicio;
        this.universo = universo;
        this.frases = frases;
        this.sonidoExplosion = new Audio(RUTA_SONIDO_EXPLOSION);
        this.sonidoExplosion.preload = "auto";
        this.sonidoExplosion.load();
        this.intentosNo = 0;
        this.explosionEnCurso = false;
        this.secuenciaIniciada = false;
        this.entradaSecreta = "";
        this.bind();
    }

    bind() {
        this.si.addEventListener("click", () => this.aceptar());
        this.no.addEventListener("click", () => this.intentarNo());
        document.addEventListener("keydown", event => this.detectarFraseSecreta(event));
    }

    detectarFraseSecreta(event) {
        if (this.secuenciaIniciada || this.inicio.hidden || this.inicio.style.display === "none") return;
        if (event.repeat || event.key.length !== 1) return;

        this.entradaSecreta = (this.entradaSecreta + event.key.toLocaleLowerCase())
            .slice(-FRASE_SECRETA.length);
        if (this.entradaSecreta !== FRASE_SECRETA) return;

        this.entradaSecreta = "";
        if (typeof window.mostrarPergaminoTouhou !== "function") {
            console.error("[StartButtons] No se pudo abrir el pergamino: falta la función del juego.");
            return;
        }

        if (window.mostrarPergaminoTouhou()) {
            this.inicio.style.display = "none";
            this.universo.classList.add("pergamino-secreto");
        }
    }

    /** SÍ: cierra la intro y encadena la secuencia del universo */
    aceptar() {
        if (this.secuenciaIniciada) return;
        this.secuenciaIniciada = true;

        this.iniciarMusicaIntro();
        this.programarSecuenciaUniverso();

        this.inicio.style.opacity = "0";
        setTimeout(() => { this.inicio.style.display = "none"; }, 700);
    }

    iniciarMusicaIntro() {
        this.musica = document.createElement("audio");
        const fuenteCancion = document.createElement("source");
        fuenteCancion.src = RUTA_CANCION;
        fuenteCancion.type = "audio/mpeg";
        this.musica.appendChild(fuenteCancion);
        this.musica.loop = true;
        this.musica.play().catch(error => {
            console.error(
                `[StartButtons] No se pudo reproducir la canción "${RUTA_CANCION}". Revisa la ruta y el formato del archivo.`,
                error
            );
        });
        window.prepararAudioTouhou?.();
    }

    programarSecuenciaUniverso() {
        // Las fotos empiezan a despedirse
        setTimeout(() => this.universo.classList.add("cierre-frases"), 20000);

        // Seis segundos después comienza a nacer el universo
        setTimeout(() => this.universo.classList.add("golden-final"), 26000);

        setTimeout(() => this.frases.iniciarFrenado(), INICIO_FRENADO_FRASES);
        setTimeout(() => this.iniciarTrayectoFinal(), INICIO_TRAYECTO_FINAL);
        setTimeout(() => this.mostrarGalaxiaFinal(), INICIO_GALAXIA_FINAL);
    }

    iniciarTrayectoFinal() {
        this.frases.iniciarRecorridoFinal(() => this.mostrarMensajeFinal());
    }

    mostrarMensajeFinal() {
        this.universo.classList.add("mensaje-final-visible");
    }

    mostrarGalaxiaFinal() {
        this.universo.classList.add("galaxy-visible");
        setTimeout(
            () => this.finalizarGalaxia(),
            DURACION_GALAXIA - DURACION_DESVANECIMIENTO_GALAXIA
        );
    }

    finalizarGalaxia() {
        this.universo.classList.remove("galaxy-visible");
        this.universo.classList.add("finale-negro");
        this.desvanecerMusica();

        setTimeout(
            () => this.iniciarSupervivencia(),
            DURACION_DESVANECIMIENTO_GALAXIA
                + ESPERA_MENSAJE_CIERRE
                + ESPERA_SUPERVIVENCIA
        );
    }

    iniciarSupervivencia() {
        const overlay = document.getElementById("juegoOverlay");
        const aviso = document.getElementById("supervivenciaMensaje");

        if (!overlay || !aviso || typeof window.iniciarJuegoTouhou !== "function") {
            console.error("[StartButtons] No se pudo iniciar la fase de supervivencia: faltan elementos del juego.");
            return;
        }

        this.universo.classList.remove("finale-negro");
        this.universo.classList.add("fase-supervivencia", "galaxy-visible");
        aviso.classList.add("visible");
        window.iniciarJuegoTouhou();

        setTimeout(() => aviso.classList.remove("visible"), DURACION_AVISO_SUPERVIVENCIA);
    }

    desvanecerMusica() {
        if (!this.musica || this.musica.paused) return;

        const volumenInicial = this.musica.volume;
        const inicio = performance.now();
        const musica = this.musica;
        let desvanecimientoTerminado = false;

        const detenerMusica = () => {
            if (desvanecimientoTerminado) return;
            desvanecimientoTerminado = true;
            musica.volume = 0;
            musica.pause();
            musica.currentTime = 0;
        };

        const bajarVolumen = tiempo => {
            const progreso = Math.min(
                (tiempo - inicio) / DURACION_DESVANECIMIENTO_MUSICA,
                1
            );
            musica.volume = volumenInicial * (1 - progreso) ** 2;

            if (progreso < 1) {
                requestAnimationFrame(bajarVolumen);
                return;
            }

            detenerMusica();
        };

        setTimeout(detenerMusica, DURACION_DESVANECIMIENTO_MUSICA + 100);
        requestAnimationFrame(bajarVolumen);
    }

    explotar(alTerminar = () => {}) {
        const explosion = document.getElementById("explosion");
        if (!explosion) {
            console.error("[StartButtons] No se encontró el elemento de la explosión.");
            alTerminar();
            return;
        }

        const rect = this.no.getBoundingClientRect();

        explosion.style.left = `${rect.left + rect.width / 2 - 36}px`;
        explosion.style.top = `${rect.top + rect.height / 2 - 50}px`;

        this.sonidoExplosion.volume = 0.7;
        this.sonidoExplosion.currentTime = 0;
        this.sonidoExplosion.play().then(() => {
            this.animarExplosion(explosion, alTerminar);
        }).catch(error => {
            console.error("[StartButtons] No se pudo reproducir el sonido de la explosión.", error);
            this.animarExplosion(explosion, alTerminar);
        });
    }

    animarExplosion(explosion, alTerminar) {
        const inicio = performance.now();
        let ultimoFotograma = -1;

        explosion.style.backgroundPosition = "0 -15px";
        explosion.classList.add("activa");

        const avanzarFotograma = tiempo => {
            const fotograma = Math.floor(
                (tiempo - inicio) / DURACION_FOTOGRAMA_EXPLOSION
            );

            if (fotograma >= TOTAL_FOTOGRAMAS_EXPLOSION) {
                explosion.classList.remove("activa");
                alTerminar();
                return;
            }

            if (fotograma !== ultimoFotograma) {
                const columna = fotograma % 6;
                const fila = Math.floor(fotograma / 6);
                const x = columna * ANCHO_FOTOGRAMA_EXPLOSION;
                const y = 15 + fila * ALTO_FOTOGRAMA_EXPLOSION;

                explosion.style.backgroundPosition = `-${x}px -${y}px`;
                ultimoFotograma = fotograma;
            }

            requestAnimationFrame(avanzarFotograma);
        };

        requestAnimationFrame(avanzarFotograma);
    }

    /** NO: se mueve al hacer clic y explota al cuarto intento */
    intentarNo() {
        if (this.explosionEnCurso) return;

        this.intentosNo++;

        if (this.intentosNo === 3) {
            this.respuestaNo.textContent = "Sigue jodiendo y reviento el boton >:V";
            this.respuestaNo.classList.remove("visible");
            void this.respuestaNo.offsetWidth;
            this.respuestaNo.classList.add("visible");
        }

        if (this.intentosNo === 4) {
         
           
            
            this.explotar(() => {
                this.explosionEnCurso = false;
                this.moverNo();
                this.respuestaNo.textContent = "TE LO ADVERTI >:V";
                this.no.style.display = "none";
            });
           
             this.explosionEnCurso = true;
            return;
            
        }
       
        this.moverNo();
      
    }

    moverNo() {
        const margenX = window.innerWidth * 0.08;
        const margenY = window.innerHeight * 0.10;

        const rect = this.no.getBoundingClientRect();

        const btnW = rect.width;
        const btnH = rect.height;

        const minX = margenX;
        const minY = margenY;

        const maxX = Math.max(
            minX,
            window.innerWidth - btnW - margenX
        );

        const maxY = Math.max(
            minY,
            window.innerHeight - btnH - margenY
        );

        const nuevaX =
            minX + Math.random() * Math.max(0, maxX - minX);

        const nuevaY =
            minY + Math.random() * Math.max(0, maxY - minY);

        this.no.style.position = "fixed";
        this.no.style.left = `${nuevaX}px`;
        this.no.style.top = `${nuevaY}px`;
    }
}
