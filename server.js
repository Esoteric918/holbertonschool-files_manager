const express = require('express');
const router = require('./routes/index');

const app = express();
const port = process.env.port || 5000;

app.use(express.json());

app
  .use(router)
  .get('/', (req, res) => res.send('Express server'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
