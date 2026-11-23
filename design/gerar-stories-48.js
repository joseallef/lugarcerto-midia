// Stories animados (1080x1920, MP4) da semana 48 com o elenco.
// Renderiza quadro a quadro (animações CSS controladas pelo tempo) e codifica com ffmpeg.
// Uso: node design/gerar-stories-48.js [filtro]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { personagem: P } = require('./personagens');

const OUT = path.join(__dirname, '..', 'semana-48', 'stories');
const W = 1080, H = 1920, FPS = 30, DUR = 12;
const QR = fs.readFileSync(path.join(__dirname, 'qr-semana48.svg'), 'utf8').replace('<svg', '<svg width="100%" height="100%"');

const CSS = `
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=block" rel="stylesheet">
<style>
:root{--ink:#1F1A17;--cream:#F6F0E4;--butter:#FFD94A;--tomato:#FF5A36;--red:#E8362B;--lilac:#CDB8FF;--navy:#13254A;--lime:#C6F24E;--green:#138A55}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;overflow:hidden;font-family:Inter,sans-serif;color:var(--ink);position:relative}
.h{font-family:'Bricolage Grotesque';font-weight:800;letter-spacing:-.035em;line-height:.92}
.serif{font-family:'Instrument Serif';font-style:italic;font-weight:400}
.mono{font-family:'DM Mono',monospace}
.abs{position:absolute}
.card{background:#fff;border:5px solid var(--ink);border-radius:32px;box-shadow:10px 10px 0 var(--ink)}
.chip{display:inline-flex;align-items:center;gap:10px;padding:14px 26px;border-radius:999px;border:4px solid var(--ink);font-weight:800;font-size:34px;background:#fff}
.logo{display:flex;align-items:center;gap:14px;font-family:'Bricolage Grotesque';font-weight:800;font-size:38px}
.logo i{width:50px;height:50px;border-radius:13px;display:grid;place-items:center;border:4px solid currentColor}
@keyframes pop{0%{transform:scale(0) rotate(var(--r,0deg));opacity:0}60%{transform:scale(1.12) rotate(var(--r,0deg));opacity:1}100%{transform:scale(1) rotate(var(--r,0deg));opacity:1}}
@keyframes up{0%{transform:translateY(160px);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes down{0%{transform:translateY(-900px) rotate(-14deg)}55%{transform:translateY(30px) rotate(6deg)}75%{transform:translateY(-10px) rotate(-3deg)}100%{transform:translateY(0) rotate(-4deg)}}
@keyframes fromL{0%{transform:translateX(-700px)}70%{transform:translateX(30px)}100%{transform:translateX(0)}}
@keyframes fromR{0%{transform:translateX(700px)}70%{transform:translateX(-30px)}100%{transform:translateX(0)}}
@keyframes out{to{opacity:0;transform:scale(.9)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes wig{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes stamp{0%{transform:scale(3.2) rotate(-12deg);opacity:0}70%{transform:scale(.92) rotate(-12deg);opacity:1}100%{transform:scale(1) rotate(-12deg);opacity:1}}
@keyframes shake{0%,100%{transform:translate(0)}20%{transform:translate(-14px,6px)}40%{transform:translate(12px,-8px)}60%{transform:translate(-8px,4px)}80%{transform:translate(6px,-2px)}}
@keyframes draw{from{width:0}}
@keyframes grow{from{transform:scaleX(0)}}
@keyframes marquee{to{transform:translateX(-50%)}}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes show{from{opacity:0}to{opacity:1}}
@keyframes hide{to{opacity:0}}
@keyframes fall{from{transform:translateY(-300px) rotate(0)}to{transform:translateY(2300px) rotate(540deg)}}
@keyframes print{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes zoom{0%{transform:scale(4);opacity:0}60%{transform:scale(.95);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes glow{0%,100%{text-shadow:0 0 0 transparent}50%{text-shadow:0 0 60px #C6F24E}}
@keyframes flip{0%{transform:rotateX(0)}50%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes dots{0%,100%{opacity:.25}50%{opacity:1}}
</style>`;

