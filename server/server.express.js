import express from 'express';
import bodyParser from 'body-parser';
import { db } from "./server.mongodb.js";

const app = express();
const port = process.env.PORT;

app.use(express.static('src'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/check/:nombre', async (req, res) => {
  const usuarios = await db.users.count()
  res.send(`Hola ${req.params.nombre}, hay ${usuarios} usuarios`)
})
// CRUD
app.post('/create/articles', async (req, res) => {
  res.json(await db.articles.create(req.body))
})
app.get('/read/articles', async (req, res) => {
  res.json(await db.articles.get())
})
app.get('/filter/articles/:name', async (req, res) => {
  res.json(await db.articles.get({ $text: { $search: req.params.name } }))
})
app.put('/update/articles/:id', async (req, res) => {
  res.json(await db.articles.update(req.params.id, req.body))
})
app.delete('/delete/articles/:id', async (req, res) => {
  res.json(await db.articles.delete(req.params.id))
})
app.get('/read/users', async (req, res) => {
  res.json(await db.users.get())
})
app.get('/filter/users/:name', async (req, res) => {
  // TODO: ver parámetros de búsqueda
  // https://www.mongodb.com/docs/manual/reference/operator/query/
  res.json(await db.articles.get({ $text: { $search: req.params.name } }))
})

app.listen(port, async () => {
  const articles = await db.articles.count()
  const usuarios = await db.users.count()
  console.log(`Shopping List listening on port ${port}: ${articles} articles, ${usuarios} users`);
})