# SECRETARIA DE DESARROLLO PRODUCTIVO E INDUSTRIA
## DIRECCION DE PROMOCION ECONOMICA INDUSTRIA Y COMERCIO
## PROYECTO DE APOYO A LA PRODUCCION DE LA MICRO Y PEQUEÑA EMPRESA DEL DEPARTAMENTO DE ORURO REACTIVA TIC

## `DESARROLLO DE SISTEMA DE TIENDA VIRTUAL`

### FRONTEND

Este frontend está desarrollado en Angular 9.1.6 y utiliza Node.js como entorno de ejecución para manejar dependencias con NPM (Node Package Manager). A continuación, se proporciona información sobre las herramientas necesarias, comandos para su instalación y puesta en marcha, y los enlaces de descarga de las herramientas requeridas.

#### Instalación y Configuración para S.O. WINDOWS

##### Requisitos
Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- Angular: v9.1.15.
- Node.js: v12.11.1.
- NPM: (se instala automáticamente con Node.js).

##### Enlaces de descarga
- [Node.js]
- [Angular CLI]

##### Instalación de Node.js

1. Descargar y ejecutar **Node.js v12.11.1**, seguir las instrucciones del asistente de instalación. Asegúrate de marcar la casilla que incluye NPM.
2. Abre una terminal (cmd) y ejecuta los siguientes comandos para verificar la instalación de Node.js y NPM:
    ```sh
    node -v
    npm -v
    ```
Deberías ver las versiones instaladas de Node.js y NPM.

##### Instalación de Node.js con NVM

Si prefieres utilizar NVM (Node Version Manager) para gestionar la instalación de Node.js en lugar de descargar el instalador de Node.js, sigue estos pasos:

1. Instalar NVM en Windows
    - **Descargar NVM**:
        - Ve al [repositorio oficial de NVM] y descarga el archivo `nvm-setup.zip`.
        - **Instalar NVM**:
        - Ejecuta el archivo `nvm-setup.exe` y sigue los pasos del instalador.
    - **Verificar la instalación de NVM**:
        - Abre una terminal y ejecuta:
            ```bash
            nvm version
            ```
    Si la instalación es correcta, se mostrará la versión de NVM.
2. Instalar Node.js con NVM
    - **Listar versiones de Node.js:**
        ```bash
           nvm list available
        ```
    - **Instalar una versión de Node.js:**
        ```bash
           nvm install 12.11.1
        ```
    - **Usar la versión instalada:**
        ```bash
           nvm use 12.11.1
        ```
    - **Verificar la instalación:**
        ```bash
           node -v
           npm -v
        ```
3. Cambiar de versión de Node.js
    Para cambiar entre versiones de Node.js instaladas:
    ```bash
       nvm install <version>
       nvm use <version>
    ```
4. Listar todas las versiones de Node.js instaladas
    ```bash
       nvm list
    ```
5. Eliminar una versión específica de Node.js:
    ```bash
       nvm uninstall <version>
    ```

##### Configuración del entorno:

1. Clonar el repositorio:
    ```sh
    git clone https://github.com/jlc24/REACTIVATIC-frontend.git
    cd REACTIVATIC-frontend
    ```
2. Revisar y/o configurar el archivo **application.ts**, colocando la direccion de funcionamiento del **Backend**.
    ```sh
    export const RUTA = 'http://localhost:8678/reactivaticapp';
    // export const RUTA = 'https://<direccion de la web>/reactivaticapp';
    export const TOKEN = 'access_token';
    ```
3. Abre una terminal y ejecuta el siguiente comando para instalar Angular CLI globalmente en tu sistema:
    ```sh
    npm install -g @angular/cli@9.1.15
    ```
4. Verificar la instalación.
    - Para verificar que Angular CLI se instaló correctamente, ejecuta:
        ```sh
        ng version
        ```
        Esto deberia mostrar la version de Angular CLI
        ```sh
                
             _                      _                 ____ _     ___
            / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
           / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
          / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
         /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                        |___/
            
        
        Angular CLI: 9.1.15
        Node: 12.11.1
        OS: win32 x64
        
        Angular: 9.1.13
        ... animations, common, compiler, compiler-cli, core, forms
        ... localize, platform-browser, platform-browser-dynamic, router
        Ivy Workspace: Yes
        
        Package                           Version
        -----------------------------------------------------------
        @angular-devkit/architect         0.901.15
        @angular-devkit/build-angular     0.901.15
        @angular-devkit/build-optimizer   0.901.15
        @angular-devkit/build-webpack     0.901.15
        @angular-devkit/core              9.1.15
        @angular-devkit/schematics        9.1.15
        @angular/cli                      9.1.15
        @ngtools/webpack                  9.1.15
        @schematics/angular               9.1.15
        @schematics/update                0.901.15
        rxjs                              6.5.5
        typescript                        3.8.3
        webpack                           4.42.0
        ```

5. Instalar dependencias.
    ```sh
    npm install
    ```
    si falla la instalación ejecutar:
    ```sh
    npm install --force
    ```
6. Comandos de Puesta en Funcionamiento.
    - Modo Desarrollo.
        Para ejecutar el proyecto en modo desarrollo, usa el siguiente comando:
        ```sh
        ng serve
        ```
        Esto levantará el servidor de desarrollo en http://localhost:4200/. Puedes acceder a la aplicación desde cualquier navegador.


## License

MIT

**Free Software**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [PostgreSQL]: <https://www.postgresql.org/download/>
   [repositorio oficial de NVM]: <https://github.com/coreybutler/nvm-windows/releases>
   