const check = (c = 'currentColor', s = 28) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke="${c}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const logo = (c = 'var(--ink)') => `<div class="logo" style="color:${c}"><i>${check(c)}</i>Lugar Certo</div>`;
// a(css de posição, animações, conteúdo)
const a = (css, anim, html) => `<div class="abs" style="${css};animation:${anim}">${html}</div>`;
const pop = (d) => `pop .55s ${d}s cubic-bezier(.2,1.3,.4,1) both`;
const up = (d) => `up .6s ${d}s cubic-bezier(.2,1.2,.4,1) both`;
const out = (d) => `out .4s ${d}s forwards`;
const page = (bg, body) => `<!doctype html><html><head><meta charset="utf-8">${CSS}</head><body style="background:${bg}">${body}</body></html>`;

// Painel final com QR Code (sobe aos 8,6 s)
const final = (titulo, sub, bg = '#fff', d = 8.6) => a(`left:60px;right:60px;bottom:300px;z-index:10`, up(d), `
  <div class="card" style="background:${bg};padding:34px;display:flex;gap:30px;align-items:center">
    <div style="width:230px;height:230px;flex:none;background:#fff;padding:12px;border-radius:18px;border:4px solid var(--ink)">${QR}</div>
    <div><div class="h" style="font-size:54px">${titulo}</div><div style="font-size:30px;font-weight:600;margin-top:12px;line-height:1.25">${sub}</div>
    <div class="mono" style="font-size:26px;margin-top:14px">lugarcerto.tec.br</div></div>
  </div>`);
const topo = (c) => a('left:60px;top:150px', `show .4s 0s both`, logo(c));

// ---------- 1. Dona Cida investiga o desconto ----------
const s1 = page('var(--butter)', `
  <div class="abs mono" style="left:0;top:250px;height:72px;width:4000px;background:var(--ink);color:var(--butter);font-size:28px;letter-spacing:.12em;display:flex;align-items:center;white-space:nowrap;animation:marquee 8s linear infinite">${'OFERTA DA SEMANA ★ '.repeat(30)}</div>
  ${topo('var(--ink)')}
  ${a('left:60px;top:370px;width:960px', `${pop(0.2)}, ${out(6.0)}`, `<div class="h" style="font-size:112px">Black Friday<br><span class="serif" style="font-size:124px">chegando…</span></div>`)}
  ${a('left:250px;top:660px;width:740px', `down 1.1s .8s cubic-bezier(.3,1,.5,1) both, shake .35s 5.3s, ${out(8.2)}`, `
    <div style="background:#fff;border:6px solid var(--ink);border-radius:26px;box-shadow:12px 12px 0 var(--ink);overflow:hidden;position:relative">
      <div style="background:var(--red);color:#fff;padding:22px 36px;display:flex;justify-content:space-between;align-items:center"><span class="h" style="font-size:68px">OFERTA!</span><span class="mono" style="font-size:26px">CAFÉ 500 G</span></div>
      <div style="padding:26px 36px 36px">
        <div style="display:flex;align-items:baseline;gap:20px"><span style="font-size:38px;font-weight:700">de</span><span class="h" style="font-size:84px;position:relative">R$ 24,90<span style="position:absolute;left:0;top:48%;height:9px;background:var(--red);width:100%;animation:draw .5s 2s both"></span></span></div>
        <div style="display:flex;align-items:baseline;gap:20px"><span style="font-size:38px;font-weight:700">por</span><span class="h" style="font-size:170px;color:var(--red)">19,90</span></div>
      </div>
      <div class="abs h" style="right:24px;bottom:40px;padding:14px 26px;border:8px solid var(--ink);border-radius:18px;font-size:58px;background:var(--lime);animation:stamp .45s 5s both">É SÓ O PREÇO</div>
    </div>`)}
  ${a('left:-20px;top:1160px;width:400px;height:800px', `fromL .8s 2.6s cubic-bezier(.2,1,.4,1) both`, `<div style="animation:bob 1.4s 3.4s ease-in-out infinite">${P('cida', { bracoD: 'aponta', bracoE: 'cintura', expressao: 'desconfiada' })}</div>`)}
  ${a('left:400px;top:1240px;--r:-2deg', `${pop(3.4)}, ${out(8.2)}`, `<div class="card" style="padding:26px 34px;font-size:46px;font-weight:800;line-height:1.15">Hmm… mês passado<br>eu paguei <u>19,90</u>. 🤨</div>`)}
  ${a('left:60px;top:370px;width:960px', `${pop(6.3)}`, `<div class="h" style="font-size:96px">Desconto de verdade<br><span class="serif" style="font-size:104px">ou só cartaz?</span></div>`)}
  ${final('3 perguntas no post 👆', 'O Lugar Certo guarda o preço de cada compra. 14 dias de Premium grátis, sem cartão.')}
`);

