// Carrossel "Black Friday no mercado: uma comédia em 4 atos".
// Humor de situação + um insight prático por ato. Layout limpo/premium.
// Uso: node design/gerar-comedia-48.js
const fs = require('fs'), path = require('path');
const { personagem: P } = require('./personagens-v3');
const render = require('./render');

const OUT = path.join(__dirname, '..', 'semana-48');
const W = 1080, H = 1350, TOTAL = 6;
const QR = fs.readFileSync(path.join(__dirname, 'qr-semana48.svg'), 'utf8').replace('<svg', '<svg width="100%" height="100%"');

const CSS = `
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Serif:ital@1&family=DM+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
:root{--ink:#1F1A17;--paper:#F7F4EE;--lime:#C6F24E;--green:#138A55;--red:#E8362B;--muted:#6F675E}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;background:var(--paper);font-family:Inter,sans-serif;color:var(--ink);position:relative}
.abs{position:absolute}
.h{font-family:'Bricolage Grotesque';font-weight:800;letter-spacing:-.035em;line-height:.95}
.serif{font-family:'Instrument Serif';font-style:italic;font-weight:400;letter-spacing:-.01em}
.mono{font-family:'DM Mono',monospace;letter-spacing:.12em;font-size:22px}
.cena{position:absolute;left:60px;top:300px;width:960px;height:660px;border-radius:44px;overflow:hidden}
.bal{position:absolute;background:#fff;border:3px solid var(--ink);border-radius:30px;padding:20px 26px;font-size:31px;font-weight:600;line-height:1.2;z-index:5;box-shadow:0 10px 24px #1f1a1714}
.bal:after{content:'';position:absolute;bottom:-14px;width:24px;height:24px;background:#fff;border-right:3px solid var(--ink);border-bottom:3px solid var(--ink);transform:rotate(45deg)}
.bal.e:after{left:44px}.bal.d:after{right:44px}
.quem{display:block;font-family:'DM Mono',monospace;font-size:18px;letter-spacing:.1em;color:var(--muted);font-weight:500;margin-bottom:6px}
.insight{position:absolute;left:60px;right:60px;top:990px;background:var(--ink);color:#fff;border-radius:36px;padding:34px 40px}
.tag{display:inline-block;background:var(--lime);color:var(--ink);border-radius:999px;padding:8px 18px;font-family:'DM Mono',monospace;font-size:20px;letter-spacing:.1em;font-weight:500}
</style>`;

const check = (c = 'currentColor') => `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke="${c}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const topo = (n) => `<div class="abs" style="left:60px;right:60px;top:56px;display:flex;justify-content:space-between;align-items:center">
  <div style="display:flex;align-items:center;gap:10px;font-family:'Bricolage Grotesque';font-weight:800;font-size:26px"><span style="width:34px;height:34px;border-radius:9px;border:3px solid var(--ink);display:grid;place-items:center">${check()}</span>Lugar Certo</div>
  <div class="mono" style="color:var(--muted)">${n}/${TOTAL}</div></div>`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body>${body}</body></html>`;
const pers = (id, o, css) => `<div class="abs" style="${css}">${P(id, o)}</div>`;
const bal = (quem, txt, css, lado = 'e') => `<div class="bal ${lado}" style="${css}"><span class="quem">${quem}</span>${txt}</div>`;
const ato = (n, kicker, titulo, cor, cena, insight) => page(`
  ${topo(n)}
  <div class="abs mono" style="left:60px;top:136px;color:var(--muted)">${kicker}</div>
  <div class="abs h" style="left:60px;top:176px;font-size:60px;width:960px">${titulo}</div>
  <div class="cena" style="background:${cor}">${cena}</div>
  <div class="insight"><span class="tag">INSIGHT</span><div style="font-size:31px;font-weight:500;line-height:1.32;margin-top:16px">${insight}</div></div>`);

// Props
const produto = (w, h, cor) => `<div style="width:${w}px;height:${h}px;background:${cor};border:3px solid var(--ink);border-radius:8px"></div>`;
const prateleira = (cor, h, preco, destaque) => `<div style="display:flex;align-items:flex-end;justify-content:center;gap:10px;height:${h + 14}px;border-bottom:10px solid #CDBFAE;position:relative">
  ${produto(64, h, cor)}${produto(64, h, cor)}${produto(64, h, cor)}
  <div style="position:absolute;right:10px;bottom:-46px;background:${destaque ? 'var(--lime)' : '#fff'};border:3px solid var(--ink);border-radius:8px;padding:2px 10px;font-family:'Bricolage Grotesque';font-weight:800;font-size:24px">${preco}</div></div>`;
