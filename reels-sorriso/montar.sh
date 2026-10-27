#!/usr/bin/env bash
# Junta as cenas (cenas/*.png) num MP4 1080×1920, 30 fps, sem áudio.
# A música entra no próprio Instagram (biblioteca de áudios), que ajuda no alcance.
set -euo pipefail
cd "$(dirname "$0")"
FPS=30
# cena:duração(s):zoom (1 = aproximação lenta nas fotos, 0 = parada)
CENAS="c01:4.5:0 c02:1.0:1 c03:1.0:1 c03b:1.0:1 c04:1.6:1 c05:1.6:1 c06:1.2:0 c07:2.0:0 c08:2.6:1 c09:2.6:0"
mkdir -p tmp && : > tmp/lista.txt
for item in $CENAS; do
  IFS=: read -r id dur zoom <<< "$item"
  frames=$(python3 -c "print(round($dur*$FPS))")
  if [ "$zoom" = 1 ]; then
    vf="scale=2160:3840,zoompan=z='1+0.04*on/$frames':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$frames:s=1080x1920:fps=$FPS"
  else
    vf="fps=$FPS"
  fi
  ffmpeg -loglevel error -y -loop 1 -i "cenas/$id.png" -vf "$vf,format=yuv420p" -frames:v "$frames" \
    -c:v libx264 -preset slow -crf 18 -r $FPS "tmp/$id.mp4"
  echo "file '$id.mp4'" >> tmp/lista.txt
done
ffmpeg -loglevel error -y -f concat -safe 0 -i tmp/lista.txt -c copy -movflags +faststart reels-sorriso.mp4
rm -rf tmp
echo "ok: reels-sorriso.mp4"