// ---------- 2. "Qual leite?" (Bia & Rafa) ----------
const bolha = (txt, eu, d) => `<div style="display:flex;justify-content:${eu ? 'flex-end' : 'flex-start'};margin:16px 0;animation:${pop(d)};transform-origin:${eu ? 'right' : 'left'} bottom">
  <div style="max-width:80%;background:${eu ? '#DCF8C6' : '#fff'};border:4px solid var(--ink);border-radius:${eu ? '32px 32px 8px 32px' : '32px 32px 32px 8px'};padding:20px 28px;font-size:40px;font-weight:600">${txt}</div></div>`;
const digitando = (d, fim) => `<div style="height:0;overflow:visible"><div style="width:130px;background:#fff;border:4px solid var(--ink);border-radius:30px;padding:16px 22px;display:flex;gap:12px;animation:show .1s ${d}s both, hide .1s ${fim}s forwards">${[0, .2, .4].map(x => `<span style="width:18px;height:18px;border-radius:50%;background:var(--ink);animation:dots .8s ${x}s infinite"></span>`).join('')}</div></div>`;
const s2 = page('var(--lilac)', `
  ${topo('var(--ink)')}
  ${a('left:60px;top:250px;width:960px', pop(0.1), `<div class="h" style="font-size:96px">Ligação do<br>corredor 📞</div>`)}
  ${a('left:60px;top:500px;width:960px', `up .6s .3s both, shake .4s 4.6s, ${out(6.6)}`, `
    <div class="card" style="overflow:hidden;padding:0">
      <div style="background:var(--ink);color:#fff;padding:24px 32px;font-size:36px;font-weight:800;display:flex;gap:18px;align-items:center"><span style="width:56px;height:56px;border-radius:50%;background:var(--butter)"></span>Bia 💛</div>
      <div style="padding:20px 30px 34px;background:#F3EEE6;height:700px;position:relative">
        ${bolha('tô no mercado. qual leite?', true, 0.8)}
        ${digitando(1.5, 2.2)}
        ${bolha('o de sempre', false, 2.2)}
        ${bolha('QUAL é o de sempre 😩', true, 3.0)}
        ${digitando(3.6, 4.5)}
        ${bolha('🎤 áudio · 2:47', false, 4.5)}
        <div class="abs h" style="left:200px;top:260px;padding:16px 30px;border:8px solid var(--red);color:var(--red);border-radius:20px;font-size:64px;background:#fffd;animation:stamp .4s 5.4s both">CHEGA DE ÁUDIO</div>
      </div>
    </div>`)}
  ${a('left:90px;top:470px;width:900px', `down .9s 6.2s cubic-bezier(.3,1,.5,1) both, ${out(8.2)}`, `
    <div style="background:var(--green);color:#fff;border:5px solid var(--ink);border-radius:30px;padding:28px 32px;box-shadow:10px 10px 0 var(--ink);display:flex;gap:22px;align-items:center">
      <span style="width:72px;height:72px;border-radius:18px;background:#fff;display:grid;place-items:center;flex:none">${check('#138A55', 40)}</span>
      <div><div style="font-size:40px;font-weight:800">Bia adicionou Leite integral 1 L</div><div style="font-size:28px;margin-top:6px;opacity:.9">apareceu na hora no celular do Rafa</div></div></div>`)}
  ${a('left:60px;top:740px;width:960px', pop(7.0), `<div class="h" style="font-size:92px;text-align:center">A lista é da casa.<br><span class="serif" style="font-size:100px">Não do grupo da família.</span></div>`)}
  ${a('left:-30px;top:1330px;width:330px;height:660px', `up .6s .4s both`, `<div style="animation:bob 1.6s ease-in-out infinite">${P('bia', { bracoD: 'celular', prop: 'celular', expressao: 'piscada' })}</div>`)}
  ${a('left:760px;top:1330px;width:330px;height:660px', `up .6s .6s both, hide .1s 6.4s forwards`, P('rafa', { bracoD: 'celular', prop: 'celular', expressao: 'preocupada' }))}
  ${a('left:760px;top:1330px;width:330px;height:660px', `show .1s 6.4s both`, `<div style="animation:bob 1s 6.4s ease-in-out infinite">${P('rafa', { bracoD: 'aceno', propE: 'sacola', expressao: 'feliz' })}</div>`)}
  ${final('Lista em tempo real', 'No Premium, 1 pessoa usa junto. 14 dias grátis, sem cartão.')}
`);

