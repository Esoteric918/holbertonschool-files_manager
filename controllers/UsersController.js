const sha1 = require('sha1');
const mon = require('mongodb');
const Redis = require('../utils/redis');
const dbClient = require('../utils/db');

class UsersController {
  static async createUser(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });
    if (await dbClient.users.findOne({ email })) return res.status(400).send({ error: 'Already exist' });
    const newUser = await dbClient.users.insertOne({
      email,
      password: sha1(password),
    });
    return res.status(201).send({ id: newUser.insertedId, email });
  }

  static async getMe(req, res) {
    const authToken = `auth_${req.headers['x-token']}`;
    const userId = await Redis.get(authToken);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await dbClient.users.findOne({ _id: new mon.ObjectId(userId) });
    return res.json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
