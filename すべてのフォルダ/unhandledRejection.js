/* 

--- POST BY SALOMON ---
_______________________  
- CODE NAME : fix error unhandledRejection
-----------------------
- CREATORE : ren collins
-----------------------
- DM CREATOR : wa.me/6281324846720
-----------------------
- SUMBER : https://whatsapp.com/channel/0029Vb3qQSk77qVKayc2aT21/105
_______________________

*/

function clearSessions(folder = 'sessions') {
	let filename = []
	readdirSync(folder).forEach(file => filename.push(join(folder, file)))
	return filename.map(file => {
		let stats = statSync(file)
		if (stats.isFile() &&
			(Date.now() - stats.mtimeMs >= 1000 * 60 * 120) &&
			!file.includes('creds.json')) {
			console.log('Deleted old session:', file)
			return unlinkSync(file)
		}
		return false
	})
}

async function connectionUpdate(update) {
	const {
		receivedPendingNotifications,
		connection,
		lastDisconnect,
		isOnline,
		isNewLogin
	} = update

	if (isNewLogin) {
		conn.isInit = true
		console.log(chalk.green('Login Baru Terdeteksi'))
	}

	switch (connection) {
		case 'connecting':
			console.log(chalk.redBright('Mengaktifkan Bot, Mohon tunggu sebentar...'))
			break
		case 'open':
			console.log(chalk.green('Berhasil Tersambung'))
			break
		case 'close':
			console.log(chalk.red('⏱️ Koneksi Terputus'))

			if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
				console.log(chalk.yellow('Mencoba menghubungkan kembali...'))
				await global.reloadHandler(true)
			} else {
				console.log(chalk.red('Koneksi gagal - Logged Out'))
			}
			break
	}

	if (isOnline === true) console.log(chalk.green('Status Aktif'))
	if (isOnline === false) console.log(chalk.red('Status Mati'))

	if (receivedPendingNotifications) {
		console.log(chalk.yellow('Menunggu Pesan Baru'))
	}

	global.timestamp.connect = new Date

	if (global.db.data == null) await global.loadDatabase()
}

async function initConnection() {
	if (!existsSync(global.authFile)) {
		mkdirSync(global.authFile, {
			recursive: true
		})
	}

	try {
		await conn.connect()
	} catch (error) {
		console.error('Kesalahan saat koneksi:', error)
		setTimeout(initConnection, 5000)
	}
}

process.on('uncaughtException', console.error)