// ---------- 3. Checklist imprimindo (Black Friday amanhã) ----------
const itens = ['FIZ A LISTA ANTES', 'ANOTEI O QUE PAGUEI', 'COMPAREI POR KG/L', 'DEFINI UM TETO', 'SÓ PEGUEI O QUE USO', 'CONFERI A NOTA'];
const s3 = page('var(--tomato)', `
  ${topo('#fff')}
  ${a('left:60px;top:250px', pop(0.1), `<div class="chip" style="background:var(--butter);font-size:38px">⏰ Black Friday é AMANHÃ</div>`)}
  <div class="abs" style="left:90px;top:380px;width:900px;height:36px;background:var(--ink);border-radius:18px"></div>
  ${a('left:130px;top:398px;width:820px', `print 2.2s .4s steps(22) both, ${out(8.2)}`, `
    <div style="background:#FFFDF8;padding:44px 50px 50px;box-shadow:0 20px 0 #0002">
      <div class="mono" style="text-align:center;font-size:26px;line-height:1.5">CUPOM DE CONFERÊNCIA · 27/11</div>
      <div style="border-top:4px dashed var(--ink);margin:22px 0"></div>
      <div class="h" style="font-size:88px">Checklist da<br><span class="serif" style="font-size:96px">Black Friday</span></div>
      <div style="border-top:4px dashed var(--ink);margin:24px 0 10px"></div>
      ${itens.map((t, i) => `<div class="mono" style="display:flex;gap:18px;align-items:center;font-size:36px;margin:20px 0"><span style="width:50px;height:50px;border:4px solid var(--ink);border-radius:8px;display:grid;place-items:center;flex:none"><span style="display:block;animation:${pop(2.8 + i * 0.5)}">${check('#138A55', 42)}</span></span>${t}</div>`).join('')}
      <div style="border-top:4px dashed var(--ink);margin:24px 0 16px"></div>
      <div style="animation:${pop(6.0)}"><div class="mono" style="display:flex;justify-content:space-between;font-size:44px"><span>TOTAL</span><span>R$ 0,00</span></div><div class="mono" style="text-align:right;font-size:28px">de arrependimento ✨</div></div>
    </div>`)}
  ${a('left:690px;top:1380px;width:360px;height:720px', `fromR .8s 1.2s cubic-bezier(.2,1,.4,1) both`, `<div style="animation:bob 1.3s ease-in-out infinite">${P('cida', { bracoD: 'segura', prop: 'caneta', bracoE: 'cintura', expressao: 'feliz' })}</div>`)}
  ${a('left:60px;top:480px;width:960px', pop(8.6), `<div class="h" style="font-size:104px;color:#fff">Salve o post<br>de hoje 📌</div><div style="font-size:40px;color:#fff;font-weight:700;margin-top:20px">e mande pra quem vai junto</div>`)}
  ${final('Nota no caixa, preço salvo', 'Escaneie o QR da nota e o histórico se monta sozinho.')}
`);

