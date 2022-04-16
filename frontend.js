const divMenu = document.querySelector('#menu')
const editor = document.getElementById('editor')
const menuList = document.getElementById('menu_list')
const menuItems = [...menuList.childNodes]

let currentOpenFile = '';
let isIODialogOpen = false

menuItems.map(item => {
    item.addEventListener('click', handleMenuItem)
})


const $myCodeMirror = CodeMirror.fromTextArea(document.querySelector('#editor'), {
    lineNumbers: true,
    theme: 'monokai',
    mode: 'javascript'
})

const { ipcRenderer } = require('electron')

//função para tratar eventos para cada item de menuList
function handleMenuItem(event) {
    let id = event.target.id
    if (id == 1) {
        salvarComo()
    }

    handleMenu()
}
// função para salvar arquivo
function salvarArquivo() {
    const conteudoDoArquivo = $myCodeMirror.getValue();
    console.log('entrei em salvar arquivo')
    //não faz nada se o IODialog estiver ocupado
    if (isIODialogOpen) {
        return
    }

    //caso não tenha arquivo aberto
    if (currentOpenFile == '') {
        ipcRenderer.send('renderer/salvar_arquivo', conteudoDoArquivo)
    } else { //salvo o arquivo atual
        ipcRenderer.send('renderer/salvar_arquivo_atual', { currentOpenFile, conteudoDoArquivo })
    }
    isIODialogOpen = true
}
//função para salvarComo
function salvarComo() {
    if (isIODialogOpen) {
        return
    }
    const conteudoDoArquivo = $myCodeMirror.getValue();
    ipcRenderer.send('renderer/salvar_arquivo', conteudoDoArquivo)
    isIODialogOpen = true
}

//função para abrir menu
function handleMenu() {
    //caso o menu esteja fechado
    if (divMenu.className == '') {
        //adiciona classe para abrir o menu
        divMenu.className = 'open'
        editor.className = 'open'
    } else {
        //remove classes para fechar menu
        divMenu.className = ''
        editor.className = ''
    }
}

function abrirArquivo() {
    if (isIODialogOpen == false) {
        ipcRenderer.send('renderer/abrir_arquivo', '')
        isIODialogOpen = true
    }

}

ipcRenderer.on('main/salvar_arquivo', function (event, mainMessage) {
    console.log(mainMessage)
    if (mainMessage.status == 200) {
        currentOpenFile = mainMessage.body.filePath
    }
    isIODialogOpen = false
})

ipcRenderer.on('main/abrir_arquivo', function (event, mainMessage) {
    if (mainMessage.status == 200) {
        currentOpenFile = mainMessage.path
        $myCodeMirror.setValue(mainMessage.data)
    }

    isIODialogOpen = false
})

ipcRenderer.on('main/salvar_arquivo_atual', function (event, mainMessage) {
    if (mainMessage.status == 200) {
        currentOpenFile = mainMessage.body.filePath
    }
    console.log(mainMessage)
    isIODialogOpen = false
})