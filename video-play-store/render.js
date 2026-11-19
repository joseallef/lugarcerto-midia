// Usage: node render.js out_dir [fps] [t0] [t1]   -> writes PNG frames; or node render.js --stills out_dir t1,t2,...
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const args = process.argv.slice(2);
  const stills = args[0] === '--stills'; if (stills) args.shift();
  const out = args[0]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(__dirname, 'video.html'));
  await p.waitForFunction(() => window.READY);
  const times = stills ? args[1].split(',').map(Number) : (() => {
    const fps = +(args[1] || 30), t0 = +(args[2] || 0), t1 = +(args[3] || 60); const a = [];
    for (let f = Math.round(t0 * fps); f < Math.round(t1 * fps); f++) a.push(f / fps); return a; })();
  const fps = +(args[1] || 30);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(t => window.render(t), times[i]);
    const name = stills ? `t${times[i].toFixed(2)}.png` : `f${String(Math.round(times[i] * fps)).padStart(5, '0')}.png`;
    await p.screenshot({ path: path.join(out, name), type: 'png' });
    if (!stills && i % 150 === 0) console.log('frame', i, '/', times.length);
  }
  await b.close();
})();
