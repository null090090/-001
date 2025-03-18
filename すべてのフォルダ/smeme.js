/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : smeme canvas
-----------------------
- CREATORE : ren collins
-----------------------
- DM CREATOR : wa.me/6281324846720
-----------------------
- SUMBER : https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21/105
_______________________

*/

// font : https://github.com/sophilabs/macgifer/blob/master/static/font/impact.ttf
// di edit dulu jangan langsung di pasang, di sesuaikan sama base kalian !

import { createCanvas, loadImage, registerFont } from 'canvas';
import uploadImage from '../lib/uploadImage.js';
import { sticker } from '../lib/sticker.js';

registerFont('./lib/font/impact.ttf', { family: 'impact' });

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [atas, bawah] = text.split`|`;
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw `Cara penggunaan salah !\nContoh: ${usedPrefix}${command} ted|tes\n> Reply Image Nya !`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Error`;
    
    let img = await q.download();
    let background = await loadImage(img);
    
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0);

    function drawTextWithBorder(text, x, y, fontSize) {
        ctx.font = `bold ${fontSize}px "Impact"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 15; 

        ctx.strokeText(text.toUpperCase(), x, y);
        
        ctx.fillStyle = 'white';
        ctx.fillText(text.toUpperCase(), x, y);
    }

    const fontSize = Math.min(canvas.width / 8, 100); 

    if (atas) {
        drawTextWithBorder(atas, canvas.width / 2, 0, fontSize); 
    }

    if (bawah) {
        drawTextWithBorder(bawah, canvas.width / 2, canvas.height - fontSize * 1.5, fontSize); 
    }

    const buffer = canvas.toBuffer('image/png');
    
    let url = await uploadImage(buffer);
    let stiker = await sticker(false, url, global.packname, global.author);
    
    if (stiker) await conn.sendFile(m.chat, stiker, null, global.author, m, null, { asSticker: 1 });
}

handler.help = ['smeme'];
handler.tags = ['sticker'];
handler.command = /^(smeme)$/i;

export default handler;