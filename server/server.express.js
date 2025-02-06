import express from 'express';
import bodyParser from 'body-parser';
import { crud } from "./server.crud.js";

const app = express();
const port = process.env.PORT;
const ARTICLES_URL = './server/BBDD/articles.json'

app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/hello/:nombre', (req, res) => {
  res.send(`Hola ${req.params.nombre}`)
})
// CRUD
app.post('/create/articles', (req, res) => {
  crud.create(ARTICLES_URL, req.body, (data) => {
    res.json(data)
  });
})
app.get('/read/articles', (req, res) => {
  crud.read(ARTICLES_URL, (data) => {
    res.json(data)
  });
})
app.get('/filter/articles/:name', (req, res) => {
  crud.filter(ARTICLES_URL, { name: req.params.name }, (data) => {
    res.json(data)
  });
})
app.put('/update/articles/:id', (req, res) => {
  crud.update(ARTICLES_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})
app.delete('/delete/articles/:id', (req, res) => {
  crud.delete(ARTICLES_URL, req.params.id, (data) => {
    res.json(data)
  });
})

app.listen(port, () => {
  console.log(`Shopping List listening on port ${port}`)
})