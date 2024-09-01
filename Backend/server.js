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

routes.forEach(({ name, router }) => {
  app.use(name, router);
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
