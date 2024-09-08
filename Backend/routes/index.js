import { Router } from "express";
import authRouter from "./auth.js";
import restaurantsRouter from "./restaurant.js";
import orderRouter from "./order.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("working");
});

export default [
  { name: "/", router },
  { name: "/auth", router: authRouter },
  { name: "/restaurants", router: restaurantsRouter },
  { name: "/order", router: orderRouter },
];
