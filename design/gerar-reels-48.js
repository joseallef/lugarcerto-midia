// Série de Reels "Reclama, Bia!": as reclamações reais de quem cuida da casa.
// Cada episódio (15 s, 1080x1920): reclamação → dado real → solução no app → QR Code.
// Uso: node design/gerar-reels-48.js [filtro]
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { personagem: P } = require('./personagens-v3');

const OUT = path.join(__dirname, '..', 'semana-48', 'reels');
const W = 1080, H = 1920, FPS = 30, DUR = 15;
const QR = fs.readFileSync(path.join(__dirname, 'qr-semana48.svg'), 'utf8').replace('<svg', '<svg width="100%" height="100%"');

const CSS = `
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=block" rel="stylesheet">
<style>
:root{--ink:#1F1A17;--paper:#F7F4EE;--lime:#C6F24E;--green:#138A55;--red:#E8362B;--muted:#6F675E}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;font-family:Inter,sans-serif;color:var(--ink);position:relative;background:var(--paper)}
.abs{position:absolute}.h{font-family:'Bricolage Grotesque';font-weight:800;letter-spacing:-.04em;line-height:.92}
.serif{font-family:'Instrument Serif';font-style:italic;font-weight:400}.mono{font-family:'DM Mono',monospace;letter-spacing:.12em}
.cena{position:absolute;inset:0}
.bal{background:#fff;border-radius:40px;padding:30px 38px;font-size:50px;font-weight:700;line-height:1.12;box-shadow:0 20px 50px #1f1a1726;position:relative}
.bal:after{content:'';position:absolute;bottom:-18px;left:var(--cx,80px);width:40px;height:40px;background:#fff;transform:rotate(45deg);border-radius:6px}
@keyframes pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes slam{0%{transform:scale(3) rotate(-6deg);opacity:0}60%{transform:scale(.95) rotate(-2deg);opacity:1}100%{transform:scale(1) rotate(-2deg);opacity:1}}
@keyframes up{0%{transform:translateY(220px);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes inR{0%{transform:translateX(1200px)}75%{transform:translateX(-24px)}100%{transform:translateX(0)}}
@keyframes inL{0%{transform:translateX(-1200px)}75%{transform:translateX(24px)}100%{transform:translateX(0)}}
@keyframes shake{0%,100%{transform:translate(0)}20%{transform:translate(-16px,8px)}40%{transform:translate(14px,-8px)}60%{transform:translate(-8px,4px)}80%{transform:translate(6px,-2px)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
@keyframes show{from{opacity:0}to{opacity:1}}@keyframes hide{to{opacity:0}}
@keyframes grow{from{transform:scaleX(0)}}
@keyframes wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes fly{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(var(--dx),var(--dy)) rotate(var(--rr))}}
@keyframes tick{0%{transform:translateY(0)}100%{transform:translateY(var(--ty))}}
</style>`;
const a = (css, anim, html) => `<div class="abs" style="${css};animation:${anim}">${html}</div>`;
const pop = (d) => `pop .5s ${d}s cubic-bezier(.2,1.3,.4,1) both`;
const up = (d) => `up .55s ${d}s cubic-bezier(.2,1.2,.4,1) both`;
// cena visível entre t0 e t1 (corte seco com leve fade)
const cena = (t0, t1, bg, html) => `<div class="cena" style="background:${bg};animation:show .12s ${t0}s both${t1 ? `, hide .12s ${t1}s forwards` : ''}">${html}</div>`;
const check = (c = 'currentColor', s = 26) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke="${c}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const logo = (c = 'var(--ink)') => `<div style="display:flex;align-items:center;gap:12px;font-family:'Bricolage Grotesque';font-weight:800;font-size:36px;color:${c}"><span style="width:46px;height:46px;border-radius:12px;border:4px solid ${c};display:grid;place-items:center">${check(c)}</span>Lugar Certo</div>`;
const selo = (ep) => a('left:60px;top:150px;z-index:20', 'show .1s 0s both', `<div style="display:flex;gap:14px;align-items:center"><span class="mono" style="background:var(--ink);color:#fff;padding:10px 18px;border-radius:999px;font-size:24px">RECLAMA, BIA! · EP. ${ep}</span></div>`);

