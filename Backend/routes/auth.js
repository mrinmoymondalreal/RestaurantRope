import { Router } from "express";
import { re, signin, verifyUser } from "../auth/signin.js";
import { signup } from "../auth/signup.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const resp = await signin(username, password);
  if (resp.err) return res.send(resp.err);
  if (!resp.data) return res.status(500).send();
  res.setHeader("set-cookie", [
    `authtoken=${resp.data.token};httpOnly;secure;path=/`,
    `prtkn=${resp.data.prtkn};httpOnly;secure;path=/`,
  ]);
  res.send("ok");
});

router.post("/signup", async (req, res) => {
  const props = req.body;
  const resp = await signup(props);
  if (resp.err == "invalid") return res.status(400).send(resp.err);
  if (resp.err) return res.send(resp.err);
  if (!resp.data) return res.status(500).send();
  res.send("ok");
});

router.get("/name", verifyUser("Manager", re("/")), (req, res) => {
  res.send("hello manager");
});

export default router;
