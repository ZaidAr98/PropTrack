import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import adminRoute from './routes/adminRoute';
import clientRoute from './routes/clientRoute';
import connectDB from '../src/util/connectDB'

const app = express();
const port = 8000;


connectDB();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', adminRoute);
app.use('/api', clientRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});