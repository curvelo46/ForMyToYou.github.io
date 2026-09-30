// ======================================================
// galaxy.js — galaxia detallada e interactiva en canvas
// ======================================================

import { loadStylesheet } from "./load-stylesheet.js";
import { debounce } from "./utils.js";

export const stylesReady = loadStylesheet(new URL("../css/galaxy.css", import.meta.url));

const BACKGROUND_STAR_COUNT = 1600;
const GALAXY_STAR_COUNT = 3200;
const ASTEROID_COUNT = 400;
const NEBULA_COUNT = 18;
const COMET_COUNT = 6;
const ARMS_COUNT = 4;
const FRAME_DURATION = 1000 / 60;
const MIN_FRAME_INTERVAL = 1000 / 60;

export class Galaxy {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement("canvas");
        this.canvas.id = "galaxiaCanvas";
        this.canvas.setAttribute("aria-hidden", "true");
        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d", { alpha: false });
        if (!this.ctx) {
            throw new Error("[Galaxy] El navegador no pudo crear el contexto 2D del canvas.");
        }

        this.title = document.createElement("div");
        this.title.className = "galaxy-title";
        this.title.textContent = "Galaxy // Deep Space";
        this.title.setAttribute("aria-hidden", "true");
        container.appendChild(this.title);

        this.info = document.createElement("div");
        this.info.className = "galaxy-info";
        this.info.textContent = "Mueve el mouse para explorar";
        this.info.setAttribute("aria-hidden", "true");
        container.appendChild(this.info);

        this.time = 0;
        this.lastFrame = null;
        this.rafId = null;
        this.running = false;
        this.sceneInitialized = false;
        this.galaxyLayer = null;
        this.nebulaLayer = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        this.resize = this.resize.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.animate = this.animate.bind(this);

        this.resize();

