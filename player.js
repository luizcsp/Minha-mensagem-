document.addEventListener("DOMContentLoaded", function () {
    startplayer();
    initializeFireworks();
}, false);

let player;

function startplayer() {
    player = document.getElementById("music_player");
    player.controls = false;
}

function play_aud() {
    player.play();
}

function pause_aud() {
    player.pause();
}

function stop_aud() {
    player.pause();
    player.currentTime = 0;
}

function replay_aud() {
    player.currentTime = 0;
    player.play();
}

function change_vol() {
    player.volume = document.getElementById("change_vol").value;
}

// Inicializa os fogos de artifício
function initializeFireworks() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    let particles = [];

    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 3;
            this.exploded = false;
        }

        update() {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            this.x += Math.cos(angle) * this.speed;
            this.y += Math.sin(angle) * this.speed;

            if (distance < 5 && !this.exploded) {
                this.exploded = true;
                for (let i = 0; i < 50; i++) {
                    particles.push(new Particle(this.targetX, this.targetY));
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.closePath();
        }
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.speed = Math.random() * 3 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.alpha = 1;
            this.decay = Math.random() * 0.03 + 0.01;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1;
        }
    }

    function animate() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks = fireworks.filter((fw) => !fw.exploded);
        fireworks.forEach((fw) => {
            fw.update();
            fw.draw();
        });

        particles = particles.filter((p) => p.alpha > 0);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * canvas.height * 0.5;
        fireworks.push(new Firework(x, y, targetX, targetY));
    }, 800);

    animate();

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

