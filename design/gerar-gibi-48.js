// Tirinha em linguagem de gibi (elenco próprio do Lugar Certo): "A Black Fraude".
// Uso: node design/gerar-gibi-48.js
const fs = require('fs'), path = require('path');
const { personagem: P } = require('./personagens');
const render = require('./render');

const OUT = path.join(__dirname, '..', 'semana-48');
const W = 1080, H = 1350;
const QR = fs.readFileSync(path.join(__dirname, 'qr-semana48.svg'), 'utf8').replace('<svg', '<svg width="100%" height="100%"');

const CSS = `
<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@700&family=Bricolage+Grotesque:opsz,wght@12..96,800&family=DM+Mono:wght@500&display=block" rel="stylesheet">
<style>
:root{--ink:#1F1A17;--butter:#FFD94A;--tomato:#FF5A36;--red:#E8362B;--lilac:#CDB8FF;--navy:#13254A;--lime:#C6F24E;--green:#138A55;--sky:#8FD3FF;--paper:#FFF8EA}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;background:var(--paper);font-family:'Comic Neue',sans-serif;color:var(--ink);position:relative}
.abs{position:absolute}
.bang{font-family:'Bangers';letter-spacing:.04em;font-weight:400}
.painel{position:absolute;border:7px solid var(--ink);overflow:hidden;background:var(--bg,#fff)}
.ret{background-image:radial-gradient(#0000001f 22%,transparent 24%);background-size:18px 18px}
.leg{position:absolute;background:var(--butter);border:5px solid var(--ink);padding:10px 18px;font-family:'Bangers';font-size:34px;letter-spacing:.04em;z-index:5}
.bal{position:absolute;background:#fff;border:5px solid var(--ink);border-radius:50%/44%;padding:30px 38px;font-size:36px;line-height:1.12;text-align:center;z-index:6}
.bal:after{content:'';position:absolute;width:38px;height:44px;background:#fff;border-right:5px solid var(--ink);border-bottom:5px solid var(--ink);bottom:-26px;left:var(--cx,40%);transform:skewX(var(--sk,30deg)) rotate(40deg)}
.grito{position:absolute;z-index:6;padding:56px 60px;background:#fff;font-family:'Bangers';font-size:50px;letter-spacing:.03em;text-align:center;line-height:1;clip-path:polygon(50% 0,58% 12%,72% 3%,74% 18%,92% 12%,86% 30%,100% 38%,88% 50%,100% 62%,85% 70%,92% 88%,74% 82%,70% 98%,57% 86%,46% 100%,40% 85%,24% 96%,24% 79%,6% 86%,13% 68%,0 58%,12% 47%,1% 34%,16% 28%,9% 10%,28% 16%,32% 2%,42% 14%)}
.sfx{position:absolute;font-family:'Bangers';color:var(--butter);-webkit-text-stroke:5px var(--ink);paint-order:stroke fill;text-shadow:6px 6px 0 var(--ink);z-index:7;letter-spacing:.03em}
.topo{position:absolute;left:40px;right:40px;top:26px;display:flex;justify-content:space-between;font-family:'Bangers';font-size:30px;letter-spacing:.08em}
</style>`;
const page = (body, pag) => `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body>
  <div class="topo"><span>GIBI LUGAR CERTO · Nº 1</span><span>${pag}</span></div>${body}</body></html>`;
const pers = (id, o, css) => `<div class="abs" style="${css}">${P(id, o)}</div>`;
// painéis: dois por página
const P1 = 'left:40px;top:80px;width:1000px;height:600px';
const P2 = 'left:40px;top:704px;width:1000px;height:600px';
const etiqueta = (de, por, css) => `<div class="abs" style="${css}"><div style="background:#fff;border:6px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:8px 8px 0 var(--ink)">
  <div style="background:var(--red);color:#fff;padding:10px 20px" class="bang"><span style="font-size:44px">OFERTA!</span></div>
  <div style="padding:10px 20px 16px;font-family:'Bricolage Grotesque';font-weight:800">${de ? `<div style="font-size:36px;text-decoration:line-through;text-decoration-color:var(--red);text-decoration-thickness:6px">de ${de}</div>` : ''}<div style="font-size:76px;color:var(--red);line-height:1">${por}</div></div></div></div>`;