// Celular com a tela do app
const celular = (css, tela, d) => a(css, `inR .7s ${d}s cubic-bezier(.2,1,.4,1) both`, `<div style="width:560px;height:1000px;background:var(--ink);border-radius:76px;padding:22px;box-shadow:0 40px 80px #0004">
  <div style="width:100%;height:100%;background:#fff;border-radius:56px;overflow:hidden;position:relative">
    <div style="background:var(--green);color:#fff;padding:60px 36px 28px"><div style="font-size:24px;opacity:.85">Lugar Certo</div>${tela.titulo}</div>
    <div style="padding:20px 30px">${tela.corpo}</div></div></div>`);
const item = (nome, info, dir, d) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:20px 0;border-bottom:2px solid #EEE8DD;animation:${up(d)}"><div><div style="font-size:32px;font-weight:700">${nome}</div><div style="font-size:22px;color:var(--muted)">${info}</div></div>${dir}</div>`;

const fim = (t0, titulo, sub) => cena(t0, null, 'var(--ink)', `
  ${a('left:60px;top:220px', pop(t0 + .1), logo('#fff'))}
  ${a('left:60px;top:340px;width:960px;color:#fff', up(t0 + .2), `<div class="h" style="font-size:110px">${titulo}</div><div style="font-size:42px;margin-top:26px;opacity:.85;line-height:1.3">${sub}</div>`)}
  ${a('left:60px;right:60px;top:900px', up(t0 + .5), `<div style="background:#fff;border-radius:44px;padding:40px;display:flex;gap:40px;align-items:center">
    <div style="width:300px;height:300px;flex:none">${QR}</div>
    <div><div class="h" style="font-size:62px">Aponte a câmera</div><div style="font-size:34px;margin-top:12px;color:var(--muted)">e baixe grátis</div><div class="mono" style="font-size:28px;margin-top:20px">lugarcerto.tec.br</div></div></div>`)}
  ${a('left:60px;top:1350px', `${pop(t0 + .9)}, pulse 1s ${t0 + 1.4}s infinite`, `<div style="background:var(--lime);border-radius:999px;padding:22px 36px;font-size:40px;font-weight:800">14 dias de Premium grátis, sem cartão</div>`)}`);

const dado = (t0, t1, bg, num, txt, fonte, cor = '#fff') => cena(t0, t1, bg, `
  ${a('left:60px;top:300px', pop(t0 + .05), `<div class="mono" style="font-size:30px;color:${cor};opacity:.8">E NÃO É SÓ A BIA:</div>`)}
  ${a('left:40px;top:380px;width:1000px', `slam .45s ${t0 + .15}s cubic-bezier(.2,1.2,.4,1) both`, `<div class="h" style="font-size:330px;color:${cor};letter-spacing:-.06em">${num}</div>`)}
  ${a('left:60px;top:780px;width:960px', up(t0 + .5), `<div style="font-size:64px;font-weight:800;line-height:1.1;color:${cor}">${txt}</div>`)}
  ${a('left:60px;top:1200px;width:960px', up(t0 + .8), `<div class="mono" style="font-size:24px;color:${cor};opacity:.7">FONTE: ${fonte}</div>`)}`);

