const fs = require('fs');

const express = require('express');

const app = express();

const PATH = './data.json';

app.use(express.json({ limit: '50mb', extended: true })).use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/resources', (req, res) => {
  let resources = {};

  if (fs.existsSync(PATH)) {
    const tmp = fs.readFileSync(PATH);
    resources = tmp ? JSON.parse(tmp) : {};
  }

  res.json({ resources });
});

app.put('/resources', (req, res) => {
  const data = req.body.data;
  fs.writeFileSync('./data.json', JSON.stringify(data));
  res.json({ status: 'success' });
});

app.listen(3000);
