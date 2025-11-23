Place your Instrument Serif font file(s) here.

Recommended filename(s):
- InstrumentSerif-Regular.ttf
- InstrumentSerif-Bold.ttf (optional)

Then restart the dev server. The layout.tsx is already wired to use next/font/local and will add the CSS variable `--font-instrument` so the app will use this font automatically.

Steps:
1. Copy your .ttf files into this folder (e.g. src/fonts/InstrumentSerif-Regular.ttf).
2. Restart the dev server: npm run dev
3. Hard refresh the browser (Cmd+Shift+R) to ensure the new font is loaded.
