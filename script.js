(() => {
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.panel')];
  const dots = [...document.querySelectorAll('#pager span')];
  const main = document.getElementById('main');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  let current = 0;
  let startX = 0;
  let startY = 0;

  function show(index, updateHash = true) {
    current = Math.max(0, Math.min(index, panels.length - 1));
    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      if (active) tab.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    });
    panels.forEach((panel, i) => {
      const active = i === current;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    if (updateHash) history.replaceState(null, '', `#tab-${current + 1}`);
    window.scrollTo({top: document.querySelector('.tabs-wrap').offsetTop, behavior:'smooth'});
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i)));

  main.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, {passive:true});

  main.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) show(current + 1);
      else show(current - 1);
    }
  }, {passive:true});

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  fullscreenBtn.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  });

  const m = location.hash.match(/tab-(\d)/);
  if (m) show(Number(m[1]) - 1, false);
})();
