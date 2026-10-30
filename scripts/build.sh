#!/usr/bin/env bash
# Build index.html (standalone page) and dist/bundle.js (used by the tests)
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=src
JS="$SRC/engine.js $SRC/svg.js $SRC/data0.js $SRC/data1.js $SRC/data2.js $SRC/data3.js $SRC/formulae.js"
mkdir -p dist
cat $JS > dist/bundle.js
{
  echo '<!doctype html>'
  echo '<html lang="vi"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '<meta name="description" content="Tài liệu ôn tập MATH1179 Mathematics for Computer Science: làm bài trực tiếp, gợi ý và tự kiểm tra đáp án.">'
  echo '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
  sed -n '1,/<style>/p' $SRC/head.html | sed '$d'
  sed -n '/<style>/,/<\/style>/p' $SRC/head.html
  echo '</head><body>'
  sed -n '/<\/style>/,$p' $SRC/head.html | sed '1d'
  echo '<script>'
  cat $JS $SRC/ui.js
  echo '</script>'
  echo '</body></html>'
} > index.html
echo "Built index.html ($(wc -c < index.html) bytes)"
