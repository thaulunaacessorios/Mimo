const params = new URLSearchParams(window.location.search);
const clientName = params.get("nome") || "Estrela";

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("display-name").textContent = clientName;

  setWhatsAppLink();
  initSplash();
  initPolaroid();
  initCursor();

  document.getElementById("btn-step1").onclick = () => show("step-2");
  document.getElementById("btn-step2").onclick = () => show("step-3");
  document.getElementById("gift-emoji").onclick = revealCupom;
});

/* SPLASH */
function initSplash() {
  const env = document.getElementById("open-envelope");
  const nameEl = document.getElementById("splash-name");

  typeWriter(clientName, nameEl);

  env.onclick = () => {
    env.classList.add("open");
    setTimeout(() => {
      document.getElementById("splash").style.display = "none";
    }, 900);
  };

  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
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

/* POLAROID */
function initPolaroid() {
  const foto = params.get("foto");
  const img = document.getElementById("client-photo");
  const box = document.getElementById("polaroid");

  if (foto) {
    img.src = foto;
  } else {
    box.style.display = "none";
  }
}

/* CURSOR */
function initCursor() {
  if (window.innerWidth < 768) return;

  const cursor = document.querySelector(".cursor-dot");
  let x=0,y=0,tx=0,ty=0;

  document.addEventListener("mousemove", e => {
    tx=e.clientX;
    ty=e.clientY;
  });

  function loop(){
    x += (tx-x)*0.2;
    y += (ty-y)*0.2;
    cursor.style.transform = `translate(${x}px,${y}px)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* FLOW */
function show(id) {
  document.querySelectorAll(".scene").forEach(s => s.style.display="none");
  document.getElementById(id).style.display="flex";
}

/* CUPOM */
function revealCupom() {
  document.getElementById("pre-reveal").style.display="none";
  document.getElementById("post-reveal").classList.remove("hidden");
}

/* COPY */
function copyCupom() {
  navigator.clipboard.writeText("MimoNiver");
}

/* WHATSAPP */
function setWhatsAppLink() {
  const btn = document.getElementById("btn-whatsapp");
  btn.href = `https://wa.me/5585987511775?text=Oi! Sou ${clientName} e quero usar meu cupom`;
}
