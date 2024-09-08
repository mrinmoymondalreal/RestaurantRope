import { Router } from "express";
import { re, verifyUser } from "../auth/signin.js";
import client from "../database/index.js";

const router = Router();

router.get(
  "/add/restaurant/:restaurant/dish/:dishid/q/:quantity",
  verifyUser("Customer", re("/")),
  async (req, res) => {
    const { dishid, quantity, restaurant: restaurantid } = req.params;
    let result;
    result = await client.query(
      "SELECT OrderID FROM Orders WHERE userid = $1 AND orderstatus = 'Pending' AND restaurantid = $2",
      [res.locals.user.userid, restaurantid]
    );

    if (result.rows.length == 0) {
      await client.query("DELETE FROM orders WHERE userid = $1", [
        res.locals.user.userid,
      ]);
      result = await client.query(
        "INSERT INTO orders(userid, restaurantid, totalamount) VALUES ($1, $2, 0) RETURNING orderid",
        [res.locals.user.userid, restaurantid]
      );
    }

    let resp = await client.query(
      "SELECT * FROM orderitems WHERE orderid = $1 AND dishid = $2",
      [result.rows[0].orderid, dishid]
    );

    let resp2 = await client.query(
      "SELECT price FROM dishes WHERE dishid = $1",
      [dishid]
    );

    if (resp.rows[0]) {
      await client.query(
        "UPDATE orderitems SET price = $1, quantity = $2, subtotal = $3 WHERE dishid = $4 AND orderid = $5",
        [
          resp2.rows[0].price,
          quantity,
          resp2.rows[0].price * quantity,
          dishid,
          result.rows[0].orderid,
        ]
      );
    } else {
      await client.query(
        "INSERT INTO orderitems(orderid, dishid, quantity, price, subtotal) VALUES ($1, $2, $3, $4, $5)",
        [
          result.rows[0].orderid,
          dishid,
          quantity,
          resp2.rows[0].price,
          quantity * resp2.rows[0].price,
        ]
      );
    }

    // calculate subtotal
    await client.query(
      "UPDATE orders SET totalamount = (SELECT SUM(subtotal) FROM orderitems WHERE orderid = $1) WHERE orderid = $1",
      [result.rows[0].orderid]
    );

    res.send("ok");
  }
);

router.get(
  "/delete/dish/:dishid",
  verifyUser("Customer", re("/")),
  async (req, res) => {
    let { dishid } = req.params;
    await client.query(
      "DELETE FROM orderitems WHERE dishid = $1 AND orderid = (select orderid from orders where userid = $2)",
      [dishid, res.locals.user.userid]
    );

    // calculate subtotal
    await client.query(
      "UPDATE orders SET totalamount = (SELECT SUM(subtotal) FROM orderitems WHERE orderid = (select orderid from orders where userid = $1)) WHERE userid = $1",
      [res.locals.user.userid]
    );

    res.send("ok");
  }
);

router.get(
  "/check/restaurant/:id",
  verifyUser("Customer", re("/")),
  async (req, res) => {
    let { id } = req.params;
    let g = await client.query(
      "SELECT orderid FROM orders WHERE restaurantid = $1",
      [id]
    );
    res.send(g.rows[0]);
  }
);

router.get("/list", verifyUser("Customer", re("/")), async (req, res) => {
  let order_details = await client.query(
    "SELECT orders.*, restaurants.name FROM orders JOIN restaurants ON restaurants.restaurantid = orders.restaurantid WHERE userid = $1",
    [res.locals.user.userid]
  );

  if (order_details.rows[0]) {
    let orderid = order_details.rows[0].orderid;
    let item_list = await client.query(
      "SELECT *, dishes.name FROM orderitems JOIN dishes ON dishes.dishid = orderitems.dishid WHERE orderid = $1",
      [orderid]
    );

    let resp = {
      ...order_details.rows[0],
      list: item_list.rows,
    };

    res.send(resp);
  } else {
    res.status(404).send(null);
  }
});

router.get("/now/:id", verifyUser("Customer", re("/")), async (req, res) => {
  let { id } = req.params;

  await client.query(
    "UPDATE orders SET orderstatus = 'Preparing' WHERE orderid = $1",
    [id]
  );

  res.send("ok");
});

export default router;