// ---------- EP 1: Subiu tudo! ----------
const ep1 = `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body>
  ${cena(0, 3.6, '#FFE3DC', `
    ${a('left:40px;top:300px;width:1000px;z-index:3', `slam .45s .1s cubic-bezier(.2,1.2,.4,1) both, shake .4s .6s`, `<div class="h" style="font-size:210px;color:var(--red)">SUBIU<br>TUDO!</div>`)}
    ${a('left:540px;top:820px;width:460px', pop(1.0), `<div style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px #0002;transform:rotate(4deg)"><div style="background:var(--red);color:#fff;padding:14px 24px;font-family:'Bricolage Grotesque';font-weight:800;font-size:36px">CAFÉ 500 G</div><div style="padding:16px 24px;font-family:'Bricolage Grotesque';font-weight:800"><div style="font-size:40px;color:var(--muted);text-decoration:line-through">mês passado 19,90</div><div style="font-size:100px;color:var(--red);line-height:1">23,49</div></div></div>`)}
    ${a('left:60px;top:1120px;width:640px;--cx:120px;z-index:5', pop(1.6), `<div class="bal">Cada vez que eu venho, o mesmo carrinho custa mais!</div>`)}
    ${a('left:-20px;top:1260px;width:440px;height:880px', up(.4), `<div style="animation:bob 1.2s ease-in-out infinite">${P('bia', { bracoD: 'aponta', bracoE: 'cintura', expressao: 'surpresa' })}</div>`)}
    ${a('left:640px;top:1300px;width:400px;height:800px', up(2.2), P('rafa', { bracoD: 'segura', propE: 'sacola', expressao: 'preocupada' }))}
  `)}
  ${dado(3.6, 6.6, 'var(--red)', '72%', 'dos brasileiros sentem que o preço dos alimentos subiu no último ano.', 'PESQUISA QUAEST')}
  ${cena(6.6, 11.6, 'var(--paper)', `
    ${a('left:60px;top:250px;width:960px', up(6.7), `<div class="h" style="font-size:92px">Mas o que subiu<br><span class="serif" style="font-size:100px">na SUA lista?</span></div>`)}
    ${celular('left:260px;top:560px', { titulo: `<div class="h" style="font-size:46px;margin-top:6px">O que subiu desde<br>a última compra</div>`, corpo:
      item('Café 500 g', 'era 19,90 · agora 23,49', `<b style="color:var(--red);font-size:30px">▲ 18%</b>`, 7.6) +
      item('Leite 1 L', 'era 5,29 · agora 5,89', `<b style="color:var(--red);font-size:30px">▲ 11%</b>`, 7.9) +
      item('Arroz 5 kg', 'era 27,90 · agora 26,49', `<b style="color:var(--green);font-size:30px">▼ 5%</b>`, 8.2) +
      item('Feijão 1 kg', 'mesmo preço', `<b style="color:var(--muted);font-size:30px">=</b>`, 8.5) +
      `<div style="margin-top:26px;background:#E8F6EE;border-radius:20px;padding:20px;font-size:26px;font-weight:600;animation:${pop(9)}">Dica: troque o café de marca este mês.</div>` }, 7.0)}
    ${a('left:-40px;top:1300px;width:360px;height:720px', up(9.4), `<div style="animation:bob 1.4s ease-in-out infinite">${P('bia', { bracoD: 'aceno', bracoE: 'cintura', expressao: 'feliz' })}</div>`)}
    ${a('left:620px;top:1640px;width:420px', pop(9.8), `<div style="background:var(--ink);color:#fff;border-radius:28px;padding:22px 26px;font-size:30px;font-weight:600">Cada nota fiscal escaneada vira histórico de preço.</div>`)}
  `)}
  ${fim(11.6, 'Pare de adivinhar o preço.', 'Escaneie a nota no caixa e veja o que subiu, item por item.')}
</body></html>`;

