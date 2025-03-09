import fs from "fs";
import cp, { exec as _exec } from "child_process";
import { promisify } from "util";

let exec = promisify(_exec).bind(cp);

async function backupScript(conn) {
   try {
      let namaFileZip = `BackupScript.zip`;
      const daftarPengecualian = ["node_modules/*", ".cache/*", ".npm/*", "sessions/*", ".config/*"];
      const argumenPengecualian = daftarPengecualian.map(item => `-x "${item}"`).join(' ');

      let waktuSekarang = new Date();
      let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      let tanggal = waktuSekarang.toLocaleDateString("id-ID", options);
      let jam = waktuSekarang.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      let groupId = "// id gc kamu.....!";
      console.log(`Auto Backup Aktif ${tanggal} ${jam}`);
      await conn.sendMessage(groupId, { text: `Auto Backup Aktif ${tanggal} ${jam}\nFile Backup Akan Terkirim....` });

      const perintahZip = `zip -r ${namaFileZip} . ${argumenPengecualian}`;
      await exec(perintahZip);

      if (!fs.existsSync(namaFileZip)) throw new Error("Gagal membuat file backup");

      const statFile = fs.statSync(namaFileZip);
      if (statFile.size === 0) throw new Error("File backup kosong");

      const file = fs.readFileSync(namaFileZip);

      await conn.sendMessage(
         groupId,
         {
            document: file,
            mimetype: "application/zip",
            fileName: namaFileZip,
            caption: `> Name File : ${namaFileZip}\n> Create Date : ${tanggal} ${jam}\n> Size : ${(statFile.size / 1024 / 1024).toFixed(2)} MB`,
         }
      );

      console.log(`Backup berhasil dikirim ke grup ${groupId}`);

      setTimeout(() => {
         try {
            fs.unlinkSync(namaFileZip);
            console.log("File backup telah dihapus.");
         } catch (errorHapus) {
            console.error("Gagal menghapus file backup:", errorHapus);
         }
      }, 5000);

   } catch (error) {
      console.error("Kesalahan backup:", error);
   }
}

setInterval(() => {
   let conn = global.conn;
   if (conn) {
      backupScript(conn);
   } else {
      console.error("Koneksi bot tidak tersedia untuk backup otomatis.");
   }
}, 86400000);
