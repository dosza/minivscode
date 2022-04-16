require("electron-reload")(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`),
})



const { app, BrowserWindow } = require('electron')
const path = require('path')
const { writeFile, readFile } = require('fs')
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
    win.webContents.openDevTools()
    win.removeMenu()

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

ipcMain.on('renderer/abrir_arquivo', async (event, message) => {
    const { filePaths, canceled } = await dialog.showOpenDialog()
    if (canceled) {
        event.reply('main/abrir_arquivo', {
            status: 400,
            path: '',
            text: '',
            msg: 'Usuário cancelou'
        })
        return false
    }


    readFile(filePaths[0], 'utf-8', (err, text) => {
        if (err) throw err;

        event.reply('main/abrir_arquivo', {
            status: 200,
            data: text,
            path: filePaths[0]
        });
    })

})

ipcMain.on('renderer/salvar_arquivo_atual', async (event, message) => {
    let { currentOpenFile, conteudoDoArquivo } = message

    writeFile(currentOpenFile, conteudoDoArquivo, 'utf-8', (err, result) => {
        if (err) throw err;

        event.reply('main/salvar_arquivo_atual', {
            status: 200, body: {
                filePath: currentOpenFile
            }
        })
    })

})