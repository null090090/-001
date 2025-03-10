/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : backup database.json
-----------------------
- CREATORE : ren collins
-----------------------
- DM CREATOR : wa.me/6281324846720
-----------------------
- SUMBER : https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21/105
_______________________

*/

// taro di ./plugins/nama...js

import fs from 'fs';
import axios from 'axios';

const githubToken = 'YOUR_TOKEN';
const owner = 'YOUR_GITHUB_USERNAME';
const repo = 'YOUR_REPO_NAME';
const branch = 'main';
const filePath = 'database.json';
const githubFilePath = `backup/${filePath}`;
const targetNumber = '62XXXXXXXXXX@s.whatsapp.net';

async function uploadToGitHub(conn) {
  try {
    if (!fs.existsSync(filePath)) return;

    let fileContent = fs.readFileSync(filePath, 'utf-8');
    let base64Content = Buffer.from(fileContent).toString('base64');
    let currentTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    let date = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${githubFilePath}`,
      {
        message: `Auto backup database.json - ${currentTime}`,
        content: base64Content,
        branch: branch,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let repoUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${githubFilePath}`;
    let message = `*Auto Backup Database Aktif !*\n\n> 📅 *Date* : ${date} ${time}\n> 🔗 *Repository* : ${repoUrl}`;

    console.log(message);
    if (conn) await conn.sendMessage(targetNumber, { text: message });

  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

setInterval(() => {
  let conn = global.conn;
  if (conn) uploadToGitHub(conn);
}, 5 * 60 * 1000);
