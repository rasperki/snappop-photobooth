// --- 1. Background Animation & Theme Engine ---
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');

let doodles = [];
const TOTAL_DOODLES = 35;

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();

class DoodleItem {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    this.size = Math.random() * 12 + 10;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.01;
    this.type = Math.floor(Math.random() * 4);
  }
  update() {
    this.y += this.speedY;
    this.rotation += this.rotSpeed;
    if (this.y < -30) {
      this.y = bgCanvas.height + 30;
      this.x = Math.random() * bgCanvas.width;
    }
  }
  draw() {
    bgCtx.save();
    bgCtx.translate(this.x, this.y);
    bgCtx.rotate(this.rotation);
    const doodleColor = getComputedStyle(document.body).getPropertyValue('--doodle-color').trim();
    bgCtx.strokeStyle = doodleColor;
    bgCtx.fillStyle = doodleColor;
    bgCtx.lineWidth = 2;
    bgCtx.lineCap = 'round';

    if (this.type === 0) {
      bgCtx.beginPath();
      bgCtx.moveTo(0, -this.size);
      bgCtx.quadraticCurveTo(0, 0, this.size, 0);
      bgCtx.quadraticCurveTo(0, 0, 0, this.size);
      bgCtx.quadraticCurveTo(0, 0, -this.size, 0);
      bgCtx.quadraticCurveTo(0, 0, 0, -this.size);
      bgCtx.stroke();
    } else if (this.type === 1) {
      const s = this.size * 0.6;
      bgCtx.beginPath();
      bgCtx.moveTo(0, -s); bgCtx.lineTo(0, s);
      bgCtx.moveTo(-s, 0); bgCtx.lineTo(s, 0);
      bgCtx.stroke();
    } else if (this.type === 2) {
      bgCtx.beginPath();
      bgCtx.arc(0, 0, this.size * 0.6, 0.5 * Math.PI, 1.5 * Math.PI, true);
      bgCtx.quadraticCurveTo(this.size * 0.3, 0, 0, -this.size * 0.6);
      bgCtx.stroke();
    } else {
      bgCtx.beginPath();
      bgCtx.arc(0, 0, 3, 0, Math.PI * 2);
      bgCtx.fill();
    }
    bgCtx.restore();
  }
}

for (let i = 0; i < TOTAL_DOODLES; i++) doodles.push(new DoodleItem());

function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  doodles.forEach(d => { d.update(); d.draw(); });
  requestAnimationFrame(animateBg);
}
animateBg();

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeIcon.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  renderStrip();
});

// --- 2. Main Studio Logic & Padding Optimization ---
const video = document.getElementById('webcam');
const canvas = document.getElementById('strip-canvas');
const ctx = canvas.getContext('2d');
const btnSnap = document.getElementById('btn-snap');
const snapBtnText = document.getElementById('snap-btn-text');
const btnRetake = document.getElementById('btn-retake');
const btnDownload = document.getElementById('btn-download');
const btnGif = document.getElementById('btn-gif');
const actionButtons = document.getElementById('action-buttons');
const countdownEl = document.getElementById('countdown-layer');
const flashEl = document.getElementById('flash');

const retakeModal = document.getElementById('retake-modal');
const btnConfirmRetake = document.getElementById('btn-confirm-retake');
const btnCancelRetake = document.getElementById('btn-cancel-retake');

let capturedPhotos = [];
let photoBoxes = [];
let selectedPhotoIndex = -1;
let activeFilter = 'none';
let activeBgColor = '#ffffff';
let activeLayout = 'vertical';
let totalPoses = 4;
let stampsOnCanvas = [];
let draggedStampIndex = -1;

async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' },
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    alert("Camera permission is required to run the photobooth studio.");
  }
}

document.querySelectorAll('.pose-pills .pose-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.pose-pills .pose-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    totalPoses = parseInt(e.target.dataset.poses);
    snapBtnText.innerText = `✨ Take Photos (${totalPoses}x)`;
  });
});

btnSnap.addEventListener('click', async () => {
  capturedPhotos = [];
  btnSnap.disabled = true;

  for (let i = 0; i < totalPoses; i++) {
    await runCountdown(3);
    triggerFlash();
    const frameCanvas = captureFrame();
    capturedPhotos.push(frameCanvas);
  }

  btnSnap.disabled = false;
  renderStrip();
});

