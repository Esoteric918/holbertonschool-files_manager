// GET /connect should sign-in the user by generating a new authentication token

// By using the header Authorization and the technique of the Basic auth (Base64 of the <email>:<password>), find the user associate to this email and with this password (reminder: we are storing the SHA1 of the password)
// If no user has been found, return an error Unauthorized with a status code 401

// Otherwise:
    // Generate a random string (using uuidv4) as token
    // Create a key: auth_<token>
    // Use this key for storing in Redis (by using the redisClient create previously) the user ID for 24 hours
    // Return this token: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" } with a status code 200


    // Every authenticated endpoints of our API will look at this token inside the header X-Token.

    // GET /disconnect should sign-out the user based on the token:

    // Retrieve the user based on the token:
    // If not found, return an error Unauthorized with a status code 401
    // Otherwise, delete the token in Redis and return nothing with a status code 204
    // Inside the file controllers/UsersController.js add a new endpoint:

    // GET /users/me should retrieve the user base on the token used:

    // Retrieve the user based on the token:
    // If not found, return an error Unauthorized with a status code 401
    // Otherwise, return the user object (email and id only)

    const sha1 = require('sha1');
    const { v4: uuidv4 } = require('uuid');
    const Mongo = require('../utils/db');
    const Redis = require('../utils/redis');

class AuthController {
  static async getConnect(req, res) {
      const authHeader = req.headers.authorization;
      const auth = Buffer.from(authHeader[1], 'base64').toString().split(':');
      const { email, password } = auth.splice(0, 2);

      if (!email) return res.status(400).send({ error: 'Missing email' });
      if (!password) return res.status(400).send({ error: 'Missing password' });
      const user = await Mongo.users.findOne({
        email,
        password: pass ? sha1(password): null
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
