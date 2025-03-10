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

const githubToken = '';
const owner = '';
const repo = '';
const branch = 'main';
const filePath = 'database.json';
const targetNumber = '';

let isUploading = false;
let lastUploadTime = 0;
const COOLDOWN_PERIOD = 60000;

async function uploadToGitHub(conn) {
  const currentTime = Date.now();
  
  if (isUploading) {
    console.log("Upload sedang berlangsung, menghindari duplikasi");
    return;
  }
  
  if (currentTime - lastUploadTime < COOLDOWN_PERIOD) {
    console.log("Cooldown aktif, menghindari upload berlebihan");
    return;
  }
  
  try {
    isUploading = true;
    
    if (!fs.existsSync(filePath)) {
      isUploading = false;
      return;
    }

    let fileContent = fs.readFileSync(filePath, 'utf-8');
    let base64Content = Buffer.from(fileContent).toString('base64');
    
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const timestampedFileName = `database:date(${day},${month},${year})${hours}${minutes}${seconds}.json`;
    const githubFilePath = `backup/${timestampedFileName}`;
    
    let currentTimeFormatted = now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    let date = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${githubFilePath}`,
      {
        message: `Auto backup database.json - ${currentTimeFormatted}`,
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

    if (response.status === 201 || response.status === 200) {
      let repoUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${githubFilePath}`;
      let message = `*Auto Backup Database Aktif !*\n\n> 📅 *Date* : ${date} ${time}\n> 🔗 *Repository* : ${repoUrl}`;

      console.log(message);
      
      if (conn) {
        await conn.sendMessage(targetNumber, { text: message })
          .catch(err => console.error("Error mengirim pesan WhatsApp:", err.message));
      }
      
      lastUploadTime = Date.now();
    }

  } catch (error) {
    console.error("Error saat upload:", error.response?.data?.message || error.message);
  } finally {
    isUploading = false;
  }
}

let backupInterval = null;

function startBackupInterval() {
  if (backupInterval) {
    clearInterval(backupInterval);
  }
  
  backupInterval = setInterval(() => {
    let conn = global.conn;
    if (conn) uploadToGitHub(conn);
  }, 5 * 60 * 60 * 1000);
  
  console.log("Jadwal backup dimulai");
}

startBackupInterval();
