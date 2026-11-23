// Elenco Lugar Certo v3: ilustração editorial (sem contorno preto, proporções naturais, volume com gradiente).
// Mesma API do personagens.js: personagem(id, { bracoD, bracoE, expressao, prop, propE, espelhar, recorte })
const INK = '#1F1A17';

function tom(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))));
  return '#' + ch.map(v => v.toString(16).padStart(2, '0')).join('');
}

const ELENCO = {
  cida: { nome: 'Dona Cida', pele: '#E2A57E', iris: '#5B3A24', cabelo: 'cida', corCabelo: '#CFCAC4', blusa: '#7E57C2', blusa2: '#FFF4E2', baixo: '#E9A93A', tipoBaixo: 'saia', tenis: '#4A2E22', batom: '#B5505B', oculos: true, idade: true, brinco: '#E9B949' },
  teo: { nome: 'Téo', pele: '#7B4A30', iris: '#2E1A10', cabelo: 'teo', corCabelo: '#1B120D', blusa: '#239C8F', blusa2: '#1C7F74', baixo: '#2D3550', tipoBaixo: 'calca', tenis: '#F4F1EA', chapeu: '#FF7A3D', moletom: true },
  bia: { nome: 'Bia', pele: '#B97B52', iris: '#2E1A10', cabelo: 'bia', corCabelo: '#24170F', blusa: '#FFC23C', blusa2: '#E9A91C', baixo: '#E35D7A', tipoBaixo: 'pantalona', tenis: '#2A2220', batom: '#9C3B52', brinco: '#F1D27A', cilios: true },
  rafa: { nome: 'Rafa', pele: '#F0C6A3', iris: '#4C7A3D', cabelo: 'rafa', corCabelo: '#C1602B', blusa: '#3B5BFA', blusa2: '#FFFFFF', baixo: '#C7A46C', tipoBaixo: 'calca', tenis: '#FF5A36', barba: true },
};

// Mesmo esqueleto de mãos do v1 (props e layouts continuam encaixando)
const POSES = {
  baixo: [[186, 186], [204, 272], [200, 338]],
  aceno: [[186, 186], [240, 150], [250, 80]],
  segura: [[186, 186], [212, 266], [176, 290]],
  cintura: [[186, 186], [236, 258], [198, 302]],
  aponta: [[186, 186], [240, 210], [284, 198]],
  celular: [[186, 186], [226, 260], [200, 214]],
};
const espelha = (pts) => pts.map(([x, y]) => [300 - x, y]);

let UID = 0;

// Braço: manga (ombro→cotovelo) + antebraço; sem contorno, com sombra lateral
function braco(pts, c, mangaCurta) {
  const [s, e, h] = pts;
  const manga = c.blusa, sombra = tom(c.blusa, -0.18);
  const ante = mangaCurta ? c.pele : c.blusa;
  const pe = `M${s[0]} ${s[1]} L${e[0]} ${e[1]}`, pa = `M${e[0]} ${e[1]} L${h[0]} ${h[1]}`;
  return `<path d="${pa}" stroke="${tom(ante, -0.15)}" stroke-width="27" stroke-linecap="round"/>
    <path d="${pa}" stroke="${ante}" stroke-width="22" stroke-linecap="round"/>
    <path d="${pe}" stroke="${sombra}" stroke-width="33" stroke-linecap="round"/>
    <path d="${pe}" stroke="${manga}" stroke-width="28" stroke-linecap="round"/>
    ${mangaCurta ? '' : `<path d="M${e[0] + (h[0] - e[0]) * 0.78} ${e[1] + (h[1] - e[1]) * 0.78} L${e[0] + (h[0] - e[0]) * 0.86} ${e[1] + (h[1] - e[1]) * 0.86}" stroke="${sombra}" stroke-width="25" stroke-linecap="butt"/>`}`;
}

