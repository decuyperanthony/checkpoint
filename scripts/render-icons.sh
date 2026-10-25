#!/bin/sh
# Renders the PNG icons from their SVG sources (macOS: Quick Look and sips).
#   src/app/icon.svg          -> public/icons/icon-512.png, icon-192.png (the roundel, transparent corners)
#   scripts/icons/maskable.svg -> public/icons/icon-maskable-512.png, src/app/apple-icon.png (full bleed)
# Run from the repository root: sh scripts/render-icons.sh
set -eu

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

qlmanage -t -s 512 -o "$work" src/app/icon.svg >/dev/null
qlmanage -t -s 512 -o "$work" scripts/icons/maskable.svg >/dev/null

mkdir -p public/icons
cp "$work/icon.svg.png" public/icons/icon-512.png
sips -z 192 192 "$work/icon.svg.png" --out public/icons/icon-192.png >/dev/null
cp "$work/maskable.svg.png" public/icons/icon-maskable-512.png
sips -z 180 180 "$work/maskable.svg.png" --out src/app/apple-icon.png >/dev/null
