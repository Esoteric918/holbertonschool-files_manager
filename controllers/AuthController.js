const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const Mongo = require('../utils/db');
const Redis = require('../utils/redis');

class AuthController {
  static async userConnect(req, res) {
   const authHeader = req.headers.authorization.split(' ')[1];
    const auth = Buffer.from(authHeader, 'base64').toString();
    const [email, pass] = auth.split(':');
    const user = await Mongo.users.findOne({
      email,
      password: pass ? sha1(pass) : null,
    });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    await Redis.set(`auth_${token}`, user._id.toString(), 86400);
    return res.json({ token });
  }

  static async userDisconnect(req, res) {
    const authToken = `auth_${req.headers['x-token']}`;
    if (!await Redis.get(authToken)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    Redis.del(authToken);
    return res.status(204).send();
  }
}


module.exports = AuthController;
