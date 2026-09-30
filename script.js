const phrases = [
    "Te amo",
    "Mi osito",
    "My love",
    "Eres mi lugar seguro",
    "Siempre tú",
    "Solo tú",
    "Me encantas",
    "Mi vida entera",
    "Eres mi todo",
    "Mi felicidad",
    "Mi amor",
    "Contigo siempre",

    // Frases adicionales
    "Eres precioso",
    "Mi paz",
    "Te quiero",
    "Eres especial",
    "Mi persona favorita",
    "Hasta el infinito",
    "Tú y yo",
    "Te elegiría otra vez",
    "Me encantas demasiado",
    "Siempre nosotros",
    "Mi hogar",
    "Mi felicidad eres tú",
    "Eres mi lugar seguro",
    "Solo contigo",
    "Mi amor bonito",
    "Eres mi calma",
    "Qué bonito tenerte",
    "Mi vida",
    "Te escogería siempre",
    "Eres mi mundo",
    "Mi razón de sonreír",
    "Ti amo",
    "My love",
    "Juntos siempre"
];


const frases = document.getElementById("frases");
const fotos = document.getElementById("fotos");
const inicio = document.getElementById("inicio");

const si = document.getElementById("si");
const no = document.getElementById("no");
const respuestaNo = document.getElementById("respuestaNo");

const estrellas = document.getElementById("estrellas");
const estrellasFugaces = document.getElementById("estrellasFugaces");

const universo = document.getElementById("universo");


// ======================================================
// ESTRELLAS CON PROFUNDIDAD
// ======================================================

// Estrellas lejanas
// Muchas, pequeñas y suaves.

for (let i = 0; i < 500; i++) {

    const estrella = document.createElement("span");

    estrella.className = "estrella";

    estrella.style.left =
        Math.random() * 100 + "%";

    estrella.style.top =
        Math.random() * 100 + "%";

    const size =
        Math.random() * 1.1 + 0.35;

    estrella.style.width =
        size + "px";

    estrella.style.height =
        size + "px";

    estrella.style.setProperty(
        "--blink",
        (3.5 + Math.random() * 5) + "s"
    );

    estrella.style.animationDelay =
        (Math.random() * 6) + "s";

    estrella.style.opacity =
        (0.25 + Math.random() * 0.35);

    estrellas.appendChild(estrella);
}


// Estrellas de profundidad media
// Un poco más visibles.

for (let i = 0; i < 100; i++) {

    const estrella = document.createElement("span");

    estrella.className = "estrella";

    estrella.style.left =
        Math.random() * 100 + "%";

    estrella.style.top =
        Math.random() * 100 + "%";

    const size =
        Math.random() * 1.5 + 0.7;

    estrella.style.width =
        size + "px";

    estrella.style.height =
        size + "px";

    estrella.style.setProperty(
        "--blink",
        (2.5 + Math.random() * 4) + "s"
    );

    estrella.style.animationDelay =
        (Math.random() * 5) + "s";

    estrella.style.opacity =
        (0.45 + Math.random() * 0.35);

    estrellas.appendChild(estrella);
}


// Estrellas cercanas
// Pocas, más grandes y brillantes.

for (let i = 0; i < 25; i++) {

    const estrella = document.createElement("span");

    estrella.className = "estrella";

    estrella.style.left =
        Math.random() * 100 + "%";

    estrella.style.top =
        Math.random() * 100 + "%";

    const size =
        Math.random() * 2.2 + 1.2;

    estrella.style.width =
        size + "px";

    estrella.style.height =
        size + "px";

    estrella.style.setProperty(
        "--blink",
        (2 + Math.random() * 3) + "s"
    );

    estrella.style.animationDelay =
        (Math.random() * 4) + "s";

    estrella.style.opacity =
        (0.65 + Math.random() * 0.35);

    estrella.style.boxShadow =
        "0 0 7px rgba(255,255,255,.65)";

    estrellas.appendChild(estrella);
}


// ======================================================
// COMETAS
// ======================================================

// Los cometas viajan visualmente:
// desde arriba/derecha hacia abajo/izquierda.

