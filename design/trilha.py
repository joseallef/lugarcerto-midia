"""Trilha sonora original (livre de direitos) + efeitos sincronizados para os Reels.

Gera uma música pop animada (118 BPM, C–G–Am–F) com bateria, baixo, acordes
e melodia de marimba, mais efeitos (impacto, pop, whoosh, plim) nos tempos das cenas.
Uso: python3 design/trilha.py   (mistura o áudio nos MP4 de semana-48/reels)
"""
import os, subprocess, wave
import numpy as np
from scipy.signal import butter, lfilter

SR = 44100
DUR = 15.0
N = int(SR * DUR)
BPM = 118
BEAT = 60 / BPM
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, d=0.25, sus=0.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * (sus + (1 - sus) * np.exp(-t / d))
    return e


def add(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def lp(x, f):
    b, a = butter(2, f / (SR / 2), 'low')
    return lfilter(b, a, x)


def hp(x, f):
    b, a = butter(2, f / (SR / 2), 'high')
    return lfilter(b, a, x)


def nota(m):  # MIDI -> Hz
    return 440 * 2 ** ((m - 69) / 12)


# ---------- instrumentos ----------
def kick():
    t = t_(0.35)
    f = 50 + 110 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def clap():
    s = hp(rng.standard_normal(int(SR * 0.2)), 1200) * env(int(SR * 0.2), 0.001, 0.06)
    return s * 0.6


def hat(open_=False):
    s = hp(rng.standard_normal(int(SR * 0.12)), 7000) * env(int(SR * 0.12), 0.001, 0.05 if open_ else 0.018)
    return s * 0.35


def baixo(m, d):
    t = t_(d)
    f = nota(m)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.4 + np.sin(2 * np.pi * f * t)
    return lp(s, 500) * env(len(t), 0.004, 0.18, 0.35) * 0.55


def stab(ms, d=0.22):
    t = t_(d)
    s = sum(sum(np.sin(2 * np.pi * nota(m) * k * t) / k for k in range(1, 6)) for m in ms)
    return lp(s, 2500) * env(len(t), 0.003, 0.09) * 0.13


def marimba(m, d=0.35):
    t = t_(d)
    f = nota(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)
    return s * env(len(t), 0.002, 0.16) * 0.32


def pad(ms, d):
    t = t_(d)
    s = sum(np.sin(2 * np.pi * nota(m) * t + np.sin(2 * np.pi * 0.3 * t)) for m in ms)
    e = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.6)
    return s * e * 0.05


# ---------- efeitos ----------
def impacto():
    t = t_(0.7)
    f = 30 + 120 * np.exp(-t / 0.08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.25)
    n = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t / 0.08)
    return (s + 0.5 * n) * 0.9


def pop():
    t = t_(0.09)
    f = 700 + 900 * (t / 0.09)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.03) * 0.45


def whoosh():
    d = 0.45
    t = t_(d)
    n = rng.standard_normal(len(t))
    s = lp(hp(n, 600), 4000)
    e = np.sin(np.pi * t / d) ** 2
    return s * e * 0.35


def plim(f=1568):
    t = t_(1.2)
    s = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.01 * t) + 0.25 * np.sin(2 * np.pi * f * 3 * t)
    return s * env(len(t), 0.002, 0.35) * 0.32


def caixa():  # "cha-ching"
    s = np.zeros(int(SR * 1.3))
    add(s, hp(rng.standard_normal(int(SR * 0.08)), 3000) * env(int(SR * 0.08), 0.001, 0.03) * 0.5, 0)
    add(s, plim(2093), 0.09)
    add(s, plim(2637) * 0.8, 0.16)
    return s


SFX = {'impacto': impacto, 'pop': pop, 'whoosh': whoosh, 'plim': plim, 'caixa': caixa}


