// Gera as artes da semana 48 (23–29/11) com o novo elenco e layouts variados.
// Uso: node design/gerar-semana-48.js
const path = require('path');
const { personagem: P } = require('./personagens');
const render = require('./render');

const OUT = path.join(__dirname, '..', 'semana-48');
const W = 1080, H = 1350;

const BASE = `
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=block" rel="stylesheet">
<style>
:root{--ink:#1F1A17;--cream:#F6F0E4;--butter:#FFD94A;--tomato:#FF5A36;--red:#E8362B;--lilac:#CDB8FF;--navy:#13254A;--lime:#C6F24E;--green:#138A55;--white:#fff}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;font-family:Inter,sans-serif;color:var(--ink);position:relative}
.h{font-family:'Bricolage Grotesque';font-weight:800;letter-spacing:-0.035em;line-height:.92}
.serif{font-family:'Instrument Serif';font-style:italic;font-weight:400;letter-spacing:-0.01em}
.mono{font-family:'DM Mono',monospace}
.abs{position:absolute}
.logo{display:flex;align-items:center;gap:12px;font-family:'Bricolage Grotesque';font-weight:800;font-size:30px;letter-spacing:-0.02em}
.logo i{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;border:3px solid currentColor}
.chip{display:inline-flex;align-items:center;gap:10px;padding:12px 22px;border-radius:999px;border:3px solid var(--ink);font-weight:700;font-size:26px;background:#fff}
.card{background:#fff;border:4px solid var(--ink);border-radius:28px;box-shadow:8px 8px 0 var(--ink)}
.pers{display:block}
</style>`;

const check = (c = 'currentColor') => `<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke="${c}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const logo = (cor = 'var(--ink)') => `<div class="logo" style="color:${cor}"><i>${check(cor)}</i>Lugar Certo</div>`;
const page = (bg, body) => `<!doctype html><html><head><meta charset="utf-8">${BASE}</head><body style="background:${bg}">${body}</body></html>`;
const pers = (id, o, css) => `<div class="abs" style="${css}">${P(id, o)}</div>`;
const dots = (n) => `<div class="abs" style="right:80px;bottom:64px;display:flex;gap:10px">${Array.from({ length: 4 }, (_, i) => `<span style="width:${i === n ? 36 : 12}px;height:12px;border-radius:9px;background:var(--ink);opacity:${i === n ? 1 : .3}"></span>`).join('')}</div>`;

// ---------- 1. Carrossel "cartaz de oferta" (Dona Cida) ----------
const faixa = (txt, bg = 'var(--ink)', fg = 'var(--butter)') => `<div class="abs mono" style="left:0;right:0;top:0;height:64px;background:${bg};color:${fg};font-size:24px;font-weight:500;letter-spacing:.12em;display:flex;align-items:center;white-space:nowrap;overflow:hidden">${(txt + ' ★ ').repeat(8)}</div>`;

const etiqueta = `<div class="abs" style="left:430px;top:600px;width:560px;transform:rotate(-5deg)">
  <div style="background:#fff;border:5px solid var(--ink);border-radius:22px 22px 22px 22px;box-shadow:10px 10px 0 var(--ink);overflow:hidden">
    <div style="background:var(--red);color:#fff;padding:18px 32px;display:flex;justify-content:space-between;align-items:center">
      <span class="h" style="font-size:52px">OFERTA!</span><span class="mono" style="font-size:22px">BLACK FRIDAY</span></div>
    <div style="padding:22px 32px 30px">
      <div class="mono" style="font-size:24px;opacity:.7">CAFÉ TORRADO 500 G</div>
      <div style="display:flex;align-items:baseline;gap:18px;margin-top:6px"><span style="font-size:30px;font-weight:700">de</span><span class="h" style="font-size:64px;text-decoration:line-through;text-decoration-thickness:6px;text-decoration-color:var(--red)">R$ 24,90</span></div>
      <div style="display:flex;align-items:baseline;gap:18px"><span style="font-size:30px;font-weight:700">por</span><span class="h" style="font-size:124px;color:var(--red)">19,90</span></div>
    </div></div>
  <div class="abs" style="left:-26px;top:50%;width:34px;height:34px;border-radius:50%;background:var(--butter);border:5px solid var(--ink)"></div>
