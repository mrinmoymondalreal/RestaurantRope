import { Router } from "express";
import { re, verifyUser } from "../auth/signin.js";
import client from "../database/index.js";

const router = Router();

router.get("/orders/list", verifyUser("Manager", re("/")), async (req, res) => {
  let order_details = await client.query(
    `SELECT orders.*, users.name as person_name 
      FROM orders 
      INNER JOIN users ON users.userid = orders.userid 
      WHERE orders.restaurantid = $1 
      AND orders.orderstatus = 'Preparing';
      `,
    [res.locals.user.restaurantid]
  );
  if (order_details.rows.length > 0) {
    let resp = [];
    for (let i in order_details.rows) {
      console.log(i);
      let orderid = order_details.rows[i].orderid;
      let item_list = await client.query(
        "SELECT orderitems.quantity, orderitems.price, dishes.name FROM orderitems JOIN dishes ON dishes.dishid = orderitems.dishid WHERE orderid = $1",
        [orderid]
      );

      resp.push({
        ...order_details.rows[0],
        list: item_list.rows,
      });
    }

    res.send(resp);
  } else {
    res.status(404).send([]);
  }
});

router.get("/details", verifyUser("Manager", re("/")), (req, res) => {
  res.send(res.locals.user);
});

router.get(
  "/order/cancel/:id",
  verifyUser("Manager", re("/")),
  async (req, res) => {
    let { id } = req.params;

    await client.query(
      "UPDATE orders SET orderstatus = 'Cancelled' WHERE orderid = $1",
      [id]
    );
    res.send("ok");
  }
);

router.get(
  "/order/done/:id",
  verifyUser("Manager", re("/")),
  async (req, res) => {
    let { id } = req.params;

    await client.query(
      "UPDATE orders SET orderstatus = 'Completed' WHERE orderid = $1",
      [id]
    );
    res.send("ok");
  }
);

export default router;
