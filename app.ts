import express from "express";
import mongoose from "mongoose";
import "reflect-metadata";
import { errorHandler, jsonResponseMiddleware } from "./middlewares";
import { ApiRoutes } from "./routes/api.routes";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const mongoURI = process.env.MONGO_URI!;
const corsURL = process.env.CORS_URL!;

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connexion à la db établie"))
  .catch((error: Error) => console.log(error));

app.use(cookieParser());
app.use(
  cors({
    origin: corsURL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(jsonResponseMiddleware);
app.use("/api", ApiRoutes);

app.use(errorHandler);

app.listen(8000, () => {
  console.clear();
  console.log("✅ Connexion serveur établie");
});