function mao(e, h, pele) {
  const ang = Math.atan2(h[1] - e[1], h[0] - e[0]) * 180 / Math.PI;
  return `<g transform="translate(${h[0]} ${h[1]}) rotate(${ang - 90})">
    <path d="M-11 -4 Q-13 14 -4 20 Q6 24 11 14 Q14 2 10 -6 Z" fill="${pele}"/>
    <path d="M10 -2 Q19 2 17 10" stroke="${pele}" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M-6 16 Q0 20 7 16" stroke="${tom(pele, -0.2)}" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
}

function propNaMao(prop, x, y) {
  if (prop === 'celular') return `<g transform="translate(${x - 20} ${y - 62})"><rect width="40" height="74" rx="9" fill="${INK}"/><rect x="4" y="6" width="32" height="60" rx="5" fill="#C6F24E"/><path d="M12 36 l6 6 l11 -13" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  if (prop === 'nota') return `<g transform="translate(${x - 24} ${y - 6}) rotate(-6)"><path d="M0 0 h48 v112 l-6 -6 l-6 6 l-6 -6 l-6 6 l-6 -6 l-6 6 l-6 -6 l-6 6 Z" fill="#FFFFFF"/><path d="M8 16 h32 M8 30 h24 M8 44 h32 M8 58 h18 M8 80 h32" stroke="#B9B2A8" stroke-width="4" stroke-linecap="round"/></g>`;
  if (prop === 'sacola') return `<g transform="translate(${x - 38} ${y - 12})"><path d="M22 16 q16 -30 32 0" stroke="#C25A28" stroke-width="5" fill="none"/><path d="M4 16 h68 l-6 80 h-56 Z" fill="#FF7A3D"/><path d="M4 16 h68 l-2 18 h-64 Z" fill="#E0642C"/><path d="M16 14 q-6 -16 6 -22 M58 14 q8 -18 -4 -24" stroke="#2E9C4F" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
  if (prop === 'caneta') return `<g transform="translate(${x} ${y}) rotate(-35)"><rect x="-5" y="-56" width="10" height="60" rx="4" fill="#FF5A36"/></g>`;
  return '';
}

function cabelo(c, camada, id) {
  const h = c.corCabelo, hl = tom(h, 0.28), sh = tom(h, -0.25);
  if (c.cabelo === 'cida') {
    if (camada === 'tras') return `<circle cx="150" cy="38" r="22" fill="url(#gc${id})"/><path d="M106 96 Q100 62 120 50 Q150 36 180 50 Q200 62 194 96 Q198 120 188 128 L112 128 Q102 120 106 96 Z" fill="${sh}"/>`;
    return `<path d="M108 92 Q104 52 150 50 Q196 52 192 92 Q186 70 168 66 Q152 78 132 70 Q114 74 108 92 Z" fill="url(#gc${id})"/>
      <path d="M122 60 q14 -8 30 -4 M160 58 q14 2 22 12" stroke="${hl}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M138 30 q10 -8 22 -2" stroke="${hl}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  if (c.cabelo === 'teo') {
    if (camada === 'tras') return '';
    return `<path d="M106 96 Q104 70 116 64 L184 64 Q196 70 194 96 Q190 82 184 78 L116 78 Q110 82 106 96 Z" fill="${h}"/>
      <path d="M112 64 Q110 28 150 26 Q190 28 188 64 Z" fill="${c.chapeu}"/>
      <path d="M112 64 Q110 28 150 26 Q170 27 180 38 Q160 34 150 36 Q122 40 120 64 Z" fill="${tom(c.chapeu, 0.18)}"/>
      <path d="M98 66 Q150 52 202 66 Q204 75 196 76 Q150 66 104 76 Q96 75 98 66 Z" fill="${tom(c.chapeu, -0.12)}"/>
      <path d="M114 54 Q150 46 186 54" stroke="${tom(c.chapeu, -0.25)}" stroke-width="3" fill="none"/>`;
  }
  if (c.cabelo === 'bia') {
    const tranca = (x0, dir) => `<path d="M${x0} 96 Q${x0 + dir * 8} 170 ${x0 + dir * 2} 250" stroke="${h}" stroke-width="18" stroke-linecap="round" fill="none"/>
      <path d="M${x0} 96 Q${x0 + dir * 8} 170 ${x0 + dir * 2} 250" stroke="${hl}" stroke-width="18" stroke-dasharray="3 11" fill="none" opacity=".45"/>`;
    if (camada === 'tras') return `<path d="M104 96 Q98 50 150 46 Q202 50 196 96 L200 150 Q150 160 100 150 Z" fill="${sh}"/>${tranca(108, -1)}${tranca(122, -1)}${tranca(192, 1)}${tranca(178, 1)}`;
    return `<path d="M106 98 Q102 48 150 46 Q198 48 194 98 Q188 70 162 62 Q156 58 150 60 Q144 58 138 62 Q112 70 106 98 Z" fill="${h}"/>
      <path d="M150 48 V62" stroke="${sh}" stroke-width="2"/><path d="M124 58 q12 -8 22 -8" stroke="${hl}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M112 82 q-4 6 -2 12 M188 82 q4 6 2 12" stroke="${h}" stroke-width="2" fill="none"/>`;
  }
  if (c.cabelo === 'rafa') {
    if (camada === 'tras') return '';
    return `<path d="M108 88 Q102 46 146 42 Q160 38 176 44 Q198 54 192 88 Q188 70 176 64 Q166 72 150 66 Q130 70 118 66 Q110 74 108 88 Z" fill="url(#gc${id})"/>
      <path d="M126 52 q12 -6 26 -4 M160 50 q12 2 18 8" stroke="${hl}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  return '';
}

function barba(c) {
  if (!c.barba) return '';
  const h = c.corCabelo;
  return `<path d="M110 104 Q110 150 150 156 Q190 150 190 104 Q186 124 176 128 Q166 118 150 120 Q134 118 124 128 Q114 124 110 104 Z" fill="${h}"/>
    <path d="M136 122 Q150 116 164 122 Q150 126 136 122 Z" fill="${tom(h, -0.15)}"/>
    <path d="M128 140 q22 10 44 0" stroke="${tom(h, 0.25)}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>`;
}

