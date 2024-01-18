const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');

//import routes
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const collectionRouter = require('./routes/collection');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/collections', collectionRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