function runCountdown(seconds) {
  return new Promise((resolve) => {
    let current = seconds;
    countdownEl.classList.remove('hidden');
    countdownEl.innerText = current;

    const timer = setInterval(() => {
      current--;
      if (current > 0) {
        countdownEl.innerText = current;
      } else {
        clearInterval(timer);
        countdownEl.classList.add('hidden');
        resolve();
      }
    }, 1000);
  });
}

function triggerFlash() {
  flashEl.classList.add('active');
  setTimeout(() => flashEl.classList.remove('active'), 150);
}

function captureFrame() {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 800;
  tempCanvas.height = 600;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.filter = activeFilter;
  tempCtx.translate(tempCanvas.width, 0);
  tempCtx.scale(-1, 1);
  tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
  return tempCanvas;
}

// Render Engine Photo Strip (Nilai Padding & Spasi Ditambah)
function renderStrip() {
  if (capturedPhotos.length === 0) return;

  const photoW = 360;
  const photoH = 270;
  const padding = 24;      // Jarak antar foto ditingkatkan (sebelumnya 16px)
  const topSpace = 32;     // Margin atas diperlonggar
  const bottomSpace = 85;  // Margin bawah diperlonggar

  let canvasWidth = photoW + (padding * 2);
  let canvasHeight = topSpace + (capturedPhotos.length * photoH) + ((capturedPhotos.length - 1) * padding) + bottomSpace;

  if (activeLayout === 'grid') {
    canvasWidth = (photoW * 2) + (padding * 3);
    const rows = Math.ceil(capturedPhotos.length / 2);
    canvasHeight = topSpace + (rows * photoH) + ((rows - 1) * padding) + bottomSpace;
  } else if (activeLayout === 'polaroid') {
    const polaroidPadding = 32;
    canvasWidth = (photoW * 2) + (padding * 3) + (polaroidPadding * 2);
    const rows = Math.ceil(capturedPhotos.length / 2);
    canvasHeight = topSpace + (rows * photoH) + ((rows - 1) * padding) + bottomSpace + 40;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  photoBoxes = [];

  ctx.fillStyle = activeBgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (activeLayout === 'vertical') {
    capturedPhotos.forEach((photoCanvas, idx) => {
      const yPos = topSpace + (idx * (photoH + padding));
      ctx.drawImage(photoCanvas, padding, yPos, photoW, photoH);
      photoBoxes.push({ index: idx, x: padding, y: yPos, w: photoW, h: photoH });
    });
  } else if (activeLayout === 'grid') {
    capturedPhotos.forEach((photoCanvas, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = padding + col * (photoW + padding);
      const yPos = topSpace + row * (photoH + padding);
      ctx.drawImage(photoCanvas, xPos, yPos, photoW, photoH);
      photoBoxes.push({ index: idx, x: xPos, y: yPos, w: photoW, h: photoH });
    });
  } else if (activeLayout === 'polaroid') {
    const polaroidPadding = 32;
    capturedPhotos.forEach((photoCanvas, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = polaroidPadding + padding + col * (photoW + padding);
      const yPos = polaroidPadding + topSpace + row * (photoH + padding);
      ctx.drawImage(photoCanvas, xPos, yPos, photoW, photoH);
      photoBoxes.push({ index: idx, x: xPos, y: yPos, w: photoW, h: photoH });
    });
  }

  drawBranding(canvasWidth, canvasHeight);
  drawStamps();

  actionButtons.classList.remove('hidden');
}

function drawBranding(canvasWidth, canvasHeight) {
  const isDarkBg = activeBgColor === '#2D2B30' || activeBgColor === '#4A5568';
  
  ctx.fillStyle = isDarkBg ? '#FFFFFF' : '#FF4081';
  ctx.font = '700 18px "Fredoka", cursive';
  ctx.textAlign = 'center';
  ctx.fillText("SNAPPOP! ⚡", canvasWidth / 2, canvasHeight - 48);

  ctx.fillStyle = isDarkBg ? '#CCCCCC' : '#718096';
  ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  ctx.fillText(`by Gege's Lab • ${today}`, canvasWidth / 2, canvasHeight - 26);
}

function drawStamps() {
  stampsOnCanvas.forEach(stamp => {
    ctx.font = `${stamp.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stamp.text, stamp.x, stamp.y);
  });
}

// Retake Trigger
canvas.addEventListener('click', (e) => {
  if (capturedPhotos.length === 0) return;
  const coords = getCanvasCoordinates(e);

  for (let box of photoBoxes) {
    if (coords.x >= box.x && coords.x <= box.x + box.w && coords.y >= box.y && coords.y <= box.y + box.h) {
      selectedPhotoIndex = box.index;
      retakeModal.classList.remove('hidden');
      return;
    }
  }
});

btnConfirmRetake.addEventListener('click', async () => {
  retakeModal.classList.add('hidden');
  if (selectedPhotoIndex === -1) return;

  await runCountdown(3);
  triggerFlash();
  const newFrame = captureFrame();
  capturedPhotos[selectedPhotoIndex] = newFrame;
  renderStrip();
});

btnCancelRetake.addEventListener('click', () => {
  retakeModal.classList.add('hidden');
  selectedPhotoIndex = -1;
});

// Drag & Drop Stamp Physics
function getCanvasCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('touchstart', startDrag);

function startDrag(e) {
  if (stampsOnCanvas.length === 0) return;
  const coords = getCanvasCoordinates(e);

  for (let i = stampsOnCanvas.length - 1; i >= 0; i--) {
    const s = stampsOnCanvas[i];
    const dist = Math.hypot(coords.x - s.x, coords.y - s.y);
    if (dist < s.size) {
      draggedStampIndex = i;
      return;
    }
  }
}

window.addEventListener('mousemove', drag);
window.addEventListener('touchmove', drag);

function drag(e) {
  if (draggedStampIndex === -1) return;
  const coords = getCanvasCoordinates(e);
  stampsOnCanvas[draggedStampIndex].x = coords.x;
  stampsOnCanvas[draggedStampIndex].y = coords.y;
  renderStrip();
}

window.addEventListener('mouseup', () => draggedStampIndex = -1);
window.addEventListener('touchend', () => draggedStampIndex = -1);

document.querySelectorAll('.stamp-pills .stamp-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (capturedPhotos.length === 0) return;
    stampsOnCanvas.push({
      text: e.target.dataset.stamp,
      x: canvas.width / 2 + (Math.random() * 40 - 20),
      y: canvas.height / 2 + (Math.random() * 40 - 20),
      size: 32
    });
    renderStrip();
  });
});

// GIF Generator
btnGif.addEventListener('click', () => {
  if (capturedPhotos.length === 0) return;
  btnGif.innerText = "⏳ Generating GIF...";
  btnGif.disabled = true;

  const images = capturedPhotos.map(p => p.toDataURL('image/png'));

  gifshot.createGIF({
    images: images,
    gifWidth: 400,
    gifHeight: 300,
    interval: 0.5,
    numFrames: 10
  }, function (obj) {
    if (!obj.error) {
      const link = document.createElement('a');
      link.download = `snappop-gif-${Date.now()}.gif`;
      link.href = obj.image;
      link.click();
    } else {
      alert("Gagal membuat GIF. Silakan coba lagi.");
    }
    btnGif.innerText = "🎬 Download Animated GIF";
    btnGif.disabled = false;
  });
});

document.querySelectorAll('.layout-pills .pill-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.layout-pills .pill-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeLayout = e.target.dataset.layout;
    renderStrip();
  });
});

document.querySelectorAll('.filter-pills .pill-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-pills .pill-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = e.target.dataset.filter;
    video.style.filter = activeFilter;
    renderStrip();
  });
});

document.querySelectorAll('.color-picker-row .color-dot').forEach(dot => {
  dot.addEventListener('click', (e) => {
    document.querySelectorAll('.color-picker-row .color-dot').forEach(d => d.classList.remove('active'));
    e.target.classList.add('active');
    activeBgColor = e.target.dataset.color;
    renderStrip();
  });
});

btnRetake.addEventListener('click', () => {
  capturedPhotos = [];
  stampsOnCanvas = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actionButtons.classList.add('hidden');
});

btnDownload.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `snappop-strip-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
});

window.addEventListener('DOMContentLoaded', initCamera);