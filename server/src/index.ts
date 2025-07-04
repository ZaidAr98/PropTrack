import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
const port = 8000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(cors())


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
