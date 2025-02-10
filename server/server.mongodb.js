import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI;

export const db = {
  articles: {
    get: getArticles,
    create: createArticle,
    count: countArticles,
    update: updateArticle,
    delete: deleteArticle
  },
  users: {
    get: getUsers,
    count: countUsers
  }
}

/**
 * Returns the number of users in the 'users' collection in the 'shoppingList' database.
 *
 * @returns {Promise<number>} The number of users in the collection.
 */
async function countUsers() {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const usersCollection = shoppinglistDB.collection('users');
  return await usersCollection.countDocuments()
}

/**
 * Gets an array of users from the 'users' collection in the 'shoppingList' database.
 *
 * @returns {Promise<Array<object>>} - The array of users.
 */
async function getUsers(filter){
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const usersCollection = shoppinglistDB.collection('users');
  return await usersCollection.find(filter).toArray()
}

/**
 * Creates a new article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {object} article - The article to be created.
 * @returns {Promise<object>} The created article.
 */
async function createArticle(article) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  const returnValue = await articlesCollection.insertOne(article);
  console.log('db createArticle', returnValue, article._id)
  return article
}

/**
 * Gets an array of articles from the 'articles' collection in the 'shoppingList' database.
 * The articles are filtered by the given filter.
 *
 * @param {object} [filter] - The filter to apply to the articles.
 * @returns {Promise<Array<object>>} - The array of articles.
 */
async function getArticles(filter) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  return await articlesCollection.find(filter).toArray();
}

/**
 * Returns the number of articles in the 'articles' collection in the 'shoppingList' database.
 *
 * @returns {Promise<number>} The number of articles in the collection.
 */
async function countArticles() {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  return await articlesCollection.countDocuments();
}

/**
 * Updates an article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} id - The ID of the article to be updated.
 * @param {object} updates - The fields and new values to update the article with.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
async function updateArticle(id, updates) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  const returnValue = await articlesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log('db updateArticle', returnValue, updates)
  return returnValue
}

/**
 * Deletes an article from the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} id - The ID of the article to be deleted.
 * @returns {Promise<string>} The ID of the deleted article.
 */
async function deleteArticle(id) {
  const client = new MongoClient(URI);
  const shoppinglistDB = client.db('shoppingList');
  const articlesCollection = shoppinglistDB.collection('articles');
  const returnValue = await articlesCollection.deleteOne({ _id: new ObjectId(id) });
  console.log('db deleteArticle', returnValue, id)
  return id
}