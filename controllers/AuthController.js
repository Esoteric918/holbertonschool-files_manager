const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const Mongo = require('../utils/db');
const Redis = require('../utils/redis');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization.split(' ')[1];
    const auth = Buffer.from(authHeader, 'base64').toString().split(':');
    const [ email, password ] = auth;

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });
    const user = await Mongo.users.findOne({
      email,
      password: pass ? sha1(password) : null,
    });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
    if (sha1(password) !== user.password) return res.status(401).send({ error: 'Unauthorized' });
    const token = uuidv4();
    await Redis.set(`auth_${token}`, user._id, 'EX', 24 * 60 * 60);
    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const authToken = `auth_${req.headers['x-token']}`;
    const userId = await Redis.get(authToken);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    await Redis.del(authToken);
    return res.status(204).send();
  }
}

module.exports = AuthController;