</div>`;

const balao = (txt, css, cauda = 'left') => `<div class="abs" style="${css}">
  <div style="background:#fff;border:4px solid var(--ink);border-radius:30px;padding:20px 28px;font-size:34px;font-weight:700;line-height:1.15;box-shadow:6px 6px 0 var(--ink);position:relative">${txt}
  <svg class="abs" style="${cauda === 'left' ? 'left:40px' : 'right:40px'};bottom:-34px" width="44" height="38" viewBox="0 0 44 38"><path d="M2 0 L${cauda === 'left' ? '6 34 L36' : '38 34 L8'} 0" fill="#fff" stroke="#1F1A17" stroke-width="4" stroke-linejoin="round"/><rect x="4" y="-6" width="36" height="8" fill="#fff"/></svg></div></div>`;

const c1s1 = page('var(--butter)', `
  ${faixa('OFERTA DA SEMANA')}
  <div class="abs" style="left:80px;top:110px;right:80px;display:flex;justify-content:space-between;align-items:center">${logo()}<span class="chip">arraste →</span></div>
  <div class="abs h" style="left:80px;top:210px;font-size:118px;width:940px">Esse desconto<br>é <span class="serif" style="font-size:140px;letter-spacing:-.02em">de verdade?</span></div>
  <div class="abs" style="left:80px;top:478px;font-size:36px;font-weight:600;width:620px;line-height:1.25">3 perguntas da Dona Cida antes da Black Friday do mercado (27/11).</div>
  ${etiqueta}
  ${balao('Mês passado eu<br>paguei <u>19,90</u>.', 'left:350px;top:990px', 'left')}
  ${pers('cida', { bracoD: 'aponta', bracoE: 'cintura', expressao: 'desconfiada' }, 'left:10px;top:660px;width:340px;height:680px')}
  ${dots(0)}
`);

const numeral = (n, cor) => `<div class="abs h" style="left:60px;top:150px;font-size:520px;line-height:.8;color:transparent;-webkit-text-stroke:6px ${cor}">${n}</div>`;

const c1s2 = page('var(--cream)', `
  ${faixa('PERGUNTA 1 DE 3', 'var(--butter)', 'var(--ink)')}
  ${numeral('1', 'var(--ink)')}
  <div class="abs h" style="left:360px;top:220px;font-size:104px;width:680px">Eu preciso<br>mesmo disso?</div>
  <div class="abs" style="left:360px;top:470px;font-size:36px;width:620px;line-height:1.3;font-weight:500">Oferta do que você não usa <b>não é economia.</b> É só gasto com cartaz amarelo.</div>
  <div class="abs card" style="left:80px;top:700px;width:650px;padding:36px 40px">
    <div class="mono" style="font-size:22px;letter-spacing:.1em;opacity:.6">CARRINHO DA EMPOLGAÇÃO</div>
    ${[['Maionese “leve 3 pague 2”', 'R$ 23,80'], ['Panetone nº 4 do ano', 'R$ 29,90'], ['Fritadeira que ninguém pediu', 'R$ 199,00']].map(([a, b]) => `<div style="display:flex;justify-content:space-between;gap:20px;white-space:nowrap;font-size:28px;font-weight:600;padding:18px 0;border-bottom:3px dashed #0002;text-decoration:line-through;text-decoration-color:var(--red);text-decoration-thickness:5px"><span>${a}</span><span>${b}</span></div>`).join('')}
    <div style="display:flex;justify-content:space-between;font-size:34px;font-weight:800;padding-top:20px;color:var(--green)"><span>Café 500 g (acabou)</span><span>✓ fica</span></div>
  </div>
  ${pers('cida', { bracoD: 'segura', prop: 'nota', bracoE: 'baixo', expressao: 'piscada' }, 'left:740px;top:720px;width:300px;height:600px')}
  ${dots(1)}
