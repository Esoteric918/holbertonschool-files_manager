const sha1 = require('sha1');
const mon = require('mongodb');
const Mongo = require('../utils/db');
const Redis = require('../utils/redis');

class UsersController {
  static async createUser(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });
    if (await Mongo.users.findOne({ email })) return res.status(400).send({ error: 'Already exist' });
    const newUser = await Mongo.users.insertOne({
      email,
      password: sha1(password),
    });
    return res.status(201).send({ id: newUser.insertedId, email });
  }

  static async getUser(req, res) {
    const authToken = `auth_${req.headers['x-token']}`;
    const userId = await Redis.get(authToken);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    const user = await Mongo.users.findOne({ _id: new mon.ObjectId(userId) });
    return res.send({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;