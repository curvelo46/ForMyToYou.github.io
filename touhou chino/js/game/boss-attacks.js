export function createBossAttacks(boss, player, addBullet, addRay) {
    function createBullet(x, y, angle, speed, radius = 6) {
        addBullet({
            x,
            y,
            velocidadX: Math.cos(angle) * speed,
            velocidadY: Math.sin(angle) * speed,
            radio: radius
        });
    }

    function spiral() {
        const count = 12;

        for (let index = 0; index < count; index++) {
            const angle = boss.angulo + (Math.PI * 2 / count) * index;
            createBullet(boss.x, boss.y, angle, 2.5);
        }

        boss.angulo += 0.30;
    }

    function fan() {
        const count = 9;
        const direction = Math.PI / 2;
        const spread = Math.PI / 2.5;

        for (let index = 0; index < count; index++) {
            const progress = index / (count - 1);
            const angle = direction - spread / 2 + spread * progress;
            createBullet(boss.x, boss.y, angle, 3);
        }
    }

    function reverseSpiral() {
        const count = 14;

        for (let index = 0; index < count; index++) {
            const angle = -boss.angulo + (Math.PI * 2 / count) * index;
            createBullet(boss.x, boss.y, angle, 3, 5);
        }

        boss.angulo += 0.22;
    }

    function doubleFan() {
        const count = 7;

        for (let index = 0; index < count; index++) {
            const angle = Math.PI / 2 - 0.9 + (1.8 / (count - 1)) * index;
            createBullet(boss.x, boss.y, angle, 3.5, 5);
        }

        for (let index = 0; index < count; index++) {
            const angle = Math.PI / 2 + 0.9 - (1.8 / (count - 1)) * index;
            createBullet(boss.x, boss.y, angle, 3.5, 5);
        }
    }

    function beam() {
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x);

        addRay({
            x: boss.x,
            y: boss.y,
            angulo: angle,
            longitud: 900,
            grosor: 10,
            duracion: 65,
            aviso: 45
        });
    }

    return {
        spiral,
        fan,
        reverseSpiral,
        doubleFan,
        beam
    };
}