const pote = (x, y, r = 0) => `<div class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg);z-index:6"><div style="width:62px;height:20px;background:#FF7A3D;border:3px solid var(--ink);border-radius:6px 6px 0 0;margin:0 6px"></div><div style="width:74px;height:84px;background:#FFF6D6;border:3px solid var(--ink);border-radius:10px 10px 16px 16px;display:grid;place-items:center;font-family:'Bricolage Grotesque';font-weight:800;font-size:15px">MAIO</div></div>`;
const etiqueta = (css) => `<div class="abs" style="${css}"><div style="background:#fff;border:3px solid var(--ink);border-radius:20px;overflow:hidden;box-shadow:0 14px 30px #1f1a171f">
  <div style="background:var(--red);color:#fff;padding:10px 20px;font-family:'Bricolage Grotesque';font-weight:800;font-size:30px">OFERTA</div>
  <div style="padding:10px 20px 16px;font-family:'Bricolage Grotesque';font-weight:800"><div style="font-size:28px;text-decoration:line-through;text-decoration-color:var(--red);text-decoration-thickness:4px;color:var(--muted)">de 24,90</div><div style="font-size:64px;color:var(--red);line-height:1">19,90</div></div></div></div>`;
const carrinho = (css, cheio) => `<div class="abs" style="${css}"><svg viewBox="0 -30 300 280" width="100%" height="100%"><g stroke="#1F1A17" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
  ${cheio ? '<rect x="100" y="-20" width="50" height="60" rx="8" fill="#C6F24E"/><rect x="80" y="20" width="56" height="70" rx="8" fill="#FFD94A"/><rect x="140" y="0" width="48" height="90" rx="8" fill="#FF5A36"/><rect x="192" y="34" width="60" height="56" rx="8" fill="#8FD3FF"/>' : '<rect x="120" y="50" width="56" height="40" rx="8" fill="#C6F24E"/>'}
  <path d="M8 30 h40 l30 150 h180 l30 -110 h-224" fill="none"/><path d="M68 80 h210 l-22 96 h-170 Z" fill="#B9C3CF" fill-opacity=".5"/>
  <circle cx="100" cy="220" r="18" fill="#fff"/><circle cx="240" cy="220" r="18" fill="#fff"/></g></svg></div>`;

// ---- 1. Capa ----
const capa = page(`
  ${topo(1)}
  <div class="abs mono" style="left:60px;top:150px;color:var(--muted)">EDIÇÃO BLACK FRIDAY · 27/11</div>
  <div class="abs h" style="left:60px;top:196px;font-size:124px;width:960px">Black Friday<br>no mercado:</div>
  <div class="abs serif" style="left:60px;top:432px;font-size:96px">uma comédia em 4 atos.</div>
  <div class="abs" style="left:60px;top:580px;font-size:30px;color:var(--muted);width:640px;line-height:1.35">Estrelando o Téo, que acredita em todo cartaz. Com participação da Dona Cida, que não acredita em nenhum.</div>
  <div class="abs" style="right:60px;top:690px;font-family:'Bricolage Grotesque';font-weight:800;font-size:30px;border-bottom:4px solid var(--ink)">arraste →</div>
  <div class="abs" style="left:60px;top:760px;width:960px;height:530px;border-radius:44px;background:#EDE7DD;overflow:hidden">
    ${carrinho('left:520px;top:230px;width:330px;height:300px', true)}
    ${pers('teo', { bracoD: 'aceno', bracoE: 'baixo', expressao: 'feliz' }, 'left:270px;top:40px;width:290px;height:580px')}
    ${pers('cida', { bracoD: 'cintura', bracoE: 'cintura', expressao: 'desconfiada' }, 'left:10px;top:70px;width:270px;height:540px')}
    ${etiqueta('left:700px;top:40px;width:210px;transform:rotate(6deg)')}
  </div>
`);

