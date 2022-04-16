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
    if (id == 2) {
        fecharArquivo()
    }
    handleMenu()
}
// função para salvar arquivo
function salvarArquivo() {
    const conteudoDoArquivo = $myCodeMirror.getValue();
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

//função para perguntar se o usuário gostaria
//de salvar arquivo atualmente aberto
function gostariaSalvarAberto() {
    let message = 'Há um arquivo aberto, gostaria de salvar ?\n' +
        'Se você não salvar, perderá todas as alterações!!'
    return confirm(message)
}

//função para perguntar se o usuario gostaria de salvar 
//o conteudo do "Novo arquivo"
function gostariaSalvarConteudoNovoArquivo() {
    let message = 'Gostaria de salvar o "Documento não salvo 1"?\n' +
        'Se você não salvar, perderá todas as alterações!!'
    return confirm(message)
}

function acoesAntesdeFecharArquivo() {
    if (isIODialogOpen) {
        return
    }

    if (currentOpenFile != '') {
        if (gostariaSalvarAberto()) {
            salvarArquivo()
        }
    } else {
        if ($myCodeMirror.getValue() != '') {
            if (gostariaSalvarConteudoNovoArquivo()) {
                salvarArquivo()
            }
        }
    }
}
function fecharArquivo() {
    if (isIODialogOpen) {
        return
    }
    acoesAntesdeFecharArquivo()
    $myCodeMirror.setValue("")
    currentOpenFile = ''
}
function acoesAntesdeAbrirArquivo() {
    if (isIODialogOpen) {
        return
    }

    if (currentOpenFile != '') {
        if (gostariaSalvarAberto()) {
            salvarArquivo()
        }
    } else {
        if ($myCodeMirror.getValue() != '') {
            if (gostariaSalvarConteudoNovoArquivo()) {
                salvarArquivo()
            }
        }
    }
}
//função para abrir arquivo
function abrirArquivo() {
    if (isIODialogOpen) {
        return
    }
    acoesAntesdeAbrirArquivo()
    ipcRenderer.send('renderer/abrir_arquivo', '')
    isIODialogOpen = true

}

// limpa o conteudo $myCodeMirror.value após a inicialização da página
document.addEventListener('DOMContentLoaded', function () {
    $myCodeMirror.setValue('')
})

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
    } else {
        $myCodeMirror.setValue('')
        currentOpenFile = ''
    }
    console.log(mainMessage)

    isIODialogOpen = false
})

ipcRenderer.on('main/salvar_arquivo_atual', function (event, mainMessage) {
    if (mainMessage.status == 200) {
        currentOpenFile = mainMessage.body.filePath
    }
    console.log(mainMessage)
    isIODialogOpen = false
})

