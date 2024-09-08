import { Router } from "express";
import { re, signin, verifyUser } from "../auth/signin.js";
import { signup } from "../auth/signup.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const resp = await signin(email, password);
  if (resp.err)
    return res.redirect(`${req.headers["referer"]}login?error=${resp.err}`);
  if (!resp.data)
    return res.redirect(`${req.headers["referer"]}login?error=${resp.err}`);
  res.setHeader("set-cookie", [
    `authtoken=${resp.data.token};httpOnly;path=/`,
    `prtkn=${resp.data.prtkn};httpOnly;path=/`,
  ]);
  res.redirect(`${req.query.redirect}`);
});

router.post("/signup", async (req, res) => {
  const props = req.body;
  const resp = await signup(props);
  if (resp.err == "invalid")
    return res.redirect(
      `${req.headers["referer"]}signup?error=invalid inputs${resp.err}`
    );
  if (resp.err)
    return res.redirect(`${req.headers["referer"]}signup?error=${resp.err}`);
  if (!resp.data)
    return res.redirect(`${req.headers["referer"]}signup?error=${resp.err}`);
  res.redirect(`${req.query.redirect}`);
});

router.get("/get_user", verifyUser("Customer", re("/")), async (req, res) => {
  res.send(res.locals.user);
});

router.get("/name", verifyUser("Manager", re("/")), (req, res) => {
  res.send("hello manager");
});

export default router;