// ---------- EP 2: Ninguém lembra o que falta ----------
const ep2 = `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body>
  ${cena(0, 4.2, '#ECE6FF', `
    ${a('left:60px;top:280px;width:960px;z-index:3', `slam .45s .1s cubic-bezier(.2,1.2,.4,1) both`, `<div class="h" style="font-size:118px">Só eu sei o que acabou nessa casa?!</div>`)}
    ${a('left:60px;top:740px;width:560px;--cx:100px;z-index:5', pop(1.2), `<div class="bal" style="font-size:42px"><span class="mono" style="font-size:20px;color:var(--muted)">RAFA · DO MERCADO</span><br>Amor, tinha que trazer o quê mesmo? 📞</div>`)}
    ${a('left:520px;top:1000px;width:500px;--cx:380px;z-index:5', pop(2.2), `<div class="bal" style="font-size:42px"><span class="mono" style="font-size:20px;color:var(--muted)">TÉO</span><br>Acabou o papel higiênico. Faz 3 dias. 🫠</div>`)}
    ${a('left:-30px;top:1240px;width:440px;height:880px', up(.4), P('bia', { bracoD: 'cintura', bracoE: 'cintura', expressao: 'preocupada' }))}
    ${a('left:640px;top:1300px;width:400px;height:800px', up(1.9), P('teo', { bracoD: 'aceno', bracoE: 'baixo', expressao: 'surpresa' }))}
  `)}
  ${cena(4.2, 6.8, 'var(--ink)', `
    ${a('left:60px;top:360px;width:960px', up(4.3), `<div class="h" style="font-size:120px;color:#fff">Lista no papel<br>fica na geladeira.</div>`)}
    ${a('left:60px;top:740px;width:960px', up(5.0), `<div class="h" style="font-size:120px;color:var(--lime)">Lista no grupo<br>some no meio<br>dos áudios.</div>`)}
  `)}
  ${cena(6.8, 11.6, 'var(--paper)', `
    ${a('left:60px;top:250px;width:960px', up(6.9), `<div class="h" style="font-size:92px">Uma lista só.<br><span class="serif" style="font-size:100px">A casa toda vê.</span></div>`)}
    ${celular('left:260px;top:560px', { titulo: `<div class="h" style="font-size:46px;margin-top:6px">Lista da casa</div><div style="font-size:24px;opacity:.85;margin-top:6px">Bia e Rafa · tempo real</div>`, corpo:
      item('Papel higiênico 12 un.', 'adicionado por Téo', `<span style="font-size:22px;background:#FFF1C9;border-radius:10px;padding:6px 10px">agora</span>`, 7.8) +
      item('Leite integral 1 L', 'adicionado por Bia', `<span style="color:var(--green)">${check('#138A55', 34)}</span>`, 8.2) +
      item('Café 500 g', 'adicionado por Bia', `<span style="color:var(--green)">${check('#138A55', 34)}</span>`, 8.5) +
      `<div style="margin-top:26px;display:flex;justify-content:space-between;font-size:30px;font-weight:800;animation:${pop(9)}"><span>Total</span><span>R$ 47,30</span></div>` }, 7.1)}
    ${a('left:640px;top:1340px;width:400px;height:800px', up(9.3), `<div style="animation:bob 1.2s ease-in-out infinite">${P('rafa', { bracoD: 'celular', prop: 'celular', expressao: 'feliz' })}</div>`)}
    ${a('left:60px;top:1620px;width:560px', pop(9.8), `<div style="background:var(--ink);color:#fff;border-radius:28px;padding:22px 26px;font-size:30px;font-weight:600">Quem está em casa adiciona. Quem está no mercado vê na hora.</div>`)}
  `)}
  ${fim(11.6, 'A lista é da casa.', 'No Premium, 1 pessoa usa junto, numa assinatura só.')}
</body></html>`;