// ---- 2. Ato 1: ponta de gôndola ----
const a1 = ato(2, 'ATO 1 · A PONTA DE GÔNDOLA', 'Se tá na ponta, tá barato. <span class="serif" style="font-size:64px;color:var(--muted)">Será?</span>', '#ECE6FF', `
  <div class="abs" style="left:330px;top:190px;width:300px;height:500px;background:#fff;border:4px solid var(--ink);border-radius:20px 20px 0 0;padding:14px">
    <div style="background:var(--red);color:#fff;border-radius:12px;text-align:center;font-family:'Bricolage Grotesque';font-weight:800;font-size:40px;padding:8px">IMPERDÍVEL</div>
    ${['#FFD94A', '#8FD3FF', '#FF9B85'].map(c => `<div style="display:flex;gap:8px;justify-content:center;align-items:flex-end;height:112px;border-bottom:8px solid #CDBFAE;margin-top:4px">${produto(66, 88, c)}${produto(66, 88, c)}${produto(66, 88, c)}</div>`).join('')}
  </div>
  ${pers('teo', { bracoD: 'aponta', bracoE: 'baixo', expressao: 'feliz' }, 'left:40px;top:200px;width:290px;height:580px')}
  ${pers('cida', { bracoD: 'cintura', bracoE: 'cintura', expressao: 'desconfiada', espelhar: true }, 'left:660px;top:220px;width:270px;height:540px')}
  ${bal('TÉO', 'Tá escrito IMPERDÍVEL, Cida.', 'left:30px;top:36px;width:340px')}
  ${bal('DONA CIDA', 'Imperdível é o meu dinheiro, Téo.', 'left:580px;top:36px;width:350px', 'd')}
`, 'A ponta de gôndola é o espaço mais disputado do mercado. Estar ali é vitrine, não garantia de desconto. <b>Compare o preço por kg</b> na etiqueta.');

// ---- 3. Ato 2: altura dos olhos ----
const a2 = ato(3, 'ATO 2 · A ALTURA DOS OLHOS', 'Peguei o primeiro que eu vi.', '#E3F4EA', `
  <div class="abs" style="left:330px;top:170px;width:300px;background:#fff;border:4px solid var(--ink);border-radius:16px;padding:14px 0 50px">
    ${prateleira('#8FD3FF', 84, 'R$ 11,90')}
    <div style="height:56px"></div>
    <div style="position:relative">${prateleira('#FF5A36', 96, 'R$ 12,90')}<div style="position:absolute;inset:-8px -6px;border:6px solid var(--red);border-radius:12px"></div></div>
    <div style="height:56px"></div>
    ${prateleira('#FFD94A', 76, 'R$ 8,49', true)}
  </div>
  ${pers('teo', { bracoD: 'aceno', bracoE: 'baixo', expressao: 'feliz' }, 'left:40px;top:210px;width:290px;height:580px')}
  ${pers('cida', { bracoD: 'baixo', bracoE: 'cintura', expressao: 'piscada', espelhar: true }, 'left:670px;top:230px;width:270px;height:540px')}
  ${bal('TÉO', 'Esse aqui. Tava na cara.', 'left:30px;top:36px;width:300px')}
  ${bal('DONA CIDA', 'Tava na cara de propósito. O barato mora lá embaixo.', 'left:560px;top:36px;width:370px', 'd')}
`, 'As marcas que mais vendem costumam ficar na altura dos olhos. Antes de pegar, <b>olhe a prateleira de baixo e a de cima</b>: o mesmo tipo de produto pode sair bem mais em conta.');

// ---- 4. Ato 3: leve 3 pague 2 ----
const a3 = ato(4, 'ATO 3 · O “LEVE 3, PAGUE 2”', 'Economizei uma maionese inteira.', '#FFF1C9', `
  ${pers('teo', { bracoD: 'segura', bracoE: 'segura', expressao: 'feliz' }, 'left:110px;top:200px;width:290px;height:580px')}
  ${pote(150, 440, -8)}${pote(222, 430, 3)}${pote(294, 444, 10)}
  ${pers('cida', { bracoD: 'cintura', bracoE: 'cintura', expressao: 'desconfiada', espelhar: true }, 'left:640px;top:220px;width:270px;height:540px')}
  ${bal('TÉO', 'Leve 3, pague 2! Uma saiu de graça!', 'left:40px;top:36px;width:360px')}
  ${bal('DONA CIDA', 'Você usa uma por mês. Acabou de comprar maionese até fevereiro.', 'left:480px;top:36px;width:450px', 'd')}
`, '“Leve 3, pague 2” só é desconto se você ia usar os 3 antes de vencer. Se não, é <b>gasto adiantado</b> ocupando espaço no armário.');

