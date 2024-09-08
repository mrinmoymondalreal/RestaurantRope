import { Router } from "express";
import client from "../database/index.js";

const router = Router();

router.get("/list", async (req, res) => {
  let filter = req.query;
  let resp;
  if (Object.values(filter).length > 0) {
    let { name, city, page } = filter;
    resp = await client.query(
      `
      SELECT DISTINCT ON (r.restaurantid) r.*, d.price as lowest_price
      FROM restaurants r
      JOIN dishes d ON r.restaurantid = d.restaurantid
      WHERE lower(r.name) LIKE $1 
        AND lower(r.address) LIKE $2
      LIMIT 5 OFFSET $3;
      `,
      [`%${name || ""}%`, `%${city || ""}%`, (page - 1 || 0) * 5]
    );
  } else
    resp = await client.query(
      "SELECT DISTINCT ON (r.restaurantid) r.*, d.price as lowest_price FROM restaurants r INNER JOIN dishes d ON r.restaurantid = d.restaurantid"
    );

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
  let { name, order } = req.query;
  let resp = await client.query(
    "SELECT dishid, name, isavailable, imageurl, price, description FROM dishes WHERE restaurantid = $1 AND lower(name) LIKE $2" +
      (order ? " ORDER BY price " + (order == "d" ? "asc" : "dsec") : ""),
    [id, `%${name || ""}%`]
  );
  res.send(resp.rows);
});

export default router;