for (let i = 0; i < 8; i++) {

    const fugaz =
        document.createElement("span");

    fugaz.className =
        "estrella-fugaz";


    // Posición inicial

    const startX =
        Math.random() * 115 - 15;

    const startY =
        Math.random() * 25 - 20;

    fugaz.style.left =
        startX + "vw";

    fugaz.style.top =
        startY + "vh";


    // Posición final

    const endX =
        startX -
        (75 + Math.random() * 35);

    const endY =
        105 +
        Math.random() * 25;


    fugaz.style.setProperty(
        "--startX",
        "0px"
    );

    fugaz.style.setProperty(
        "--startY",
        "0px"
    );

    fugaz.style.setProperty(
        "--endX",
        (endX - startX) + "vw"
    );

    fugaz.style.setProperty(
        "--endY",
        (endY - startY) + "vh"
    );


    // Velocidad de los cometas

    fugaz.style.setProperty(
        "--cometDuration",
        (3.0 + Math.random() * 1.5) + "s"
    );


    // Separación

    fugaz.style.setProperty(
        "--cometDelay",
        (-Math.random() * 7) + "s"
    );


    estrellasFugaces.appendChild(fugaz);
}


// ======================================================
// TRAYECTORIAS DE LAS FRASES
// ======================================================

const trayectorias = [

    [-44, -30, "pequena", -3],
    [38, -42, "pequena", 2],

    [-55, -8, "mediana", -2],
    [52, -12, "pequena", 2],

    [-48, 18, "pequena", -1],
    [45, 24, "mediana", 2],

    [-35, 42, "mediana", -2],
    [35, 45, "pequena", 1],

    [-62, 8, "pequena", -2],
    [60, 4, "pequena", 2],

    [-25, -50, "pequena", -3],
    [25, -52, "mediana", 2],

    [-55, -35, "pequena", -2],
    [55, -32, "pequena", 2],

    [-65, 30, "pequena", -1],
    [62, 34, "mediana", 2],

    [-38, 58, "pequena", -2],
    [40, 58, "pequena", 1],

    [-72, -18, "pequena", -2],
    [72, -15, "pequena", 2],


    // NUEVAS TRAYECTORIAS

    [-18, -35, "pequena", -1],
    [20, -38, "pequena", 1],

    [-28, -12, "pequena", -2],
    [30, -8, "pequena", 2],

    [-20, 12, "mediana", -1],
    [22, 16, "pequena", 1],

    [-27, 28, "pequena", -2],
    [29, 30, "pequena", 2],

    [-15, 50, "pequena", -1],
    [18, 52, "pequena", 1],

    [-48, -48, "pequena", -3],
    [48, -46, "pequena", 3],

    [-58, 45, "pequena", -2],
    [55, 48, "pequena", 2],

    [-75, 5, "pequena", -2],
    [75, 10, "pequena", 2]
];


// ======================================================
// CREACIÓN DE FRASES
// ======================================================

// Cada trayectoria tendrá 3 frases diferentes.

const FRASES_POR_TRAYECTORIA = 3;


// ======================================================
// CREAR LAS FRASES
// ======================================================

trayectorias.forEach(
    (trayectoria, trayectoriaIndex) => {

        // Creamos 3 frases para cada trayectoria

        for (
            let variante = 0;
            variante < FRASES_POR_TRAYECTORIA;
            variante++
        ) {

            const frase =
                document.createElement("div");


            // Tamaño

            frase.className =
                "frase " + trayectoria[2];


            // ==========================================
            // FRASE
            // ==========================================

            const indiceFrase =
                (
                    trayectoriaIndex *
                    FRASES_POR_TRAYECTORIA
                    + variante
                ) % phrases.length;


            frase.textContent =
                phrases[indiceFrase];


            // ==========================================
            // PUNTO DE PARTIDA
            // ==========================================

            frase.style.setProperty(
                "--startX",
                "0px"
            );

            frase.style.setProperty(
                "--startY",
                "0px"
            );


            // ==========================================
            // MISMA TRAYECTORIA
            // ==========================================

            frase.style.setProperty(
                "--endX",
                trayectoria[0] + "vw"
            );

            frase.style.setProperty(
                "--endY",
                trayectoria[1] + "vh"
            );


            // ==========================================
            // ROTACIÓN
            // ==========================================

            frase.style.setProperty(
                "--rot",
                trayectoria[3] + "deg"
            );


            // ==========================================
            // VELOCIDAD
            // ==========================================

            const duracion =
                2.8 +
                Math.random() * 0.8;

            frase.style.setProperty(
                "--travelDuration",
                duracion + "s"
            );


            // ==========================================
            // APARICIÓN ESCALONADA
            // ==========================================

            const separacion =
                duracion / 2;

            const faseInicial =
                Math.random() * duracion;

            const delay =
                -(
                    faseInicial +
                    variante * separacion
                );


            frase.style.setProperty(
                "--travelDelay",
                delay + "s"
            );


            // ==========================================
            // AÑADIR
            // ==========================================

            frases.appendChild(frase);
        }

    }
);


