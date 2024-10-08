import { compare } from "bcrypt";
import client from "../database/index.js";
import jwt from "jsonwebtoken";

export async function signin(email, password) {
  try {
    let h = await client.query(
      "SELECT userid, passwordhash FROM Users WHERE Email = $1 LIMIT 1",
      [email]
    );
    if (h.rows[0] && (await compare(password, h.rows[0].passwordhash))) {
      let { email, phonenumber, name, role, restaurantname, restaurantid } = (
        await client.query(
          "SELECT email, phonenumber, name, role, restaurantname, restaurantid FROM Users WHERE userid = $1 LIMIT 1",
          [h.rows[0].userid]
        )
      ).rows[0];
      let token = jwt.sign(
        {
          userid: h.rows[0].userid,
          email,
          phonenumber,
          name,
          role,
          restaurantname,
          restaurantid,
        },
        process.env.AUTH_SECRET,
        {
          expiresIn: 12 * 60,
        }
      );
      let uuid = crypto.randomUUID();
      let prtkn = h.rows[0].userid + "." + uuid;
      await client.query("UPDATE Users SET prtkn = $1 WHERE userid = $2", [
        uuid,
        h.rows[0].userid,
      ]);
      return { err: null, data: { token, prtkn } };
    } else {
      return { err: "user not found", data: null };
    }
  } catch (err) {
    return { err: err, data: null };
  }
}

export async function verifyToken(tkn, prtkn) {
  try {
    return jwt.verify(tkn, process.env.AUTH_SECRET);
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      let [userid, uuid] = prtkn.split(".");
      let h = await client.query("SELECT prtkn FROM Users WHERE userid = $1", [
        userid,
      ]);
      if (h.rows[0] && h.rows[0].prtkn == uuid) {
        let data = jwt.decode(tkn);
        tkn = jwt.sign(data, process.env.AUTH_SECRET);
        return [tkn, data];
      } else {
        return null;
      }
    }
  }
}

export function verifyUser(role, callback) {
  return async (req, res, next) => {
    try {
      if (req.cookies && req.cookies.authtoken && req.cookies.prtkn) {
        let result = await verifyToken(
          req.cookies.authtoken,
          req.cookies.prtkn
        );
        if (result instanceof Array) {
          res.setHeader("set-cookie", `authtoken=${result[0]};httpOnly;path=/`);
          result = result[1];
        }
        res.locals.user = result;
        if (result.role != role) return callback(req, res);
        if (!result) return callback(req, res);
      } else return callback(req, res);
    } catch (err) {
      console.log(err);
      return callback(req, res);
    }
    next();
  };
}

export function re(route) {
  return (req, res) => {
    res.redirect(route);
  };
}
