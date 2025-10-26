const prizes = [
  { text: "100K tiền mặt", weight: 1 },
  { text: "50K tiền mặt", weight: 10 },
  { text: "20K tiền mặt", weight: 20 },
  { text: "10K tiền mặt", weight: 30 },
  { text: "Chúc may mắn lần sau!", weight: 39 }
];

let recipients = JSON.parse(sessionStorage.getItem("recipients")) || [];
renderList();

const wheelCanvas = document.getElementById("wheel");
const ctx = wheelCanvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");
let spinning = false;

function drawWheel() {
  const total = prizes.reduce((a, b) => a + b.weight, 0);
  let startAngle = 0;
  prizes.forEach((p, i) => {
    const slice = (p.weight / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, startAngle, startAngle + slice);
    ctx.fillStyle = i % 2 === 0 ? "#f44336" : "#ffcc80";
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(startAngle + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(p.text, 130, 5);
    ctx.restore();

    startAngle += slice;
  });
}
drawWheel();

spinBtn.onclick = () => {
  if (spinning) return;
  spinning = true;
  spinSound.play();

  let rand = Math.random() * 100;
  let acc = 0, prize;
  for (let p of prizes) {
    acc += p.weight;
    if (rand <= acc) {
      prize = p.text;
      break;
    }
  }

  const rotation = 3600 + Math.random() * 360;
  wheelCanvas.style.transform = `rotate(${rotation}deg)`;

  setTimeout(() => {
    winSound.play();
    alert(`🎉 Bạn nhận được: ${prize}!`);
    if (prize.includes("100K")) launchFireworks();
    spinning = false;
  }, 4200);
};

document.getElementById("addBtn").onclick = () => {
  const name = document.getElementById("nameInput").value.trim();
  const gift = document.getElementById("giftInput").value.trim();
  if (!name) return alert("Vui lòng nhập tên người nhận!");

  recipients.push({ name, gift });
  sessionStorage.setItem("recipients", JSON.stringify(recipients));
  renderList();

  document.getElementById("nameInput").value = "";
  document.getElementById("giftInput").value = "";
};

function renderList() {
  const list = document.getElementById("recipientList");
  list.innerHTML = "";
  recipients.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${r.name} ${r.gift ? "🎁 " + r.gift : ""}`;
    list.appendChild(li);
  });
}

document.getElementById("resetBtn").onclick = () => {
  if (confirm("Bạn có chắc muốn làm mới toàn bộ danh sách không?")) {
    sessionStorage.removeItem("recipients");
    recipients = [];
    renderList();
  }
};

function launchFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 5 + 2,
      radius: Math.random() * 3 + 2,
      alpha: 1
    });
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.01;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},${p.alpha})`;
      ctx.fill();
    });
    particles = particles.filter(p => p.alpha > 0);
    if (particles.length > 0) requestAnimationFrame(animate);
  }
  animate();
}
