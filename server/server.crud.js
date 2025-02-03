// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
// import { read } from './crud/read.js';
import { create } from './crud/create.js';


const USERS = './server/BBDD/users.json'
// const ARTICLES = './server/BBDD/articles.json'

// READ:
// read(USERS, (data) => console.log('server', data));
// read(ARTICLES, (data) => console.log('server', data));

// CREATE:
create(USERS, { name: 'pepe', age: 12 }, (data) => console.log('server', 'pepe creado', data));