// ---------- EP 3: Comida estragando ----------
const potes = [['#8FD3FF', 'iogurte'], ['#C6F24E', 'alface'], ['#FFD94A', 'queijo'], ['#FF9B85', 'presunto']];
const ep3 = `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body>
  ${cena(0, 4.0, '#E3F4EA', `
    ${a('left:60px;top:270px;width:960px;z-index:3', `slam .45s .1s cubic-bezier(.2,1.2,.4,1) both`, `<div class="h" style="font-size:124px">Comprei.<br>Esqueci.<br><span style="color:var(--red)">Estragou.</span></div>`)}
    ${a('left:560px;top:720px;width:440px;height:600px', pop(.9), `<div style="width:100%;height:100%;background:#fff;border:8px solid #D9D3C7;border-radius:30px;padding:30px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
      ${potes.map(([c, n], i) => `<div style="background:${c};border-radius:16px;display:grid;place-items:center;font-weight:800;font-size:26px;position:relative;animation:${pop(1.2 + i * .2)}">${n}<span class="abs" style="right:-8px;top:-12px;background:var(--red);color:#fff;border-radius:999px;font-size:18px;padding:4px 10px">venceu</span></div>`).join('')}</div>`)}
    ${a('left:60px;top:1060px;width:480px;--cx:200px;z-index:5', pop(2.2), `<div class="bal" style="font-size:44px">Toda semana vai alguma coisa pro lixo. 😩</div>`)}
    ${a('left:-30px;top:1260px;width:440px;height:880px', up(.4), P('bia', { bracoD: 'segura', bracoE: 'cintura', expressao: 'preocupada' }))}
  `)}
  ${dado(4.0, 7.0, 'var(--green)', '61%', 'dos brasileiros jogam fora alimentos em bom estado toda semana.', 'EDELMAN / UNILEVER (AGÊNCIA BRASIL)')}
  ${cena(7.0, 11.6, 'var(--paper)', `
    ${a('left:60px;top:250px;width:960px', up(7.1), `<div class="h" style="font-size:92px">Compre o que<br><span class="serif" style="font-size:100px">a casa realmente usa.</span></div>`)}
    ${celular('left:260px;top:560px', { titulo: `<div class="h" style="font-size:44px;margin-top:6px">Próxima lista</div><div style="font-size:24px;opacity:.85;margin-top:6px">montada a partir da sua última nota</div>`, corpo:
      item('Iogurte', 'você comprou 6 · usou 3', `<b style="font-size:28px">3 ✓</b>`, 8.0) +
      item('Alface', 'comprou 2 · usou 1', `<b style="font-size:28px">1 ✓</b>`, 8.3) +
      item('Queijo 500 g', 'durou o mês', `<b style="font-size:28px">1 ✓</b>`, 8.6) +
      `<div style="margin-top:26px;background:#E8F6EE;border-radius:20px;padding:20px;font-size:26px;font-weight:600;animation:${pop(9.1)}">Ajuste as quantidades antes de sair de casa.</div>` }, 7.3)}
    ${a('left:640px;top:1340px;width:400px;height:800px', up(9.4), `<div style="animation:bob 1.3s ease-in-out infinite">${P('cida', { bracoD: 'aceno', bracoE: 'cintura', expressao: 'piscada' })}</div>`)}
    ${a('left:60px;top:1640px;width:560px', pop(9.8), `<div style="background:var(--ink);color:#fff;border-radius:28px;padding:22px 26px;font-size:30px;font-weight:600">A nota da última compra vira a próxima lista.</div>`)}
  `)}
  ${fim(11.6, 'Menos lixo, mais mês.', 'Lista pronta a partir da sua última compra. Ajuste e vá.')}
</body></html>`;

