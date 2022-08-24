const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_NAME || 'file_manager';
    const url = `mongodb://${host}:${port}/${database}`;
    this.isAlive = function isAlive() { return false; };

    MongoClient.connect(url,
      { useNewUrlParser: true, useUnfiedTopology: true },
      (err, client) => {
        if (err) {
          // client.close();
          return console.log(err);
        } else {
          this.isAlive = function isAlive() { return true; };
          this.users = client.db(database).collection('users');
          this.files = client.db(database).collection('files');
          return console.log('MongoDB connected');
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
