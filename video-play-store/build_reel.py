"""Monta reel.html (1080x1920) reaproveitando estilo, personagem e motor de animação do video.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
v = open(os.path.join(D, 'video.html'), encoding='utf-8').read()
body = open(os.path.join(D, 'reel_body.html'), encoding='utf-8').read()

def between(s, a, b):
    i = s.index(a); j = s.index(b, i); return s[i:j]

head = v[: v.index('</style>')]
head = head.replace('html,body{background:#000;width:1920px;height:1080px', 'html,body{background:#000;width:1080px;height:1920px')
head = head.replace('#stage{position:relative;width:1920px;height:1080px', '#stage{position:relative;width:1080px;height:1920px')
head = head.replace('<title>Lugar Certo — vídeo Play Store</title>', '<title>Lugar Certo — Reel</title>')
head += """
.floor{height:300px}
.rt{position:absolute;left:70px;top:290px;width:940px}.rt .h1{font-size:100px}
#bug{left:70px;top:170px;transform:scale(.85);transform-origin:left top}
#vhs{position:absolute;inset:0;z-index:70;display:none;background:repeating-linear-gradient(rgba(0,0,0,.2) 0 3px,transparent 3px 7px)}
#vhs .vt{position:absolute;left:70px;top:620px;font-family:'DejaVu Sans Mono',monospace;font-weight:700;font-size:74px;color:#fff;text-shadow:5px 0 #ff3b6b,-5px 0 #3bd5ff}
#vhs .vc{position:absolute;left:70px;top:715px;font-family:'DejaVu Sans Mono',monospace;font-weight:700;font-size:44px;color:#fff;opacity:.9}
#vhs .vband{position:absolute;left:0;right:0;height:120px;background:linear-gradient(transparent,rgba(255,255,255,.45),transparent)}
#vhs .vq{position:absolute;left:0;right:0;top:820px;text-align:center}
</style>"""
head += v[v.index('</style>') + len('</style>'): v.index('<body>')] + '<body>\n<div id="stage">\n  <div id="amb"></div>\n  <div class="floor"></div>\n'

tail_html = between(v, '<div id="bug" class="logo">', '<script>')

js_helpers = between(v, '/* ---------------- helpers', '/* ---------------- S1 shelves')
js_rows = between(v, '/* ---------------- list rows', "$('#list4')")
js_qr = between(v, '/* ---------------- receipt + QR', "$('#rc5')")
js_driver = between(v, '/* ---------------- motion engine', 'const qs=new URLSearchParams')
js_driver = js_driver.replace('const WHIPS={5:1,12.5:1,20:-1,26.5:1,32.5:-1,38:1,43:-1}, WIPES=[46.5], FLASH=[9.5];',
                              'const WHIPS={2.6:1,5.2:-1,12.6:1,16:-1,19:1}, WIPES=[22], FLASH=[9.0];')
js_driver = js_driver.replace("$('#bug').style.opacity=(t>=12.5&&t<46.5)?1:0;", "$('#bug').style.opacity=(t>=9&&t<22)?1:0;")
js_driver = js_driver.replace('window.render=render;window.DURATION=60;', '')

js_reel = r"""
/* ---------------- reel builders ---------------- */
(function(){const items=[['🧀',60,170],['🧀',160,185],['🧀',260,175],['🍉',360,150],['🦆',190,50,1],['🍫',90,80],['🍫',330,60],['🍫',420,95],['🥤',460,30],['🍪',280,-30]];
  $('#rpile').innerHTML=items.map((it,i)=>`<div class="emo a" style="--an:drop;--at:${.3+i*.14}s;--du:.45s;--ez:cubic-bezier(.5,0,.5,1.4);--r:${(rnd()*40-20).toFixed(0)}deg;left:${it[1]}px;top:${it[2]}px;font-size:${it[3]?140:96}px">${it[0]}</div>`).join('');})();