// ======================================================
// FOTOS
// ======================================================

const fotosConfig = [

    ["sonrisa.jpg", -42, -28, 68, -5],
    ["ilustracion_pareja.jpg", 42, -34, 62, 4],

    ["luna_llena.jpg", -20, -52, 58, 0],
    ["luna_creciente.jpg", 48, -5, 55, -5],

    ["camiseta_negra.jpg", -50, 20, 62, 5],
    ["selfie_acostado.jpg", 38, 34, 64, -4],

    ["flores.jpg", -32, 48, 66, 4],
    ["ramo.jpg", 25, 52, 52, -5]
];


// ======================================================
// CREACIÓN DE FOTOS
// ======================================================

fotosConfig.forEach((item, i) => {

    const foto =
        document.createElement("img");


    foto.className =
        "foto " +
        (i === 2 || i === 3 ? "luna" : "");


    foto.src =
        "assets/" + item[0];





    // Punto de partida

    foto.style.setProperty(
        "--startX",
        "0px"
    );

    foto.style.setProperty(
        "--startY",
        "0px"
    );


    // Trayectoria

    foto.style.setProperty(
        "--endX",
        item[1] + "vw"
    );

    foto.style.setProperty(
        "--endY",
        item[2] + "vh"
    );


    // Tamaño

    foto.style.setProperty(
        "--size",
        item[3] + "px"
    );


    // Rotación

    foto.style.setProperty(
        "--rot",
        item[4] + "deg"
    );


    // Velocidad

    foto.style.setProperty(
        "--photoDuration",
        (4.0 + Math.random() * 0.8) + "s"
    );


    // Distribución

    foto.style.setProperty(
        "--photoDelay",
        (-Math.random() * 9) + "s"
    );


    fotos.appendChild(foto);
});


// ======================================================
// BOTONES DE INICIO
// ======================================================


// ======================================================
// BOTÓN SÍ
// ======================================================

si.addEventListener("click", () => {

    /* Después de 20 segundos, las frases empiezan a despedirse */
setTimeout(() => {
    universo.classList.add("cierre-frases");
}, 20000);

/* Seis segundos después comienza a nacer el universo */
setTimeout(() => {
    universo.classList.add("golden-final");
}, 26000);

setTimeout(() => {
    universo.classList.add("mensaje-final-visible");
}, 38000);

    // ==================================================
    // OCULTAR LA PANTALLA INICIAL
    // ==================================================

    inicio.style.opacity = "0";

    setTimeout(() => {

        inicio.style.display = "none";

    }, 700);
   
});



// ======================================================
// BOTÓN "NO" — HUYE DEL CURSOR
// ======================================================

let intentosNo = 0;

no.addEventListener("mouseenter", () => {

    // Contamos cada vez que el cursor logra tocar
    // el botón antes de que este escape.
    intentosNo++;

    // Después del segundo intento aparece el mensaje.
    if (intentosNo === 3) {

        respuestaNo.textContent =
            "¿Y vas a seguir? ¡Pilas! >:v";

        respuestaNo.classList.remove("visible");

        // Reinicia la animación para que vuelva a aparecer.
        void respuestaNo.offsetWidth;

        respuestaNo.classList.add("visible");
    }


    // ==================================================
    // NUEVA POSICIÓN DEL BOTÓN
    // ==================================================

    const margen = 30;

    const maxX =
        window.innerWidth - no.offsetWidth - margen;

    const maxY =
        window.innerHeight - no.offsetHeight - margen;

    const nuevaX =
        margen + Math.random() * (maxX - margen);

    const nuevaY =
        margen + Math.random() * (maxY - margen);


    // Lo hacemos independiente de los otros elementos.
    no.style.position = "fixed";

    no.style.left = nuevaX + "px";
    no.style.top = nuevaY + "px";
});

