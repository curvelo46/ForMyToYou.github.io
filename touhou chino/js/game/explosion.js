const EXPLOSION_DURATION = 54;
const EXPLOSION_COLORS = ["#fff7bf", "#ffdc4a", "#ff8c32", "#f04b28"];

export function createExplosionEffect(context, playSound, onComplete) {
    let explosion = null;

    return {
        get active() {
            return explosion !== null;
        },

        start(x, y) {
            explosion = {
                x,
                y,
                frame: 0,
                particles: Array.from({ length: 42 }, () => {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 1.5 + Math.random() * 5;

                    return {
                        x,
                        y,
                        velocityX: Math.cos(angle) * speed,
                        velocityY: Math.sin(angle) * speed,
                        size: 2 + Math.random() * 5,
                        color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)]
                    };
                })
            };

            playSound();
        },

        update() {
            if (!explosion) return;

            explosion.frame++;
            for (const particle of explosion.particles) {
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
                particle.velocityX *= 0.97;
                particle.velocityY *= 0.97;
            }

            if (explosion.frame >= EXPLOSION_DURATION) {
                explosion = null;
                onComplete();
            }
        },

        draw() {
            if (!explosion) return;

            const progress = explosion.frame / EXPLOSION_DURATION;
            const radius = 18 + progress * 115;

            context.save();
            context.globalCompositeOperation = "lighter";

            for (let ring = 0; ring < 2; ring++) {
                context.beginPath();
                context.arc(
                    explosion.x,
                    explosion.y,
                    radius * (ring === 0 ? 1 : 0.62),
                    0,
                    Math.PI * 2
                );
                context.strokeStyle = ring === 0 ? "#ffad42" : "#fff2a8";
                context.lineWidth = Math.max(1, 8 * (1 - progress));
                context.globalAlpha = (1 - progress) * (ring === 0 ? 0.9 : 0.75);
                context.stroke();
            }

            const flashRadius = Math.max(0, 42 * (1 - progress * 1.4));
            if (flashRadius > 0) {
                const flash = context.createRadialGradient(
                    explosion.x,
                    explosion.y,
                    0,
                    explosion.x,
                    explosion.y,
                    flashRadius
                );
                flash.addColorStop(0, "rgba(255, 255, 225, 0.95)");
                flash.addColorStop(0.35, "rgba(255, 181, 54, 0.8)");
                flash.addColorStop(1, "rgba(255, 66, 24, 0)");
                context.globalAlpha = 1;
                context.fillStyle = flash;
                context.beginPath();
                context.arc(explosion.x, explosion.y, flashRadius, 0, Math.PI * 2);
                context.fill();
            }

            for (const particle of explosion.particles) {
                context.globalAlpha = 1 - progress;
                context.fillStyle = particle.color;
                context.beginPath();
                context.arc(
                    particle.x,
                    particle.y,
                    particle.size * (1 - progress * 0.45),
                    0,
                    Math.PI * 2
                );
                context.fill();
            }

            context.restore();
        },

        reset() {
            explosion = null;
        }
    };
}