const carrinho = (itens, css) => `<div class="abs" style="${css}"><svg viewBox="0 0 400 330" width="100%" height="100%">
  <g stroke="#1F1A17" stroke-width="8" stroke-linejoin="round" stroke-linecap="round">
  ${itens.map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${c}"/>`).join('')}
  <path d="M10 40 h50 l40 200 h240 l40 -150 h-300" fill="none"/><path d="M90 90 h290 l-30 140 h-230 Z" fill="#B9C3CF" fill-opacity=".55"/>
  <circle cx="130" cy="290" r="24" fill="#fff"/><circle cx="310" cy="290" r="24" fill="#fff"/></g></svg></div>`;

// ---- Capa ----
const capa = `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body style="background:var(--red)">
  <div class="abs ret" style="inset:0;background-color:var(--red);background-image:radial-gradient(#ffffff30 24%,transparent 26%)"></div>
  <div class="abs" style="left:40px;right:40px;top:40px;display:flex;justify-content:space-between;align-items:flex-start">
    <div style="background:var(--butter);border:6px solid var(--ink);padding:12px 22px;box-shadow:8px 8px 0 var(--ink)"><div class="bang" style="font-size:34px">GIBI LUGAR CERTO</div><div style="font-size:22px">edição Black Friday</div></div>
    <div style="background:#fff;border:6px solid var(--ink);padding:10px 18px;text-align:center;transform:rotate(4deg)"><div class="bang" style="font-size:26px">Nº 1</div><div class="bang" style="font-size:22px">NOV · 2026</div></div></div>
  <div class="abs bang" style="left:40px;top:200px;width:1000px;text-align:center;font-size:96px;color:#fff;-webkit-text-stroke:6px var(--ink);paint-order:stroke fill;text-shadow:8px 8px 0 var(--ink);line-height:.95">O PESSOAL DO MERCADO EM</div>
  <div class="abs bang" style="left:20px;top:300px;width:1040px;text-align:center;font-size:230px;color:var(--butter);-webkit-text-stroke:10px var(--ink);paint-order:stroke fill;text-shadow:12px 12px 0 var(--ink);line-height:.9;transform:rotate(-3deg)">A BLACK<br>FRAUDE!</div>
  ${etiqueta('24,90', '19,90', 'left:60px;top:780px;width:300px;transform:rotate(-12deg)')}
  ${pers('teo', { bracoD: 'aceno', propE: 'sacola', expressao: 'surpresa' }, 'left:320px;top:720px;width:320px;height:640px')}
  ${pers('cida', { bracoD: 'aponta', bracoE: 'cintura', expressao: 'desconfiada', espelhar: true }, 'left:650px;top:790px;width:300px;height:600px')}
  <div class="grito" style="left:700px;top:660px;width:340px;font-size:38px;background:var(--lime)">CONFERE ANTES,<br>MEU FILHO!</div>
  <div class="abs" style="left:40px;bottom:40px;background:#fff;border:5px solid var(--ink);padding:10px 18px;font-size:26px;transform:rotate(-2deg)">arraste pra ler →</div>
