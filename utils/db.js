const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_NAME || 'file_manager';

const url = `mongodb://${host}:${port}/${database}`;

class DBClient {
  constructor() {
    this.isAlive = function isAlive() { return false; };

    MongoClient.connect(url,
      { useNewUrlParser: true, useUnfiedTopology: true },
      (err, client) => {
        if (err) {
          // client.close();
          console.log(err);
        } else {
          this.db = client.db(database);
          this.users = this.db.collection('users');
          this.files = this.db.collection('files');
          console.log('MongoDB connected');
          this.isAlive = function isAlive() { return true; };
        }
      });
  }

  async nbUsers() {
    return this.users.countDocuments({});
  }

  async nbFiles() {
    return this.files.countDocuments({});
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
