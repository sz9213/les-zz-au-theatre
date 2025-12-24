(() => {
  const sampleRatio = (ctx, w, h) => {
    const step = 16;
    const data = ctx.getImageData(0, 0, w, h).data;
    let t = 0, tot = 0;
    for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
      const a = data[(y * w + x) * 4 + 3];
      tot++; if (a === 0) t++;
    }
    return t / tot;
  };

  const init = (el) => {
    const canvas = el.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const text = el.dataset.coverText || "Gratte pour révéler ✨";
    const brush = parseInt(el.dataset.brush || "24", 10);
    let down = false;

    const drawCover = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.max(1, devicePixelRatio || 1);
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, r.width, r.height);

      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, "rgba(255,255,255,0.18)");
      g.addColorStop(1, "rgba(0,0,0,0.22)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, r.width, r.height);

      ctx.fillStyle = "rgba(255,255,255,0.10)";
      for (let i = 0; i < 70; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * r.width, Math.random() * r.height, 1 + Math.random() * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(231,237,247,0.92)";
      ctx.font = "800 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      ctx.textAlign = "center";
      ctx.fillText(text, r.width / 2, r.height / 2 + 6);

      ctx.globalCompositeOperation = "destination-out";
    };

    const scratch = (clientX, clientY) => {
      const b = canvas.getBoundingClientRect();
      const x = clientX - b.left;
      const y = clientY - b.top;
      ctx.beginPath();
      ctx.arc(x, y, brush, 0, Math.PI * 2);
      ctx.fill();
    };

    canvas.addEventListener("pointerdown", (e) => { down = true; scratch(e.clientX, e.clientY); });
    window.addEventListener("pointermove", (e) => { if (down) scratch(e.clientX, e.clientY); });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (sampleRatio(ctx, canvas.width, canvas.height) > 0.55) {
        const r = canvas.getBoundingClientRect();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillRect(0, 0, r.width, r.height);
        el.classList.add("is-revealed");
      }
    });

    window.addEventListener("resize", drawCover);
    drawCover();
  };

  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".scratch-card").forEach(init);
  });
})();