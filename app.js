import express from 'express';

const app = express();
const port = 3000;

// route definitions
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
