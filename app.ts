import express from "express";
import mongoose from "mongoose";
import {MONGO_URI} from "./config/db";
import {errorHandler, jsonResponseMiddleware} from "./middlewares";
import {ApiRoutes} from "./routes/api.routes";
import  path from "path";


const app = express();

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connexion à la db établie'))
    .catch((error: Error) => console.log(error))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(jsonResponseMiddleware);
app.use('/api', ApiRoutes)

app.use(errorHandler);

app.listen(8000, () => {
    console.clear()
    console.log('✅ Connexion serveur établie')
});