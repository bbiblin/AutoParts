

***Proyecto Integración de Plataformas***  
Deploy: https://autoparts-frontend.onrender.com/  
Caso semestral: AutoParts  
Tecnologías utilizadas: React, Node.Js, PostgreSQL, Koa (para las rutas), Sequelizer  
Integrantes: Belen Díaz, Isaías Vejar, Lucero Leyva  

Dependencias: 
@koa/router
react-dom
react
sequelize
sequelize-cli


Pasos para instalar todo lo necesario:

1.- Instalar nvm (node version manager): curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash  
2.- Instalar versión de node: nvm install 21.1.0  
3.- Para utilizar su versión de nvm usen: nvm use 21.1.0  
4.- Instalar yarn (para utilizar las dependencias): npm install --global yarn  
5.- Instalar todas las dependencias del proyecto: yarn install (aparte) node install  

Iniciar frontend:
Ubicación: AutoParts/  
Comando: yarn build (aparte) yarn  install  

Iniciar backend:   
Ubicacion: AutoParts/backend/src  
Comando: node build (aparte) node index.js  
  
Migraciones con Sequelize:  
Ubicacion: AutoParts/backend/src  
Comandos:   
1.- yarn sequelize-cli db:migrate (pueden surgir errores de dependencias, de ser así, ir ejecutando las migraciones con las tablas que no dependen de nada)  
2.- yarn sequelize-cli db:seed --seed (nombre del archivo de la carpeta "seeds")  
El orden que recomiendo para ejecutar las seeds: 1. seed de brands 2. seed de categories 3. seed de productos  

La base de datos si clonas el proyecto en tu máquina será personal. Al estar en deploy, la página cuenta con su propia base de datos POSTGRESQL en línea.