</body></html>`;

// ---- Página 2 ----
const pg2 = page(`
  <div class="painel ret" style="${P1};--bg:var(--sky)">
    <div class="leg" style="left:-6px;top:-6px">QUINTA, 23H59. NO MERCADO…</div>
    <div class="abs" style="left:0;right:0;bottom:0;height:150px;background:#C9A66B;border-top:7px solid var(--ink)"></div>
    ${etiqueta('', '19,90', 'left:110px;top:170px;width:290px;transform:rotate(-4deg)')}
    <div class="abs bang" style="left:420px;top:250px;font-size:120px">➜</div>
    ${etiqueta('24,90', '19,90', 'left:560px;top:130px;width:320px;transform:rotate(3deg)')}
    <div class="sfx" style="left:630px;top:440px;font-size:100px;transform:rotate(-8deg)">TCHANAN!</div>
    <div class="abs" style="left:40px;top:500px;font-size:28px;background:#fff;border:4px solid var(--ink);padding:6px 14px;transform:rotate(-3deg);z-index:6">o mesmo preço… com um “de” na frente 🙃</div>
  </div>
  <div class="painel ret" style="${P2};--bg:var(--butter)">
    <div class="leg" style="left:-6px;top:-6px">SEXTA, 8H. O TÉO CHEGA.</div>
    ${pers('teo', { bracoD: 'aceno', bracoE: 'cintura', expressao: 'surpresa' }, 'left:620px;top:140px;width:340px;height:680px')}
    <div class="grito" style="left:60px;top:110px;width:560px;font-size:58px">24,90 POR 19,90?!<br>LEVA TUDO!!!</div>
    <div class="sfx" style="left:70px;top:430px;font-size:120px;transform:rotate(-6deg)">ZUUUM!</div>
  </div>`, 'PÁG. 2');

// ---- Página 3 ----
const pg3 = page(`
  <div class="painel ret" style="${P1};--bg:var(--lilac)">
    ${carrinho([[110, 20, 70, 90, '#FFD94A'], [190, 0, 60, 110, '#FF5A36'], [260, 30, 90, 80, '#8FD3FF'], [120, 60, 220, 50, '#C6F24E'], [100, -30, 80, 90, '#fff'], [230, -50, 70, 110, '#E8362B']], 'left:520px;top:200px;width:440px;height:360px')}
    ${pers('teo', { bracoD: 'segura', bracoE: 'baixo', expressao: 'feliz' }, 'left:250px;top:250px;width:300px;height:600px')}
    <div class="bal" style="left:40px;top:60px;width:520px;--cx:62%">Maionese “leve 3 pague 2”… <br>eu nem gosto de maionese. 🤷</div>
    <div class="sfx" style="left:30px;top:500px;font-size:70px;transform:rotate(-8deg)">PLIM! PLIM!</div>
  </div>
  <div class="painel ret" style="${P2};--bg:#FFB8A8">
    ${pers('cida', { bracoD: 'segura', prop: 'nota', bracoE: 'cintura', expressao: 'desconfiada', espelhar: true }, 'left:40px;top:120px;width:340px;height:680px')}
    ${pers('teo', { bracoD: 'baixo', bracoE: 'baixo', expressao: 'surpresa' }, 'left:700px;top:160px;width:300px;height:600px')}
    <div class="bal" style="left:300px;top:50px;width:470px;--cx:18%;--sk:-30deg">Téo, mês passado esse café era <b style="color:var(--red)">19,90</b>. Tá na minha nota.</div>
    <div class="sfx" style="left:380px;top:400px;font-size:120px;transform:rotate(-5deg)">PLOFT!</div>
  </div>`, 'PÁG. 3');

// ---- Página 4 ----
const pg4 = page(`
  <div class="painel ret" style="${P1};--bg:var(--lime)">
    ${pers('cida', { bracoD: 'celular', bracoE: 'cintura', expressao: 'piscada' }, 'left:30px;top:150px;width:320px;height:640px')}
    <div class="abs" style="left:380px;top:200px;width:300px;height:360px;background:var(--ink);border-radius:36px;padding:16px;transform:rotate(-4deg);z-index:4">
      <div style="background:#fff;border-radius:24px;height:100%;padding:18px;font-family:'Bricolage Grotesque';font-weight:800">
        <div style="font-size:20px;color:var(--green)">HISTÓRICO · CAFÉ 500 G</div>
        <div style="display:flex;align-items:flex-end;gap:10px;height:170px;margin-top:20px">${[[18.9, 'ago'], [19.9, 'set'], [21.5, 'out'], [19.9, 'nov']].map(([v, m]) => `<div style="flex:1;text-align:center;font-size:18px"><div>${v.toFixed(2).replace('.', ',')}</div><div style="height:${(v - 15) * 22}px;background:${m === 'nov' ? 'var(--green)' : '#D9D3C7'};border-radius:8px 8px 0 0;margin-top:4px"></div><div>${m}</div></div>`).join('')}</div>
        <div style="margin-top:20px;font-size:22px;background:var(--lime);border-radius:12px;padding:8px 10px;text-align:center">“por 19,90” = mesmo preço</div>
      </div></div>
    <div class="bal" style="left:620px;top:60px;width:350px;--cx:12%;--sk:-30deg">Cada nota que eu escaneio vira histórico. Tá tudo aqui.</div>
    <div class="sfx" style="left:720px;top:430px;font-size:90px;transform:rotate(6deg)">BIP!</div>
  </div>
  <div class="painel ret" style="${P2};--bg:var(--navy)">
    ${pers('teo', { bracoD: 'baixo', bracoE: 'cintura', expressao: 'preocupada' }, 'left:60px;top:260px;width:300px;height:600px')}
    ${pers('cida', { bracoD: 'aponta', bracoE: 'cintura', expressao: 'desconfiada', espelhar: true }, 'left:660px;top:130px;width:320px;height:640px')}
    <div class="bal" style="left:70px;top:40px;width:330px;--cx:30%">Então o desconto é…</div>
    <div class="grito" style="left:360px;top:60px;width:420px;font-size:56px;background:var(--butter)">BLACK<br>FRAUDE,<br>MEU FILHO!</div>
  </div>`, 'PÁG. 4');

// ---- Página 5: final + o que o Lugar Certo faz ----
const pg5 = page(`
  <div class="painel ret" style="left:40px;top:80px;width:1000px;height:560px;--bg:var(--sky)">
    <div class="leg" style="left:-6px;top:-6px">MINUTOS DEPOIS…</div>
    ${carrinho([[150, 60, 80, 50, '#C6F24E'], [240, 40, 60, 70, '#FFD94A']], 'left:540px;top:210px;width:400px;height:330px')}
    ${pers('teo', { bracoD: 'aceno', bracoE: 'baixo', expressao: 'feliz' }, 'left:220px;top:240px;width:300px;height:600px')}
    <div class="bal" style="left:40px;top:70px;width:440px;--cx:58%">Levei só o que tava na lista. E o que tava barato <u>de verdade</u>.</div>
    <div class="abs" style="left:600px;top:70px;background:#fff;border:6px solid var(--ink);padding:16px 22px;transform:rotate(4deg);z-index:6;box-shadow:8px 8px 0 var(--ink)">
      <div class="bang" style="font-size:30px">ECONOMIA DO DIA</div><div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:64px;color:var(--green)">R$ 87,40</div><div style="font-size:18px">valor ilustrativo</div></div>
  </div>
  <div class="abs" style="left:40px;top:664px;width:1000px;height:640px;background:var(--ink);color:#fff;border:7px solid var(--ink);padding:36px 40px">
    <div class="bang" style="font-size:54px;color:var(--butter)">MORAL DA HISTÓRIA:</div>
    <div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:58px;line-height:1;letter-spacing:-.02em;margin-top:6px">Desconto bom é o que<br>você confere.</div>
    <div style="margin-top:28px;font-size:31px;line-height:1.5;width:560px">
      ✅ histórico de preço de cada compra<br>✅ lista que soma o total na hora<br>✅ nota fiscal escaneada no caixa<br>✅ lista da casa, em tempo real</div>
    <div class="abs" style="right:40px;top:200px;width:330px;background:#fff;color:var(--ink);border-radius:24px;padding:22px;text-align:center">
      <div style="width:250px;height:250px;margin:0 auto">${QR}</div>
      <div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:30px;margin-top:12px">aponte a câmera</div>
      <div style="font-size:22px">e baixe grátis · lugarcerto.tec.br</div></div>
    <div class="abs" style="left:40px;bottom:30px;font-size:24px;opacity:.85">14 dias de Premium grátis, sem cartão</div>
  </div>`, 'PÁG. 5');

render([['ter-24-gibi-1.png', capa], ['ter-24-gibi-2.png', pg2], ['ter-24-gibi-3.png', pg3], ['ter-24-gibi-4.png', pg4], ['ter-24-gibi-5.png', pg5]]
  .map(([f, html]) => ({ html, out: path.join(OUT, f), w: W, h: H })));
