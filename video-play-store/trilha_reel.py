"""Trilha do Reel (26 s). Reaproveita os instrumentos de trilha.py. Uso: python3 trilha_reel.py [saida.wav]"""
import os, sys
D = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(D, 'trilha.py'), encoding='utf-8').read()
exec(src[: src.index('# Intro (0–5)')], globals())   # instrumentos + groove()

DUR = 26.0; N = int(SR * DUR); L = np.zeros(N); R = np.zeros(N)

# R1–R2: intro brincalhona
walk = [60, 64, 67, 64, 62, 65, 69, 65, 64, 67, 72, 67, 65, 69, 74, 71, 72, 76, 79, 76]
for i, n in enumerate(walk):
    tt = 0.05 + i * BEAT / 2
    if tt > 4.4: break
    put(marimba(n, 0.25), tt, 0.5, pan=0.25)
    if i % 2 == 0: put(bass([48, 50, 52, 53][(i // 4) % 4], 0.3), tt, 0.45)
    if i % 4 == 2: put(clap(0.18), tt)
put(pop(80, 0.35), 1.4)
put(whoosh(0.45, True, 0.35), 2.3)
for k, t in enumerate([2.95, 3.2, 3.45, 3.7]): put(pop(76 + k * 3, 0.3), t, pan=-0.4)
for i in range(10): put(pop(72 + i * 2, 0.28), 2.9 + i * 0.14 + 0.28, pan=0.5)
trombone([(55, 0.2), (54, 0.2), (52, 0.55)], 4.45, 1.0)

# R3: caixa
put(whoosh(0.45, True, 0.35), 4.9)
for k in range(4): put(bass(41 if k % 2 == 0 else 42, 0.45), 5.2 + k * 0.38, 0.45)
tt, gap = 5.45, 0.17
while tt < 6.75:
    put(click(0.5), tt, pan=0.3); put(beep(100, 0.02, 0.05), tt, pan=0.3); tt += gap; gap = max(0.035, gap * 0.88)
put(riser(1.3, 0.18), 5.45)
put(hit(0.95), 6.75); put(boing(0.25), 6.8)

# fita parando + rebobinando (o próprio áudio de trás pra frente, acelerado)
seg0, seg1 = int(0.2 * SR), int(7.45 * SR)
rw_len = int(1.5 * SR)
for ch in (L, R):
    seg = ch[seg0:seg1][::-1]
    idx = np.linspace(0, len(seg) - 1, rw_len)
    rev = np.interp(idx, np.arange(len(seg)), seg)
    rev = rev - lowpass(rev, 250)                     # som fino de fita
    stop = ch[int(7.15 * SR):int(7.45 * SR)].copy()  # "tape stop"
    k = np.linspace(0, 1, len(stop)); pos = np.cumsum(1 - k) ; pos = pos / pos[-1] * (len(stop) - 1) * 0.6
    ch[int(7.15 * SR):int(7.45 * SR)] = np.interp(pos, np.arange(len(stop)), stop) * (1 - k)
    i0 = int(7.5 * SR); ch[i0:i0 + rw_len] = rev * 0.55 * np.sin(np.linspace(0, np.pi, rw_len)) ** 0.3
t = np.linspace(0, 1, rw_len)
put(osc(300 + 2200 * t, 1.5, 'saw') * 0.05 * np.sin(np.pi * t), 7.5)
put(scratch(0.5), 7.45)

# R4–R7: groove
for k, n in enumerate([72, 76, 79, 84]): put(bell(n, 1.2, 0.3), 9.0 + k * 0.07, pan=-0.3 + 0.2 * k)
groove(9.0, 21.0, 1.0, lead=True)
groove(21.0, 25.0, 0.75, lead=False)
for k, n in enumerate([48, 60, 64, 67, 72, 76]): put(bell(n, 1.6, 0.2), 25.0 + k * 0.02)
put(kick(1.0), 25.0)

for x in [10.0, 10.6, 11.2]: put(click(0.35), x - 0.1, pan=0.4); put(pop(88, 0.25), x, pan=0.4)
put(boing(0.3), 11.5)
for b in [12.6, 16.0, 19.0]: put(whoosh(0.45, True, 0.35), b - 0.3)
hum = osc(220, 1.3, 'tri') * (0.6 + 0.4 * np.sin(np.linspace(0, 16, int(1.3 * SR))))
put(lowpass(hum, 800), 13.2, 0.06)
put(beep(93, 0.08, 0.25), 14.5); put(beep(100, 0.12, 0.25), 14.6)
put(pop(80, 0.3), 14.9); put(whoosh(0.4, False, 0.25), 15.2)
for k in range(3): put(click(0.2), 15.55 + k * 0.1)
put(ding(0.35), 16.55, pan=0.3); put(ding(0.35), 17.65, pan=-0.3); put(pop(78, 0.3), 18.0)
put(click(0.6), 20.1); put(kaching(0.55), 20.4)
put(boing(0.3), 20.4); put(boing(0.3), 21.1)
put(whoosh(0.7, True, 0.4), 21.65)
for k, n in enumerate([72, 76, 79, 84]): put(bell(n, 1.0, 0.25), 22.1 + k * 0.08)
put(pop(84, 0.35), 23.1)

mix = np.stack([L, R], 1)
fn = int(1.0 * SR); mix[-fn:] *= (np.linspace(1, 0, fn) ** 2)[:, None]
mix = np.tanh(mix * 1.1) * 0.95; mix /= np.max(np.abs(mix)) / 0.89
out = sys.argv[1] if len(sys.argv) > 1 else 'trilha_reel.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', out)
