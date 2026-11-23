// Elenco Lugar Certo — personagens em SVG (estilo flat com contorno).
// Cada personagem: viewBox 0 0 300 600, em pé, centro x=150.
// Uso: personagem('cida', { bracoE: 'baixo', bracoD: 'aceno', expressao: 'feliz', prop: 'nota' })

const INK = '#1F1A17';

const ELENCO = {
  cida: {
    nome: 'Dona Cida',
    papel: 'sabe o preço de tudo de cabeça',
    pele: '#E3A982', blusa: '#8E5BB5', detalhe: '#FFF6E8', baixo: '#F2B33D', tipoBaixo: 'saia', tenis: '#5B3A2A',
    cabelo: 'coque', corCabelo: '#D2CDC6', oculos: true, rugas: true, batom: '#B4505A', iris: '#6B4A2E', brinco: '#F2B33D',
  },
  teo: {
    nome: 'Téo',
    papel: 'primeiro apê, vai ao mercado sem lista',
    pele: '#7A4B33', blusa: '#2BA59A', detalhe: '#1E7D74', baixo: '#2B2D42', tipoBaixo: 'calca', tenis: '#FFFFFF',
    cabelo: 'chapeu', corCabelo: '#FF7A3D', moletom: true, iris: '#3B2416', corSobrancelha: '#1E130D',
  },
  bia: {
    nome: 'Bia',
    papel: 'faz a lista da casa',
    pele: '#C98B62', blusa: '#FFC93C', detalhe: '#E0A81E', baixo: '#E85D75', tipoBaixo: 'pantalona', tenis: '#1F1A17',
    cabelo: 'trancas', corCabelo: '#2A1C14', batom: '#9E3F55', iris: '#3B2416', brinco: '#FFFFFF', argola: true,
  },
  rafa: {
    nome: 'Rafa',
    papel: 'liga do corredor pra perguntar qual é o leite',
    pele: '#F1C7A3', blusa: '#3D5AFE', detalhe: '#2C44C9', baixo: '#C9A66B', tipoBaixo: 'calca', tenis: '#FF5A36',
    cabelo: 'curto', corCabelo: '#C8602A', barba: true, iris: '#4E7A3E',
  },
};

// Poses do braço direito (lado direito da imagem). O esquerdo é espelhado.
const POSES = {
  baixo: [[192, 196], [208, 280], [204, 342]],
  aceno: [[192, 196], [244, 150], [252, 78]],
  segura: [[192, 196], [214, 270], [176, 292]],
  cintura: [[192, 196], [240, 262], [198, 304]],
  aponta: [[192, 196], [246, 214], [284, 196]],
  celular: [[192, 196], [228, 262], [200, 214]],
};

function espelha(pts) { return pts.map(([x, y]) => [300 - x, y]); }
function d(pts) { return `M ${pts[0][0]} ${pts[0][1]} Q ${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}`; }

function membro(pts, cor, w) {
  return `<path d="${d(pts)}" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round" fill="none"/>
          <path d="${d(pts)}" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
}

function mao(x, y, pele) {
  return `<circle cx="${x}" cy="${y}" r="15" fill="${pele}" stroke="${INK}" stroke-width="5"/>`;
}

function propNaMao(prop, x, y) {
  if (!prop) return '';
  if (prop === 'celular') {
    return `<g transform="translate(${x - 22} ${y - 66})">
      <rect width="44" height="78" rx="9" fill="${INK}"/>
      <rect x="6" y="8" width="32" height="56" rx="4" fill="#C6F24E"/>
      <path d="M13 36 l7 7 l12 -14" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  if (prop === 'nota') {
    return `<g transform="translate(${x - 26} ${y - 8}) rotate(-6)">
      <path d="M0 0 h52 v120 l-6.5 -7 l-6.5 7 l-6.5 -7 l-6.5 7 l-6.5 -7 l-6.5 7 l-6.5 -7 l-6.5 7 Z" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M9 18 h34 M9 32 h26 M9 46 h34 M9 60 h20 M9 82 h34" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  if (prop === 'sacola') {
    return `<g transform="translate(${x - 40} ${y - 14})">
      <path d="M22 18 q18 -34 36 0" stroke="${INK}" stroke-width="6" fill="none"/>
      <path d="M4 18 h72 l-6 82 h-60 Z" fill="#FF7A3D" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="28" cy="10" r="0"/><path d="M14 18 q-6 -16 6 -22 M60 18 q8 -18 -4 -24" stroke="#2E9C4F" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
  }
  if (prop === 'caneta') {
    return `<g transform="translate(${x} ${y}) rotate(-35)"><rect x="-6" y="-58" width="12" height="62" rx="4" fill="#FF5A36" stroke="${INK}" stroke-width="4"/></g>`;
  }
  return '';
}

