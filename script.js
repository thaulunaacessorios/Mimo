/* ============================================================
THAU LUNA ACESSÓRIOS — script.js
============================================================ */

/* ── Nome via URL ───────────────────────────────────────────── */

function getNameFromURL() {
const raw = new URLSearchParams(window.location.search).get('nome') || '';
return raw.trim() || 'Estrela';
}

const clientName = getNameFromURL();

/* ── Variáveis de confete (declaradas aqui, iniciadas no DOM) ── */

let canvas, ctx, pieces = [], raf = null;

const COLORS = ['#E8789A', '#C9526F', '#C9933A', '#F5C96A', '#FFFFFF', '#D4A0B5'];

/* ── Init ───────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

/* Nome */
document.getElementById('display-name').textContent = clientName;

/* WhatsApp */
setWhatsAppLink();

/* Confete */
initConfetti();

/* Botões */
document.getElementById('btn-step1').addEventListener('click', goStep2);
document.getElementById('btn-step2').addEventListener('click', goStep3);
document.getElementById('gift-emoji').addEventListener('click', revealCupom);

initSplash();
initPolaroid();
initCursor();
});

/* ── Transições de passo ────────────────────────────────────── */

function showScene(id) {
document.querySelectorAll('.scene').forEach(s => {
s.classList.remove('active');
s.style.display = 'none';
});
const el = document.getElementById(id);
el.style.display = 'flex';
void el.offsetWidth;
el.classList.add('active');
}

function goStep2() {
const btn = document.getElementById('btn-step1');
btn.textContent = 'Um momento…';
btn.disabled    = true;
setTimeout(() => showScene('step-2'), 360);
}

function goStep3() {
const btn = document.getElementById('btn-step2');
btn.textContent = 'Abrindo…';
btn.disabled    = true;
setTimeout(() => showScene('step-3'), 360);
}

/* ── Revelar cupom ──────────────────────────────────────────── */

let revealed = false;

function revealCupom() {
if (revealed) return;
revealed = true;

const gift = document.getElementById('gift-emoji');
gift.classList.add('exploded');
gift.style.cursor = 'default';

setTimeout(() => {
gift.textContent       = '🎉';
gift.style.animation   = 'floatGift 3s ease-in-out infinite';
}, 500);

launchConfetti();

setTimeout(() => {
document.getElementById('pre-reveal').classList.add('hidden');
document.getElementById('post-reveal').classList.remove('hidden');
}, 520);
}

/* ── Copiar cupom ───────────────────────────────────────────── */

function copyCupom() {
const code     = 'MimoNiver';
const btn      = document.getElementById('btn-copy');
const feedback = document.getElementById('copy-feedback');

navigator.clipboard.writeText(code)
.then(() => flashCopied(btn, feedback))
.catch(() => {
const ta = document.createElement('textarea');
ta.value     = code;
ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
document.body.appendChild(ta);
ta.select();
try { document.execCommand('copy'); flashCopied(btn, feedback); } catch (_) {}
document.body.removeChild(ta);
});
}

function flashCopied(btn, feedback) {
btn.textContent = 'Copiado';
feedback.classList.add('show');
setTimeout(() => {
btn.textContent = 'Copiar';
feedback.classList.remove('show');
}, 2500);
}

/* ── WhatsApp ───────────────────────────────────────────────── */

function setWhatsAppLink() {
const btn   = document.getElementById('btn-whatsapp');
if (!btn) return;
const phone = '5585987511775'; /* ← substitua pelo número real */
const text  = `Oi! Sou ${clientName}.\nPeguei meu cupom de aniversário: MimoNiver\nQuero usar agora!`;
btn.href    = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/* ============================================================
CONFETTI — sem bibliotecas externas
============================================================ */

function initConfetti() {
canvas = document.getElementById('confetti-canvas');
ctx    = canvas.getContext('2d');
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
}

function newPiece() {
return {
x:     Math.random() * canvas.width,
y:     -16,
w:     Math.random() * 7 + 4,
h:     Math.random() * 4 + 3,
color: COLORS[Math.floor(Math.random() * COLORS.length)],
vx:    (Math.random() - 0.5) * 3,
vy:    Math.random() * 3 + 2,
angle: Math.random() * 360,
spin:  (Math.random() - 0.5) * 7,
life:  1,
};
}

function tick() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

pieces = pieces.filter(p => p.life > 0.02 && p.y < canvas.height + 30);

pieces.forEach(p => {
p.x     += p.vx;
p.y     += p.vy;
p.angle += p.spin;
p.vx    += (Math.random() - 0.5) * 0.15;
if (p.y > canvas.height * 0.7) p.life -= 0.025;

ctx.save();
ctx.globalAlpha = p.life;
ctx.fillStyle   = p.color;
ctx.translate(p.x, p.y);
ctx.rotate(p.angle * Math.PI / 180);
ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
ctx.restore();

});

if (pieces.length > 0) {
raf = requestAnimationFrame(tick);
} else {
ctx.clearRect(0, 0, canvas.width, canvas.height);
}
}

function launchConfetti() {
if (raf) cancelAnimationFrame(raf);
pieces = [];

[{ d: 0, n: 80 }, { d: 110, n: 50 }, { d: 260, n: 35 }].forEach(w => {
setTimeout(() => {
for (let i = 0; i < w.n; i++) pieces.push(newPiece());
}, w.d);
});

raf = requestAnimationFrame(tick);
setTimeout(() => pieces.forEach(p => { p.life = 0; }), 4800);
}

/* ===== NOVAS FEATURES ===== */

/* Splash */
function initSplash() {
const splash = document.getElementById("splash");
const env = document.getElementById("open-envelope");
const nameEl = document.getElementById("splash-name");

if (!splash || !env || !nameEl) return;

typeWriter(clientName, nameEl);

env.onclick = () => {
env.classList.add("open");

setTimeout(() => {  
  splash.style.display = "none";  
}, 900);

};

setTimeout(() => {
splash.style.display = "none";
}, 3000);
}

function typeWriter(text, el) {
let i = 0;
function t() {
if (i < text.length) {
el.textContent += text[i++];
setTimeout(t, 70);
}
}
t();
}

/* Polaroid */
function initPolaroid() {
const foto = new URLSearchParams(window.location.search).get("foto");

if (foto) {
  img.src = "images/" + foto;
} else {
  img.src = "images/thau.jpg";
  }
const img = document.getElementById("client-photo");
const box = document.getElementById("polaroid");

if (!img || !box) return;

if (foto) {
img.src = foto;
} else {
box.style.display = "none";
}
}

/* Cursor */
function initCursor() {
if (window.innerWidth < 768) return;

const cursor = document.querySelector(".cursor-dot");
if (!cursor) return;

let x = 0, y = 0, tx = 0, ty = 0;

document.addEventListener("mousemove", e => {
tx = e.clientX;
ty = e.clientY;
});

function loop() {
x += (tx - x) * 0.2;
y += (ty - y) * 0.2;
cursor.style.transform = `translate(${x}px, ${y}px)`;
requestAnimationFrame(loop);
}

loop();
}
