// Gera thumbnail.png (1280x720) e marca-dagua-youtube.png (150x150) a partir do video.html
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(__dirname, 'video.html')); await p.waitForFunction(() => window.READY);
  await p.evaluate(() => {
    window.render(8.75);
    document.querySelector('#s2 .col').style.display = 'none';
    document.querySelectorAll('#s2 .bubble').forEach(e => e.parentNode.style.display = 'none');
    const o = document.createElement('div');
    o.style.cssText = 'position:absolute;left:820px;top:70px;width:1060px;z-index:60;text-align:left';
    o.innerHTML = `<div style="display:inline-flex;align-items:center;gap:18px;background:#fff;color:#10261a;border-radius:24px;padding:14px 26px;font-weight:900;font-size:46px;box-shadow:0 10px 0 rgba(0,0,0,.2)"><span class="mark" style="width:62px;height:62px;background:#169b5a"><svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19.5 7" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Lugar Certo</div>
      <div style="font-family:'Lilita One';font-size:150px;line-height:.95;margin-top:28px;color:#fff;text-shadow:0 8px 0 rgba(0,0,0,.25)">Foi só<br>pelo pão…</div>
      <div style="display:inline-block;margin-top:24px;background:#FFD43B;color:#10261a;font-family:'Lilita One';font-size:84px;padding:6px 34px;border-radius:26px;transform:rotate(-3deg);box-shadow:0 10px 0 rgba(0,0,0,.25)">gastou R$ 487 😱</div>`;
    document.getElementById('stage').appendChild(o);
    document.querySelector('#s2 .board').style.display='none';
    document.querySelector('#s2 .paper').style.display='none';
    document.querySelector('#s2 .counter').style.display='none';
  });
  await p.screenshot({ path: 'thumb_full.png' });
  // watermark
  await p.setContent(`<html><body style="margin:0;background:transparent"><div style="width:150px;height:150px;border-radius:38px;background:#169b5a;display:grid;place-items:center">
    <svg viewBox="0 0 24 24" width="104" height="104"><path d="M5 12.5 L10 17.5 L19.5 7" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div></body></html>`);
  await p.setViewportSize({ width: 150, height: 150 });
  await p.screenshot({ path: 'marca-dagua-youtube.png', omitBackground: true });
  await b.close();
})();
