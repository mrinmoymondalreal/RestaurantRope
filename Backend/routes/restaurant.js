import { Router } from "express";
import client from "../database/index.js";

const router = Router();

router.get("/list", async (req, res) => {
  let filter = req.query;
  let resp;
  if (filter) {
    let { name, city, page } = filter;
    resp = await client.query(
      "SELECT * FROM restaurants WHERE lower(name) LIKE $1 AND lower(address) LIKE $2 LIMIT 5 OFFSET $3",
      [`%${name || ""}%`, `%${city || ""}%`, (page - 1 || 0) * 5]
    );
  } else resp = await client.query("SELECT * FROM restaurants");
  res.send(resp.rows);
});

router.get("/list/:id", async (req, res) => {
  let { id } = req.params;
  const resp = await client.query(
    "SELECT * FROM restaurants WHERE restaurantid = $1",
    [id]
  );
  res.send(resp.rows[0]);
});

router.get("/:id/dishes/list", async (req, res) => {
  let { id } = req.params;
  let { name, order, page } = req.query;
  let resp = await client.query(
    "SELECT dishid, name, isavailable, imageurl, price FROM dishes WHERE restaurantid = $1 AND lower(name) LIKE $2" +
      (order ? " ORDER BY price " + (order == "d" ? "asc" : "dsec") : "") +
      " LIMIT 5 OFFSET $3",
    [id, `%${name || ""}%`, (page - 1 || 0) * 5]
  );
  res.send(resp.rows);
});

export default router;
