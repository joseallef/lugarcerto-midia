# Vídeo Play Store: "Foi só pelo pão…"

Vídeo de 60 s em 1920×1080 com o Léo, para subir no YouTube e usar como vídeo promocional na ficha da Google Play.

| Arquivo | Para quê |
|---|---|
| `lugar-certo-play-store-1080p.mp4` | O vídeo final (H.264 + AAC, 30 fps, áudio a −14 LUFS, que é o padrão do YouTube) |
| `thumbnail-youtube.png` | Miniatura 1280×720 |
| `marca-dagua-youtube.png` | Logo 150×150 para a **marca d'água do canal**. É ela que fica clicável sobre o vídeo |
| `video.html` · `render.js` · `trilha.py` · `extras.js` | Código-fonte. Toda a animação, a trilha e os efeitos são originais, sem samples nem banco de imagens |

## Roteiro (as funcionalidades aparecem na ordem de uso)

| Tempo | Cena | Piada / gancho |
|---|---|---|
| 0–5 s | **Gancho:** "Fui no mercado só pelo pão." | O carrinho enche (3 queijos, pato inflável…) e o Léo admite: "e o pão? …esqueci." 🤦 |
| 5–9,5 s | **Dor:** o total no caixa dispara até R$ 487,90 | "QUANTO?!", com zoom de câmera e a tela tremendo |
| 9,5–12,5 s | **Virada:** logo Lugar Certo | "Calma, Léo. Tem um lugar certo pra isso." |
| 12,5–20 s | **1 · Lista do mês:** o Léo marca no corredor e o total soma na hora | "zero conta de cabeça" · "bateu certinho ✓" |
| 20–26,5 s | **2 · Escanear a nota** (QR da NFC-e) | "sem digitar nada. seu dedão agradece 👍" |
| 26,5–32,5 s | **3 · Histórico de preço** | "Tô de olho em você, café. ☕👀" |
| 32,5–38 s | **4 · Lista a dois** com sincronização em tempo real | "adeus, 'você não pegou o leite?'" |
| 38–43 s | **5 · VA, VR e salário** (grátis, pelo site) | "o VA não some mais 'misteriosamente' 🕵️" |
| 43–46,5 s | **Mês que vem: é só duplicar** | Fecha a piada do começo: "E dessa vez eu trouxe o pão. 🥖" |
| 46,5–60 s | **Tela final** com CTA | Use esses 13 s para os elementos de tela final do YouTube |

Por que foi feito assim (boas práticas de vídeo para loja de apps):
- **Funciona sem som.** A Play Store toca o vídeo mudo, então toda a mensagem está em texto grande na tela.
- **Gancho nos 3 primeiros segundos** e o app aparece antes de 13 s.
- **Mostra o uso real:** toques na tela, contador somando, câmera lendo o QR e notificação de sincronização, em vez de só listar recursos.
- **Sem promessas que a Google Play proíbe** ("melhor", "nº 1"). O que é Premium está sinalizado na tela e no rodapé. Os valores aparecem como ilustrativos.

## Como publicar

### 1. YouTube
1. Envie o `.mp4` com visibilidade **Público** ou **Não listado**. Deixe a **incorporação permitida**, a **monetização desativada** e o vídeo **sem restrição de idade**. A Google Play exige essas três coisas.
2. Miniatura: `thumbnail-youtube.png`.
3. **Logo clicável sobre o vídeo:** YouTube Studio → *Personalização* → *Branding* → *Marca d'água do vídeo* → envie `marca-dagua-youtube.png` e escolha **"Vídeo inteiro"**. O logo fica no canto do player e quem clica se inscreve no canal.
4. **Tela final clicável (46,5 s até o fim):** YouTube Studio → vídeo → *Tela final*. Coloque **Inscrever-se** e **Vídeo/Playlist**, ou **Link** se o canal estiver no Programa de Parcerias, no lado direito, ao redor do Léo. O lado esquerdo já tem logo e CTA.
5. **Cards** (opcional): adicione um card de link ou vídeo aos 13 s (entrada do app) e outro aos 47 s.

**Título sugerido:** `Foi só pelo pão… 🥖 | Lugar Certo: lista de compras, nota fiscal e controle de preços`

**Descrição sugerida** (o YouTube transforma os links e os capítulos em cliques):
```
O Léo foi no mercado só pelo pão... e voltou com um pato inflável. 🦆
Com o Lugar Certo, as suas compras ficam no lugar certo:

✅ Lista do mês por categoria, com o total somando na hora
📷 Escaneie o QR Code da nota (NFC-e) e a compra entra sozinha
📈 Histórico de preço de cada item
👥 Lista compartilhada com +1 pessoa, em tempo real
💳 Quanto saiu do VA, do VR e do salário

📲 Android (Google Play): https://play.google.com/store/apps/details?id=SEU.PACOTE.AQUI
🍎 iPhone e computador: https://lugarcerto.tec.br
🎁 14 dias de Premium grátis, sem cartão.

00:00 Foi só pelo pão…
00:12 Lista do mês com o total na hora
00:20 Escaneie a nota fiscal
00:26 Histórico de preço
00:32 Compra a dois
00:38 VA, VR e salário
00:46 Baixe grátis

Importar nota fiscal, histórico de preço e lista a dois são recursos Premium (R$ 9,90/mês).
#ListaDeCompras #Supermercado #EconomiaDoméstica #NotaFiscal #LugarCerto
```
> Troque `SEU.PACOTE.AQUI` pelo ID do app no Play Console.

### 2. Google Play Console
*Crescimento → Presença na loja → Página principal da loja → Gráficos → Vídeo*: cole a URL do YouTube (por exemplo `https://www.youtube.com/watch?v=XXXX`) e salve.

## Renderizar de novo (depois de editar textos ou tempos)
```bash
node render.js /tmp/frames 30 0 60
```
```bash
python3 trilha.py /tmp/trilha.wav
```
```bash
ffmpeg -framerate 30 -i /tmp/frames/f%05d.png -i /tmp/trilha.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest lugar-certo-play-store-1080p.mp4
```
```bash
node extras.js
```
Para prever um instante específico, abra `video.html?t=8.6` no navegador.
