/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : xbox stalk with canvas image
-----------------------
- CREATORE : salomon
-----------------------
- SUMBER : https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21/105
_______________________

*/

import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import cheerio from 'cheerio';
import sharp from 'sharp';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Contoh: ${usedPrefix}${command} ruep`);

    m.reply('⌛ Sedang memproses...');

    try {
        const profile = await xboxStalk(args[0]);
        if (typeof profile === 'string') throw profile;

        const canvas = createCanvas(1080, 2750);
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e8f5e8');
        gradient.addColorStop(0.5, '#ffffff');
        gradient.addColorStop(1, '#e8f5e8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(16, 124, 16, 0.05)';
        for (let i = 0; i < canvas.width; i += 30) {
            for (let j = 0; j < canvas.height; j += 30) {
                ctx.fillRect(i, j, 15, 15);
            }
        }

        const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 300);
        headerGradient.addColorStop(0, '#28a745');
        headerGradient.addColorStop(1, '#34ce57');
        ctx.fillStyle = headerGradient;
        ctx.fillRect(0, 0, canvas.width, 300);

        let avatarBuffer;
        try {
            let avatarUrl = profile.avatar;
            if (avatarUrl && avatarUrl.startsWith('https://https//')) {
                avatarUrl = avatarUrl.replace('https://https//', 'https://');
            }
            const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
            avatarBuffer = await sharp(avatarResponse.data)
                           .resize(240, 240)
                           .png()
                           .toBuffer();
        } catch (avatarError) {
            console.error('Error avatar:', avatarError);
            avatarBuffer = await sharp('https://i.imgur.com/QGxmhVE.png')
                           .resize(240, 240)
                           .png()
                           .toBuffer();
        }

        const avatar = await loadImage(avatarBuffer);

        ctx.save();
        ctx.beginPath();
        ctx.arc(200, 150, 110, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(200, 150, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, 100, 50, 200, 200);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(200, 150, 100, 0, Math.PI * 2);
        ctx.strokeStyle = '#28a745';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';

        ctx.font = 'bold 56px Arial';
        ctx.fillText(profile.name, 350, 130);

        drawStatsBox(ctx, 350, 160, `🏆 ${profile.gamerscore}`, 'Gamerscore');
        drawStatsBox(ctx, 650, 160, `📝 ${profile.gamesPlayed}`, 'Games Played');

        let yPos = 350;

        ctx.fillStyle = '#28a745';
        ctx.font = 'bold 44px Arial';
        ctx.fillText('Recent Games', 70, yPos);

        ctx.beginPath();
        ctx.moveTo(70, yPos + 10);
        ctx.lineTo(300, yPos + 10);
        ctx.strokeStyle = '#34ce57';
        ctx.lineWidth = 3;
        ctx.stroke();

        yPos += 80;

        profile.gameHistory.forEach((game, i) => {
            const cardHeight = 180;
            drawLightCard(ctx, 50, yPos, canvas.width - 100, cardHeight);

            ctx.fillStyle = '#28a745';
            ctx.font = 'bold 32px Arial';
            ctx.fillText(game.title, 70, yPos + 45);

            ctx.fillStyle = '#e9ecef';
            roundRect(ctx, 70, yPos + 60, 350, 30, 15);
            ctx.fill();

            const progress = parseInt(game.progress) || 0;
            const progressGradient = ctx.createLinearGradient(70, 0, 420, 0);
            progressGradient.addColorStop(0, '#28a745');
            progressGradient.addColorStop(1, '#34ce57');
            ctx.fillStyle = progressGradient;
            roundRect(ctx, 70, yPos + 60, 350 * (progress / 100), 30, 15);
            ctx.fill();

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`${progress}%`, 430, yPos + 82);

            drawGameStat(ctx, 70, yPos + 120, '🏆', game.achievements, 'Achievements');
            drawGameStat(ctx, 300, yPos + 120, '⭐', game.gamerscore, 'Gamerscore');
            drawGameStat(ctx, 600, yPos + 120, '⏱️', game.lastPlayed, 'Last Played');

            yPos += cardHeight + 30;
        });

        const buffer = canvas.toBuffer('image/png');

        await conn.sendFile(m.chat, buffer, 'xbox-profile.png', `🎮 *Xbox Profile: ${profile.name}*\n\n` +
                            `Gamerscore: ${profile.gamerscore}\n` +
                            `Games Played: ${profile.gamesPlayed}\n\n` +
                            `Recent Games:\n${profile.gameHistory.map((game, i) =>
        `${i + 1}. ${game.title}\n` +
        `   ▸ Progress: ${game.progress}\n` +
        `   ▸ Achievements: ${game.achievements}\n` +
        `   ▸ Gamerscore: ${game.gamerscore}\n` +
        `   ▸ Last Played: ${game.lastPlayed}`
                                                                      ).join('\n\n')
                                              }`, m);

    } catch (error) {
        console.error(error);
        return m.reply('❌ Error: ' + error);
    }
};

function drawStatsBox(ctx, x, y, value, label) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    roundRect(ctx, x, y, 250, 80, 10);
    ctx.fill();

    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(value, x + 20, y + 45);

    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial';
    ctx.fillText(label, x + 20, y + 70);
}

function drawLightCard(ctx, x, y, width, height) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
    roundRect(ctx, x, y, width, height, 20);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, height, 20);
    ctx.stroke();
}

function drawGameStat(ctx, x, y, icon, value, label) {
    ctx.fillStyle = '#f8f9fa';
    roundRect(ctx, x, y - 25, 200, 40, 8);
    ctx.fill();

    ctx.fillStyle = '#28a745';
    ctx.font = '24px Arial';
    ctx.fillText(`${icon} ${value}`, x + 10, y);
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

async function xboxStalk(teks) {
    try {
        const { data } = await axios.get('https://xboxgamertag.com/search/' + teks);
        const $ = cheerio.load(data);

        let gamerscore = 0;
        let gamesPlayed = 0;

        $('.profile-detail-item').each((index, element) => {
            const title = $(element).find('span').text();
            const value = $(element).text().replace(title, '').trim();
            if (title.includes("Gamerscore")) {
                gamerscore = parseInt(value.replace(/,/g, ''), 10) || 0;
            }
            if (title.includes("Games Played")) {
                gamesPlayed = parseInt(value, 10) || 0;
            }
        });

        const gamertag = {
            name: $('h1 a').text(),
            avatar: $('.avatar img').attr('src'),
            gamerscore: gamerscore,
            gamesPlayed: gamesPlayed,
            gameHistory: []
        };

        $('.recent-games .game-card').each((index, element) => {
            const game = {
                title: $(element).find('h3').text(),
                lastPlayed: $(element).find('.text-sm').text().replace('Last played ', ''),
                platforms: $(element).find('.text-xs').text(),
                gamerscore: $(element).find('.badge:contains("Gamerscore")').parent().next().text().trim(),
                achievements: $(element).find('.badge:contains("Achievements")').parent().next().text().trim(),
                progress: ($(element).find('.progress-bar').attr('style') || 'width: 0%;').match(/width: (.*?); /)?.[1] || '0%'
            };
            gamertag.gameHistory.push(game);
        });

        return gamertag;
    } catch (error) {
        return error.message;
    }
}

handler.help = ['xboxs <gamertag>'];
handler.tags = ['internet'];
handler.command = ['xboxs'];
handler.register = true;

export default handler;
