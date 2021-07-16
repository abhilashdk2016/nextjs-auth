import express from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
const morgan = require('morgan');
require('dotenv').config();
import mongoose from 'mongoose';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfProtection = csrf({ cookie: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const db = mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('Connected to DB'))
  .catch(err => console.error('DB Connection Error', err));

readdirSync('./routes').map(r => app.use(`/api`, require(`./routes/${r}`)));
app.use(csrfProtection);
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken()});
})

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
