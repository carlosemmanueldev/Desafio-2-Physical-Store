import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from "./app";

dotenv.config({path: '.env'});

const DB = process.env.DATABASE!.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD!);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});