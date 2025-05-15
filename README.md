# Gestor de Videojocs

## Descripció del Projecte
Una aplicació web per gestionar videojocs amb operacions CRUD (Crear, Llegir, Actualitzar, Eliminar).

## Arquitectura i Estructura
- `backend/`: API REST amb Express.js i MongoDB.
  - `models/`: Models de dades.
  - `routes/`: Rutes de l’API.
  - `controllers/`: Lògica del negoci.
  - `config/`: Configuració de la base de dades.
- `frontend/`: Interfície amb HTML, CSS, JS i Vue (MVVM).
  - `css/`: Estils.
  - `js/`: Lògica MVVM.

## Instruccions d’Instal·lació i Execució
1. Clona el repositori: `git clone <URL>`
2. A `backend/`, instal·la dependències: `npm install`
3. Inicia MongoDB: `mongod`
4. Executa el backend: `node app.js`
5. Obre `frontend/index.html` amb Live Server o un navegador.