// ---------- 4. HOJE (Téo) ----------
const etq = (de, por, n, d) => `<div style="width:290px;perspective:600px"><div style="background:#fff;border:5px solid var(--ink);border-radius:18px;padding:18px 20px;animation:${pop(d)}, flip .6s ${d + 1.6}s"><div class="mono" style="font-size:24px">${n}</div><div class="h" style="font-size:62px;position:relative"><span style="animation:hide .01s ${d + 1.9}s forwards">${de}</span><span class="abs" style="left:0;color:var(--green);animation:show .01s ${d + 1.9}s both">${por}</span></div></div></div>`;
const s4 = page('var(--navy)', `
  ${topo('#fff')}
  <div class="abs h" style="left:50px;top:250px;font-size:400px;color:var(--lime);letter-spacing:-.06em;display:flex;animation:glow 1.2s 1.4s infinite">${'HOJE'.split('').map((l, i) => `<span style="display:inline-block;animation:zoom .5s ${0.2 + i * 0.18}s cubic-bezier(.2,1.2,.4,1) both">${l}</span>`).join('')}</div>
  ${a('left:60px;top:640px;width:960px', up(1.2), `<div class="h" style="font-size:96px;color:#fff">é a Black Friday<br>do mercado.</div>`)}
  ${a('left:60px;top:900px;width:620px;color:#fff', out(8.2), [['Abre a lista', 'nada de ir de cabeça'], ['Abre o histórico', 'o “de” não é o que você pagava'], ['Escaneia a nota', 'ali no caixa']].map(([t, s], i) => `<div style="display:flex;gap:24px;align-items:center;margin-bottom:36px;animation:${up(2.0 + i * 0.5)}"><span class="h" style="flex:none;width:84px;height:84px;border-radius:50%;background:var(--lime);color:var(--ink);display:grid;place-items:center;font-size:50px">${i + 1}</span><div><div style="font-size:50px;font-weight:800">${t}</div><div style="font-size:32px;opacity:.8">${s}</div></div></div>`).join(''))}
  ${a('left:640px;top:880px;width:420px;height:840px', `fromR .8s 1.6s cubic-bezier(.2,1,.4,1) both`, `<div style="animation:bob .9s ease-in-out infinite">${P('teo', { bracoD: 'celular', prop: 'celular', bracoE: 'cintura', expressao: 'surpresa' })}</div>`)}
  <div class="abs" style="left:0;right:0;top:1440px;height:480px;background:#0C1A36;border-top:14px solid #C9A66B"></div>
  ${a('left:60px;top:1500px;display:flex;gap:24px', out(8.2), etq('24,90', '19,90', 'CAFÉ 500 G', 3.8) + etq('10,49', '9,90', 'LEITE 1 L', 4.2) + etq('9,29', '8,49', 'ARROZ 1 KG', 4.6))}
  ${a('left:60px;top:1330px', pop(5.6) + ', ' + out(8.2), `<div class="chip" style="background:var(--lime);--r:-3deg">compare com o que VOCÊ pagou</div>`)}
  ${final('Baixe agora e confira', 'Histórico de preço e nota fiscal: 14 dias de Premium grátis, sem cartão.', 'var(--lime)')}
`);

