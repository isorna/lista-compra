import express, { Router } from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import { crud } from "../../server/server.crud.js";

const api = express();
const router = Router();
const ARTICLES_URL = '../server/server/BBDD/articles.json'

// CRUD
router.post('/articles', (req, res) => {
  crud.create(ARTICLES_URL, req.body, (data) => {
    res.json(data)
  });
})
router.get('/articles', (req, res) => {
  crud.read(ARTICLES_URL, (data) => {
    res.json(data)
  });
})
router.get('/articles/:name', (req, res) => {
  crud.filter(ARTICLES_URL, { name: req.params.name }, (data) => {
    res.json(data)
  });
})
router.put('/articles/:id', (req, res) => {
  crud.update(ARTICLES_URL, req.params.id, req.body, (data) => {
    res.json(data)
  });
})
router.delete('/articles/:id', (req, res) => {
  crud.delete(ARTICLES_URL, req.params.id, (data) => {
    res.json(data)
  });
})

// for parsing application/json
api.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }))
api.use('/api/', router)

export const handler = serverless(api);