`);

const barras = [['ago', 18.9], ['set', 19.9], ['out', 21.5], ['nov', 19.9]];
const c1s3 = page('var(--navy)', `
  ${faixa('PERGUNTA 2 DE 3', 'var(--lime)', 'var(--ink)')}
  <div class="abs h" style="left:80px;top:130px;font-size:300px;line-height:.8;color:transparent;-webkit-text-stroke:5px var(--lime)">2</div>
  <div class="abs h" style="left:80px;top:400px;font-size:100px;width:920px;color:#fff">Quanto eu paguei<br><span style="color:var(--lime)">da última vez?</span></div>
  <div class="abs" style="left:80px;top:670px;width:920px;height:450px;background:#fff;border-radius:28px;padding:40px 44px;border:4px solid var(--ink)">
    <div style="display:flex;justify-content:space-between"><span class="mono" style="font-size:22px;letter-spacing:.1em;opacity:.6">HISTÓRICO · CAFÉ 500 G</span><span class="mono" style="font-size:22px;opacity:.6">exemplo</span></div>
    <div style="display:flex;align-items:flex-end;gap:34px;height:300px;margin-top:30px">
      ${barras.map(([m, v]) => `<div style="flex:1;text-align:center"><div style="font-weight:700;font-size:28px;margin-bottom:10px">${v.toFixed(2).replace('.', ',')}</div><div style="height:${(v - 14) * 34}px;background:${m === 'nov' ? 'var(--green)' : '#D9D3C7'};border-radius:14px 14px 0 0"></div><div class="mono" style="font-size:24px;margin-top:12px">${m}</div></div>`).join('')}
      <div style="flex:1.3;text-align:center"><div style="font-weight:800;font-size:28px;margin-bottom:10px;color:var(--red)">“por” 19,90</div><div style="height:${(19.9 - 14) * 34}px;background:repeating-linear-gradient(45deg,var(--red) 0 14px,#FF8C80 14px 28px);border-radius:14px 14px 0 0"></div><div class="mono" style="font-size:24px;margin-top:12px">27/11</div></div>
    </div>
  </div>
  <div class="abs" style="left:600px;top:628px;transform:rotate(4deg)"><span class="chip" style="background:var(--lime);font-size:30px">mesmo preço de novembro</span></div>
  <div class="abs" style="left:80px;top:1150px;width:920px;color:#fff;font-size:30px;line-height:1.35">Se o “por” é igual ao que você já pagava, <b style="color:var(--lime)">não é desconto. É só o preço.</b></div>
  <div class="abs" style="left:80px;bottom:56px;display:flex;gap:10px">${[0, 1, 2, 3].map(i => `<span style="width:${i === 2 ? 36 : 12}px;height:12px;border-radius:9px;background:#fff;opacity:${i === 2 ? 1 : .35}"></span>`).join('')}</div>
`);

const pacote = (peso, preco, kg, win) => `<div class="card" style="flex:1;padding:30px;${win ? 'background:var(--lime)' : ''}">
  <div class="mono" style="font-size:22px;letter-spacing:.1em">ARROZ ${peso}</div>
  <div class="h" style="font-size:58px;margin:10px 0 18px;white-space:nowrap">R$ ${preco}</div>
  <div style="border-top:3px dashed #0003;padding-top:16px;font-size:24px;font-weight:600">sai por <b style="font-size:32px;white-space:nowrap">R$ ${kg}</b>/kg</div>
  ${win ? `<div class="chip" style="margin-top:20px;font-size:22px;background:var(--ink);color:#fff;border-color:var(--ink)">mais barato ${check('#fff')}</div>` : `<div class="chip" style="margin-top:20px;font-size:22px;opacity:.5">o “econômico”</div>`}
