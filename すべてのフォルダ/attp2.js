/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : attp2
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
import GIFEncoder from 'gif-encoder-2';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args }) => {
    let stiker = false;
    try {
        if (!args[0]) throw 'Harap masukkan teks dan ukuran untuk diubah menjadi stiker.\nContoh: /attp teks|ukuran';

        let [text, size] = args.join(' ').split('|');
        size = parseInt(size);

        if (!size || isNaN(size) || size < 1) throw 'Ukuran teks harus berupa angka positif.';

        let gifBuffer = await generateTextGIF(text, size);
        
        stiker = await createSticker(gifBuffer, text);
    } catch (e) {
        console.log(e);
        stiker = e.message ? e.message : e.toString();
    } finally {
        m.reply(stiker);
    }
};

handler.help = ['attp2'];
handler.tags = ['sticker'];
handler.command = /^attp2$/i;

export default handler;

async function generateTextGIF(text, size) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    
    const encoder = new GIFEncoder(512, 512);
    encoder.start();
    encoder.setDelay(200);       encoder.setRepeat(0); 
    encoder.setTransparent(0x000000); 

    for (let i = 0; i < 10; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        
        ctx.fillStyle = getRandomColor();
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        encoder.addFrame(ctx);
    }

    encoder.finish();
    return encoder.out.getData(); 
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

async function createSticker(img, text) {
    let stickerMetadata = {
        pack: global.packname, 
        author: global.author, 
    };
    return (new Sticker(img, stickerMetadata)).toBuffer();
}
