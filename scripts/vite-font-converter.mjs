import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';

const fontDir = './files/fonts';
const outputDir = './src/fonts';

function getTTFFiles(directory) {
  return readdirSync(directory)
    .filter((file) => path.extname(file) === '.ttf')
    .map((file) => path.join(directory, file));
}

function convertToWoff(files) {
  files.forEach((file) => {
    const ttfBuffer = readFileSync(file);
    const woffBuffer = ttf2woff(ttfBuffer);
    const woffFileName = path.join(outputDir, path.basename(file, '.ttf') + '.woff');
    writeFileSync(woffFileName, woffBuffer);
    console.log(`Converted ${file} to ${woffFileName}`);
  });
}

function convertToWoff2(files) {
  files.forEach((file) => {
    const ttfBuffer = readFileSync(file);
    const woff2Buffer = ttf2woff2(ttfBuffer);
    const woff2FileName = path.join(outputDir, path.basename(file, '.ttf') + '.woff2');
    writeFileSync(woff2FileName, woff2Buffer);
    console.log(`Converted ${file} to ${woff2FileName}`);
  });
}

const ttfFiles = getTTFFiles(fontDir);
const formatsToConvert = process.argv.slice(2);

if (formatsToConvert.includes('woff')) {
  convertToWoff(ttfFiles);
}

if (formatsToConvert.includes('woff2')) {
  convertToWoff2(ttfFiles);
}