</div>`;

const c1s4 = page('var(--tomato)', `
  ${faixa('PERGUNTA 3 DE 3')}
  <div class="abs h" style="left:80px;top:120px;font-size:300px;line-height:.8;color:transparent;-webkit-text-stroke:5px var(--ink)">3</div>
  <div class="abs h" style="left:80px;top:390px;font-size:100px;width:940px">Quanto sai o<br>quilo ou o litro?</div>
  <div class="abs" style="left:80px;top:620px;width:640px;display:flex;gap:24px">${pacote('5 KG', '44,90', '8,98', false)}${pacote('1 KG', '8,49', '8,49', true)}</div>
  <div class="abs" style="left:80px;top:1010px;width:560px;font-size:28px;font-weight:600;line-height:1.3">Embalagem maior nem sempre sai mais barata. <span style="opacity:.7">(valores ilustrativos)</span></div>
  <div class="abs" style="left:0;right:0;bottom:0;height:200px;background:var(--ink);color:#fff;padding:36px 80px">
    <div style="font-size:32px;font-weight:700;width:640px;line-height:1.25">Chegue no dia 27 com <span style="color:var(--butter)">seus preços na mão.</span></div>
    <div style="font-size:24px;margin-top:12px;opacity:.85">14 dias de Premium grátis, sem cartão · link na bio</div>
  </div>
  ${pers('cida', { bracoD: 'aceno', bracoE: 'cintura', expressao: 'feliz' }, 'left:740px;top:740px;width:300px;height:600px')}
`);

// ---------- 2. Conversa (Bia & Rafa) ----------
const msg = (txt, eu, hora) => `<div style="display:flex;justify-content:${eu ? 'flex-end' : 'flex-start'};margin:12px 0">
  <div style="max-width:76%;background:${eu ? '#DCF8C6' : '#fff'};border:3px solid var(--ink);border-radius:${eu ? '26px 26px 6px 26px' : '26px 26px 26px 6px'};padding:16px 22px;font-size:31px;font-weight:500;line-height:1.25">${txt}<span class="mono" style="font-size:18px;opacity:.5;margin-left:12px">${hora}</span></div></div>`;
const chat = page('var(--lilac)', `
  <div class="abs" style="left:80px;top:72px;right:80px;display:flex;justify-content:space-between;align-items:center">${logo()}<span class="chip">marque quem vai junto</span></div>
  <div class="abs h" style="left:80px;top:170px;font-size:90px;width:960px">A lista é da casa.<br><span class="serif" style="font-size:92px;white-space:nowrap">Não do grupo da família.</span></div>
  <div class="abs card" style="left:80px;top:420px;width:920px;padding:0;overflow:hidden">
    <div style="background:var(--ink);color:#fff;padding:18px 28px;display:flex;align-items:center;gap:16px;font-size:28px;font-weight:700"><span style="width:44px;height:44px;border-radius:50%;background:var(--butter);display:inline-block"></span>Bia 💛<span class="mono" style="font-size:20px;opacity:.6;font-weight:400">online</span></div>
    <div style="padding:20px 28px 26px;background:#F3EEE6">
      ${msg('tô no mercado. qual leite?', true, '18:42')}
      ${msg('o de sempre', false, '18:43')}
      ${msg('QUAL é o de sempre 😩', true, '18:43')}
      ${msg('🎤 áudio · 2:47', false, '18:44')}
    </div>
  </div>
  <div class="abs" style="left:150px;top:925px;width:780px;transform:rotate(-2deg)">
    <div style="background:var(--green);color:#fff;border:4px solid var(--ink);border-radius:24px;padding:22px 28px;box-shadow:8px 8px 0 var(--ink);display:flex;gap:18px;align-items:center">
      <span style="width:54px;height:54px;border-radius:14px;background:#fff;display:grid;place-items:center;flex:none">${check('#138A55')}</span>
      <div><div style="font-size:30px;font-weight:800">Bia adicionou Leite integral 1 L</div><div style="font-size:22px;opacity:.9;margin-top:4px">apareceu na hora no celular do Rafa · Lugar Certo</div></div>
    </div>
  </div>
  ${pers('bia', { bracoD: 'celular', prop: 'celular', expressao: 'piscada' }, 'left:30px;top:1060px;width:300px;height:600px')}
  ${pers('rafa', { bracoD: 'aceno', propE: 'sacola', expressao: 'surpresa' }, 'left:760px;top:1060px;width:300px;height:600px')}
  <div class="abs" style="left:340px;top:1150px;width:400px;text-align:center;font-size:26px;font-weight:600;line-height:1.3">Sem áudio, sem print.<br>No Premium, 1 pessoa usa junto.</div>