        window.addEventListener("resize", debounce(this.resize, 150));
        window.addEventListener("pointermove", this.onPointerMove, { passive: true });
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.pause();
            } else if (this.isVisible()) {
                this.resume();
            }
        });

        this.observer = new MutationObserver(() => {
            if (this.isVisible()) {
                this.resume();
            } else {
                this.pause();
            }
        });
        this.observer.observe(container, {
            attributes: true,
            attributeFilter: ["class"]
        });

        if (this.isVisible()) this.resume();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.minDimension = Math.min(this.width, this.height);
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        this.canvas.width = Math.round(this.width * this.dpr);
        this.canvas.height = Math.round(this.height * this.dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        if (this.sceneInitialized) {
            this.createGalaxyLayer();
            this.createNebulaLayer();
        }
    }

    onPointerMove(event) {
        this.targetMouseX = (event.clientX - this.centerX) / this.width;
        this.targetMouseY = (event.clientY - this.centerY) / this.height;
    }

    isVisible() {
        return this.container.classList.contains("galaxy-visible")
            || this.container.classList.contains("galaxia-final");
    }

    createBackgroundStars() {
        this.stars = Array.from({ length: BACKGROUND_STAR_COUNT }, () => ({
            x: Math.random(),
            y: Math.random(),
            depth: Math.random(),
            size: Math.random() * 1.6 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.003
        }));
    }

    createGalaxyStars() {
        this.galaxyStars = Array.from({ length: GALAXY_STAR_COUNT }, () => {
            const radius = Math.pow(Math.random(), 0.58) * 0.48;
            const arm = Math.floor(Math.random() * ARMS_COUNT);
            const armAngle = arm * Math.PI * 2 / ARMS_COUNT;
            const spiral = radius * this.minDimension * 0.018;

            return {
                radius,
                angle: armAngle + spiral + (Math.random() - 0.5) * 0.65,
                size: Math.random() * 1.5 + 0.15,
                brightness: Math.random() * 0.9 + 0.1
            };
        });
    }

    createNebulae() {
        this.nebulae = Array.from({ length: NEBULA_COUNT }, () => ({
            angle: Math.random() * Math.PI * 2,
            radius: 180 + Math.random() * 350,
            size: 80 + Math.random() * 160,
            alpha: 0.015 + Math.random() * 0.035
        }));
    }

    createPlanets() {
        this.planets = [
            {
                orbit: 0.16, speed: 0.003, angle: 1, size: 6.5,
                glow: 18, color: "#39bfff", color2: "#0066ff", moon: true
            },
            {
                orbit: 0.29, speed: 0.00125, angle: 3.5, size: 8.9,
                glow: 25, color: "#ffd34d", color2: "#ff7300", moon: false
            },
              {
                orbit: 0.42, speed: 0.00143, angle: 5, size: 10,
                glow: 21, color: "#ef00df", color2: "#00ff37", moon: true
            },
            {
                orbit: 0.42, speed: 0.00143, angle: 5, size: 10,
                glow: 21, color: "#ff4d63", color2: "#ff1600", moon: true
            }
        ];
    }

    createAsteroids() {
        this.asteroids = Array.from({ length: ASTEROID_COUNT }, () => ({
            angle: Math.random() * Math.PI * 2,
            orbit: 0.3 + Math.random() * 0.12,
            size: Math.random() * 2 + 0.3,
            speed: 0.00008 + Math.random() * 0.00018
        }));
    }

    createComets() {
        this.comets = Array.from({ length: COMET_COUNT }, () => ({
            angle: Math.random() * Math.PI * 2,
            orbit: 0.45 + Math.random() * 0.3,
            speed: 0.001 + Math.random() * 0.002,
            size: Math.random() * 2 + 1
        }));
    }

    pause() {
        this.running = false;
        this.lastFrame = null;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    resume() {
        if (this.running || document.hidden) return;
        this.initializeScene();
        this.running = true;
        this.rafId = requestAnimationFrame(this.animate);
    }

    initializeScene() {
        if (this.sceneInitialized) return;

        this.createBackgroundStars();
        this.createGalaxyStars();
        this.createNebulae();
        this.createPlanets();
        this.createAsteroids();
        this.createComets();
        this.createGalaxyLayer();
        this.createNebulaLayer();
        this.sceneInitialized = true;
    }

    createGalaxyLayer() {
        const dimension = Math.max(1, Math.ceil(this.minDimension));
        const layer = document.createElement("canvas");
        layer.width = Math.ceil(dimension * this.dpr);
        layer.height = Math.ceil(dimension * this.dpr);

        const ctx = layer.getContext("2d");
        if (!ctx) {
            throw new Error("[Galaxy] No se pudo crear la capa optimizada de estrellas.");
        }

        ctx.scale(this.dpr, this.dpr);
        ctx.translate(dimension / 2, dimension / 2);

        const haloRadius = dimension * 0.5;
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, haloRadius);
        halo.addColorStop(0, "rgba(100,90,255,.22)");
        halo.addColorStop(0.3, "rgba(60,80,220,.08)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        for (const star of this.galaxyStars) {
            const radius = star.radius * dimension;
            const x = Math.cos(star.angle) * radius;
            const y = Math.sin(star.angle) * radius * 0.45;
            const alpha = star.brightness * (1 - radius / (dimension * 0.65));

            ctx.fillStyle = `rgba(160,190,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
        }

        this.galaxyLayer = layer;
    }

    createNebulaLayer() {
        const layer = document.createElement("canvas");
        layer.width = Math.ceil(this.width * this.dpr);
        layer.height = Math.ceil(this.height * this.dpr);

        const ctx = layer.getContext("2d");
        if (!ctx) {
            throw new Error("[Galaxy] No se pudo crear la capa optimizada de nebulosas.");
        }

        ctx.scale(this.dpr, this.dpr);
        ctx.translate(this.centerX, this.centerY);

        for (const nebula of this.nebulae) {
            const x = Math.cos(nebula.angle) * nebula.radius;
            const y = Math.sin(nebula.angle) * nebula.radius * 0.55;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, nebula.size);
            gradient.addColorStop(0, `rgba(100,80,255,${nebula.alpha})`);
            gradient.addColorStop(0.5, `rgba(220,40,180,${nebula.alpha * 0.4})`);
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, nebula.size, 0, Math.PI * 2);
            ctx.fill();
        }

        this.nebulaLayer = layer;
    }

    drawBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.centerX,
            this.centerY,
            0,
            this.centerX,
            this.centerY,
            Math.max(this.width, this.height)
        );
        gradient.addColorStop(0, "#090d2a");
        gradient.addColorStop(0.35, "#030518");
        gradient.addColorStop(1, "#000000");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawBackgroundStars() {
        const { ctx } = this;
        for (const star of this.stars) {
            const parallax = star.depth * 25;
            const x = star.x * this.width + this.mouseX * parallax;
            const y = star.y * this.height + this.mouseY * parallax;
            const twinkle = 0.5 + Math.sin(this.time * star.speed + star.twinkle) * 0.5;

            ctx.fillStyle = `rgba(190,220,255,${twinkle * star.depth})`;
            ctx.beginPath();
            ctx.arc(x, y, star.size * star.depth, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawNebulae() {
        this.ctx.drawImage(
            this.nebulaLayer,
            this.mouseX * 25,
            this.mouseY * 25,
            this.width,
            this.height
        );
    }

    drawGalaxyArms() {
        const { ctx } = this;
        ctx.save();
        ctx.translate(
            this.centerX + this.mouseX * 40,
            this.centerY + this.mouseY * 40
        );
        ctx.rotate(this.time * 0.000095);
        ctx.drawImage(
            this.galaxyLayer,
            -this.minDimension / 2,
            -this.minDimension / 2,
            this.minDimension,
            this.minDimension
        );

        ctx.restore();
    }

    drawCore() {
        const radius = this.minDimension * 0.13;
        const core = this.ctx.createRadialGradient(
            this.centerX,
            this.centerY,
            0,
            this.centerX,
            this.centerY,
            radius
        );
        core.addColorStop(0, "rgba(255,255,255,1)");
        core.addColorStop(0.12, "rgba(255,244,200,.95)");
        core.addColorStop(0.35, "rgba(255,180,90,.55)");
        core.addColorStop(0.65, "rgba(160,80,255,.12)");
        core.addColorStop(1, "rgba(0,0,0,0)");
        this.ctx.fillStyle = core;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawOrbits() {
        const { ctx } = this;
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.strokeStyle = "rgba(120,160,255,.13)";
        ctx.lineWidth = 1;

        for (const planet of this.planets) {
            const orbit = this.minDimension * planet.orbit;
            ctx.beginPath();
            ctx.ellipse(0, 0, orbit, orbit * 0.45, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawAsteroids(frameScale) {
        const { ctx } = this;
        ctx.save();
        ctx.translate(this.centerX, this.centerY);

        for (const asteroid of this.asteroids) {
            asteroid.angle += asteroid.speed * frameScale;
            const orbit = this.minDimension * asteroid.orbit;
            const x = Math.cos(asteroid.angle) * orbit;
            const y = Math.sin(asteroid.angle) * orbit * 0.45;

            ctx.fillStyle = "rgba(150,150,170,.55)";
            ctx.beginPath();
            ctx.arc(x, y, asteroid.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawPlanet(planet, frameScale) {
        const orbit = this.minDimension * planet.orbit;
        const x = this.centerX + Math.cos(planet.angle) * orbit;
        const y = this.centerY + Math.sin(planet.angle) * orbit * 0.45;
        const pulse = 1 + Math.sin(this.time * 0.045 + planet.angle) * 0.12;
        const glowSize = planet.glow * pulse;
        const glow = this.ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        glow.addColorStop(0, this.hexToRGBA(planet.color, 0.85));
        glow.addColorStop(0.15, this.hexToRGBA(planet.color, 0.45));
        glow.addColorStop(0.45, this.hexToRGBA(planet.color2, 0.12));
        glow.addColorStop(1, "rgba(0,0,0,0)");
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        this.ctx.fill();

        const innerGlow = this.ctx.createRadialGradient(
            x, y, 0, x, y, planet.glow * 0.45
        );
        innerGlow.addColorStop(0, "rgba(255,255,255,1)");
        innerGlow.addColorStop(0.18, this.hexToRGBA(planet.color, 0.95));
        innerGlow.addColorStop(1, "rgba(0,0,0,0)");
        this.ctx.fillStyle = innerGlow;
        this.ctx.beginPath();
        this.ctx.arc(x, y, planet.glow * 0.45, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowColor = planet.color;
        this.ctx.shadowBlur = 25;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.beginPath();
        this.ctx.arc(x, y, planet.size * pulse, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        if (planet.moon) {
            const moonAngle = this.time * 0.002 + planet.angle;
            const moonX = x + Math.cos(moonAngle) * 14;
            const moonY = y + Math.sin(moonAngle) * 7;
            this.ctx.fillStyle = "rgba(210,220,240,.8)";
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, 1.7, 0, Math.PI * 2);
            this.ctx.fill();
        }

        planet.angle += planet.speed * frameScale;
    }

    hexToRGBA(hex, alpha) {
        const red = Number.parseInt(hex.slice(1, 3), 16);
        const green = Number.parseInt(hex.slice(3, 5), 16);
        const blue = Number.parseInt(hex.slice(5, 7), 16);
        return `rgba(${red},${green},${blue},${alpha})`;
    }

    drawComets(frameScale) {
        const { ctx } = this;
        for (const comet of this.comets) {
            comet.angle += comet.speed * frameScale;
            const orbit = this.minDimension * comet.orbit;
            const x = this.centerX + Math.cos(comet.angle) * orbit;
            const y = this.centerY + Math.sin(comet.angle) * orbit * 0.5;
            const tail = 70;
            const dx = Math.cos(comet.angle) * tail;
            const dy = Math.sin(comet.angle) * tail * 0.5;
            const gradient = ctx.createLinearGradient(x, y, x - dx, y - dy);
            gradient.addColorStop(0, "rgba(180,230,255,.9)");
            gradient.addColorStop(1, "rgba(100,150,255,0)");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = comet.size;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - dx, y - dy);
            ctx.stroke();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x, y, comet.size * 1.8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    animate(timestamp) {
        if (!this.running) return;

        if (
            this.lastFrame !== null
            && timestamp - this.lastFrame < MIN_FRAME_INTERVAL
        ) {
            this.rafId = requestAnimationFrame(this.animate);
            return;
        }

        const frameScale = this.lastFrame === null
            ? 1
            : Math.min((timestamp - this.lastFrame) / FRAME_DURATION, 3);
        this.lastFrame = timestamp;
        this.time += frameScale;

        const easing = 1 - Math.pow(1 - 0.035, frameScale);
        this.mouseX += (this.targetMouseX - this.mouseX) * easing;
        this.mouseY += (this.targetMouseY - this.mouseY) * easing;

        this.drawBackground();
        this.drawBackgroundStars();
        this.drawNebulae();
        this.drawGalaxyArms();
        this.drawOrbits();
        this.drawAsteroids(frameScale);
        this.drawComets(frameScale);
        this.drawCore();
        for (const planet of this.planets) {
            this.drawPlanet(planet, frameScale);
        }

        this.rafId = requestAnimationFrame(this.animate);
    }
}