// ======================================================
// GALAXIA FINAL
// ======================================================

const galaxia = {

    estrellas: [],
    planetas: [],

    iniciada: false,

    progreso: 0

};


// ======================================================
// AJUSTAR CANVAS
// ======================================================

const galaxiaCanvas = document.createElement("canvas");

galaxiaCanvas.id = "galaxiaCanvas";

document.getElementById("universo").appendChild(galaxiaCanvas);

const galaxiaCtx = galaxiaCanvas.getContext("2d");

// ======================================================
// AJUSTAR CANVAS
// ======================================================

function ajustarGalaxia() {

    const dpr =
        window.devicePixelRatio || 1;

    galaxiaCanvas.width =
        window.innerWidth * dpr;

    galaxiaCanvas.height =
        window.innerHeight * dpr;

    galaxiaCanvas.style.width =
        window.innerWidth + "px";

    galaxiaCanvas.style.height =
        window.innerHeight + "px";

    galaxiaCtx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


ajustarGalaxia();


window.addEventListener(
    "resize",
    ajustarGalaxia
);


// ======================================================
// CREAR ESTRELLAS DE LA GALAXIA
// ======================================================

function crearEstrellasGalaxia() {

    galaxia.estrellas = [];

    const cantidad = 1800;
    const brazos = 5;

    const colores = [
        "#f5eefe",
        "#e7e1ff",
        "#dfe9ff",
        "#f4dfe9",
        "#dfe9f8",
        "#efe6d8"
    ];

    for (let i = 0; i < cantidad; i++) {

        const distancia =
            Math.pow(Math.random(), 1.7);

        galaxia.estrellas.push({

            brazo:
                Math.floor(Math.random() * brazos),

            distancia: distancia,

            dispersion:
                (Math.random() - .5) *
                (.25 + distancia * 1.25),

            tamaño:
                .22 +
                Math.random() * 1.05 +
                (1 - distancia) * .70,

            brillo:
                .35 +
                Math.random() * .65,

            velocidad:
                .000025 +
                (1 - distancia) * .000045,

            fase:
                Math.random() * Math.PI * 2,

            color:
                colores[
                    Math.floor(
                        Math.random() * colores.length
                    )
                ]
        });
    }
}


// ======================================================
// CREAR PLANETAS
// ======================================================

function crearPlanetasGalaxia() {

    galaxia.planetas = [

        {
            x: .16,
            y: .28,
            radio: 18,
            tono: 258,
            anillos: true,
            fase: 0,
            velocidad: .00011,
            amplitud: 4,
            sentido: -1
        },

        {
            x: .82,
            y: .67,
            radio: 25,
            tono: 210,
            anillos: false,
            fase: 1.8,
            velocidad: .00008,
            amplitud: 5,
            sentido: -1
        },

        {
            x: .72,
            y: .20,
            radio: 11,
            tono: 35,
            anillos: false,
            fase: 3.2,
            velocidad: .00014,
            amplitud: 3,
            sentido: -1
        },

        {
            x: .25,
            y: .76,
            radio: 9,
            tono: 330,
            anillos: true,
            fase: 4.7,
            velocidad: .00013,
            amplitud: 3,
            sentido: -1
        }
    ];
}


// ======================================================
// CREAR GALAXIA
// ======================================================

crearEstrellasGalaxia();

crearPlanetasGalaxia();


// ======================================================
// DIBUJAR NEBULOSA
// ======================================================

function dibujarNebulosa(
    centroX,
    centroY,
    radio,
    alpha
) {

    const gradiente =
        galaxiaCtx.createRadialGradient(
            centroX,
            centroY,
            0,
            centroX,
            centroY,
            radio
        );


    gradiente.addColorStop(
        0,
        `rgba(192,180,255,${alpha * 0.55})`
    );

    gradiente.addColorStop(
        .25,
        `rgba(167,157,255,${alpha * 0.38})`
    );

    gradiente.addColorStop(
        .6,
        `rgba(160,170,220,${alpha * 0.14})`
    );

    gradiente.addColorStop(
        1,
        "rgba(20,15,70,0)"
    );


    galaxiaCtx.fillStyle =
        gradiente;


    galaxiaCtx.beginPath();

    galaxiaCtx.arc(
        centroX,
        centroY,
        radio,
        0,
        Math.PI * 2
    );

    galaxiaCtx.fill();

}


// ======================================================
// NÚCLEO GALÁCTICO
// ======================================================

function dibujarNucleoGalaxia(tiempo) {
    const ancho = window.innerWidth;
    const alto = window.innerHeight;
    const centroX = ancho * 0.5;
    const centroY = alto * 0.48;
    const radio = Math.min(ancho, alto) * 0.22 + Math.sin(tiempo * 0.0005) * 8;

    const gradiente = galaxiaCtx.createRadialGradient(
        centroX,
        centroY,
        radio * 0.08,
        centroX,
        centroY,
        radio * 2.8
    );

    gradiente.addColorStop(0, "rgba(255, 244, 214, 0.78)");
    gradiente.addColorStop(0.18, "rgba(243, 211, 179, 0.45)");
    gradiente.addColorStop(0.42, "rgba(183, 164, 255, 0.22)");
    gradiente.addColorStop(1, "rgba(72, 52, 141, 0)");

    galaxiaCtx.fillStyle = gradiente;
    galaxiaCtx.beginPath();
    galaxiaCtx.arc(centroX, centroY, radio * 2.6, 0, Math.PI * 2);
    galaxiaCtx.fill();

    galaxiaCtx.save();
    galaxiaCtx.globalAlpha = 0.32;
    galaxiaCtx.strokeStyle = "rgba(236, 214, 255, 0.5)";
    galaxiaCtx.lineWidth = 1.5;
    galaxiaCtx.beginPath();
    galaxiaCtx.arc(centroX, centroY, radio * 1.35, 0, Math.PI * 2);
    galaxiaCtx.stroke();
    galaxiaCtx.restore();
}

// ======================================================
// DIBUJAR ESTRELLAS
// ======================================================

function dibujarEstrellas(tiempo) {

    const ancho = window.innerWidth;
    const alto = window.innerHeight;

    const centroX = ancho / 2;
    const centroY = alto / 2;

    const escala =
        Math.min(ancho, alto) * .49;

    const brazos = 4;

    galaxiaCtx.save();

    galaxiaCtx.globalCompositeOperation =
        "lighter";

    galaxia.estrellas.forEach(estrella => {

        const angulo =
            estrella.brazo *
            (Math.PI * 2 / brazos) +

            estrella.distancia * 8.2 +

            estrella.dispersion +

            tiempo * estrella.velocidad;

        const radio =
            estrella.distancia * escala;

        const x =
            centroX +
            Math.cos(angulo) * radio;

        const y =
            centroY +
            Math.sin(angulo) *
            radio * .52;

        const parpadeo =
            .72 +
            Math.sin(
                tiempo * .0014 +
                estrella.fase
            ) * .28;

        galaxiaCtx.globalAlpha =
            estrella.brillo *
            parpadeo;

        galaxiaCtx.fillStyle =
            estrella.color;

        if (estrella.tamaño > 1.25) {
            galaxiaCtx.shadowBlur = 8;
            galaxiaCtx.shadowColor =
                estrella.color;
        } else {
            galaxiaCtx.shadowBlur = 0;
        }

        galaxiaCtx.beginPath();

        galaxiaCtx.arc(
            x,
            y,
            estrella.tamaño,
            0,
            Math.PI * 2
        );

        galaxiaCtx.fill();
    });

    galaxiaCtx.restore();
}


// ======================================================
// ESTRELLAS GRANDES
// ======================================================

function dibujarEstrellasBrillantes(
    tiempo
) {

    const ancho =
        window.innerWidth;

    const alto =
        window.innerHeight;


    const estrellasGrandes = [

        [.12, .18, 2.2],
        [.31, .13, 1.8],
        [.55, .09, 2.4],
        [.88, .24, 2],
        [.91, .48, 1.7],
        [.12, .61, 2.3],
        [.38, .84, 2],
        [.67, .87, 2.5],
        [.84, .78, 1.8],
        [.51, .63, 2.2]

    ];


    estrellasGrandes.forEach(
        estrella => {

            const x =
                ancho * estrella[0];

            const y =
                alto * estrella[1];

            const brillo =
                .55 +
                Math.sin(
                    tiempo * .0015 +
                    x
                ) * .35;


            galaxiaCtx.globalAlpha =
                brillo;


            galaxiaCtx.fillStyle =
                "#ffffff";


            galaxiaCtx.shadowBlur =
                12;

            galaxiaCtx.shadowColor =
                "rgba(210,190,255,.8)";


            galaxiaCtx.beginPath();

            galaxiaCtx.arc(
                x,
                y,
                estrella[2],
                0,
                Math.PI * 2
            );

            galaxiaCtx.fill();


            galaxiaCtx.shadowBlur = 0;

        }
    );


    galaxiaCtx.globalAlpha = 1;

}


// ======================================================
// DIBUJAR PLANETAS
// ======================================================

function dibujarPlanetas() {

    const ancho =
        window.innerWidth;

    const alto =
        window.innerHeight;


    galaxia.planetas.forEach(
        planeta => {

           const tiempo = performance.now();

const movimientoX =
    Math.sin(
        tiempo * planeta.velocidad +
        planeta.fase
    ) * planeta.amplitud;

const movimientoY =
    Math.cos(
        tiempo * planeta.velocidad +
        planeta.fase
    ) * planeta.amplitud * .55;

const x =
    ancho * planeta.x +
    movimientoX;

const y =
    alto * planeta.y +
    movimientoY;


            /*
             * Halo
             */

            const halo =
                galaxiaCtx.createRadialGradient(
                    x,
                    y,
                    planeta.radio * .5,
                    x,
                    y,
                    planeta.radio * 2.4
                );


            halo.addColorStop(
                0,
                "rgba(255,255,255,.18)"
            );

            halo.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );


            galaxiaCtx.fillStyle =
                halo;


            galaxiaCtx.beginPath();

            galaxiaCtx.arc(
                x,
                y,
                planeta.radio * 2.4,
                0,
                Math.PI * 2
            );

            galaxiaCtx.fill();


            /*
             * Planeta
             */

            const planetaGradiente =
                galaxiaCtx.createRadialGradient(
                    x - planeta.radio * .35,
                    y - planeta.radio * .35,
                    planeta.radio * .1,
                    x,
                    y,
                    planeta.radio
                );


            planetaGradiente.addColorStop(
                0,
                "#ffffff"
            );

            planetaGradiente.addColorStop(
                .18,
                planeta.color
            );

            planetaGradiente.addColorStop(
                1,
                "rgba(25,20,60,.95)"
            );


            galaxiaCtx.fillStyle =
                planetaGradiente;


            galaxiaCtx.beginPath();

            galaxiaCtx.arc(
                x,
                y,
                planeta.radio,
                0,
                Math.PI * 2
            );

            galaxiaCtx.fill();


            /*
             * Anillos
             */

            if (planeta.anillos) {

                galaxiaCtx.save();

                galaxiaCtx.translate(
                    x,
                    y
                );

                galaxiaCtx.rotate(
                    -.25
                );


                galaxiaCtx.strokeStyle =
                    "rgba(220,205,255,.55)";

                galaxiaCtx.lineWidth =
                    2;


                galaxiaCtx.beginPath();

                galaxiaCtx.ellipse(
                    0,
                    0,
                    planeta.radio * 1.75,
                    planeta.radio * .55,
                    0,
                    0,
                    Math.PI * 2
                );

                galaxiaCtx.stroke();


                galaxiaCtx.restore();

            }

        }
    );

}


