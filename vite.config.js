import glob from "fast-glob";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import includeHtml from "./scripts/vite-html-multiplier-changer";

export default defineConfig({
    base: '',
    plugins: [
        viteStaticCopy({
            targets: [
              {
                src: 'src/img',
                dest: 'src',
              },
              {
                src: 'src/fonts',
                dest: 'src',
              },
            ],
          }),
        includeHtml(),
        ViteImageOptimizer({
            png: {
                quality: 70,
            },
            jpeg: {
                quality: 70,
            },
            jpg: {
                quality: 70,
            },
        }),
        {
            ...imagemin(["./src/img/**/*.{jpg,png,jpeg}"], {
                destination: "./src/img/webp/",
                plugins: [imageminWebp({ quality: 70 })],
            }),
            apply: "serve",
        },
    ],
    server: {
        port: 9235,
    },
    css: {
        devSourcemap: true,
    },
    build: {
        rollupOptions: {
            input: Object.fromEntries(
                glob
                    .sync(["./*.html", "./pages/**/*.html"])
                    .map((file) => [
                        path.relative(
                            __dirname,
                            file.slice(
                                0,
                                file.length - path.extname(file).length
                            )
                        ),
                        fileURLToPath(new URL(file, import.meta.url)),
                    ])
            ),
        },


        // assetsDir: 'src',
        // outDir: 'dist',
        // cssCodeSplit: true, // розділити CSS на окремі файли
        // manifest: true,
        minify: false,
        cssMinify: false,

    },
});