$('#rburst').innerHTML=Array.from({length:16},(_,i)=>{const a=i*0.3927,c=Math.cos,s=Math.sin;return `<path d="M0 0 L${(470*c(a-.06)).toFixed(0)} ${(470*s(a-.06)).toFixed(0)} L${(470*c(a+.06)).toFixed(0)} ${(470*s(a+.06)).toFixed(0)} Z" fill="#FFD43B" opacity=".35"/>`}).join('');
$('#rlist4').innerHTML=rows([['cat','🥖 Padaria'],['Pão francês','0,5 kg','8,45',1.0,1],['cat','🥫 Mercearia'],['Leite integral 1 L','6 un.','29,94',1.6,1],['Café 500 g','1 un.','18,90',2.2,1]],{dim:true});
$('#rlist5').innerHTML=rows([['Pão francês','0,5 kg','8,45',2.95],['Leite integral 1 L','6 un.','29,94',3.05],['Café 500 g','1 un.','18,90',3.15]]).replace(/class="row"/g,'class="row a" style="--an:right;--at:2.75s;--du:.4s"');
$('#rrc').innerHTML=`<div style="text-align:center;font-weight:700">SUPERMERCADO<br>NFC-e · HOJE</div><hr>
 <div class="ln"><span>PAO FRANCES</span><span>8,45</span></div><div class="ln"><span>LEITE 1L x6</span><span>29,94</span></div>
 <div class="ln"><span>CAFE 500G</span><span>18,90</span></div><hr><div class="ln" style="font-weight:700"><span>TOTAL</span><span>57,29</span></div><div class="qr" id="rqr"></div>`;
qr($('#rqr'),5);qr($('#rqrb'),5);
(function(){
  const items=[['Café 500 g','1 un.',-1],['Leite integral 1 L','6 un.',0.75],['Pão francês','0,5 kg',1.85]];
  let h=`<div class="apphead"><div class="sbar">9:41<i>▂▄▆ ◔ ▮</i></div><h3>Casa · semana</h3><p>👥 Léo e Bia · lista compartilhada</p></div>`;
  items.forEach(it=>{h+=`<div class="row"><div class="bx a" style="--an:boxon;--at:${it[2]}s;--du:.18s;--ez:linear"><span class="a" style="--an:pop;--at:${it[2]}s;--du:.3s;display:grid">${CHECK}</span></div><div class="nm">${it[0]}<small>${it[1]}</small></div></div>`;});
  [[0.55,'Léo marcou: Leite integral ✓'],[1.65,'Léo marcou: Pão francês ✓ (finalmente!)']].forEach(([at,txt])=>h+=`<div class="abs a" style="left:14px;right:14px;top:40px;z-index:12;background:#fff;border-radius:22px;padding:14px 16px;display:flex;gap:12px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.25);--an:bannerdown;--at:${at}s;--du:1.15s;--ez:ease-out">
      <div class="mark" style="width:46px;height:46px;border-radius:12px;background:#169b5a"><svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17.5 L19.5 7" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div style="font-weight:800;font-size:19px;line-height:1.25"><b style="font-weight:900">Lugar Certo</b><br>${txt}</div></div>`);
  $('#rduo').innerHTML=h;})();
"""

js_wrap = r"""
/* ---------------- rewind (VHS) ---------------- */
const RW0=7.5,RW1=9.0,baseRender=render;
function renderReel(t){
  let src=t,rw=t>=RW0&&t<RW1,p=0;
  if(rw){p=(t-RW0)/(RW1-RW0);src=Math.max(.2,RW0-.05-ease.inout(Math.min(1,p/.85))*7.3);}
  baseRender(src);
  const v=$('#vhs');v.style.display=rw?'block':'none';
  if(rw){const s=Math.floor(src),fr=Math.floor((src%1)*30);
    $('#vtc').textContent='00:00:'+String(s).padStart(2,'0')+':'+String(fr).padStart(2,'0');
    $('#vband').style.top=(((p*4)%1)*2100-150)+'px';
    $('#stage').style.filter=`saturate(1.5) contrast(1.08) hue-rotate(${(Math.sin(t*37)*8).toFixed(1)}deg)`;
    v.querySelector('.vt').style.transform=`translateX(${(Math.sin(t*93)*5).toFixed(1)}px)`;
    const q=clamp((p-.45)/.15);const qe=v.querySelector('.vq');qe.style.opacity=q;qe.style.transform=`scale(${(.4+.6*ease.out(q)).toFixed(3)}) rotate(-3deg)`;
  } else $('#stage').style.filter='none';
}
window.render=renderReel;window.DURATION=26;
const qs=new URLSearchParams(location.search);
document.fonts.ready.then(()=>{renderReel(+(qs.get('t')||0));window.READY=true;});
"""

out = head + body + '\n' + tail_html + '<script>\n' + js_helpers + js_rows + js_qr + js_reel + js_driver + js_wrap + '</script>\n</body>\n</html>\n'
open(os.path.join(D, 'reel.html'), 'w', encoding='utf-8').write(out)
print('reel.html', len(out))
