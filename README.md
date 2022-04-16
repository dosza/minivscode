# MinivsCode Hibrid Editor  #

<p align=center className="logo">
  <img src="https://github.com/dosza/minivscode/blob/main/public/minivscode.png">

Sobre
---
É um "editor de texto" baseado no tutorial [mini-vscode](https://www.youtube.com/watch?v=NOxZ8-hZCZ0&t=520s)
Baseado no vídeo [ÚLTIMO EPISÓDIO: Como Criamos um Mini VSCode usando Electron JS // AluraJS #5](https://www.youtube.com/watch?v=NOxZ8-hZCZ0&t=520s)

Layout
---
Foi parcialmente reimplementado misturando aspectos do VSCode e do Gedit

Funcionalidades
---
- [x]   Abrir Arquivo 
- [x]   Salvar Arquivo
- [x]   Salvar Como ...
- [x]   Fechar Arquivo
- [ ]   Implementar *ContextIsolation*
- [ ]   Detectar formato de arquivo e atualizar o high-light 
- [ ]   Salvar as preferencias do editor *.preferences.json*


Getting Started!
---
Clonando projeto
```console
user@pc:~$ git clone https://github.com/dosza/minivscode.git
```
Instalando as dependencias 
```console
user@pc:~$ cd minivscode
user@pc:~$ #Configuração de dependencias
user@pc:~$ yarn
```
Iniciando A aplicação
```console
user@pc:~$ #Inicialização a aplicação
user@pc:~$ yarn dev
```