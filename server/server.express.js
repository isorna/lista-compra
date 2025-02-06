import express from 'express';
import { crud } from "./server.crud.js";

const app = express();
const port = process.env.PORT;
const ARTICLES_URL = './server/BBDD/articles.json'

app.use(express.static('src'))

app.get('/hello/:nombre', (req, res) => {
  res.send(`Hola ${req.params.nombre}`)
})

app.get('/read/articles', (req, res) => {
  crud.read(ARTICLES_URL, (data) => {
    let responseData = []
    console.log('server read articles', data)
    responseData = data

    res.write(JSON.stringify(responseData));
    res.end();
  });
})

app.listen(port, () => {
  console.log(`Shopping List listening on port ${port}`)
})