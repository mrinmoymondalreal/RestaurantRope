import express from "express";
import routes from "./routes/index.js";
import { configDotenv } from "dotenv";
import "./auth/signup.js";
import cookieParser from "cookie-parser";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ["http://192.168.0.103:5173"]);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

routes.forEach(({ name, router }) => {
  app.use(name, router);
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