// ---------- EP 4: Cadê o dinheiro? ----------
const notasVoando = Array.from({ length: 10 }, (_, i) => a(`left:${420 + (i % 5) * 50}px;top:${900 + (i % 3) * 40}px`, `fly 1.6s ${0.8 + i * .12}s cubic-bezier(.3,0,.7,1) both`, `<div style="--dx:${(i % 2 ? 1 : -1) * (200 + i * 40)}px;--dy:${-700 - i * 60}px;--rr:${i * 70}deg;width:140px;height:72px;background:#8FD19E;border-radius:10px;display:grid;place-items:center;font-family:'Bricolage Grotesque';font-weight:800;font-size:30px;animation:inherit">R$</div>`)).join('');
const ep4 = `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body>
  ${cena(0, 3.8, '#FFF1C9', `
    ${a('left:60px;top:270px;width:960px;z-index:3', `slam .45s .1s cubic-bezier(.2,1.2,.4,1) both`, `<div class="h" style="font-size:140px">Cadê o<br>dinheiro<br>do mês?</div>`)}
    ${notasVoando}
    ${a('left:560px;top:1080px;width:460px;--cx:300px;z-index:5', pop(1.8), `<div class="bal" style="font-size:42px">Dia 18 e já acabou o VA. De novo.</div>`)}
    ${a('left:-30px;top:1240px;width:440px;height:880px', up(.4), P('bia', { bracoD: 'aceno', bracoE: 'cintura', expressao: 'surpresa' }))}
  `)}
  ${dado(3.8, 6.8, 'var(--ink)', 'R$ 1.074', 'é o gasto médio mensal do brasileiro no mercado e no varejo alimentar.', 'DUNNHUMBY RPI 2026', 'var(--lime)')}
  ${cena(6.8, 11.6, 'var(--paper)', `
    ${a('left:60px;top:250px;width:960px', up(6.9), `<div class="h" style="font-size:92px">Antes de gastar,<br><span class="serif" style="font-size:100px">divida o mês.</span></div>`)}
    ${a('left:60px;top:600px;width:960px', up(7.3), `<div style="background:#fff;border-radius:40px;padding:44px;box-shadow:0 20px 50px #1f1a171a">
      ${[['VA', 'mercado', 700, 520, 'var(--green)'], ['VR', 'almoço', 300, 160, '#E9A91C'], ['Salário', 'feira e padaria', 400, 340, '#E35D7A']].map(([n, s, tot, usado, c], i) => `<div style="margin:12px 0 34px"><div style="display:flex;justify-content:space-between;font-size:40px;font-weight:800"><span>${n} <span style="font-size:28px;color:var(--muted);font-weight:600">${s}</span></span><span>sobra R$ ${tot - usado}</span></div><div style="height:34px;background:#EEE8DD;border-radius:17px;margin-top:14px;overflow:hidden"><div style="width:${usado / tot * 100}%;height:100%;background:${c};border-radius:17px;transform-origin:left;animation:grow .8s ${7.8 + i * .4}s cubic-bezier(.2,1,.4,1) both"></div></div></div>`).join('')}
      <div class="mono" style="font-size:22px;color:var(--muted)">EXEMPLO ILUSTRATIVO</div></div>`)}
    ${a('left:640px;top:1300px;width:400px;height:800px', up(9.2), `<div style="animation:bob 1.3s ease-in-out infinite">${P('bia', { bracoD: 'celular', prop: 'celular', bracoE: 'cintura', expressao: 'feliz' })}</div>`)}
    ${a('left:60px;top:1380px;width:560px', pop(9.7), `<div style="background:var(--lime);border-radius:28px;padding:24px 28px;font-size:34px;font-weight:800">Grátis, pelo site.</div><div style="background:var(--ink);color:#fff;border-radius:28px;padding:22px 26px;font-size:30px;font-weight:600;margin-top:18px">E a lista soma o total na hora: você vê o teto antes do caixa.</div>`)}
  `)}
  ${fim(11.6, 'O dinheiro tem destino.', 'VA, VR e salário separados. Grátis no site lugarcerto.tec.br.')}
</body></html>`;

const reels = [['ep1-subiu-tudo', ep1], ['ep2-o-que-acabou', ep2], ['ep3-comida-estragando', ep3], ['ep4-cade-o-dinheiro', ep4]];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const filtro = process.argv[2];
  const browser = await chromium.launch();
  for (const [nome, html] of reels.filter(([n]) => !filtro || n.includes(filtro))) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reel-'));
    const pg = await browser.newPage({ viewport: { width: W, height: H } });
    await pg.setContent(html, { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    const n = FPS * DUR;
    for (let i = 0; i < n; i++) {
      await pg.evaluate((t) => document.getAnimations().forEach(an => { an.pause(); an.currentTime = t; }), i * 1000 / FPS);
      await pg.screenshot({ path: path.join(tmp, `${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
    }
    // capa do Reels: quadro do gancho (1,2 s)
    fs.copyFileSync(path.join(tmp, `${String(Math.round(1.2 * FPS)).padStart(4, '0')}.jpg`), path.join(OUT, `${nome}-capa.jpg`));
    await pg.close();
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.jpg'),
      '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21',
      '-preset', 'medium', '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', path.join(OUT, `${nome}.mp4`)]);
    fs.rmSync(tmp, { recursive: true });
    console.log('ok', nome);
  }
  await browser.close();
})();
