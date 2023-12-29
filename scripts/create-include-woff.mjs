import * as fs from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = {
    path: {
        srcFolder: 'src',
        build: {
            fonts: '../src/fonts',
        },
    },
    isFontsReW: false,
};

async function generateFontStyles() {
    const fontsFile = join(app.path.srcFolder, 'scss', 'fonts', 'fonts.scss');

    if (app.isFontsReW) {
        await fs.unlink(fontsFile);
    }

    const fontsFiles = await fs.readdir(join(__dirname, app.path.build.fonts));

    if (fontsFiles.length > 0) {
        const fontFaces = {};

        for (const fontFileName of fontsFiles) {



            const [fontName, fontWeight, fontStyle] = parseFontFileName(fontFileName);


            const key = `${fontName}-${fontWeight}-${fontStyle || 'normal'}`;
            const fontFace = `@font-face {\n\tfont-family: "${fontName}";\n\tfont-display: swap;\n\tsrc: url("./src/fonts/${fontFileName.replace(/.(woff|woff2)/gi, '')}.woff2") format("woff2"), url("./src/fonts/${fontFileName.replace(/.(woff|woff2)/gi, '')}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle || 'normal'};\n}\r\n`;

            if (!fontFaces[key]) {
                fontFaces[key] = fontFace;
            }
        }

        await fs.writeFile(fontsFile, Object.values(fontFaces).join('\n'));
    } else {
        await fs.unlink(fontsFile);
    }
}

function parseFontFileName(fontFileName) {
    let parsedFontWeight = fontFileName.match(
        /(thin|hairline|extralight|ultralight|light|medium|semibold|demibold|bold|extrabold|ultrabold|black|heavy|extrablack|ultrablack)/gi,
        "$1"
    );

    const fontName = fontFileName.match(/^(\w[^-\.\d\s]+)/gi, "$1");
    const fontStyle = fontFileName.toLowerCase().includes("italic")
        ? "italic"
        : null;

    if (parsedFontWeight !== null && parsedFontWeight[0]) {
        parsedFontWeight =
            parsedFontWeight[0].toLowerCase() === "thin" ||
            parsedFontWeight[0].toLowerCase() === "hairline"
                ? 100
                : parsedFontWeight[0].toLowerCase() === "extralight" ||
                  parsedFontWeight[0].toLowerCase() === "ultralight"
                ? 200
                : parsedFontWeight[0].toLowerCase() === "light"
                ? 300
                : parsedFontWeight[0].toLowerCase() === "medium"
                ? 500
                : parsedFontWeight[0].toLowerCase() === "semibold" ||
                  parsedFontWeight[0].toLowerCase() === "demibold"
                ? 600
                : parsedFontWeight[0].toLowerCase() === "bold"
                ? 700
                : parsedFontWeight[0].toLowerCase() === "extrabold" ||
                  parsedFontWeight[0].toLowerCase() === "ultrabold"
                ? 800
                : parsedFontWeight[0].toLowerCase() === "black" ||
                  parsedFontWeight[0].toLowerCase() === "heavy"
                ? 900
                : parsedFontWeight[0].toLowerCase() === "extrablack" ||
                  parsedFontWeight[0].toLowerCase() === "ultrablack"
                ? 950
                : 400;
    }
    return [fontName, parsedFontWeight || 400, fontStyle || "normal"];
}

generateFontStyles();