// Tom mais escuro/claro de uma cor hex (sombra e luz)
function tom(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))));
  return '#' + ch.map(v => v.toString(16).padStart(2, '0')).join('');
}
let UID = 0;

// Olho com esclera, íris, pupila e brilho (catchlight)
function olho(x, y, iris, tipo, lado) {
  if (tipo === 'fechado') return `<path d="M${x - 10} ${y + 1} q10 -9 20 0" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  const ry = tipo === 'surpresa' ? 13 : 11, rx = tipo === 'surpresa' ? 11 : 10;
  const ir = tipo === 'surpresa' ? 6 : 7.2;
  let s = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FFFFFF" stroke="${INK}" stroke-width="3.5"/>
    <circle cx="${x + lado}" cy="${y + 1}" r="${ir}" fill="${iris}"/>
    <circle cx="${x + lado}" cy="${y + 1}" r="${ir * 0.5}" fill="${INK}"/>
    <circle cx="${x + lado - 2.6}" cy="${y - 2.6}" r="2.6" fill="#FFFFFF"/>
    <circle cx="${x + lado + 2.4}" cy="${y + 3}" r="1.2" fill="#FFFFFF" opacity=".8"/>`;
  // pálpebra superior (traço grosso = cílios)
  s += `<path d="M${x - rx - 1} ${y - 2} Q${x} ${y - ry - 5} ${x + rx + 1} ${y - 2}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (tipo === 'meio') s += `<path d="M${x - rx - 1} ${y - 1} Q${x} ${y - ry - 4} ${x + rx + 1} ${y - 1} L${x + rx + 1} ${y - 1} Q${x} ${y - 3} ${x - rx - 1} ${y - 1} Z" fill="currentColor"/><path d="M${x - rx} ${y - 1} Q${x} ${y - 4} ${x + rx} ${y - 1}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (tipo === 'sorriso') s += `<path d="M${x - rx} ${y + ry + 1} Q${x} ${y + 6} ${x + rx} ${y + ry + 1}" fill="currentColor" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  return s;
}