`);

// ---------- 3. Nota fiscal / checklist ----------
const linha = (a, b) => `<div style="display:flex;gap:10px;font-size:30px;margin:14px 0;align-items:baseline"><span style="width:34px;height:34px;border:3px solid var(--ink);border-radius:6px;display:inline-block;flex:none;transform:translateY(6px)"></span><span style="white-space:nowrap">${a}</span><span style="flex:1;border-bottom:3px dotted #0005;transform:translateY(-8px)"></span><span>${b}</span></div>`;
const serrilha = (pos) => `<div class="abs" style="left:0;right:0;${pos}:-22px;height:24px;background:radial-gradient(circle at 18px ${pos === 'top' ? '0' : '24px'},transparent 16px,#FFFDF8 17px) 0 0/36px 24px"></div>`;
const nota = page('var(--tomato)', `
  <div class="abs" style="left:80px;top:64px;right:80px;display:flex;justify-content:space-between;align-items:center">${logo('#fff')}<span class="chip">salve 📌</span></div>
  <div class="abs" style="left:110px;top:160px;width:720px;transform:rotate(-2.2deg)">
    <div style="background:#FFFDF8;padding:46px 50px 40px;position:relative;box-shadow:14px 14px 0 #0003">
      ${serrilha('bottom')}
      <div class="mono" style="text-align:center;font-size:22px;letter-spacing:.08em;line-height:1.5">SUPERMERCADO DA SUA CASA<br>CUPOM DE CONFERÊNCIA · 27/11</div>
      <div style="border-top:3px dashed var(--ink);margin:22px 0"></div>
      <div class="h" style="font-size:78px;line-height:.95">Checklist da<br>Black Friday<br><span class="serif" style="font-size:88px">do mercado</span></div>
      <div style="border-top:3px dashed var(--ink);margin:24px 0 8px"></div>
      <div class="mono">
        ${linha('FIZ A LISTA ANTES', 'OK')}
        ${linha('ANOTEI O QUE PAGUEI', 'OK')}
        ${linha('COMPAREI POR KG/L', 'OK')}
        ${linha('DEFINI UM TETO', 'R$ ___')}
        ${linha('SÓ PEGUEI O QUE USO', 'OK')}
        ${linha('CONFERI A NOTA', 'OK')}
      </div>
      <div style="border-top:3px dashed var(--ink);margin:22px 0 16px"></div>
      <div class="mono" style="display:flex;justify-content:space-between;font-size:34px;font-weight:500"><span>TOTAL</span><span>R$ 0,00</span></div>
      <div class="mono" style="text-align:right;font-size:22px;margin-top:4px">de arrependimento</div>
      <div style="margin-top:26px;display:flex;gap:4px;height:56px">${Array.from({ length: 52 }, (_, i) => `<span style="flex:${[1, 2, 1, 3, 1, 1, 2][i % 7]};background:${i % 2 ? 'transparent' : 'var(--ink)'}"></span>`).join('')}</div>
    </div>
  </div>
  ${pers('cida', { bracoD: 'segura', prop: 'caneta', bracoE: 'cintura', expressao: 'feliz' }, 'left:770px;top:800px;width:290px;height:580px')}
  <div class="abs" style="left:840px;top:620px;transform:rotate(8deg);width:190px;height:190px;border-radius:50%;background:var(--butter);border:4px solid var(--ink);display:grid;place-items:center;text-align:center;font-weight:800;font-size:28px;line-height:1.1">mande pra<br>quem vai<br>junto</div>