function rosto(c, exp, id) {
  const p = c.pele, sh = tom(p, -0.2), dk = '#2A1D17';
  const olho = (x, tipo) => {
    if (tipo === 'fechado') return `<path d="M${x - 9} ${95} q9 6 18 0" stroke="${dk}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const a = tipo === 'surpresa' ? 9 : 7;
    let s = `<path d="M${x - 10} 95 Q${x} ${95 - a - 1} ${x + 10} 95 Q${x} ${95 + a - 1} ${x - 10} 95 Z" fill="#FFFFFF"/>
      <circle cx="${x + (exp === 'desconfiada' ? 3 : 0.5)}" cy="95" r="${tipo === 'surpresa' ? 4.6 : 5.4}" fill="${c.iris}"/>
      <circle cx="${x + (exp === 'desconfiada' ? 3 : 0.5)}" cy="95" r="2.5" fill="${dk}"/>
      <circle cx="${x - 1.6}" cy="92.8" r="1.6" fill="#FFFFFF"/>
      <path d="M${x - 11} 95.5 Q${x} ${95 - a - 3} ${x + 11} 94" stroke="${dk}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    if (c.cilios) s += `<path d="M${x + 10} 94 l5 -3 M${x - 10} 95 l-4 -2" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>`;
    if (tipo === 'sorriso') s += `<path d="M${x - 11} ${100} Q${x} ${92} ${x + 11} ${100} L${x + 11} 104 L${x - 11} 104 Z" fill="${p}"/><path d="M${x - 9} 99.5 Q${x} 94 ${x + 9} 99.5" stroke="${sh}" stroke-width="1.6" fill="none"/>`;
    if (tipo === 'meio') s += `<path d="M${x - 12} 86 L${x + 12} 86 L${x + 12} 93.5 Q${x} 91 ${x - 12} 94 Z" fill="${p}"/><path d="M${x - 11} 94 Q${x} 91 ${x + 11} 93.5" stroke="${dk}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    return s;
  };
  const t = { feliz: ['sorriso', 'sorriso'], piscada: ['sorriso', 'fechado'], surpresa: ['surpresa', 'surpresa'], desconfiada: ['meio', 'meio'], preocupada: ['n', 'n'] }[exp] || ['n', 'n'];
  const corS = c.cabelo === 'cida' ? '#8F8880' : c.cabelo === 'rafa' ? tom(c.corCabelo, -0.1) : '#24170F';
  const sb = {
    feliz: ['M122 82 Q132 77 143 81', 'M157 81 Q168 77 178 82'], piscada: ['M122 81 Q132 76 143 80', 'M157 84 Q168 82 178 86'],
    surpresa: ['M122 76 Q132 70 143 75', 'M157 75 Q168 70 178 76'], desconfiada: ['M122 84 Q132 85 143 88', 'M157 82 Q168 76 178 79'],
    preocupada: ['M122 85 Q132 84 142 78', 'M158 78 Q168 84 178 85'],
  }[exp] || ['M122 82 Q132 78 143 82', 'M157 82 Q168 78 178 82'];
  const sobr = sb.map(d => `<path d="${d}" stroke="${corS}" stroke-width="4.6" fill="none" stroke-linecap="round"/>`).join('');
  const nariz = `<path d="M151 99 Q149 110 145 114 Q150 117 156 114" stroke="${sh}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const labio = c.batom || tom(p, -0.32);
  const boca = exp === 'surpresa'
    ? `<ellipse cx="150" cy="128" rx="6" ry="8" fill="#5A1E22"/>`
    : exp === 'feliz' || exp === 'piscada'
      ? `<path d="M135 123 Q150 140 165 123 Q150 126 135 123 Z" fill="#5A1E22"/><path d="M137 123.5 Q150 126.5 163 123.5 L162 126 Q150 129 138 126 Z" fill="#FFFFFF"/><path d="M133 122 q2 -2 4 0 M163 122 q2 -2 4 0" stroke="${sh}" stroke-width="1.8" fill="none"/>`
      : `<path d="M138 126 Q144 123 150 124.5 Q156 123 162 126 Q150 ${exp === 'preocupada' ? 126 : 131} 138 126 Z" fill="${labio}"/>`;
  const rubor = `<ellipse cx="125" cy="112" rx="9" ry="5" fill="#E86B5F" opacity=".22"/><ellipse cx="175" cy="112" rx="9" ry="5" fill="#E86B5F" opacity=".22"/>`;
  const oculos = c.oculos ? `<g fill="#CFE8FF" fill-opacity=".18" stroke="#3A2A22" stroke-width="2.6"><rect x="118" y="85" width="28" height="21" rx="9"/><rect x="154" y="85" width="28" height="21" rx="9"/></g><path d="M146 94 q4 -3 8 0 M118 93 l-8 -2 M182 93 l8 -2" stroke="#3A2A22" stroke-width="2.6" fill="none" stroke-linecap="round"/>` : '';
  const rugas = c.idade ? `<path d="M113 97 l-4 -2 M113 101 l-4 1 M187 97 l4 -2 M187 101 l4 1 M136 116 q-3 6 0 10 M164 116 q3 6 0 10" stroke="${sh}" stroke-width="1.8" fill="none" stroke-linecap="round"/>` : '';
  return `${rubor}${rugas}${olho(132, t[0])}${olho(168, t[1])}${sobr}${nariz}${boca}${oculos}`;
}

function tronco(c, id) {
  const b = c.blusa, s = tom(b, -0.16);
  let r = `<path d="M114 172 Q150 160 186 172 Q198 178 198 196 L200 342 Q150 352 100 342 L102 196 Q102 178 114 172 Z" fill="url(#gt${id})"/>`;
  if (c.cabelo === 'cida') r += `<path d="M134 168 L150 214 L166 168 Q150 162 134 168 Z" fill="${c.blusa2}"/><path d="M134 168 L150 214 L144 176 Z M166 168 L150 214 L156 176 Z" fill="${tom(c.blusa2, -0.08)}"/>
      <path d="M150 216 V338" stroke="${s}" stroke-width="3"/>${[244, 276, 308].map(y => `<circle cx="158" cy="${y}" r="3.4" fill="${tom(b, -0.35)}"/>`).join('')}
      <path d="M112 300 h30 v22 h-30 Z" fill="${s}" opacity=".6"/>`;
  if (c.moletom) r += `<path d="M120 170 Q150 196 180 170 Q172 186 150 190 Q128 186 120 170 Z" fill="${c.blusa2}"/>
      <path d="M142 190 v34 M158 190 v34" stroke="#F4F1EA" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M118 286 Q150 280 182 286 L178 326 Q150 330 122 326 Z" fill="${c.blusa2}"/><path d="M104 330 Q150 342 196 330 L198 342 Q150 352 102 342 Z" fill="${c.blusa2}"/>`;
  if (c.cabelo === 'bia') r += `<path d="M132 168 Q150 182 168 168" stroke="${s}" stroke-width="3" fill="none"/><path d="M104 300 Q150 312 196 300 L198 342 Q150 352 102 342 Z" fill="${s}" opacity=".5"/>`;
  if (c.barba) r += `<path d="M132 168 L150 176 L168 168 L166 340 L134 340 Z" fill="${c.blusa2}"/><path d="M134 170 L126 220 L134 340 M166 170 L174 220 L166 340" stroke="${s}" stroke-width="4" fill="none"/>
      <path d="M110 220 h18 v16 h-18 Z" fill="${s}"/>`;
  return r;
}

function pernas(c, id) {
  const p = c.baixo, s = tom(p, -0.18);
  if (c.tipoBaixo === 'saia') return `<path d="M136 420 L134 548 M164 420 L166 548" stroke="${tom(c.pele, -0.1)}" stroke-width="20" stroke-linecap="round"/>
    <path d="M102 334 L198 334 L218 438 Q150 452 82 438 Z" fill="${p}"/><path d="M150 336 L150 446 M122 336 L108 444 M178 336 L192 444" stroke="${s}" stroke-width="3"/>`;
  if (c.tipoBaixo === 'pantalona') return `<path d="M102 334 L198 334 L212 548 L160 548 L150 420 L140 548 L88 548 Z" fill="${p}"/><path d="M150 360 L150 420 M190 380 L198 548" stroke="${s}" stroke-width="3" fill="none"/>`;
  return `<path d="M104 334 L196 334 L188 548 L156 548 L150 400 L144 548 L112 548 Z" fill="${p}"/>
    <path d="M150 350 L150 400 M180 360 L184 548" stroke="${s}" stroke-width="3" fill="none"/><path d="M104 334 L196 334 L196 346 L104 346 Z" fill="${s}"/>`;
}

function sapatos(c) {
  const t = c.tenis, s = tom(t, -0.2);
  return `<path d="M104 546 h42 q6 0 6 8 v10 h-60 q-2 -18 12 -18 Z" fill="${t}"/><path d="M92 560 h60 v4 h-60 Z" fill="${s}"/>
    <path d="M154 546 h42 q14 0 12 18 h-60 v-10 q0 -8 6 -8 Z" fill="${t}"/><path d="M148 560 h60 v4 h-60 Z" fill="${s}"/>`;
}

function personagem(id, o = {}) {
  const c = ELENCO[id], u = ++UID;
  const exp = o.expressao || 'feliz';
  const pd = POSES[o.bracoD || 'baixo'], pe = espelha(POSES[o.bracoE || 'baixo']);
  const flip = o.espelhar ? ` transform="translate(300 0) scale(-1 1)"` : '';
  const p = c.pele;
  const brinco = c.brinco ? `<circle cx="110" cy="112" r="4" fill="${c.brinco}"/><circle cx="190" cy="112" r="4" fill="${c.brinco}"/>` : '';
  return `<svg viewBox="${o.recorte || '0 0 300 600'}" xmlns="http://www.w3.org/2000/svg" class="${o.classe || 'pers'}"><defs>
    <linearGradient id="gt${u}" x1="0" x2="1"><stop offset=".55" stop-color="${c.blusa}"/><stop offset="1" stop-color="${tom(c.blusa, -0.2)}"/></linearGradient>
    <linearGradient id="gf${u}" x1="0" x2="1"><stop offset=".5" stop-color="${p}"/><stop offset="1" stop-color="${tom(p, -0.14)}"/></linearGradient>
    <linearGradient id="gc${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tom(c.corCabelo, 0.15)}"/><stop offset="1" stop-color="${tom(c.corCabelo, -0.15)}"/></linearGradient>
  </defs><g${flip}>
    <ellipse cx="150" cy="566" rx="80" ry="9" fill="${INK}" opacity=".10"/>
    ${cabelo(c, 'tras', u)}
    ${pernas(c, u)}
    ${sapatos(c)}
    ${braco(pe, c, false)}${mao(pe[1], pe[2], p)}
    <path d="M138 128 L162 128 L164 172 Q150 180 136 172 Z" fill="${tom(p, -0.12)}"/>
    ${tronco(c, u)}
    <ellipse cx="108" cy="98" rx="8" ry="11" fill="${tom(p, -0.06)}"/><ellipse cx="192" cy="98" rx="8" ry="11" fill="${tom(p, -0.1)}"/>
    <path d="M150 46 C180 46 194 70 194 96 C194 128 176 146 150 146 C124 146 106 128 106 96 C106 70 120 46 150 46 Z" fill="url(#gf${u})"/>
    <path d="M124 140 Q150 152 176 140 Q166 150 150 150 Q134 150 124 140 Z" fill="${tom(p, -0.18)}" opacity=".5"/>
    ${barba(c)}
    ${cabelo(c, 'frente', u)}
    ${rosto(c, exp, u)}
    ${brinco}
    ${braco(pd, c, false)}${mao(pd[1], pd[2], p)}
    ${propNaMao(o.prop, pd[2][0], pd[2][1])}
    ${propNaMao(o.propE, pe[2][0], pe[2][1])}
  </g></svg>`;
}

module.exports = { personagem, ELENCO, INK };
