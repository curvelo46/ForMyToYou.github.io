const gameMusic = new Audio(new URL("../../musica.mp3", import.meta.url).href);
const parchmentMusic = new Audio(new URL("../../../assets/castletown.mp3", import.meta.url).href);
const bossExplosionSound = new Audio(new URL("../../../assets/deltarune-explosion.mp3", import.meta.url).href);
const enableMusicButton = document.getElementById("habilitarMusica");

gameMusic.loop = true;
gameMusic.volume = 0.5;
gameMusic.preload = "auto";
parchmentMusic.loop = true;
parchmentMusic.volume = 0.5;
parchmentMusic.preload = "auto";
bossExplosionSound.volume = 0.8;
bossExplosionSound.preload = "auto";

let gameMusicStarted = false;
let gameAudioPrepared = false;
let gameAudioPreparing = false;
let parchmentMusicAttempted = false;
let parchmentMusicPrepared = false;
let autoplayMusicAttempted = false;

function playGameMusic() {
    gameMusic.play()
        .then(() => {
            gameMusicStarted = true;
        })
        .catch(error => {
            console.error("[Space Dodge] No se pudo reproducir la música del juego.", error);
            if (enableMusicButton) enableMusicButton.hidden = false;
        });
}

function enableMusic() {
    gameMusic.muted = false;
    gameMusic.currentTime = 0;
    playGameMusic();
}

enableMusicButton?.addEventListener("click", () => {
    enableMusic();
    enableMusicButton.hidden = true;
}, { once: true });

export const gameAudio = {
    prepareSurvivalAudio() {
        if (gameAudioPrepared || gameAudioPreparing) return;

        gameAudioPreparing = true;
        gameMusic.muted = true;
        gameMusic.play()
            .then(() => {
                gameAudioPrepared = true;
            })
            .catch(error => {
                gameMusic.muted = false;
                console.error("[Space Dodge] No se pudo preparar la música para la fase de supervivencia.", error);
            })
            .finally(() => {
                gameAudioPreparing = false;
            });
    },

    startAutoplayMusic(enabled) {
        if (!enabled || autoplayMusicAttempted) return;
        autoplayMusicAttempted = true;

        if (!gameMusicStarted) playGameMusic();
    },

    startIntegratedGame() {
        gameMusic.currentTime = 0;
        gameMusic.volume = 0.5;
        gameMusic.muted = false;

        if (gameMusic.paused) {
            playGameMusic();
        } else {
            gameMusicStarted = true;
        }
    },

    prepareParchmentMusicFromGesture() {
        if (parchmentMusicAttempted) return;

        parchmentMusicAttempted = true;
        parchmentMusic.muted = true;
        parchmentMusic.play()
            .then(() => {
                if (!parchmentMusic.paused) parchmentMusicPrepared = true;
            })
            .catch(error => {
                parchmentMusic.muted = false;
                console.error("[Space Dodge] No se pudo preparar Castletown durante el juego.", error);
            });
    },

    showParchment() {
        if (parchmentMusicPrepared) {
            parchmentMusic.currentTime = 0;
            parchmentMusic.muted = false;
            return;
        }

        parchmentMusic.currentTime = 0;
        parchmentMusic.muted = false;
        parchmentMusic.play()
            .catch(error => {
                console.error("[Space Dodge] No se pudo reproducir Castletown.", error);
            });
    },

    pauseGameMusic() {
        gameMusic.pause();
    },

    resumeGameAfterRestart(enabled) {
        if (!enabled && !gameMusicStarted) return;

        gameMusic.currentTime = 0;
        playGameMusic();
    },

    playBossExplosion() {
        bossExplosionSound.currentTime = 0;
        bossExplosionSound.play()
            .catch(error => {
                console.error("[Space Dodge] No se pudo reproducir el sonido de explosión del jefe.", error);
            });
    }
};
