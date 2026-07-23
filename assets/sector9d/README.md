# Sector 9D source media

Place the two approved source files in this directory with these exact names:

- `Medical_instruments_moving_on_black_202607231715.mp4`
- `ezgif-35dd2244dafee1ab-jpg.zip`

The MP4 is the approved 8-second, 1280×720, 24 FPS opening cinematic. Do not substitute the earlier reveal/vanish file.

The ZIP must contain exactly 260 JPG frames. Frame filenames may keep their original `ezgif-frame-001.jpg` style; the build sorts them by their trailing frame number.

During `npm run dev` and `npm run build`, `scripts/prepare-cinematic-assets.mjs` will:

1. copy the MP4 to `public/media/sector9d/intro.mp4`;
2. validate the ZIP contains exactly 260 JPG frames;
3. generate an optimized 400×225-per-frame desktop WebP sprite;
4. generate an optimized 240×135-per-frame mobile WebP sprite;
5. write `public/media/sector9d/manifest.json` with the generated asset metadata.

The generated `public/media/sector9d/` directory is ignored by Git and must not be committed manually.

If either source file is missing, the build remains valid and the website presents its accessible designed fallback. Incomplete legacy base64 chunks are ignored rather than breaking the build.