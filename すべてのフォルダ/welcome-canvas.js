/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : welcome canvas
-----------------------
- CREATORE : ren collins
-----------------------
- DM CREATOR : wa.me/6281324846720
-----------------------
- SUMBER : https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21/105
_______________________

*/

// taro import ini ke handle.js
import { createCard } from './lib/welcome.js';

// simpan di ./lib/welcome.js
import { createCanvas, loadImage } from 'canvas';

export const createCard = async (avatarUrl, totalMembers, groupName, userName, isWelcome) => {
    const canvas = createCanvas(1280, 800);
    const context = canvas.getContext('2d');

    let truncatedText = isWelcome
        ? groupName.length > 9 ? `${groupName.slice(0, 8)}..` : groupName
        : userName.length > 9 ? `${userName.slice(0, 8)}..` : userName;

    const backgroundUrl = isWelcome 
        ? "bg welcome"  // jika tidak ada alternatif uploader, pake uploader github saya aja
        : "bg leave"; // jika tidak ada alternatif uploader, pake uploader github saya aja

    const backgroundImage = await loadImage(backgroundUrl).catch(() => {
        console.error('Failed to load background image.');
        return null;
    });

    if (backgroundImage) {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    context.shadowColor = 'rgba(0, 0, 0, 0.5)';
    context.shadowBlur = 30;
    context.shadowOffsetX = 10;
    context.shadowOffsetY = 20;

    const avatar = await loadImage(avatarUrl).catch(async () => {
        return await loadImage('./src/avatar_contact.png');
    });

    context.save();
    context.beginPath();
    context.arc(290, 400, 160, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    context.drawImage(avatar, 130, 240, 320, 320);
    context.restore();

    context.strokeStyle = '#ffffff';
    context.lineWidth = 12;
    context.beginPath();
    context.arc(290, 400, 165, 0, Math.PI * 2, true);
    context.stroke();

    context.shadowColor = 'transparent';

    context.fillStyle = '#ffffff';
    context.font = 'bold 90px Arial';
    context.textAlign = 'left';
    context.fillText(isWelcome ? 'Welcome To' : 'Good Bye', 500, 350);

    context.fillText(truncatedText, 500, 470);

    context.font = 'bold 60px Arial';
    context.textAlign = 'center';
    context.fillText(isWelcome ? `Kamu Member Ke #${totalMembers}` : `Total member sekarang #${totalMembers}`, 640, 700);

    return canvas.toBuffer('image/png');
};

// di bagian handler kalian ubah case add/remove kalian jadi gini :
		case 'add':
		case 'remove':
			if (chat.welcome) {
				let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata;
				for (let user of participants) {
					let pp = 'profile url'; // jika tidak ada alternatif uploader, pake uploader github saya aja
					try {
						pp = await this.profilePictureUrl(user, 'image');
					} catch (e) {
						console.error('Could not fetch profile picture, using default.');
					} finally {
						let text = (action === 'add' ?
								(chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!')
								.replace('@subject', await this.getName(id))
								.replace('@desc', groupMetadata.desc?.toString() || 'unknown') :
								(chat.sBye || this.bye || conn.bye || 'Bye, @user!'))
							.replace('@user', await this.getName(user));

						let cardBuffer = await createCard(
							pp,
							groupMetadata.participants.length,
							await this.getName(id),
							await conn.getName(user),
							action === 'add'
						);

						await this.sendFile(
							id,
							cardBuffer,
							'pp.jpg',
							text,
							null,
							false, {
								mentions: [user]
							}
						);
					}
				}
			}
			break;
