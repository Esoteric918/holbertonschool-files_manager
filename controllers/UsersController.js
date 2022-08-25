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

  static getMe(req, res) {
    (async () => {
      const authtoken = req.headers['x-token'];
      const user = await Redis.get(`auth_${authtoken}`);
      const userInfo = await dbClient.db
        .collection('users')
        .findOne({ _id: new mon.ObjectID(user) });
      if (!userInfo) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.status(200).json({ id: userInfo._id, email: userInfo.email });
    })();
  }
}

module.exports = UsersController;
