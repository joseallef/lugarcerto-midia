// Pins do Pinterest (1000x1500): faixa de título (SEO) + arte do feed.
const fs = require('fs'), path = require('path');
const render = require('./render');
const D = path.join(__dirname, '..', 'semana-48');
const pins = [
  ['pin-desconto-real.png', 'seg-23-carrossel-1.png', 'Desconto de verdade ou cartaz?', '3 perguntas antes da Black Friday do mercado', '#FFD94A', '#1F1A17'],
  ['pin-checklist.png', 'qui-26-checklist-black-friday.png', 'Checklist da Black Friday do mercado', 'salve e use na próxima compra', '#1F1A17', '#FFFFFF'],
  ['pin-13-salario.png', 'sab-28-13-salario.png', '13º salário: plano A ou plano B?', 'como dividir mercado, contas e reserva', '#13254A', '#C6F24E'],
];
const html = (img, t, s, bg, fg) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&display=block" rel="stylesheet">
<style>*{margin:0;box-sizing:border-box}body{width:1000px;height:1500px;background:${bg};color:${fg};font-family:Inter,sans-serif}
.t{height:250px;padding:44px 56px;display:flex;flex-direction:column;justify-content:center}
h1{font-family:'Bricolage Grotesque';font-weight:800;font-size:68px;letter-spacing:-.035em;line-height:.95}
p{font-size:30px;font-weight:600;margin-top:14px;opacity:.85}img{display:block;width:1000px;height:1250px}</style></head>
<body><div class="t"><h1>${t}</h1><p>${s}</p></div><img src="data:image/png;base64,${fs.readFileSync(path.join(D, img)).toString('base64')}">${img.includes('carrossel') ? `<div style="position:absolute;left:740px;top:330px;width:200px;height:80px;background:#FFD94A"></div><div style="position:absolute;left:800px;top:1410px;width:150px;height:50px;background:#FFD94A"></div>` : ''}</body></html>`;
render(pins.map(([o, i, t, s, bg, fg]) => ({ out: path.join(D, o), html: html(i, t, s, bg, fg), w: 1000, h: 1500 })));