`);

// ---------- 4. Black Friday é hoje (Téo) ----------
const etq = (p, n, cor) => `<div style="width:190px;background:${cor};border:4px solid var(--ink);border-radius:12px;padding:12px 14px;text-align:left"><div class="mono" style="font-size:18px">${n}</div><div class="h" style="font-size:46px">${p}</div></div>`;
const hoje = page('var(--navy)', `
  <div class="abs" style="inset:0;background:radial-gradient(circle at 80% 20%,#2A4A8A 0,transparent 55%)"></div>
  <div class="abs" style="left:80px;top:72px;right:80px;display:flex;justify-content:space-between;align-items:center">${logo('#fff')}<span class="chip" style="background:var(--lime)">sex · 27/11</span></div>
  <div class="abs h" style="left:66px;top:150px;font-size:330px;color:var(--lime);letter-spacing:-.06em">HOJE</div>
  <div class="abs h" style="left:80px;top:470px;font-size:84px;color:#fff;width:920px">é a Black Friday<br>do mercado.</div>
  <div class="abs" style="left:80px;top:680px;width:560px;color:#fff">
    ${[['Abre a lista', 'nada de ir de cabeça'], ['Abre o histórico', 'o “de” do cartaz não é o que você pagava'], ['Escaneia a nota', 'ali no caixa, antes de sair']].map(([a, b], i) => `<div style="display:flex;gap:22px;align-items:flex-start;margin-bottom:30px"><span class="h" style="flex:none;width:64px;height:64px;border-radius:50%;background:var(--lime);color:var(--ink);display:grid;place-items:center;font-size:38px">${i + 1}</span><div><div style="font-size:40px;font-weight:800">${a}</div><div style="font-size:26px;opacity:.8;margin-top:4px">${b}</div></div></div>`).join('')}
  </div>
  ${pers('teo', { bracoD: 'celular', prop: 'celular', bracoE: 'cintura', expressao: 'surpresa' }, 'left:660px;top:640px;width:340px;height:680px')}
  <div class="abs" style="left:0;right:0;bottom:0;height:160px;background:#0C1A36;border-top:10px solid #C9A66B"></div>
  <div class="abs" style="left:80px;bottom:40px;display:flex;gap:22px">${etq('9,90', 'LEITE 1 L', '#fff')}${etq('19,90', 'CAFÉ 500 G', 'var(--butter)')}${etq('8,49', 'ARROZ 1 KG', '#fff')}</div>
  <div class="abs" style="left:80px;top:1080px;color:var(--lime);font-size:24px;font-weight:600">Histórico e nota fiscal: Premium · 14 dias grátis, sem cartão</div>
`);

// ---------- 5. 13º: antes x depois (Téo) ----------
const split = page('var(--cream)', `
  <div class="abs" style="left:0;right:0;top:0;height:675px;background:var(--tomato)"></div>
  <div class="abs" style="left:0;right:0;top:675px;height:675px;background:var(--green)"></div>
  <div class="abs" style="left:80px;top:64px">${logo('#fff')}</div>
  <div class="abs mono" style="left:80px;top:150px;font-size:24px;letter-spacing:.12em;color:#fff">PLANO A</div>
  <div class="abs h" style="left:80px;top:190px;font-size:104px;width:600px;color:#fff">13º caiu.<br><span class="serif" style="font-size:96px">“Agora dá<br>pra tudo.”</span></div>
  <div class="abs" style="left:80px;top:560px;color:#fff;font-size:28px;font-weight:600">dia 15 de dezembro: 🫠</div>
  ${pers('teo', { bracoD: 'aceno', propE: 'sacola', expressao: 'feliz' }, 'left:700px;top:80px;width:300px;height:600px')}
  <div class="abs" style="left:490px;top:625px;width:100px;height:100px;border-radius:50%;background:var(--butter);border:4px solid var(--ink);display:grid;place-items:center;font-family:'Bricolage Grotesque';font-weight:800;font-size:40px;z-index:2">vs</div>
  <div class="abs mono" style="left:80px;top:760px;font-size:24px;letter-spacing:.12em;color:#fff">PLANO B</div>
  <div class="abs h" style="left:80px;top:800px;font-size:72px;width:560px;color:#fff">13º caiu. Já sei<br>pra onde vai.</div>
  <div class="abs card" style="left:80px;top:990px;width:560px;padding:26px 30px">
    ${[['Mercado do mês', 45, 'var(--green)'], ['Contas', 35, 'var(--butter)'], ['Guardar', 20, 'var(--lilac)']].map(([a, p, c]) => `<div style="margin:6px 0 14px"><div style="display:flex;justify-content:space-between;font-size:26px;font-weight:700"><span>${a}</span><span>${p}%</span></div><div style="height:18px;background:#EEE8DD;border-radius:9px;margin-top:8px"><div style="width:${p * 2}%;height:100%;background:${c};border-radius:9px;border:2px solid var(--ink)"></div></div></div>`).join('')}
    <div class="mono" style="font-size:18px;opacity:.55">exemplo ilustrativo</div>
  </div>
  ${pers('teo', { bracoD: 'celular', prop: 'celular', bracoE: 'cintura', expressao: 'piscada' }, 'left:700px;top:745px;width:300px;height:600px')}
  <div class="abs" style="right:60px;top:700px;transform:rotate(4deg)"><span class="chip" style="background:var(--lime);font-size:24px">grátis, pelo site</span></div>
