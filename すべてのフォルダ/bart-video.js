/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : brat video dengan module canvas
-----------------------
- CREATORE : ren collins
-----------------------
- DM CREATOR : wa.me/6281324846720
-----------------------
- SUMBER : https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21/105
_______________________

*/

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import generateBartImage from '../lib/canvas-bart.js';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    text = text ? text : m.quoted?.text || m.quoted?.caption || m.quoted?.description || '';  

    if (!text) return m.reply(`*• Contoh :*Text nya mana ?\nContoh : ${usedPrefix + command} hello wolrd hello wolrd`);
    if (text.length > 250) return m.reply(`Karakter terbatas, max 250!`);  

    const words = text.split(" ");  
    const tempDir = path.join(process.cwd(), 'tmp');  
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);  

    const framePaths = [];  

    try {  
        for (let i = 0; i < words.length; i++) {  
            const currentText = words.slice(0, i + 1).join(" ");  
            const framePath = path.join(tempDir, `frame${i}.png`);  
            await generateBartImage(currentText);  
            fs.renameSync('./tmp/bart.png', framePath);  
            framePaths.push(framePath);  
        }  

        const fileListPath = path.join(tempDir, "filelist.txt");  
        const outputVideoPath = path.join(tempDir, "output.mp4");  
        const outputWebpPath = path.join(tempDir, "sticker.webp");  

        let fileListContent = framePaths.map(frame => `file '${frame}'\nduration 0.7`).join("\n");  
        fileListContent += `\nfile '${framePaths[framePaths.length - 1]}'\nduration 2`;  

        fs.writeFileSync(fileListPath, fileListContent);  

        execSync(`ffmpeg -y -f concat -safe 0 -i ${fileListPath} -vf "fps=30,format=yuv420p" -c:v libx264 ${outputVideoPath}`);  
        execSync(`ffmpeg -y -i ${outputVideoPath} -vf "fps=15,scale=512:-1:flags=lanczos" -c:v libwebp -lossless 0 -compression_level 6 -q:v 70 -loop 0 -preset default -an -vsync 0 ${outputWebpPath}`);  

        let stickerBuffer = fs.readFileSync(outputWebpPath);
        
        let stickerWithMetadata = await sticker(stickerBuffer, false, global.packname, global.author);
        
        await conn.sendMessage(m.chat, { sticker: stickerWithMetadata }, { quoted: m });

        framePaths.forEach(frame => fs.existsSync(frame) && fs.unlinkSync(frame));  
        if (fs.existsSync(fileListPath)) fs.unlinkSync(fileListPath);  
        if (fs.existsSync(outputVideoPath)) fs.unlinkSync(outputVideoPath);  
        if (fs.existsSync(outputWebpPath)) fs.unlinkSync(outputWebpPath);  
    } catch (e) {  
        console.error(e);  
        m.reply("Terjadi kesalahan saat membuat sticker");  
    }
};

handler.help = ["bartsticker"];
handler.tags = ["sticker"];
handler.command = ["bartstick", "bartsticker"];

export default handler;



// canvas-bart.js simpan di lib
import fs from 'fs';
import { createCanvas } from 'canvas';
import Jimp from 'jimp';

const generateBartImage = async (text) => {
    const canvasSize = 500;
    const padding = 20;
    const maxFontSize = 120;
    const minFontSize = 20;
    const canvasWidth = canvasSize - 2 * padding;

    const preventSpamText = (text) => {
        const words = text.split(' ');
        let filteredWords = [];
        let prevWord = '';
        let count = 0;

        for (let word of words) {
            if (word === prevWord) {
                count++;
                if (count >= 3) {
                    filteredWords.push("\n");
                    count = 0;
                }
            } else {
                count = 1;
            }
            filteredWords.push(word);
            prevWord = word;
        }

        return filteredWords.join(' ');
    };

    const wrapText = (ctx, text, maxWidth, fontSize) => {
        ctx.font = `${fontSize}px Arial Narrow`;
        const lines = [];
        const segments = text.split(' ');
        let currentLine = '';

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            let segmentProcessed = '';

            if (segment.length * (fontSize * 0.6) > maxWidth) {
                for (let j = 0; j < segment.length; j++) {
                    const char = segment[j];
                    const testLine = segmentProcessed + char;
                    const metrics = ctx.measureText(testLine);

                    if (metrics.width > maxWidth) {
                        if (segmentProcessed !== '') {
                            if (currentLine !== '') {
                                lines.push(currentLine);
                            }
                            lines.push(segmentProcessed);
                            currentLine = '';
                            segmentProcessed = char;
                        } else {
                            lines.push(char);
                        }
                    } else {
                        segmentProcessed += char;
                    }
                }

                if (segmentProcessed !== '') {
                    if (currentLine !== '') {
                        const testLine = currentLine + ' ' + segmentProcessed;
                        const metrics = ctx.measureText(testLine);
                        if (metrics.width > maxWidth) {
                            lines.push(currentLine);
                            currentLine = segmentProcessed;
                        } else {
                            currentLine = testLine;
                        }
                    } else {
                        currentLine = segmentProcessed;
                    }
                }
            } else {
                const testLine = currentLine === '' ? segment : currentLine + ' ' + segment;
                const metrics = ctx.measureText(testLine);

                if (metrics.width > maxWidth) {
                    lines.push(currentLine);
                    currentLine = segment;
                } else {
                    currentLine = testLine;
                }
            }
        }

        if (currentLine !== '') {
            lines.push(currentLine);
        }

        return lines;
    };

    const determineFontSize = (ctx) => {
        let fontSize = maxFontSize;
        let lines;
        do {
            fontSize--;
            lines = wrapText(ctx, text, canvasWidth, fontSize);
        } while ((lines.length * fontSize * 1.5 > canvasSize - 2 * padding) && (fontSize > minFontSize));
        return Math.min(fontSize, maxFontSize);
    };

    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cleanedText = preventSpamText(text);
    const fontSize = determineFontSize(ctx);
    const lineHeight = fontSize * 1.5;
    const lines = wrapText(ctx, cleanedText, canvasWidth, fontSize);

    ctx.font = `${fontSize}px Arial Narrow`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const totalTextHeight = lines.length * lineHeight;
    const startY = ((canvasSize - totalTextHeight) / 2) + 15;

    lines.forEach((line, i) => {
        ctx.fillText(line, padding, startY + i * lineHeight);
    });

    const imagePath = './tmp/bart.png';
    fs.writeFileSync(imagePath, canvas.toBuffer());

    const image = await Jimp.read(imagePath);
    image.blur(3);
    await image.writeAsync(imagePath);

    return imagePath;
};

export default generateBartImage;
