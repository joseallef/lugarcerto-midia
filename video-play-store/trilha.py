"""Trilha + efeitos sonoros do vídeo Lugar Certo (síntese 100% original, sem samples).
Gera trilha.wav (60 s, 44.1 kHz, estéreo). Uso: python3 trilha.py [saida.wav]"""
import sys, wave
import numpy as np

SR = 44100
DUR = 60.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(42)
BPM = 120; BEAT = 60 / BPM

def note_hz(n):  # midi -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def put(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2) * 1.414
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2) * 1.414

def env(n, a=0.005, d=0.2, s=0.0, r=0.05, hold=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * (s + (1 - s) * np.exp(-t / max(d, 1e-4)))
    if r and n > 0:
        rn = min(n, int(r * SR)); e[-rn:] *= np.linspace(1, 0, rn)
    return e

def osc(freq, dur, kind='sine', phase=0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = np.broadcast_to(freq, (n,)) if np.ndim(freq) else np.full(n, freq)
    ph = 2 * np.pi * np.cumsum(f) / SR + phase
    if kind == 'sine': return np.sin(ph)
    if kind == 'tri': return 2 / np.pi * np.arcsin(np.sin(ph))
    if kind == 'saw':  # band-limited-ish
        return sum(np.sin(ph * k) / k for k in range(1, 12)) * 0.6
    if kind == 'square':
        return sum(np.sin(ph * k) / k for k in range(1, 14, 2)) * 0.9
    raise ValueError(kind)

def lowpass(x, cutoff):
    """one-pole low-pass via FFT convolution with a truncated exponential kernel"""
    tau = 1 / (2 * np.pi * cutoff); k = np.exp(-np.arange(int(tau * SR * 6) + 2) / (tau * SR)); k /= k.sum()
    n = len(x) + len(k) - 1; m = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(k, m), m)[: len(x)]

def noise(dur): return rng.uniform(-1, 1, int(dur * SR))
def hp(x): return np.diff(x, prepend=0)

# ---------- instruments ----------
def marimba(n, dur=0.35, g=1.0):
    f = note_hz(n); d = dur
    s = osc(f, d) + 0.35 * osc(f * 4, d) * env(int(d * SR), d=0.03) + 0.15 * osc(f * 10, d) * env(int(d * SR), d=0.01)
    return s * env(int(d * SR), a=0.002, d=d / 3, r=0.03) * g

def pluck(n, dur=0.3):
    f = note_hz(n); s = osc(f, dur, 'saw') * 0.6 + osc(f * 2, dur, 'tri') * 0.3
    return s * env(int(dur * SR), a=0.002, d=0.08, r=0.03)

def bass(n, dur=0.45):
    f = note_hz(n); s = osc(f, dur, 'sine') + 0.35 * osc(f * 2, dur, 'tri')
    return np.tanh(s * 1.6) * env(int(dur * SR), a=0.004, d=0.25, s=0.4, r=0.06)

def kick(g=1.0):
    d = 0.32; t = np.arange(int(d * SR)) / SR
    f = 50 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * g

def clap(g=1.0):
    d = 0.2; x = hp(noise(d)) * env(int(d * SR), a=0.001, d=0.05)
    return x * g

def hat(g=1.0, d=0.05):
    return hp(hp(noise(d))) * env(int(d * SR), a=0.0005, d=0.012) * g

def shaker(g=1.0):
    d = 0.08; return hp(noise(d)) * env(int(d * SR), a=0.02, d=0.02) * g

def bell(n, dur=1.2, g=1.0):
    f = note_hz(n); t = np.arange(int(dur * SR)) / SR
    s = np.sin(2 * np.pi * f * t + 1.8 * np.sin(2 * np.pi * f * 3.5 * t) * np.exp(-t * 4))
    return s * np.exp(-t * 3.5) * env(int(dur * SR), a=0.002, d=99, s=1, r=0.05) * g

# ---------- sfx ----------
def whoosh(dur=0.45, up=True, g=1.0):
    x = noise(dur); n = len(x); t = np.linspace(0, 1, n)
    shape = np.sin(np.pi * t) ** 2
    # crude band sweep: mix of highpassed & lowpassed noise
    lp = lowpass(x, 900); hpx = x - lp
    mix = (lp * (1 - t) + hpx * t) if up else (lp * t + hpx * (1 - t))
    return mix * shape * g * 1.4

def pop(n=84, g=1.0):
    d = 0.12; t = np.arange(int(d * SR)) / SR
    f = note_hz(n) * (1 + 1.2 * np.exp(-t * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * g

def click(g=1.0):
    d = 0.03; return hp(noise(d)) * np.exp(-np.arange(int(d * SR)) / SR * 220) * g

def kaching(g=1.0):
    s = np.zeros(int(1.2 * SR))
    c = click(1.5); s[:len(c)] += c
    for k, n in enumerate([88, 93, 96]):
        b = bell(n, 1.0, 0.5); i = int((0.06 + k * 0.05) * SR); s[i:i + len(b)] += b[: len(s) - i]
    return s * g

def beep(n=93, d=0.09, g=1.0):
    return osc(note_hz(n), d, 'square') * env(int(d * SR), a=0.002, d=99, s=1, r=0.01) * g

def ding(g=1.0):
    s = bell(91, 0.9, 0.7); b = bell(96, 0.9, 0.6)
    out = np.zeros(int(1.1 * SR)); out[:len(s)] += s; i = int(0.11 * SR); out[i:i + len(b)] += b
    return out * g

def trombone(notes, start, g=1.0):  # "wah wah wah waaah"
    t0 = start
    for k, (n, d) in enumerate(notes):
        nn = int(d * SR); t = np.arange(nn) / SR
        vib = 1 + (0.012 * np.sin(2 * np.pi * 6 * t) * (t / d) if k == len(notes) - 1 else 0)
        bend = 1 - 0.03 * (t / d) if k == len(notes) - 1 else 1
        f = note_hz(n) * vib * bend
        s = osc(f, d, 'saw'); s = lowpass(s, 1100)
        s = s * env(nn, a=0.03, d=99, s=1, r=0.08)
        put(s, t0, 0.5 * g); t0 += d

def slide_whistle(f0, f1, d, g=1.0):
    t = np.linspace(0, 1, int(d * SR)); f = f0 * (f1 / f0) ** t
    return osc(f, d) * env(int(d * SR), a=0.02, d=99, s=1, r=0.05) * g

def boing(g=1.0):
    d = 0.4; t = np.arange(int(d * SR)) / SR
    f = 180 + 220 * np.exp(-t * 6) * (1 + 0.3 * np.sin(2 * np.pi * 18 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * g

def scratch(g=1.0):
    d = 0.35; t = np.arange(int(d * SR)) / SR
    f = 300 + 900 * np.abs(np.sin(2 * np.pi * 4.5 * t))
    s = osc(f, d, 'saw') * 0.4 + hp(noise(d)) * 0.5
    return lowpass(s, 2500) * env(int(d * SR), a=0.003, d=99, s=1, r=0.05) * g

def hit(g=1.0):  # dramatic "DUN!"
    d = 1.6; t = np.arange(int(d * SR)) / SR
    boom = np.sin(2 * np.pi * np.cumsum(40 + 60 * np.exp(-t * 8)) / SR) * np.exp(-t * 2.2)
    crash = hp(noise(d)) * np.exp(-t * 2.5) * 0.35
    stab = sum(osc(note_hz(n), d, 'saw') for n in [36, 42, 48, 54]) * np.exp(-t * 3) * 0.18
    return np.tanh((boom * 1.2 + crash + lowpass(stab, 1400)) * 1.3) * g

def riser(d, g=1.0):
    x = noise(d); t = np.linspace(0, 1, len(x))
    hp_ = x - lowpass(x, 1500); return (hp_ * t + (x - lowpass(x, 300)) * (1 - t)) * t ** 2 * g

# ---------- music ----------
C, G, Am, F = 48, 43, 45, 41  # bass roots
PROG = [(C, [60, 64, 67]), (G, [59, 62, 67]), (Am, [60, 64, 69]), (F, [60, 65, 69])]
HOOK = [(0, 76), (0.5, 79), (1.0, 81), (1.5, 79), (2.5, 76), (3.0, 74), (3.5, 72), (4.5, 74), (5.0, 76), (6.0, 72)]

def groove(t0, t1, intensity=1.0, lead=True):
    bar = 4 * BEAT; nb = int(round((t1 - t0) / bar))
    for b in range(nb):
        tb = t0 + b * bar; root, chord = PROG[b % 4]
        for q in range(4):
            tq = tb + q * BEAT
            put(kick(0.9 * intensity), tq)
            if q in (1, 3): put(clap(0.45 * intensity), tq, pan=0.1)
            put(hat(0.18), tq + BEAT / 2, pan=0.3)
            for s16 in range(4): put(shaker(0.07 + 0.04 * (s16 % 2)), tq + s16 * BEAT / 4, pan=-0.35)
            # bass: root on beat, octave pop on the "and"
            put(bass(root, 0.4), tq, 0.55 * intensity)
            put(bass(root + 12, 0.2), tq + BEAT * 0.75, 0.3 * intensity)
            # offbeat chord skank (tropical pluck)
            for k, n in enumerate(chord): put(pluck(n, 0.22), tq + BEAT / 2, 0.11 * intensity, pan=-0.4 + 0.4 * k)
        if lead and b % 4 in (0, 2):
            for off, n in HOOK:
                if off < 8: put(marimba(n, 0.4), tb + off * BEAT / 2 * 1.0, 0.32 * intensity, pan=0.2)

# Intro (0–5): playful pizzicato walk
walk = [60, 64, 67, 64, 62, 65, 69, 65, 64, 67, 72, 67, 65, 69, 74, 71]
for i, n in enumerate(walk):
    tt = i * BEAT / 2 * 0.95 + 0.05
    if tt > 3.8: break
    put(marimba(n, 0.25), tt, 0.5, pan=0.25)
    if i % 2 == 0: put(bass([48, 50, 52, 53][(i // 4) % 4], 0.3), tt, 0.45)
    if i % 4 == 2: put(clap(0.18), tt)
trombone([(55, 0.28), (54, 0.28), (53, 0.28), (52, 0.75)], 3.85, 1.0)
for i in range(12): put(pop(72 + i * 2, 0.35), 1.75 + i * 0.17 + 0.28, pan=0.5)  # items landing in the cart

# Caixa (5–9.5): suspense + accelerating register ticks + hit
for k in range(8):
    put(bass(41 if k % 2 == 0 else 42, 0.5), 5.0 + k * 0.38, 0.45)
tt, gap = 5.6, 0.2
while tt < 8.0:
    put(click(0.5), tt, pan=0.3); put(beep(100, 0.02, 0.05), tt, pan=0.3); tt += gap; gap = max(0.035, gap * 0.9)
put(riser(2.4, 0.18), 5.6)
put(hit(0.95), 8.0)
put(boing(0.25), 8.05)

# Pause + logo (9.5–12.5)
put(scratch(0.6), 9.38)
for k, n in enumerate([72, 76, 79, 84]): put(bell(n, 1.4, 0.32), 9.85 + k * 0.09, pan=-0.3 + 0.2 * k)
for k in range(10): put(pop(96 + k % 5, 0.12), 10.22 + k * 0.03, pan=rng.uniform(-.8, .8))
put(riser(2.0, 0.22), 10.5)
for k in range(8): put(clap(0.08 + k * 0.03), 11.5 + k * 0.125)
# pad under logo
pad = sum(osc(note_hz(n), 3.0, 'tri') for n in [60, 64, 67, 72]) * env(int(3.0 * SR), a=0.6, d=99, s=1, r=0.5)
put(lowpass(pad, 1500), 9.6, 0.08)

# Main groove 12.5–46.5 (17 bars)
groove(12.5, 46.5, 1.0, lead=True)
# End card 46.5–58.5 softer, then final chord
groove(46.5, 58.5, 0.75, lead=False)
for k, n in enumerate([48, 60, 64, 67, 72, 76]): put(bell(n, 2.0, 0.2), 58.5 + k * 0.02)
put(kick(1.0), 58.5); put(hit(0.35), 58.5)

# ---------- SFX synced to the picture ----------
for b in [5, 12.5, 20, 26.5, 32.5, 38, 43]: put(whoosh(0.45, True, 0.35), b - 0.3, pan=0.0)
put(whoosh(0.7, True, 0.4), 46.15)
# S4 taps & checks
for x in [1.0, 1.7, 2.4, 3.1, 3.8]:
    put(click(0.35), 12.5 + x - 0.1, pan=0.4); put(pop(88, 0.25), 12.5 + x, pan=0.4)
put(whoosh(0.6, True, 0.3), 12.5 + 4.55)
for k in range(9): put(pop(84 + k, 0.12), 12.5 + 4.75 + k * 0.06, pan=0.4)
put(kaching(0.55), 12.5 + 5.25); put(pop(79, 0.4), 12.5 + 5.6)
# S5 scan
hum = osc(220, 1.6, 'tri') * (0.6 + 0.4 * np.sin(np.linspace(0, 20, int(1.6 * SR))))
put(lowpass(hum, 800), 20.9, 0.06, pan=0.4)
put(beep(93, 0.08, 0.25), 22.6, pan=0.4); put(beep(100, 0.12, 0.25), 22.7, pan=0.4)
put(whoosh(0.4, False, 0.25), 23.6)
for k in range(7): put(click(0.18), 23.9 + k * 0.1, pan=0.4)
put(pop(80, 0.35), 24.4)
# S6 chart
for k in range(5): put(pop(76 + k * 3, 0.25), 27.3 + k * 0.25, pan=0.4)
put(slide_whistle(500, 1400, 0.45, 0.18), 28.45)
put(slide_whistle(900, 600, 0.35, 0.12), 28.85)
put(pop(70, 0.3), 28.9)
# S7 sync
for t in [33.9, 36.6]:
    put(click(0.35), t - 0.1, pan=0.3); put(pop(86, 0.25), t)
    put(whoosh(0.7, True, 0.18), t + 0.1)
put(ding(0.35), 34.75, pan=0.5); put(ding(0.35), 36.75, pan=-0.5)
put(pop(78, 0.3), 36.9)
# S8 bars
for k, t in enumerate([38.7, 38.95, 39.2]): put(whoosh(0.5, True, 0.18), t)
put(pop(80, 0.3), 39.6); put(pop(76, 0.3), 40.6)
# S9 payoff
put(whoosh(0.5, True, 0.25), 43.9)
put(boing(0.3), 44.5); put(boing(0.3), 45.2)
for k, n in enumerate([72, 76, 79, 84]): put(marimba(n, 0.5), 44.5 + k * 0.08, 0.35)
# end card
put(pop(72, 0.4), 46.6); put(pop(84, 0.35), 47.3)

# ---------- master ----------
mix = np.stack([L, R], 1)
fade = np.ones(N); fn = int(1.4 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 2
mix *= fade[:, None]
mix = np.tanh(mix * 1.1) * 0.95
mix /= np.max(np.abs(mix)) / 0.89
out = sys.argv[1] if len(sys.argv) > 1 else 'trilha.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok', out)
