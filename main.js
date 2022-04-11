require("electron-reload")(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`),
})



const { app, BrowserWindow } = require('electron')
const path = require('path')
const { writeFile } = require('fs')
let win

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.loadURL(`file:///${__dirname}/index.html`)
    win.removeMenu()
    // win.webContents.openDevTools()
}


app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin ') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows.length === 0) {
        createWindow()
    }
})

const { ipcMain, dialog } = require('electron')

//------------------------------------------------------------------
ipcMain.on('renderer/salvar_arquivo', async (event, mensagem) => {
    const conteudoDoArquivo = mensagem
    const { filePath, canceled } = await dialog.showSaveDialog()

    if (canceled) {
        event.reply('main/salvar_arquivo', { status: 400, msg: 'Usuário cancelou' })
        return false
    }

    writeFile(filePath, conteudoDoArquivo, 'utf-8', (err, result) => {
        if (err) throw err;

        event.reply('main/salvar_arquivo', {
            status: 200, body: {
                filePath: filePath
            }
        })
    })

})