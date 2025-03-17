/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : attp
-----------------------
- CREATORE : ren collins
-----------------------
- DM CREATOR : wa.me/6281324846720
-----------------------
- SUMBER : https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21/105
_______________________

*/

// penggunaan :
// attp text|50 (50 itu ukuran font nya, jika ngetik banyak ukurannya 20-50 jika dikit 100-200 di sesuaikan aja)
// install module nya dulu terus sf plugins nya
// untuk base lain di sesuaikan aja yah

import { createCanvas } from 'canvas';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args }) => {
    let stiker = false;
    try {
        if (!args[0]) throw 'Harap masukkan teks dan ukuran untuk diubah menjadi stiker.\nContoh: /attp tes|20';

        let [text, size] = args.join(' ').split('|');
        size = parseInt(size); 

        if (!size || isNaN(size) || size < 1) throw 'Ukuran teks harus berupa angka positif.';
        
        let imgBuffer = await generateTextImage(text, size);
        
        stiker = await createSticker(imgBuffer, text);
    } catch (e) {
        console.log(e);
        stiker = e.message ? e.message : e.toString();
    } finally {
        m.reply(stiker);
    }
};

handler.help = ['attp'];
handler.tags = ['sticker'];
handler.command = /^attp$/i;

export default handler;

async function generateTextImage(text, size) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = `bold ${size}px Arial`;
    ctx.fillStyle = '#ffffff'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    drawWrappedText(ctx, text, canvas.width / 2, canvas.height / 2, canvas.width - 20, size);

    return canvas.toBuffer();
}

function drawWrappedText(ctx, text, x, y, maxWidth, fontSize) {
    let words = text.split(' ');
    let lineHeight = fontSize * 1.5; 
    ctx.font = `bold ${fontSize}px Arial`;

    let lines = [];
    let currentLine = '';
    for (let word of words) {
        let testLine = currentLine + word + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && currentLine !== '') {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());

    let startY = y - (lines.length - 1) * lineHeight / 2; 
    lines.forEach((line, index) => {
        ctx.fillText(line, x, startY + index * lineHeight);
    });
}

async function createSticker(img, text) {
    let stickerMetadata = {
        pack: packname,
        author: author,
    };
    return (new Sticker(img, stickerMetadata)).toBuffer();
}