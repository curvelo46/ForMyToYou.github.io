
import { gameAudio } from "./game/audio.js";
import { createBossAttacks } from "./game/boss-attacks.js";
import { createExplosionEffect } from "./game/explosion.js";

const canvas = document.getElementById("juego");
const ctx = canvas?.getContext("2d");

if (!canvas || !ctx) {
    throw new Error("[Space Dodge] No se encontró el canvas del juego o no se pudo crear su contexto 2D.");
}

const assetUrl = file => new URL(`../${file}`, import.meta.url).href;
const imagenNave = new Image();
imagenNave.src = assetUrl("nave.png");
const imagenJefe = new Image();
imagenJefe.src = assetUrl("jefe1.png");
const imagenJefe2 = new Image();
imagenJefe2.src = assetUrl("jefe2.png");

const jugador = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    ancho: 60,
    alto: 60,
    velocidad: 5,
    ultimoDisparo: 0,
    velocidadDisparo: 40
};

const teclas = {};
let juegoActivo = canvas.dataset.autostart !== "false";
const DURACION_PASO_JUEGO = 1000 / 60;
let ultimoFotograma = null;
let tiempoAcumulado = 0;
let fotogramaJuego = null;
let jefeDerrotadoEsperandoPortal = false;
let transicionPortal = false;


function mostrarPergamino() {
    const pergamino = document.getElementById("pergaminoOverlay");
    if (!pergamino) {
        console.error("[Space Dodge] No se encontró el pergamino que debe mostrarse.");
        return false;
    }

    pergamino.classList.remove("portal-transicion", "portal-oscurece", "portal-ilumina");
    juegoActivo = false;
    gameAudio.pauseGameMusic();
    if (fotogramaJuego !== null) {
        cancelAnimationFrame(fotogramaJuego);
        fotogramaJuego = null;
    }

    pergamino.hidden = false;
    gameAudio.showParchment();
    return true;
}

function prepararAudio() {
    gameAudio.prepareSurvivalAudio();
}

function iniciarJuegoIntegrado() {
    if (juegoActivo) return;

    juegoActivo = true;
    gameAudio.startIntegratedGame();

    if (fotogramaJuego === null) {
        ultimoFotograma = null;
        tiempoAcumulado = 0;
        fotogramaJuego = requestAnimationFrame(bucle);
    }
}

window.prepararAudioTouhou = prepararAudio;
window.iniciarJuegoTouhou = iniciarJuegoIntegrado;
window.mostrarPergaminoTouhou = mostrarPergamino;

document.getElementById("cerrarPergamino")?.addEventListener("click", () => {
    const pergamino = document.getElementById("pergaminoOverlay");
    if (pergamino) pergamino.hidden = true;

    const universo = document.getElementById("universo");
    if (universo?.classList.contains("pergamino-secreto")) {
        universo.classList.remove("pergamino-secreto");
        const inicio = document.getElementById("inicio");
        if (inicio) inicio.style.display = "";
    }
});

document.addEventListener("keydown", event => {
    if (juegoActivo) {
        teclas[event.key.toLowerCase()] = true;
        gameAudio.prepareParchmentMusicFromGesture();
    }

    gameAudio.startAutoplayMusic(canvas.dataset.autostart !== "false");
});

document.addEventListener("keyup", event => {
    teclas[event.key.toLowerCase()] = false;
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (fotogramaJuego !== null) {
            cancelAnimationFrame(fotogramaJuego);
            fotogramaJuego = null;
        }
        ultimoFotograma = null;
        tiempoAcumulado = 0;
        return;
    }

    if (juegoActivo && fotogramaJuego === null) {
        fotogramaJuego = requestAnimationFrame(bucle);
    }
});

let meteoritos = [];
let tiempoMeteoritos = 50;
let contadorMeteoritos = 0;

// ==========================================
// DISPAROS DE LA NAVE
// ==========================================

let disparos = [];

// ==========================================
// PUNTUACIÓN
// ==========================================

let puntuacion = 0;

// ==========================================
// JEFE
// ==========================================

const jefe = {
    x: canvas.width / 2,
    y: 100,

    ancho: 100,
    alto: 100,

    // Primera forma
    vida: 1000,
    vidaMaxima: 1000,

    activo: true,

    // 1 = jefe1.png
    // 2 = jefe2.png
    forma: 1,

    contadorDisparo: 0,
    contadorPatron2: 0,
    contadorRayo: 0,

    angulo: 0,

    imagen: imagenJefe
};