// ======================================================
// PLANETAS DE PUNTOS — reemplaza la versión anterior
// ======================================================

function dibujarPlanetas() {
    const tiempo = performance.now();
    const ancho = window.innerWidth;
    const alto = window.innerHeight;

    galaxiaCtx.save();
    galaxiaCtx.globalCompositeOperation = "screen";

    galaxia.planetas.forEach(planeta => {
        const sentido = planeta.sentido ?? -1;
        const movimientoX =
            Math.sin(tiempo * planeta.velocidad * sentido + planeta.fase) * planeta.amplitud;

        const movimientoY =
            Math.cos(tiempo * planeta.velocidad * sentido + planeta.fase) * planeta.amplitud * .55;

        const x = ancho * planeta.x + movimientoX;
        const y = alto * planeta.y + movimientoY;

        const halo = galaxiaCtx.createRadialGradient(
            x, y, planeta.radio * 0.15,
            x, y, planeta.radio * 1.8
        );

        halo.addColorStop(0, `hsla(${planeta.tono}, 72%, 78%, .22)`);
        halo.addColorStop(1, `hsla(${planeta.tono}, 70%, 58%, 0)`);

        galaxiaCtx.fillStyle = halo;
        galaxiaCtx.beginPath();
        galaxiaCtx.arc(x, y, planeta.radio * 1.8, 0, Math.PI * 2);
        galaxiaCtx.fill();

        const baseColor = `hsla(${planeta.tono}, 52%, 78%, 0.9)`;
        galaxiaCtx.fillStyle = baseColor;
        galaxiaCtx.beginPath();
        galaxiaCtx.arc(x, y, planeta.radio, 0, Math.PI * 2);
        galaxiaCtx.fill();

        galaxiaCtx.fillStyle = "rgba(255,255,255,0.28)";
        galaxiaCtx.beginPath();
        galaxiaCtx.arc(x - planeta.radio * 0.24, y - planeta.radio * 0.26, planeta.radio * 0.38, 0, Math.PI * 2);
        galaxiaCtx.fill();

        const orbitGlow = galaxiaCtx.createRadialGradient(
            x, y, planeta.radio * 0.2,
            x, y, planeta.radio * 2.2
        );

        orbitGlow.addColorStop(0, "rgba(255,255,255,0)");
        orbitGlow.addColorStop(0.6, `hsla(${planeta.tono}, 86%, 78%, 0.08)`);
        orbitGlow.addColorStop(1, "rgba(255,255,255,0)");

        galaxiaCtx.fillStyle = orbitGlow;
        galaxiaCtx.beginPath();
        galaxiaCtx.arc(x, y, planeta.radio * 2.2, 0, Math.PI * 2);
        galaxiaCtx.fill();

        if (planeta.anillos) {
            galaxiaCtx.save();
            galaxiaCtx.translate(x, y);
            galaxiaCtx.rotate(-0.38 * sentido);
            galaxiaCtx.strokeStyle = "rgba(236, 226, 255, 0.24)";
            galaxiaCtx.lineWidth = 1.1;
            galaxiaCtx.beginPath();
            galaxiaCtx.ellipse(0, 0, planeta.radio * 1.8, planeta.radio * 0.36, 0, 0, Math.PI * 2);
            galaxiaCtx.stroke();
            galaxiaCtx.restore();
        }
    });

    galaxiaCtx.restore();
}

