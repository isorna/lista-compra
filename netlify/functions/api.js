import express from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import { crud } from "../../server/server.crud.js";

const api = express();
// const port = process.env.PORT;
const ARTICLES_URL = '../server/server/BBDD/articles.json'

// api.use(express.static('src'))
// for parsing application/json
api.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))

// CRUD
api.post('/create/articles', (req, res) => {
  crud.create(ARTICLES_URL, req.body, (data) => {
    res.json(data)
  });
})
api.get('/read/articles', (req, res) => {
  crud.read(ARTICLES_URL, (data) => {
    res.json(data)
  });
})
api.get('/filter/articles', (req, res) => {
  crud.filter(ARTICLES_URL, req.body, (data) => {
    res.json(data)
  });
})
api.put('/update/articles/:id', (req, res) => {
  crud.update(ARTICLES_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})
api.delete('/delete/articles/:id', (req, res) => {
  crud.delete(ARTICLES_URL, req.params.id, (data) => {
    res.json(data)
  });
})

// app.listen(port, () => {
//   console.log(`Shopping List listening on port ${port}`)
// })

export const handler = serverless(api);