// ==========================================
// BALAS DEL JEFE
// ==========================================

let balasJefe = [];

// ==========================================
// RAYOS DEL JEFE
// ==========================================

let rayosJefe = [];
const ataquesJefe = createBossAttacks(
    jefe,
    jugador,
    bala => balasJefe.push(bala),
    rayo => rayosJefe.push(rayo)
);
const explosionJefe = createExplosionEffect(
    ctx,
    () => gameAudio.playBossExplosion(),
    () => {
        juegoActivo = false;
        gameAudio.pauseGameMusic();
        mostrarPergamino();
    }
);


// ==========================================
// PORTAL Y EXPLOSIONES FINALES
// ==========================================

let explosiones = [];

const portal = {
    x: 0,
    y: 0,
    radio: 65,
    activo: false,
    animacion: 0
};

// ==========================================
// DAÑO DE LA NAVE
// ==========================================

let dañoDisparo = 8;

let laseresJugador = [];


// ==========================================
// CREAR METEORITO
// ==========================================

function crearMeteorito() {
    const meteorito = {
        x: Math.random() * (canvas.width - 40),
        y: -40,
        velocidad: 2 + Math.random() * 4,
        tamaño: 30
    };

    meteoritos.push(meteorito);
}

// ==========================================
// DISPARAR NAVE
// ==========================================

function disparar() {
    const ahora = Date.now();

    if (ahora - jugador.ultimoDisparo < 100) {
        return;
    }

    jugador.ultimoDisparo = ahora;

    // Disparo central
    disparos.push({
        x: jugador.x,
        y: jugador.y - jugador.alto / 2,
        velocidad: 3,
        daño: dañoDisparo
    });

    // ATAQUE DESBLOQUEADO A LOS 3000 PUNTOS
    if (puntuacion >= 3000) {

        // Disparo diagonal izquierdo
        disparos.push({
            x: jugador.x - 15,
            y: jugador.y - jugador.alto / 2,
            velocidad: 5,
            velocidadX: -1.5,
            daño: 8
        });

        // Disparo diagonal derecho
        disparos.push({
            x: jugador.x + 15,
            y: jugador.y - jugador.alto / 2,
            velocidad: 5,
            velocidadX: 1.5,
            daño: 8
        });
    }
}

// ==========================================
// MOVER JUGADOR
// ==========================================

function moverJugador() {

    if (teclas["arrowleft"] || teclas["a"]) {
        jugador.x -= jugador.velocidad;
    }

    if (teclas["arrowright"] || teclas["d"]) {
        jugador.x += jugador.velocidad;
    }

    if (teclas["arrowup"] || teclas["w"]) {
        jugador.y -= jugador.velocidad;
    }

    if (teclas["arrowdown"] || teclas["s"]) {
        jugador.y += jugador.velocidad;
    }

    // Límites horizontales

    if (jugador.x < jugador.ancho / 2) {
        jugador.x = jugador.ancho / 2;
    }

    if (jugador.x > canvas.width - jugador.ancho / 2) {
        jugador.x = canvas.width - jugador.ancho / 2;
    }

    // Límites verticales

    if (jugador.y < jugador.alto / 2) {
        jugador.y = jugador.alto / 2;
    }

    if (jugador.y > canvas.height - jugador.alto / 2) {
        jugador.y = canvas.height - jugador.alto / 2;
    }

    // Disparar con Z

    if (teclas["z"]) {
        disparar();
    }
}

// ==========================================
// DIBUJAR NAVE
// ==========================================

function dibujarJugador() {

    ctx.drawImage(
        imagenNave,
        jugador.x - jugador.ancho / 2,
        jugador.y - jugador.alto / 2,
        jugador.ancho,
        jugador.alto
    );
}



// ==========================================
// DIBUJAR EXPLOSIONES
// ==========================================