// ---------- 5. 13º caiu (Téo) ----------
const notas = Array.from({ length: 16 }, (_, i) => `<div class="abs" style="left:${(i * 67) % 1000}px;top:0;width:150px;height:76px;background:#8FD19E;border:4px solid var(--ink);border-radius:10px;display:grid;place-items:center;font-family:'Bricolage Grotesque';font-weight:800;font-size:34px;animation:fall ${2.6 + (i % 4) * 0.5}s ${(i * 0.23) % 2}s linear infinite">R$</div>`).join('');
const s5 = page('var(--tomato)', `
  <div class="abs" style="inset:0;animation:hide .3s 5.2s forwards">${notas}</div>
  ${topo('#fff')}
  ${a('left:60px;top:300px;width:960px', `zoom .6s .2s cubic-bezier(.2,1.2,.4,1) both, wig .5s .8s 6, ${out(5.0)}`, `<div class="h" style="font-size:190px;color:#fff;text-align:center">13º<br>CAIU! 🤑</div>`)}
  ${a('left:60px;top:780px;width:960px', `${pop(1.6)}, ${out(5.0)}`, `<div class="serif" style="font-size:110px;color:#fff;text-align:center">“Agora dá pra tudo.”</div>`)}
  ${a('left:60px;top:960px;width:960px', `${pop(3.0)}, ${out(5.0)}`, `<div class="chip" style="font-size:44px">dia 15 de dezembro: 🫠</div>`)}
  ${a('left:340px;top:1150px;width:400px;height:800px', `up .6s .6s both, ${out(5.0)}`, `<div style="animation:bob .7s ease-in-out infinite">${P('teo', { bracoD: 'aceno', propE: 'sacola', expressao: 'feliz' })}</div>`)}
  <div class="abs" style="inset:0;background:var(--green);animation:fromR .7s 5.0s cubic-bezier(.2,1,.4,1) both">
    <div class="abs mono" style="left:60px;top:250px;font-size:34px;color:#fff;letter-spacing:.12em">PLANO B</div>
    <div class="abs h" style="left:60px;top:310px;font-size:120px;color:#fff;width:960px">13º caiu.<br>Já sei pra<br>onde vai.</div>
    <div class="abs card" style="left:60px;top:740px;width:620px;padding:36px 40px">
      ${[['Mercado do mês', 45, 'var(--green)'], ['Contas', 35, 'var(--butter)'], ['Guardar', 20, 'var(--lilac)']].map(([t, p, c], i) => `<div style="margin:10px 0 24px"><div style="display:flex;justify-content:space-between;font-size:38px;font-weight:800"><span>${t}</span><span>${p}%</span></div><div style="height:28px;background:#EEE8DD;border-radius:14px;margin-top:10px"><div style="width:${p * 2}%;height:100%;background:${c};border-radius:14px;border:3px solid var(--ink);transform-origin:left;animation:grow .7s ${6.0 + i * 0.4}s cubic-bezier(.2,1,.4,1) both"></div></div></div>`).join('')}
      <div class="mono" style="font-size:24px;opacity:.55">exemplo ilustrativo</div>
    </div>
    <div class="abs" style="left:690px;top:640px;width:380px;height:760px;animation:up .6s 5.6s both"><div style="animation:bob 1.4s ease-in-out infinite">${P('teo', { bracoD: 'celular', prop: 'celular', bracoE: 'cintura', expressao: 'piscada' })}</div></div>
  </div>
  ${final('Organize grátis pelo site', 'Divida o mês entre VA, VR e salário e veja quanto sobra.', 'var(--lime)')}
`);

// ---------- 6. Quiz: qual é você? (roleta do elenco) ----------
const pos = [[60, 640], [555, 640], [60, 1135], [555, 1135]];
const cartas = [['A', 'cida', { bracoD: 'segura', prop: 'nota', expressao: 'desconfiada' }, 'Dona Cida', 'sabe o preço de tudo', 'var(--lilac)'],
  ['B', 'teo', { bracoD: 'aceno', propE: 'sacola', expressao: 'surpresa' }, 'Téo', 'foi pelo pão, voltou sem', 'var(--butter)'],
  ['C', 'bia', { bracoD: 'celular', prop: 'celular', expressao: 'piscada' }, 'Bia', 'faz a lista da casa', '#FF9B85'],
  ['D', 'rafa', { bracoD: 'celular', prop: 'celular', expressao: 'preocupada' }, 'Rafa', 'liga: “qual leite?”', 'var(--lime)']];