// ---- 5. Ato 4: de/por ----
const a4 = ato(5, 'ATO 4 · O “DE / POR”', 'De 24,90 por 19,90. Corre!', '#FFE3DC', `
  ${etiqueta('left:350px;top:210px;width:240px;transform:rotate(-4deg)')}
  ${pers('teo', { bracoD: 'aceno', bracoE: 'baixo', expressao: 'surpresa' }, 'left:40px;top:210px;width:290px;height:580px')}
  ${pers('cida', { bracoD: 'baixo', bracoE: 'cintura', expressao: 'piscada', espelhar: true }, 'left:670px;top:230px;width:270px;height:540px')}
  <div class="abs" style="left:560px;top:330px;width:200px;background:var(--ink);border-radius:26px;padding:10px;transform:rotate(-6deg);z-index:6">
    <div style="background:#fff;border-radius:18px;padding:12px;font-family:'Bricolage Grotesque';font-weight:800">
      <div style="font-size:13px;color:var(--green)">CAFÉ 500 G · SEU HISTÓRICO</div>
      <div style="display:flex;align-items:flex-end;gap:6px;height:100px;margin-top:8px">${[[18.9, 'set'], [21.5, 'out'], [19.9, 'nov']].map(([v, m]) => `<div style="flex:1;text-align:center;font-size:13px"><div>${v.toFixed(2).replace('.', ',')}</div><div style="height:${(v - 15) * 11}px;background:${m === 'nov' ? 'var(--green)' : '#D9D3C7'};border-radius:5px 5px 0 0"></div>${m}</div>`).join('')}</div></div></div>
  ${bal('TÉO', 'Cinco reais de desconto! Pega dois!', 'left:30px;top:36px;width:340px')}
  ${bal('DONA CIDA', 'Mês passado eu paguei 19,90. Tá aqui na minha nota.', 'left:540px;top:36px;width:390px', 'd')}
`, 'O “de” do cartaz não é o seu preço. Compare com <b>o que você pagou da última vez</b>. O Lugar Certo guarda o preço de cada item da sua nota fiscal.');

// ---- 6. Final ----
const fim = page(`
  ${topo(6)}
  <div class="abs mono" style="left:60px;top:136px;color:var(--muted)">FINAL · O CAIXA</div>
  <div class="abs h" style="left:60px;top:176px;font-size:60px;width:960px">Fui com a lista. <span class="serif" style="font-size:64px">Voltei só com a lista.</span></div>
  <div class="cena" style="background:#EDE7DD;top:270px;height:490px">
    ${carrinho('left:410px;top:250px;width:250px;height:230px', false)}
    ${pers('teo', { bracoD: 'aceno', bracoE: 'baixo', expressao: 'feliz' }, 'left:150px;top:150px;width:270px;height:540px')}
    ${pers('cida', { bracoD: 'cintura', bracoE: 'cintura', expressao: 'feliz', espelhar: true }, 'left:690px;top:160px;width:260px;height:520px')}
    ${bal('DONA CIDA', 'Agora sim. Black Friday de verdade.', 'left:560px;top:30px;width:360px', 'd')}
    <div class="abs" style="left:40px;top:36px;background:#fff;border:3px solid var(--ink);border-radius:20px;padding:14px 20px;z-index:5"><div class="mono" style="font-size:16px;color:var(--muted)">TOTAL DA LISTA</div><div class="h" style="font-size:50px;color:var(--green)">R$ 186,40</div><div style="font-size:16px;color:var(--muted)">dentro do teto · ilustrativo</div></div>
  </div>
  <div class="abs" style="left:60px;right:60px;top:790px;bottom:60px;background:var(--ink);color:#fff;border-radius:36px;padding:38px 40px;display:flex;gap:30px">
    <div style="flex:1">
      <span class="tag">COMO O LUGAR CERTO AJUDA</span>
      <div style="font-size:28px;line-height:1.6;margin-top:20px">
        <div>✓ Lista que <b>soma o total na hora</b></div>
        <div>✓ <b>Histórico de preço</b> de cada nota fiscal</div>
        <div>✓ Lista da casa em <b>tempo real</b></div>
        <div>✓ Você sabe <b>o que comprar e quanto pagar</b></div></div>
      <div style="font-size:22px;opacity:.75;margin-top:14px">14 dias de Premium grátis, sem cartão</div>
    </div>
    <div style="width:250px;flex:none;background:#fff;color:var(--ink);border-radius:24px;padding:20px;text-align:center;align-self:center">
      <div style="width:200px;height:200px;margin:0 auto">${QR}</div>
      <div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:24px;margin-top:10px">aponte a câmera</div>
      <div style="font-size:17px;color:var(--muted)">lugarcerto.tec.br</div></div>
  </div>
`);

render([capa, a1, a2, a3, a4, fim].map((html, i) => ({ html, out: path.join(OUT, `ter-24-comedia-${i + 1}.png`), w: W, h: H })));