`);

// ---------- 6. Qual é você no mercado? (elenco) ----------
const cardPers = (letra, id, o, titulo, sub, bg) => `<div style="background:${bg};border:4px solid var(--ink);border-radius:30px;position:relative;overflow:hidden;height:440px;box-shadow:8px 8px 0 var(--ink)">
  <div class="h" style="position:absolute;left:26px;top:20px;width:66px;height:66px;border-radius:50%;background:#fff;border:4px solid var(--ink);display:grid;place-items:center;font-size:40px">${letra}</div>
  <div style="position:absolute;right:-46px;top:30px;width:250px;height:420px">${P(id, { ...o, recorte: '40 20 220 370' })}</div>
  <div style="position:absolute;left:26px;bottom:26px;width:210px"><div class="h" style="font-size:42px;line-height:1">${titulo}</div><div style="font-size:22px;font-weight:600;margin-top:8px;line-height:1.25">${sub}</div></div>
</div>`;
const quiz = page('var(--cream)', `
  <div class="abs" style="left:80px;top:64px;right:80px;display:flex;justify-content:space-between;align-items:center">${logo()}<span class="chip" style="background:var(--butter)">comenta a letra 👇</span></div>
  <div class="abs h" style="left:80px;top:150px;font-size:108px;width:940px">Qual é você<br><span class="serif" style="font-size:122px">no mercado?</span></div>
  <div class="abs" style="left:80px;top:420px;width:920px;display:grid;grid-template-columns:1fr 1fr;gap:28px">
    ${cardPers('A', 'cida', { bracoD: 'segura', prop: 'nota', expressao: 'desconfiada' }, 'Dona Cida', 'sabe o preço de tudo de cabeça', 'var(--lilac)')}
    ${cardPers('B', 'teo', { bracoD: 'aceno', propE: 'sacola', expressao: 'surpresa' }, 'Téo', 'foi pelo pão, voltou sem o pão', 'var(--butter)')}
    ${cardPers('C', 'bia', { bracoD: 'celular', prop: 'celular', expressao: 'piscada' }, 'Bia', 'faz a lista da casa inteira', '#FF9B85')}
    ${cardPers('D', 'rafa', { bracoD: 'celular', prop: 'celular', expressao: 'preocupada' }, 'Rafa', 'liga do corredor: “qual leite?”', 'var(--lime)')}
  </div>
`);

const jobs = [
  ['seg-23-carrossel-1.png', c1s1], ['seg-23-carrossel-2.png', c1s2], ['seg-23-carrossel-3.png', c1s3], ['seg-23-carrossel-4.png', c1s4],
  ['qua-25-lista-da-casa.png', chat], ['qui-26-checklist-black-friday.png', nota], ['sex-27-hoje-black-friday.png', hoje],
  ['sab-28-13-salario.png', split], ['dom-29-qual-e-voce.png', quiz],
].map(([f, html]) => ({ html, out: path.join(OUT, f), w: W, h: H }));

const so = process.argv[2];
render(so ? jobs.filter(j => j.out.includes(so)) : jobs);