// roleta: destaque passa pelos cards e para no C
const roleta = [0, 1, 3, 2, 0, 1, 3, 2, 0, 1, 3, 2];
const kf = `@keyframes roleta{${roleta.map((c, i) => `${(i / roleta.length * 100).toFixed(1)}%{left:${pos[c][0] - 14}px;top:${pos[c][1] - 14}px}`).join('')}100%{left:${pos[2][0] - 14}px;top:${pos[2][1] - 14}px}}`;
const s6 = page('var(--cream)', `
  <style>${kf}</style>
  ${topo('var(--ink)')}
  ${a('left:60px;top:250px;width:960px', pop(0.1), `<div class="h" style="font-size:118px">Qual é você<br><span class="serif" style="font-size:130px">no mercado?</span></div>`)}
  <div class="abs" style="width:493px;height:493px;border:12px solid var(--red);border-radius:40px;z-index:3;animation:show .1s 2.6s both, roleta 3.4s 2.6s cubic-bezier(.1,.6,.4,1) both, pulse .5s 6.1s 4"></div>
  ${cartas.map(([l, id, o, t, s, bg], i) => a(`left:${pos[i][0]}px;top:${pos[i][1]}px;width:465px;height:465px`, pop(0.6 + i * 0.35), `
    <div style="width:100%;height:100%;background:${bg};border:5px solid var(--ink);border-radius:34px;box-shadow:10px 10px 0 var(--ink);position:relative;overflow:hidden">
      <div class="h" style="position:absolute;left:24px;top:22px;width:80px;height:80px;border-radius:50%;background:#fff;border:5px solid var(--ink);display:grid;place-items:center;font-size:48px">${l}</div>
      <div style="position:absolute;right:-50px;top:30px;width:260px;height:440px;animation:bob ${1.2 + i * 0.15}s ease-in-out infinite">${P(id, { ...o, recorte: '40 20 220 370' })}</div>
      <div style="position:absolute;left:24px;bottom:26px;width:240px"><div class="h" style="font-size:50px">${t}</div><div style="font-size:26px;font-weight:700;margin-top:6px">${s}</div></div>
    </div>`)).join('')}
  ${a('left:60px;top:1620px;width:960px;text-align:center', `${pop(6.4)}, ${out(8.4)}`, `<div class="chip" style="background:var(--ink);color:#fff;font-size:40px">Deu C? Comenta a sua letra no post 👆</div>`)}
  ${final('Feito pros quatro', 'Lista que soma na hora, nota que vira histórico e lista a dois.')}
`);

const stories = [
  ['seg-23-story-desconto', s1], ['qua-25-story-qual-leite', s2], ['qui-26-story-checklist', s3],
  ['sex-27-story-hoje', s4], ['sab-28-story-13', s5], ['dom-29-story-quiz', s6],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const filtro = process.argv[2];
  const browser = await chromium.launch();
  for (const [nome, html] of stories.filter(([n]) => !filtro || n.includes(filtro))) {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'story-'));
    const pg = await browser.newPage({ viewport: { width: W, height: H } });
    await pg.setContent(html, { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    const n = FPS * DUR;
    for (let i = 0; i < n; i++) {
      const t = i * 1000 / FPS;
      await pg.evaluate((t) => document.getAnimations().forEach(an => { an.pause(); an.currentTime = t; }), t);
      await pg.screenshot({ path: path.join(tmp, `${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
    }
    // capa (quadro final) para conferência
    fs.copyFileSync(path.join(tmp, `${String(n - 1).padStart(4, '0')}.jpg`), path.join(OUT, `${nome}-capa.jpg`));
    await pg.close();
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.jpg'),
      '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '21', '-preset', 'medium', '-c:a', 'aac', '-b:a', '64k',
      '-movflags', '+faststart', path.join(OUT, `${nome}.mp4`)]);
    fs.rmSync(tmp, { recursive: true });
    console.log('ok', nome);
  }
  await browser.close();
})();
