let currentOpenFile = '';
let currentOpenDialog  = false
let currentSaveDialog = false
const divMenu = document.querySelector('#menu')
const editor = document.getElementById('editor')
const menuList  = document.getElementById('menu_list')

const menuItems =[ ...menuList.childNodes]


menuItems.map(item =>{
    item.addEventListener('click',handleMenuItem)
})


const $myCodeMirror = CodeMirror.fromTextArea(document.querySelector('#editor'), {
    lineNumbers: true,
    theme: 'monokai',
    mode: 'javascript'
})

const { ipcRenderer } = require('electron')

function handleMenuItem (event){
  let id = event.target.id 
  if ( id == 1) {
      salvarArquivo()
  }

  handleMenu()
    
}
function salvarArquivo() {
    const conteudoDoArquivo = $myCodeMirror.getValue();
    if (currentSaveDialog == false){
        ipcRenderer.send('renderer/salvar_arquivo', conteudoDoArquivo)
        currentSaveDialog = true
    }
}


function handleMenu() {
    if (divMenu.className == '') {
        divMenu.className = 'open'
        editor.className = 'open'
    } else {
        divMenu.className = ''
        editor.className = ''
    }
}

function abrirArquivo() {
    if ( currentOpenDialog == false ){
        ipcRenderer.send('renderer/abrir_arquivo', '')
        currentOpenDialog = true
    }

}

ipcRenderer.on('main/salvar_arquivo', function (event, mainMessage) {
    console.log(mainMessage)
    currentSaveDialog = false
})

ipcRenderer.on('main/abrir_arquivo', function (event, mainMessage) {
    if (mainMessage.status == 200) {
        currentOpenFile = mainMessage.path
        $myCodeMirror.setValue(mainMessage.data)
    }
    currentOpenDialog = false
})