function rosto(c, exp) {
  const pele = c.pele, sombra = tom(pele, -0.22);
  const iris = c.iris || '#5A3622';
  const sob = c.corSobrancelha || tom(c.corCabelo, c.cabelo === 'coque' ? -0.35 : -0.05);
  const L = [126, 110], R = [174, 110];
  const tipos = {
    feliz: ['sorriso', 'sorriso'], piscada: ['sorriso', 'fechado'], surpresa: ['surpresa', 'surpresa'],
    desconfiada: ['meio', 'meio'], preocupada: ['normal', 'normal'],
  }[exp] || ['normal', 'normal'];
  const olhar = exp === 'desconfiada' ? 3 : 1;
  const olhos = `<g style="color:${pele}">${olho(L[0], L[1], iris, tipos[0], olhar)}${olho(R[0], R[1], iris, tipos[1], olhar)}</g>`;
  const sb = {
    feliz: 'M112 90 Q126 82 140 89 M160 89 Q174 82 188 90',
    piscada: 'M112 88 Q126 80 140 87 M160 92 Q174 88 188 94',
    surpresa: 'M112 82 Q126 72 140 80 M160 80 Q174 72 188 82',
    desconfiada: 'M112 90 Q126 92 140 96 M160 88 Q174 80 188 84',
    preocupada: 'M112 94 Q124 92 138 84 M162 84 Q176 92 188 94',
  }[exp] || 'M112 90 Q126 84 140 90 M160 90 Q174 84 188 90';
  const sobr = `<path transform="translate(0 ${c.cabelo === 'chapeu' ? 8 : 0})" d="${sb}" stroke="${sob}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  const nariz = `<path d="M152 116 q5 12 -4 15" stroke="${sombra}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const labio = c.batom || tom(pele, -0.45);
  const boca = exp === 'surpresa'
    ? `<ellipse cx="150" cy="144" rx="9" ry="11" fill="#5B1F1F" stroke="${INK}" stroke-width="3.5"/>`
    : exp === 'preocupada' || exp === 'desconfiada'
      ? `<path d="M137 145 q13 -${exp === 'desconfiada' ? 2 : 7} 26 0" stroke="${labio}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      : `<path d="M131 136 Q150 162 169 136 Z" fill="#5B1F1F" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
         <path d="M134 138 Q150 143 166 138 L165 141 Q150 146 135 141 Z" fill="#FFFFFF"/>
         <path d="M141 151 Q150 145 159 151 Q150 156 141 151 Z" fill="#E46B6B"/>`;
  const bochecha = `<ellipse cx="114" cy="130" rx="11" ry="7" fill="#FF6B6B" opacity="${exp === 'feliz' || exp === 'piscada' ? .32 : .18}"/><ellipse cx="186" cy="130" rx="11" ry="7" fill="#FF6B6B" opacity="${exp === 'feliz' || exp === 'piscada' ? .32 : .18}"/>`;
  const oculos = c.oculos
    ? `<g stroke="${INK}" stroke-width="4.5" fill="#BFE3FF" fill-opacity=".18"><rect x="106" y="94" width="40" height="32" rx="13"/><rect x="154" y="94" width="40" height="32" rx="13"/></g>
       <path d="M146 108 q4 -4 8 0 M106 106 l-10 -3 M194 106 l10 -3" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
       <path d="M114 100 l8 -3 M162 100 l8 -3" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".8"/>`
    : '';
  const rugas = c.rugas ? `<path d="M100 116 l-6 -3 M100 122 l-6 0 M200 116 l6 -3 M200 122 l6 0" stroke="${sombra}" stroke-width="2.5" stroke-linecap="round"/>` : '';
  return `${bochecha}${rugas}${nariz}${olhos}${sobr}${boca}${oculos}`;
}

function cabeloAtras(c) {
  if (c.cabelo === 'trancas') {
    return `<path d="M96 104 Q92 220 112 236 L128 236 Q118 170 124 120 Z M204 104 Q208 220 188 236 L172 236 Q182 170 176 120 Z" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M104 150 h16 M104 176 h16 M106 202 h16 M180 150 h16 M180 176 h16 M178 202 h16" stroke="#5A3A28" stroke-width="3"/>
      <circle cx="120" cy="240" r="7" fill="#FFC93C" stroke="${INK}" stroke-width="3"/><circle cx="180" cy="240" r="7" fill="#FFC93C" stroke="${INK}" stroke-width="3"/>`;
  }
  if (c.cabelo === 'coque') {
    return `<circle cx="150" cy="40" r="28" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5"/><path d="M134 32 q14 -10 30 -2" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>`;
  }
  return '';
}