# ---------- música ----------
def musica(seed_shift=0):
    m = np.zeros(N)
    prog = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
    raiz = [36, 31, 33, 29]
    melodia = [72, 76, 79, 76, 74, 79, 83, 79, 76, 72, 74, 76, 77, 76, 74, 72]
    barra = BEAT * 4
    nb = int(DUR / barra) + 1
    for b in range(nb):
        t0 = b * barra
        acorde, r = prog[(b + seed_shift) % 4], raiz[(b + seed_shift) % 4]
        fim = t0 >= 11.4  # assinatura de marca no final
        for k in range(8):  # colcheias
            tt = t0 + k * BEAT / 2
            if tt >= DUR:
                break
            if True:
                if k % 2 == 0 and k in (0, 4) or k == 3:
                    add(m, kick(), tt)
                if k in (2, 6):
                    add(m, clap(), tt)
                add(m, hat(open_=(k % 2 == 1)), tt)
                add(m, baixo(r + (12 if k % 4 == 3 else 0), BEAT / 2), tt)
                if k % 2 == 1:
                    add(m, stab(acorde), tt)
                add(m, marimba(melodia[(b * 8 + k + seed_shift * 3) % 16] - (12 if b % 2 else 0)), tt)
        add(m, pad(acorde, barra), t0)
    # final: acorde aberto e fade
    add(m, pad([60, 64, 67, 72], 3.4) * 3.5, 11.6)
    for i, n_ in enumerate([72, 76, 79, 84]):
        add(m, marimba(n_, 0.8), 11.6 + i * 0.12)
    fade = np.ones(N)
    k = int(SR * 1.2)
    fade[-k:] = np.linspace(1, 0, k)
    return m * fade


EPISODIOS = {
    'ep1-subiu-tudo': [('impacto', .1), ('impacto', .6), ('pop', 1.0), ('pop', 1.6), ('whoosh', 3.4), ('impacto', 3.75), ('pop', 4.1),
                       ('whoosh', 6.45), ('whoosh', 7.0), ('pop', 7.6), ('pop', 7.9), ('pop', 8.2), ('pop', 8.5), ('pop', 9.0), ('pop', 9.8),
                       ('whoosh', 11.45), ('plim', 11.7), ('pop', 12.1), ('caixa', 12.5)],
    'ep2-o-que-acabou': [('impacto', .1), ('pop', 1.2), ('pop', 2.2), ('whoosh', 4.05), ('pop', 4.3), ('pop', 5.0), ('whoosh', 6.65), ('whoosh', 7.1),
                         ('pop', 7.8), ('pop', 8.2), ('pop', 8.5), ('pop', 9.0), ('pop', 9.8), ('whoosh', 11.45), ('plim', 11.7), ('caixa', 12.5)],
    'ep3-comida-estragando': [('impacto', .1), ('pop', .9), ('pop', 1.2), ('pop', 1.4), ('pop', 1.6), ('pop', 1.8), ('pop', 2.2), ('whoosh', 3.85),
                              ('impacto', 4.15), ('whoosh', 6.85), ('whoosh', 7.3), ('pop', 8.0), ('pop', 8.3), ('pop', 8.6), ('pop', 9.1), ('pop', 9.8),
                              ('whoosh', 11.45), ('plim', 11.7), ('caixa', 12.5)],
    'ep4-cade-o-dinheiro': [('impacto', .1), ('whoosh', .8), ('caixa', .9), ('pop', 1.8), ('whoosh', 3.65), ('impacto', 3.95), ('whoosh', 6.65),
                            ('pop', 7.3), ('pop', 7.8), ('pop', 8.2), ('pop', 8.6), ('pop', 9.2), ('pop', 9.7), ('whoosh', 11.45), ('plim', 11.7), ('caixa', 12.5)],
}


def salvar_wav(path, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    st = np.stack([x, x], axis=1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


if __name__ == '__main__':
    base = os.path.join(os.path.dirname(__file__), '..', 'semana-48', 'reels')
    for i, (nome, eventos) in enumerate(EPISODIOS.items()):
        mix = musica(seed_shift=i) * 0.62
        fx = np.zeros(N)
        for tipo, t in eventos:
            add(fx, SFX[tipo](), t)
        mix = mix + fx * 0.75
        wav = os.path.join(base, f'{nome}.wav')
        salvar_wav(wav, mix)
        mp4 = os.path.join(base, f'{nome}.mp4')
        tmp = mp4 + '.tmp.mp4'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp4, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                        '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-shortest', '-movflags', '+faststart', tmp], check=True)
        os.replace(tmp, mp4)
        os.remove(wav)
        print('ok', nome)