function dibujarExplosiones() {

    for (const explosion of explosiones) {

        const alpha =
            explosion.vida / 35;

        for (const particula of explosion.particulas) {

            ctx.beginPath();

            ctx.arc(
                particula.x,
                particula.y,
                particula.radio,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(255, ${80 + Math.random() * 120}, 30, ${alpha})`;

            ctx.fill();
        }
    }
}





// ==========================================
// actualizar láser del jugador
// ==========================================

function actualizarLaserJugador() {
    laseresJugador = [];

    if (puntuacion < 5000) {
        return;
    }

    // Láser izquierdo
    laseresJugador.push({
        x: jugador.x - 20,
        y: jugador.y - jugador.alto / 2,
        ancho: 10
        
    });

    // Láser derecho
    laseresJugador.push({
        x: jugador.x + 20,
        y: jugador.y - jugador.alto / 2,
        ancho: 10
    });

    // Daño continuo al jefe
    for (const laser of laseresJugador) {

        if (
            jefe.activo &&
            laser.x >= jefe.x - jefe.ancho / 2 &&
            laser.x <= jefe.x + jefe.ancho / 2 &&
            laser.y < jefe.y + jefe.alto / 2
        ) {
            jefe.vida -= 6.5;
        }
    }
}


// ==========================================
// DIBUJAR laser del jugador
// ==========================================



function dibujarLaserJugador() {

    if (puntuacion < 5000) {
        return;
    }

    ctx.save();

    for (const laser of laseresJugador) {

        const gradiente = ctx.createLinearGradient(
            laser.x - laser.ancho / 2,
            0,
            laser.x + laser.ancho / 2,
            0
        );

        gradiente.addColorStop(0, "rgba(0,255,255,0)");
        gradiente.addColorStop(0.5, "white");
        gradiente.addColorStop(1, "rgba(0,255,255,0)");

        ctx.fillStyle = gradiente;

        ctx.fillRect(
            laser.x - laser.ancho / 2,
            0,
            laser.ancho,
            jugador.y
        );
    }

    ctx.restore();
}



// ==========================================
// CREAR EXPLOSIÓN
// ==========================================

function crearExplosion(x, y) {

    const explosion = {
        x: x,
        y: y,
        particulas: [],
        vida: 35
    };

    for (let i = 0; i < 18; i++) {

        const angulo =
            Math.random() * Math.PI * 2;

        const velocidad =
            1.5 + Math.random() * 3;

        explosion.particulas.push({
            x: x,
            y: y,
            velocidadX:
                Math.cos(angulo) * velocidad,
            velocidadY:
                Math.sin(angulo) * velocidad,
            radio:
                2 + Math.random() * 4
        });
    }

    explosiones.push(explosion);
}



// ==========================================
// DIBUJAR METEORITO
// ==========================================

function dibujarMeteorito(meteorito) {

    ctx.fillStyle = "#ff6b00";
    ctx.font = "35px monospace";

    ctx.fillText(
        "*",
        meteorito.x,
        meteorito.y
    );
}

// ==========================================
// DIBUJAR DISPAROS
// ==========================================

function dibujarDisparos() {

    ctx.fillStyle = "#00ffff";

    for (const disparo of disparos) {

        ctx.fillRect(
            disparo.x - 2,
            disparo.y,
            4,
            12
        );
    }
}




// ==========================================
// ACTUALIZAR EXPLOSIONES
// ==========================================

function actualizarExplosiones() {

    for (
        let i = explosiones.length - 1;
        i >= 0;
        i--
    ) {

        const explosion = explosiones[i];

        explosion.vida--;

        for (const particula of explosion.particulas) {

            particula.x += particula.velocidadX;
            particula.y += particula.velocidadY;

            particula.velocidadX *= 0.96;
            particula.velocidadY *= 0.96;

            particula.radio *= 0.96;
        }

        if (explosion.vida <= 0) {
            explosiones.splice(i, 1);
        }
    }

    // Cuando ya no queda ninguna explosión,
    // aparece el portal.

    if (
        jefeDerrotadoEsperandoPortal &&
        explosiones.length === 0 &&
        !portal.activo
    ) {

        portal.activo = true;

        portal.x = jefe.x;
        portal.y = jefe.y;

        portal.animacion = 0;

        jefeDerrotadoEsperandoPortal = false;
    }
}










// ==========================================
// ACTUALIZAR DISPAROS
// ==========================================

function actualizarDisparos() {

    for (
        let i = disparos.length - 1;
        i >= 0;
        i--
    ) {

        const disparo = disparos[i];

        disparo.y -= disparo.velocidad;

        if (disparo.y < -20) {
            disparos.splice(i, 1);
        }
    }
}

// ==========================================
// COLISIÓN DISPARO - METEORITO
// ==========================================

function comprobarColisionDisparo(
    disparo,
    meteorito
) {

    const distanciaX =
        disparo.x - meteorito.x;

    const distanciaY =
        disparo.y - meteorito.y;

    const distancia =
        Math.sqrt(
            distanciaX * distanciaX +
            distanciaY * distanciaY
        );

    return distancia < 25;
}

// ==========================================
// COLISIÓN NAVE - METEORITO
// ==========================================

function comprobarColisionJugador(
    jugador,
    meteorito
) {

    const distanciaX =
        jugador.x - meteorito.x;

    const distanciaY =
        jugador.y - meteorito.y;

    const distancia =
        Math.sqrt(
            distanciaX * distanciaX +
            distanciaY * distanciaY
        );

    return distancia < 35;
}

// ==========================================
// ACTUALIZAR METEORITOS
// ==========================================

function actualizarMeteoritos() {

    for (
        let i = meteoritos.length - 1;
        i >= 0;
        i--
    ) {

        const meteorito = meteoritos[i];

        meteorito.y += meteorito.velocidad;

        if (
            comprobarColisionJugador(
                jugador,
                meteorito
            )
        ) {

            perder();
            return;
        }

        if (
            meteorito.y >
            canvas.height + 40
        ) {

            meteoritos.splice(i, 1);
        }
    }
}

// ==========================================
// DISPAROS CONTRA METEORITOS
// ==========================================

function comprobarDisparos() {

    for (
        let i = disparos.length - 1;
        i >= 0;
        i--
    ) {

        const disparo = disparos[i];

        for (
            let j = meteoritos.length - 1;
            j >= 0;
            j--
        ) {

            const meteorito = meteoritos[j];

            if (
                comprobarColisionDisparo(
                    disparo,
                    meteorito
                )
            ) {

                disparos.splice(i, 1);
                meteoritos.splice(j, 1);

                puntuacion += 40;

                actualizarPuntuacion();

                break;
            }
        }
    }
}

// ==========================================
// PUNTUACIÓN
// ==========================================

function actualizarPuntuacion() {

    document.getElementById(
        "puntuacion"
    ).textContent = puntuacion;
}

// ==========================================
// ACTUALIZAR RAYOS
// ==========================================

function actualizarRayosJefe() {

    for (
        let i = rayosJefe.length - 1;
        i >= 0;
        i--
    ) {

        const rayo = rayosJefe[i];

        rayo.duracion--;
        rayo.aviso--;

        // ==================================
        // COLISIÓN
        // ==================================

        if (rayo.aviso <= 0) {

            const dx =
                jugador.x - rayo.x;

            const dy =
                jugador.y - rayo.y;

            const distancia =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            const anguloJugador =
                Math.atan2(dy, dx);

            let diferencia =
                Math.abs(
                    anguloJugador -
                    rayo.angulo
                );

            if (diferencia > Math.PI) {

                diferencia =
                    Math.PI * 2 -
                    diferencia;
            }

            const distanciaRayo =
                Math.abs(
                    distancia *
                    Math.sin(diferencia)
                );

            if (
                distanciaRayo <
                rayo.grosor + 12
            ) {

                if (
                    distancia <
                    rayo.longitud
                ) {

                    perder();
                    return;
                }
            }
        }

        // ==================================
        // ELIMINAR RAYO
        // ==================================

        if (rayo.duracion <= 0) {

            rayosJefe.splice(i, 1);
        }
    }
}

// ==========================================
// DIBUJAR RAYOS
// ==========================================

function dibujarRayosJefe() {

    for (const rayo of rayosJefe) {

        const finalX =
            rayo.x +
            Math.cos(rayo.angulo) *
            rayo.longitud;

        const finalY =
            rayo.y +
            Math.sin(rayo.angulo) *
            rayo.longitud;

        // ==================================
        // AVISO
        // ==================================

        if (rayo.aviso > 0) {

            ctx.beginPath();

            ctx.moveTo(
                rayo.x,
                rayo.y
            );

            ctx.lineTo(
                finalX,
                finalY
            );

            ctx.strokeStyle = "#ffaa00";
            ctx.lineWidth = 4;

            ctx.setLineDash([10, 10]);

            ctx.stroke();

            ctx.setLineDash([]);
        }

        // ==================================
        // RAYO ACTIVO
        // ==================================

        else {

            // Borde

            ctx.beginPath();

            ctx.moveTo(
                rayo.x,
                rayo.y
            );

            ctx.lineTo(
                finalX,
                finalY
            );

            ctx.strokeStyle = "#ff0055";
            ctx.lineWidth = rayo.grosor;

            ctx.stroke();

            // Centro

            ctx.beginPath();

            ctx.moveTo(
                rayo.x,
                rayo.y
            );

            ctx.lineTo(
                finalX,
                finalY
            );

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth =
                rayo.grosor / 3;

            ctx.stroke();
        }
    }
}

// ==========================================
// ACTUALIZAR JEFE
// ==========================================

function actualizarJefe() {

    if (!jefe.activo) {
        return;
    }

    jefe.contadorDisparo++;
    jefe.contadorPatron2++;
    jefe.contadorRayo++;

    const porcentajeVida =
        jefe.vida /
        jefe.vidaMaxima;

    // ======================================
    // PRIMERA FORMA
    // jefe1.png
    // ======================================

   if (jefe.forma === 1) {

    // PATRÓN 1: ESPIRAL
    if (jefe.contadorDisparo >= 35) {

        ataquesJefe.spiral();

        jefe.contadorDisparo = 0;
    }

    // PATRÓN 2: ABANICO
    if (jefe.contadorPatron2 >= 55) {

        ataquesJefe.fan();

        jefe.contadorPatron2 = 0;
    }

    return;
}

    // ======================================
    // SEGUNDA FORMA
    // jefe2.png
    // ======================================

    // ======================================
    // 100% → 50%
    // ======================================

    if (porcentajeVida > 0.50) {

        if (
            jefe.contadorDisparo >= 35
        ) {

            ataquesJefe.spiral();

            jefe.contadorDisparo = 0;
        }
    }

    // ======================================
    // 50% → 25%
    // ======================================

    else if (porcentajeVida > 0.25) {

        // Patrón 1

        if (
            jefe.contadorDisparo >= 35
        ) {

            ataquesJefe.spiral();

            jefe.contadorDisparo = 0;
        }

      

        // Rayo

        if (
            jefe.contadorRayo >= 180
        ) {

            ataquesJefe.beam();

            jefe.contadorRayo = 0;
        }
    }

    // ======================================
    // 25% → 0%
    // ======================================

    else {

        // El daño baja a 2.5

        dañoDisparo = 2.5;

        // ==================================
        // LOS 4 PATRONES JUNTOS
        // ==================================

        if (
            jefe.contadorDisparo >= 45
        ) {

            ataquesJefe.spiral();
           
            ataquesJefe.reverseSpiral();
            ataquesJefe.doubleFan();

            jefe.contadorDisparo = 0;
        }

        // ==================================
        // RAYO
        // ==================================

        if (
            jefe.contadorRayo >= 170
        ) {

            ataquesJefe.beam();

            jefe.contadorRayo = 0;
        }
    }
}

// ==========================================
// ACTUALIZAR BALAS DEL JEFE
// ==========================================

function actualizarBalasJefe() {

    for (
        let i = balasJefe.length - 1;
        i >= 0;
        i--
    ) {

        const bala = balasJefe[i];

        bala.x += bala.velocidadX;
        bala.y += bala.velocidadY;

        // Fuera de pantalla

        if (
            bala.x < -20 ||
            bala.x > canvas.width + 20 ||
            bala.y < -20 ||
            bala.y > canvas.height + 20
        ) {

            balasJefe.splice(i, 1);
            continue;
        }

        // Colisión con jugador

        const distanciaX =
            jugador.x - bala.x;

        const distanciaY =
            jugador.y - bala.y;

        const distancia =
            Math.sqrt(
                distanciaX * distanciaX +
                distanciaY * distanciaY
            );

        if (distancia < 14) {

            perder();
            return;
        }
    }
}

// ==========================================
// DIBUJAR JEFE
// ==========================================

function dibujarJefe() {

    if (!jefe.activo) {
        return;
    }

    ctx.drawImage(
        jefe.imagen,
        jefe.x - jefe.ancho / 2,
        jefe.y - jefe.alto / 2,
        jefe.ancho,
        jefe.alto
    );
}

// ==========================================
// DIBUJAR BALAS DEL JEFE
// ==========================================

function dibujarBalasJefe() {

    for (const bala of balasJefe) {

        ctx.beginPath();

        ctx.arc(
            bala.x,
            bala.y,
            bala.radio,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ff3366";
        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            bala.x,
            bala.y,
            bala.radio / 2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffffff";
        ctx.fill();
    }
}

// ==========================================
// DAÑO AL JEFE
// ==========================================

function comprobarDisparosContraJefe() {

    if (!jefe.activo) {
        return;
    }

    const porcentajeVida =
        jefe.vida /
        jefe.vidaMaxima;

    // Daño normal

    dañoDisparo = 5;

    // Última fase

    if (
        jefe.forma === 2 &&
        porcentajeVida <= 0.25
    ) {

        dañoDisparo = 3.5;
    }

    // Comprobar disparos

    for (
        let i = disparos.length - 1;
        i >= 0;
        i--
    ) {

        const disparo = disparos[i];

        const distanciaX =
            disparo.x - jefe.x;

        const distanciaY =
            disparo.y - jefe.y;

        const distancia =
            Math.sqrt(
                distanciaX * distanciaX +
                distanciaY * distanciaY
            );

        if (
            distancia <
            jefe.ancho / 2
        ) {

            disparos.splice(i, 1);

            jefe.vida -= dañoDisparo;

            puntuacion += 10;

            actualizarPuntuacion();

            // ==================================
            // JEFE LLEGA A 0
            // ==================================

            if (jefe.vida <= 0) {

                // ==================================
                // PRIMERA DERROTA
                // ==================================

                if (jefe.forma === 1) {

                    console.log(
                        "¡PRIMERA FORMA DERROTADA!"
                    );

                    // Cambiar forma

                    jefe.forma = 2;

                    // Cambiar imagen

                    jefe.imagen =
                        imagenJefe2;

                    // Segunda vida

                    jefe.vida = 2000;
                    jefe.vidaMaxima = 2000;

                    // Reiniciar ataques

                    jefe.contadorDisparo = 0;
                    jefe.contadorPatron2 = 0;
                    jefe.contadorRayo = 0;
                    jefe.angulo = 0;

                    // Limpiar ataques antiguos

                    balasJefe = [];
                    rayosJefe = [];

                    // Volver a daño normal

                    dañoDisparo = 5;

                    console.log(
                        "¡SEGUNDA FORMA!"
                    );

                    return;
                }

                // ==================================
                // SEGUNDA DERROTA
                // JEFE FINALMENTE MUERE
                // ==================================

                jefe.vida = 0;
jefe.activo = false;

// ==========================================
// EXPLOSIÓN DE TODAS LAS BALAS
// ==========================================

for (const bala of balasJefe) {

    crearExplosion(
        bala.x,
        bala.y
    );
}

// También hacemos una explosión en el jefe

crearExplosion(
    jefe.x,
    jefe.y
);

// ==========================================
// ELIMINAR BALAS Y RAYOS
// ==========================================

balasJefe = [];
rayosJefe = [];

// ==========================================
// ESPERAR A QUE TERMINEN LAS EXPLOSIONES
// ==========================================

jefeDerrotadoEsperandoPortal = true;

console.log(
    "¡JEFE DERROTADO DEFINITIVAMENTE!"
);
            }
        }
    }
}


// ==========================================
// DIBUJAR PORTAL
// ==========================================

function dibujarPortal() {

    if (!portal.activo) {
        return;
    }

    portal.animacion += 0.05;

    const pulso =
        Math.sin(portal.animacion) * 8;

    const radio =
        portal.radio + pulso;

    // Aura exterior

    ctx.beginPath();

    ctx.arc(
        portal.x,
        portal.y,
        radio + 15,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "rgba(0, 100, 255, 0.35)";

    ctx.lineWidth = 12;

    ctx.stroke();

    // Portal rojo

    ctx.beginPath();

    ctx.arc(
        portal.x,
        portal.y,
        radio,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "#ff1744";

    ctx.lineWidth = 18;

    ctx.stroke();

    // Portal azul

    ctx.beginPath();

    ctx.arc(
        portal.x,
        portal.y,
        radio - 10,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "#00aaff";

    ctx.lineWidth = 12;

    ctx.stroke();

    // Centro oscuro

    ctx.beginPath();

    ctx.arc(
        portal.x,
        portal.y,
        radio - 20,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#050015";

    ctx.fill();

    // Espiral interna

    ctx.beginPath();

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const angulo =
            portal.animacion +
            i * 0.35;

        const distancia =
            (radio - 20) *
            (i / 30);

        const x =
            portal.x +
            Math.cos(angulo) * distancia;

        const y =
            portal.y +
            Math.sin(angulo) * distancia;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
}




// ==========================================
// COMPROBAR ENTRADA AL PORTAL
// ==========================================

function comprobarPortal() {

    if (!portal.activo || transicionPortal) {
        return;
    }

    const dx =
        jugador.x - portal.x;

    const dy =
        jugador.y - portal.y;

    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (
        distancia <
        portal.radio
    ) {
        transicionPortal = true;
        iniciarTransicionPergamino();
    }
}


function iniciarTransicionPergamino() {
    const overlay = document.getElementById("pergaminoOverlay");
    const iframe = overlay?.querySelector("iframe");

    if (!overlay || !iframe) {
        console.error("[Space Dodge] No se pudo iniciar la transición: falta el overlay o el pergamino.");
        transicionPortal = false;
        return;
    }

    overlay.hidden = false;
    overlay.classList.remove("portal-oscurece", "portal-ilumina");
    overlay.classList.add("portal-transicion");

    const recibirConfirmacion = event => {
        if (event.source !== iframe.contentWindow || event.data?.tipo !== "pergamino-portal-listo") return;

        window.removeEventListener("message", recibirConfirmacion);
        overlay.classList.add("portal-ilumina");
        gameAudio.showParchment();
        juegoActivo = false;
        gameAudio.pauseGameMusic();
        if (fotogramaJuego !== null) {
            cancelAnimationFrame(fotogramaJuego);
            fotogramaJuego = null;
        }
    };

    const solicitarApertura = () => {
        window.addEventListener("message", recibirConfirmacion);
        iframe.contentWindow?.postMessage({ tipo: "abrir-pergamino-portal" }, "*");
    };

    const completarOscurecimiento = event => {
        if (event.target !== overlay || event.propertyName !== "opacity") return;
        overlay.removeEventListener("transitionend", completarOscurecimiento);

        if (iframe.contentDocument?.readyState === "complete") {
            solicitarApertura();
        } else {
            iframe.addEventListener("load", solicitarApertura, { once: true });
        }
    };

    overlay.addEventListener("transitionend", completarOscurecimiento);

    requestAnimationFrame(() => overlay.classList.add("portal-oscurece"));
}



// ==========================================
// BARRA DE VIDA DEL JEFE
// ==========================================

function dibujarVidaJefe() {

    if (!jefe.activo) {
        return;
    }

    const anchoBarra = 500;
    const altoBarra = 18;

    const x =
        canvas.width / 2 -
        anchoBarra / 2;

    const y = 20;

    const porcentaje =
        Math.max(
            0,
            jefe.vida / jefe.vidaMaxima
        );

    // Fondo

    ctx.fillStyle = "#222";

    ctx.fillRect(
        x,
        y,
        anchoBarra,
        altoBarra
    );

    // Vida

    ctx.fillStyle =
        jefe.forma === 1
            ? "#00ffff"
            : "#ff0055";

    ctx.fillRect(
        x,
        y,
        anchoBarra * porcentaje,
        altoBarra
    );

    // Borde

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        x,
        y,
        anchoBarra,
        altoBarra
    );

    // Texto

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "14px monospace";

    ctx.textAlign = "center";

    ctx.fillText(
        jefe.forma === 1
            ? "JEFE - FORMA 1"
            : "JEFE - FORMA 2",
        canvas.width / 2,
        y + 14
    );

    ctx.textAlign = "left";
}

// ==========================================
// GAME OVER
// ==========================================

function perder() {

    if (!juegoActivo) {
        return;
    }

    juegoActivo = false;

    const puntuacionFinal =
        document.getElementById(
            "puntuacionFinal"
        );

    if (puntuacionFinal) {

        puntuacionFinal.textContent =
            puntuacion;
    }

    document.getElementById(
        "mensaje"
    ).style.display = "flex";
}

// ==========================================
// REINICIAR
// ==========================================

function reiniciar() {
    gameAudio.resumeGameAfterRestart(canvas.dataset.autostart !== "false");

    meteoritos = [];
    disparos = [];
    balasJefe = [];
    rayosJefe = [];

    puntuacion = 0;

    // ======================================
    // JUGADOR
    // ======================================

    jugador.x =
        canvas.width / 2;

    jugador.y =
        canvas.height - 100;

    jugador.ultimoDisparo = 0;

    // ======================================
    // JEFE
    // ======================================

    jefe.x =
        canvas.width / 2;

    jefe.y = 100;

    jefe.forma = 1;

    jefe.vida = 1000;

    jefe.vidaMaxima = 1000;

    jefe.activo = true;

    jefe.imagen =
        imagenJefe;
    explosionJefe.reset();

    jefe.contadorDisparo = 0;
    jefe.contadorPatron2 = 0;
    jefe.contadorRayo = 0;
    jefe.angulo = 0;

    // ======================================
    // DAÑO
    // ======================================

    dañoDisparo = 5;

    // ======================================
    // JUEGO
    // ======================================

    juegoActivo = true;

    contadorMeteoritos = 0;

    tiempoMeteoritos = 30;

    actualizarPuntuacion();

    document.getElementById(
        "mensaje"
    ).style.display = "none";

    ultimoFotograma = null;
    tiempoAcumulado = 0;
    fotogramaJuego = requestAnimationFrame(bucle);
}

window.reiniciar = reiniciar;

// ==========================================
// DIBUJAR TODO
// ==========================================

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // NAVE
    dibujarJugador();

    // METEORITOS
    for (
        const meteorito of meteoritos
    ) {

        dibujarMeteorito(
            meteorito
        );
    }

    // DISPAROS
    dibujarDisparos();

    // JEFE
    dibujarJefe();

    // BALAS
    dibujarBalasJefe();

    // RAYOS
    dibujarRayosJefe();

    // EXPLOSIONES
    dibujarExplosiones();

    // PORTAL
    dibujarPortal();

    // VIDA
    dibujarVidaJefe();

    // OSCURIDAD FINAL
}

// ==========================================
// BUCLE PRINCIPAL
// ==========================================

function actualizarJuego() {
    if (transicionPortal) return;

    if (explosionJefe.active) {
        explosionJefe.update();
        return;
    }

    // Jugador

    moverJugador();
    actualizarLaserJugador();

    // Meteoritos

    actualizarMeteoritos();
    if (!juegoActivo) return;

    // Disparos
    actualizarExplosiones();

    // PORTAL
    comprobarPortal();
    if (transicionPortal) return;

    actualizarDisparos();

    comprobarDisparos();

    // Jefe

    actualizarJefe();

    actualizarBalasJefe();

    actualizarRayosJefe();

    dibujar();

    // METEORITOS
    contadorMeteoritos++;


    comprobarDisparosContraJefe();

    if (!juegoActivo) return;

    // Crear meteoritos

    contadorMeteoritos++;

    if (
        contadorMeteoritos >
        tiempoMeteoritos
    ) {

        crearMeteorito();

        contadorMeteoritos = 0;
    }
}

function bucle(tiempo) {
    fotogramaJuego = null;
    if (!juegoActivo || document.hidden) return;

    const delta = ultimoFotograma === null
        ? DURACION_PASO_JUEGO
        : Math.min(tiempo - ultimoFotograma, 100);
    ultimoFotograma = tiempo;
    tiempoAcumulado += delta;

    let actualizarCanvas = false;
    while (tiempoAcumulado >= DURACION_PASO_JUEGO && juegoActivo) {
        actualizarJuego();
        tiempoAcumulado -= DURACION_PASO_JUEGO;
        actualizarCanvas = true;
    }

    if (actualizarCanvas) dibujar();
    if (juegoActivo) {
        fotogramaJuego = requestAnimationFrame(bucle);
    }
}

// ==========================================
// INICIAR
// ==========================================

if (juegoActivo) {
   fotogramaJuego = requestAnimationFrame(bucle);
}