function cabeloFrente(c) {
  if (c.cabelo === 'coque') {
    return `<path d="M98 112 Q96 56 150 58 Q204 56 202 112 Q190 84 150 82 Q114 84 98 112 Z" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M120 72 q20 -8 40 0" stroke="#B5AFA6" stroke-width="3" fill="none"/>`;
  }
  if (c.cabelo === 'trancas') {
    return `<path d="M98 112 Q94 52 150 56 Q206 52 202 112 Q186 74 150 78 Q120 80 98 112 Z" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M150 58 V78" stroke="#5A3A28" stroke-width="3"/><path d="M120 70 q12 -8 24 -8" stroke="#6B4A36" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  if (c.cabelo === 'curto') {
    return `<path d="M100 104 Q96 52 150 54 Q206 50 200 104 Q194 80 170 78 Q160 90 140 82 Q118 80 100 104 Z" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M118 70 q16 -10 34 -8 M160 64 q14 0 24 8" stroke="${tom(c.corCabelo, 0.35)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  if (c.cabelo === 'chapeu') {
    return `<g fill="#1E130D" stroke="${INK}" stroke-width="3"><circle cx="104" cy="100" r="10"/><circle cx="100" cy="114" r="8"/><circle cx="196" cy="100" r="10"/><circle cx="200" cy="114" r="8"/></g>
      <path d="M104 96 Q100 46 150 44 Q200 46 196 96 Z" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M84 98 Q150 80 216 98 Q218 110 210 112 Q150 98 90 112 Q82 110 84 98 Z" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M108 74 Q150 66 192 74" stroke="${INK}" stroke-width="4" fill="none"/>`;
  }
  return '';
}

function barba(c) {
  if (!c.barba) return '';
  return `<path d="M102 118 Q104 168 150 170 Q196 168 198 118 Q190 146 172 146 Q160 130 150 134 Q140 130 128 146 Q110 146 102 118 Z" fill="${c.corCabelo}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M140 146 q10 6 20 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
}

function tronco(c) {
  const corpo = `<path d="M106 186 Q150 166 194 186 L204 362 Q150 372 96 362 Z" fill="${c.blusa}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  let det = '';
  if (c.cabelo === 'coque') det = `<path d="M136 180 L150 232 L164 180" fill="${c.detalhe}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M150 236 V352" stroke="${INK}" stroke-width="4"/><circle cx="160" cy="262" r="4" fill="${INK}"/><circle cx="160" cy="298" r="4" fill="${INK}"/><circle cx="160" cy="334" r="4" fill="${INK}"/>`;
  if (c.moletom) det = `<path d="M118 182 Q150 214 182 182" fill="${c.detalhe}" stroke="${INK}" stroke-width="5"/>
      <path d="M140 200 v34 M160 200 v34" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      <path d="M118 300 h64 v40 h-64 Z" fill="${c.detalhe}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  if (c.cabelo === 'trancas') det = `<path d="M130 182 Q150 200 170 182" fill="none" stroke="${INK}" stroke-width="4"/>
      <path d="M100 290 h104" stroke="${c.detalhe}" stroke-width="14"/><path d="M98 284 h108 M98 297 h108" stroke="${INK}" stroke-width="3" opacity=".25"/>`;
  if (c.barba) det = `<path d="M128 178 l22 18 l22 -18" fill="#FFFFFF" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M150 196 V356" stroke="${c.detalhe}" stroke-width="6"/>`;
  const sombra = `<path d="M176 182 Q190 184 194 186 L204 362 Q190 366 178 367 Q186 280 176 182 Z" fill="${INK}" opacity=".12"/>`;
  return corpo + sombra + det;
}

function pernas(c) {
  if (c.tipoBaixo === 'saia') {
    return `${membro([[132, 420], [130, 480], [130, 548]], c.pele, 24)}${membro([[168, 420], [170, 480], [170, 548]], c.pele, 24)}
      <path d="M98 352 L202 352 L222 452 Q150 468 78 452 Z" fill="${c.baixo}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M120 370 l-10 74 M150 372 v84 M180 370 l10 74" stroke="#D8962A" stroke-width="4"/>`;
  }
  if (c.tipoBaixo === 'pantalona') {
    return `<path d="M98 352 L202 352 L214 548 L158 548 L150 430 L142 548 L86 548 Z" fill="${c.baixo}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  }
  return `${membro([[128, 356], [126, 450], [126, 546]], c.baixo, 40)}${membro([[172, 356], [174, 450], [174, 546]], c.baixo, 40)}`;
}

function sapatos(c) {
  return `<path d="M96 548 h50 q8 0 8 10 v6 h-66 q-2 -16 8 -16 Z" fill="${c.tenis}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M154 548 h50 q10 0 8 16 h-66 v-6 q0 -10 8 -10 Z" fill="${c.tenis}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
}

function personagem(id, o = {}) {
  const c = ELENCO[id];
  const pd = POSES[o.bracoD || 'baixo'];
  const pe = espelha(POSES[o.bracoE || 'baixo']);
  const exp = o.expressao || 'feliz';
  const manga = c.blusa;
  const brinco = c.brinco ? (c.argola
    ? `<circle cx="96" cy="140" r="9" fill="none" stroke="${c.brinco}" stroke-width="4"/><circle cx="204" cy="140" r="9" fill="none" stroke="${c.brinco}" stroke-width="4"/>`
    : `<circle cx="96" cy="136" r="5" fill="${c.brinco}" stroke="${INK}" stroke-width="2"/><circle cx="204" cy="136" r="5" fill="${c.brinco}" stroke="${INK}" stroke-width="2"/>`) : '';
  const uid = ++UID;
  const flip = o.espelhar ? ` transform="translate(300 0) scale(-1 1)"` : '';
  return `<svg viewBox="${o.recorte || '0 0 300 600'}" xmlns="http://www.w3.org/2000/svg" class="${o.classe || 'pers'}" style="${o.estilo || ''}"><g${flip}>
    <ellipse cx="150" cy="570" rx="96" ry="12" fill="${INK}" opacity=".12"/>
    ${c.cabelo !== 'trancas' ? cabeloAtras(c) : ''}
    ${pernas(c)}
    ${sapatos(c)}
    ${membro(pe, manga, 34)}
    ${tronco(c)}
    ${c.cabelo === 'trancas' ? cabeloAtras(c) : ''}
    <rect x="136" y="150" width="28" height="36" fill="${c.pele}" stroke="${INK}" stroke-width="5"/>
    <path d="M139 158 Q150 168 161 158 L161 172 Q150 176 139 172 Z" fill="${tom(c.pele, -0.25)}"/>
    <g transform="translate(150 118) scale(1.1) translate(-150 -118)">
    <ellipse cx="96" cy="118" rx="11" ry="14" fill="${c.pele}" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="204" cy="118" rx="11" ry="14" fill="${c.pele}" stroke="${INK}" stroke-width="5"/>
    <clipPath id="cab${uid}"><path d="M150 54 C188 54 204 82 204 112 C204 146 182 168 150 168 C118 168 96 146 96 112 C96 82 112 54 150 54 Z"/></clipPath>
    <path d="M150 54 C188 54 204 82 204 112 C204 146 182 168 150 168 C118 168 96 146 96 112 C96 82 112 54 150 54 Z" fill="${c.pele}"/>
    <g clip-path="url(#cab${uid})">
      <path d="M182 60 C214 90 210 150 160 172 L220 180 L220 50 Z" fill="${tom(c.pele, -0.16)}"/>
      <ellipse cx="128" cy="86" rx="22" ry="12" fill="#FFFFFF" opacity=".14"/>
      <path d="M96 84 Q150 100 204 84 L204 70 L96 70 Z" fill="${tom(c.pele, -0.2)}" opacity=".5"/>
    </g>
    <path d="M150 54 C188 54 204 82 204 112 C204 146 182 168 150 168 C118 168 96 146 96 112 C96 82 112 54 150 54 Z" fill="none" stroke="${INK}" stroke-width="6"/>
    ${barba(c)}
    ${cabeloFrente(c)}
    ${rosto(c, exp)}
    ${brinco}
    </g>
    ${membro(pd, manga, 34)}
    ${mao(pe[2][0], pe[2][1], c.pele)}
    ${mao(pd[2][0], pd[2][1], c.pele)}
    ${propNaMao(o.prop, pd[2][0], pd[2][1])}
    ${propNaMao(o.propE, pe[2][0], pe[2][1])}
  </g></svg>`;
}

module.exports = { personagem, ELENCO, INK };
