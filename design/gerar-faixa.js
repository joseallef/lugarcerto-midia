// Faixa "Antes de apoiar um app gigante..." (estilo faixa de pano artesanal).
// Gera: faixa para impressão (alta resolução) + post 1080x1350 com a Bia segurando a faixa.
// Uso: node design/gerar-faixa.js
const fs = require('fs'), path = require('path');
const { personagem: P } = require('./personagens-v3');
const render = require('./render');

const OUT = path.join(__dirname, '..', 'semana-48', 'faixa');
fs.mkdirSync(OUT, { recursive: true });

const FONTES = `<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Pacifico&family=Nunito:wght@700;800&display=block" rel="stylesheet">`;
const NAVY = '#24427A', CORAL = '#E8604C', VERDE = '#3E8E4E', ROSA = '#E4407A';

// Ramo de folhinhas (decoração da faixa)
const ramo = (cor, flip = false) => `<svg width="70" height="40" viewBox="0 0 70 40" style="${flip ? 'transform:scaleX(-1)' : ''}"><path d="M4 30 Q34 26 66 8" stroke="${cor}" stroke-width="3" fill="none" stroke-linecap="round"/>${[[16, 26, -30], [28, 22, -40], [40, 17, -45], [52, 12, -50]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y - 6}" rx="7" ry="3.6" transform="rotate(${r} ${x} ${y - 6})" fill="${cor}"/><ellipse cx="${x + 2}" cy="${y + 5}" rx="7" ry="3.6" transform="rotate(${r + 70} ${x + 2} ${y + 5})" fill="${cor}"/>`).join('')}</svg>`;
const brilho = (cor) => `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="${cor}"/></svg>`;
const coracao = `<svg width="120" height="92" viewBox="0 0 120 92"><defs><linearGradient id="gco" x1="0" x2="1"><stop offset="0" stop-color="#F27A8A"/><stop offset="1" stop-color="#E4407A"/></linearGradient></defs><path d="M60 88 C20 60 0 42 0 22 C0 8 12 0 26 0 C40 0 52 8 60 20 C68 8 80 0 94 0 C108 0 120 8 120 22 C120 42 100 60 60 88 Z" fill="url(#gco)"/></svg>`;

// Faixa em unidades de 1000 px de largura (escala via CSS transform)
const faixa = () => `
<div class="faixa" style="width:1000px;height:1240px;position:relative;background:#FBF6EC;
  background-image:repeating-linear-gradient(0deg,#0000000a 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,#00000008 0 1px,transparent 1px 4px);
  box-shadow:0 30px 60px #00000033, inset 0 0 60px #c8b9a033;border-radius:6px;padding:70px 50px 40px;text-align:center;font-family:'Baloo 2';font-weight:800;line-height:1.02;letter-spacing:.01em">
  <div style="position:absolute;inset:18px;border:3px dashed #D8CBB6;border-radius:4px"></div>
  <div style="position:absolute;left:46px;top:60px">${ramo(VERDE)}</div>
  <div style="position:absolute;right:46px;top:60px">${ramo(VERDE, true)}</div>
  <div style="position:absolute;left:120px;top:290px">${brilho('#E9B949')}</div>
  <div style="position:absolute;right:110px;top:600px">${brilho('#E9B949')}</div>
  <div style="position:absolute;left:90px;top:860px">${brilho('#E9B949')}</div>
  <div style="color:${NAVY};font-size:96px">ANTES DE APOIAR<br>UM APP GIGANTE,</div>
  <div style="color:${CORAL};font-size:104px;margin-top:22px">APOIE UM APP<br>BRASILEIRO</div>
  <div style="color:${VERDE};font-size:84px;margin-top:22px">QUE AJUDA A SUA<br>CASA A ECONOMIZAR<br>NO MERCADO.</div>
  <div style="margin:44px auto 0;width:760px;text-align:left;font-family:Nunito;font-weight:800;font-size:40px;line-height:1.45;color:${NAVY}">
    <div>♥ a lista soma o total na hora</div>
    <div>♥ a nota fiscal vira histórico de preço</div>
    <div>♥ a casa toda usa a mesma lista</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:178px;display:flex;justify-content:center;gap:40px">${ramo(VERDE)}${ramo(VERDE, true)}</div>
  <div style="position:absolute;left:0;right:0;bottom:70px;height:110px;display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">${coracao}</div>
    <div style="position:relative;font-family:Pacifico;font-weight:400;font-size:84px;color:${ROSA};-webkit-text-stroke:10px #fff;paint-order:stroke fill;text-shadow:0 4px 0 #00000014">Lugar Certo</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:34px;font-family:Nunito;font-weight:800;font-size:28px;color:${NAVY};letter-spacing:.02em">lista de compras da casa · grátis · lugarcerto.tec.br</div>
</div>`;

// 1) Faixa para impressão (2000x2480 px ≈ 50x62 cm a 100 dpi; amplia bem por ser vetorial)
const impressao = `<!doctype html><html><head><meta charset="utf-8">${FONTES}<style>*{margin:0;box-sizing:border-box}body{width:2000px;height:2480px;background:#FBF6EC;overflow:hidden}</style></head>
<body><div style="transform:scale(2);transform-origin:0 0">${faixa().replace('box-shadow:0 30px 60px #00000033, ', '')}</div></body></html>`;

// 2) Post 1080x1350: cenário de loja com flores + Bia segurando a faixa
const flor = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="#F6D27A"/>`;
const flores = (ox, oy, n, seed) => { let s = ''; let k = seed; for (let i = 0; i < n; i++) { k = (k * 9301 + 49297) % 233280; const a = k / 233280; k = (k * 9301 + 49297) % 233280; const b = k / 233280; s += flor(ox + a * 260, oy + b * 300, 12 + (i % 3) * 5, ['#F4B6C2', '#F7D3DA', '#EE8FA6', '#FBE3E8', '#E9A0B4'][i % 5]); } return s; };
const folhas = (ox, oy) => Array.from({ length: 9 }, (_, i) => `<path d="M${ox} ${oy} Q${ox - 120 + i * 30} ${oy - 160 - (i % 3) * 30} ${ox - 160 + i * 40} ${oy - 260 + (i % 2) * 40}" stroke="#3F7A4A" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('');

const post = `<!doctype html><html><head><meta charset="utf-8">${FONTES}
<style>*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#F1EBE2}.abs{position:absolute}</style></head><body>
  <div class="abs" style="left:0;top:0;right:0;height:1010px;background:linear-gradient(#F4EFE7,#ECE4D8)"></div>
  <div class="abs" style="left:0;right:0;top:1010px;bottom:0;background:#D9D4CC;background-image:linear-gradient(90deg,#0000000f 2px,transparent 2px),linear-gradient(#0000000f 2px,transparent 2px);background-size:180px 120px"></div>
  <div class="abs" style="left:0;top:120px;width:300px;height:520px;background:linear-gradient(#8A5A3C,#6E4630);border-radius:0 10px 10px 0"></div>
  <svg class="abs" style="left:0;top:0" width="1080" height="1350">
    ${folhas(150, 900)}${folhas(140, 1000)}
    ${flores(0, 600, 60, 3)}${flores(40, 780, 50, 11)}
    ${flores(800, 20, 70, 5)}${flores(820, 300, 60, 19)}${flores(800, 580, 50, 23)}
  </svg>
  <div class="abs" style="left:250px;top:40px;width:580px;height:1160px">${P('bia', { bracoD: 'baixo', bracoE: 'baixo', expressao: 'feliz' })}</div>
  <div class="abs" style="left:215px;top:380px;width:650px;transform:rotate(-1.2deg)">
    <div style="transform:scale(.65);transform-origin:0 0;width:1000px">${faixa()}</div>
  </div>
  <svg class="abs" style="left:0;top:0" width="1080" height="1350">
    <ellipse cx="228" cy="392" rx="26" ry="30" fill="#B97B52"/><ellipse cx="852" cy="384" rx="26" ry="30" fill="#B97B52"/>
    <path d="M214 380 q14 -10 30 0 M838 372 q14 -10 30 0" stroke="#9A6440" stroke-width="3" fill="none"/>
  </svg>
  <div class="abs" style="left:24px;top:24px;background:#ffffffd9;border-radius:999px;padding:10px 20px;font-family:Nunito;font-weight:800;font-size:22px;color:${NAVY}">📲 lugarcerto.tec.br</div>
</body></html>`;

render([
  { html: impressao, out: path.join(OUT, 'faixa-para-imprimir.png'), w: 2000, h: 2480 },
  { html: post, out: path.join(OUT, 'post-faixa-bia.png'), w: 1080, h: 1350 },
]);
