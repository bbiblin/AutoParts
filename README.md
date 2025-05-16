<<<<<<< HEAD
Proyecto Integración de Plataformas
Caso semestral: AutoParts
Tecnologías utilizadas: React, Node.Js, MongoDB, Koa (para las rutas), Sequelizer

Dependencias: 
@koa/router
react-dom
react
sequelize
sequelize-cli


=======
Tutoriales:
React: https://www.youtube.com/watch?v=SqcY0GlETPk
Node.js: https://www.youtube.com/watch?v=TlB_eWDSMt4

>>>>>>> 8aecbd3ff880f47515b7a5a1a7798168da37fc6d

Pasos para instalar todo lo necesario:

1.- Abrir la PowerShell de windows y escribir el comando "wsl --install", luego, al entrar a WSL después de reiniciar el computador, colocan su usuario UNIX y su contraseña.
Desde ahora en adelante, todo se hará desde la consola WSL, por lo que deberán colocar los siguientes comandos:

Ahora, para utilizar WSL, es importante saber 3 comandos esenciales, con "ls" podemos visualizar el directorio en el que estamos junto a todos los subdirectorios, si queremos acceder a alguna carpeta, utilizaremos "cd (nombre carpeta)", por último, para salir de la carpeta actual, utilizaremos "cd .."

PD: Para pegar texto en WSL se utiliza el click derecho 

2.- Instalar git: sudo apt install git

### Token de github

Para hacer pull y push al repo desde git en WSL, necesitarán un token de github, por lo que en estos pasos les mostraré cómo crear uno:
- Dirijanse a las configuraciones en Github
- Bajan hasta el fondo y presionan "developer settings"
- Presionan "Personal access tokens"
- Luego presionan "Tokens (classic)"
- Se dirigen a "Generate new token" y presionan "Generate new token (classic)
- A partir de ahí, llenan todos los cuadritos que aparezcan para dar permisos y bajan hasta el fondo, donde por fín se genera el token
- luego de eso les mostrará su token, copienlo y guardenlo en un bloc de notas, ya que deberán usarlo seguido para hacer pull y push al repositorio.

Luego de instalar git y tener el token, clonarán el repositorio a su WSL, utilizando "git clone https://github.com/bbiblin/AutoParts.git", si les pide un username y password coloquen su username de github en username y su token en password, con esto ya tendrán el repositorio.

3.- Instalar nvm (node version manager): curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
4.- Instalar versión de node: nvm install 21.1.0
5.- Para utilizar su versión de nvm usen: nvm use 21.1.0
6.- Instalar yarn (para utilizar las dependencias): npm install --global yarn
7.- Instalar todas las dependencias del proyecto: yarn install

### Guía git en WSL

Para hacer pull de los cambios en el repositorio remoto, utilizarán git pull origin master, siendo master el nombre de la branch a la que quieren hacer pull.
Para subir sus cambios, deben colocar "git add ." para añadir todos los cambios, luego de eso, colocarán " git commit -m "mensaje que quieran" " y por último "git push origin master" y se subirán sus cambios.