// ======================================================
// PARTÍCULAS LUMINOSAS
// ======================================================

function dibujarParticulas(
    tiempo
) {

    const ancho =
        window.innerWidth;

    const alto =
        window.innerHeight;


    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const x =
            (
                Math.sin(
                    tiempo * .00012 +
                    i * 7.3
                ) * .5 +
                .5
            ) * ancho;


        const y =
            (
                Math.cos(
                    tiempo * .00009 +
                    i * 4.7
                ) * .5 +
                .5
            ) * alto;


        galaxiaCtx.globalAlpha =
            .09;


        galaxiaCtx.fillStyle =
            "#f0ebff";


        galaxiaCtx.beginPath();

        galaxiaCtx.arc(
            x,
            y,
            1.1,
            0,
            Math.PI * 2
        );

        galaxiaCtx.fill();

    }


    galaxiaCtx.globalAlpha = 1;

}


// ======================================================
// ANIMACIÓN DE LA GALAXIA
// ======================================================

function animarGalaxia(
    tiempo
) {

    const ancho =
        window.innerWidth;

    const alto =
        window.innerHeight;


    galaxiaCtx.clearRect(
        0,
        0,
        ancho,
        alto
    );


    /*
     * Nebulosa central.
     */

    dibujarNebulosa(
        ancho * .50,
        alto * .48,
        Math.min(ancho, alto) * .48,
        .24
    );


    dibujarNebulosa(
        ancho * .56,
        alto * .42,
        Math.min(ancho, alto) * .30,
        .12
    );

    dibujarNucleoGalaxia(tiempo);

    dibujarEstrellas(
        tiempo
    );


    dibujarEstrellasBrillantes(
        tiempo
    );


    dibujarParticulas(
        tiempo
    );


    dibujarPlanetas();


    requestAnimationFrame(
        animarGalaxia
    );

}


requestAnimationFrame(
    animarGalaxia
);
