import { LucideArrowLeft, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cart } from "../lib/states";
import preparing from "../../public/order preparing.gif";

function Item({ initQuantity, name, id, price, restaurantId, imageurl }) {
  const [quantity, _setQuantity] = useState(initQuantity);

  let [__c, setCart] = useAtom(cart);

  function setQuantity(_v) {
    fetch(
      `http://192.168.0.103:3000/order/add/restaurant/${restaurantId}/dish/${id}/q/${_v(quantity)}`,
      {
        credentials: "include",
      },
    );
    setCart((c) => {
      for (let i in c) {
        if (c[i].id == id) c[i].quantity = _v(quantity);
      }
      return c;
    });
    _setQuantity(_v);
  }

  return (
    <div className="item flex items-center">
      <div className="">
        <div
          className="image bg-gray-600 w-20 rounded-md aspect-square"
          style={{
            backgroundImage: `url("${imageurl}")`,
            backgroundSize: "cover",
          }}
        ></div>
      </div>
      <div className="name flex-1 box-border px-4 space-y-2">
        <div className="text-lg font-bold">
          {name} - #{id}
        </div>
        <div className="flex max-w-24 border border-gray-400 box-border px-2 py-1 rounded-md">
          <button className="flex-1">
            <Minus onClick={() => setQuantity((q) => (q > 0 ? q - 1 : q))} />
          </button>
          <div>{quantity}</div>
          <button className="flex-1 flex justify-end">
            <Plus onClick={() => setQuantity((q) => (q < 7 ? q + 1 : q))} />
          </button>
        </div>
      </div>
      <div className="price">₹ {price * quantity}</div>
    </div>
  );
}

export default function Cart() {
  let [_cart, setCart] = useAtom(cart);

  const {
    data: cartlist,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["cart-list-2"],
    queryFn: async () => {
      let resp = await (
        await fetch("http://192.168.0.103:3000/order/list", {
          credentials: "include",
        })
      ).json();

      if (resp) {
        setCart(
          resp.list.map((e) => ({
            id: e.dishid,
            name: e.name,
            price: e.price,
            quantity: e.quantity,
            restaurantId: resp.restaurantid,
            imageurl: e.imageurl,
          })),
        );
      }

      return resp;
    },
  });

  let [isActive, setActive] = useState(false);

  return (
    <>
      {isActive && (
        <div className="fixed w-full min-h-screen flex flex-col justify-center items-center bg-white z-[100]">
          <img src={preparing} className="max-w-full w-64" alt="" />
          <div className="text-2xl font-bold ">Your Food is Preparing !!</div>
          <div className="text-gray-600">
            We will notify you once it is done
          </div>
          <Link to="/" className="mt-6">
            <Button>Go Home</Button>
          </Link>
        </div>
      )}
      <div className="w-full flex justify-center bg-gray-200 min-h-screen">
        <div className="wrapper w-full max-w-7xl flex justify-center relative">
          <header className="fixed left-0 px-6 py-4 flex items-center gap-x-6">
            <LucideArrowLeft size={30} onClick={() => window.history.back()} />
            <div className="font-bold text-xl">{cartlist && cartlist.name}</div>
          </header>
          <div className="billWrapper px-6 py-20 md:px-12 w-full max-w-2xl min-h-screen bg-white">
            <div className="items space-y-6">
              {_cart.map((props, index) => (
                <Item
                  {...{ ...props, initQuantity: props.quantity }}
                  key={index}
                />
              ))}
            </div>
            <div className="pt-6">
              <h1 className="text-xl font-bold">Bill Details</h1>
              <table className="w-full mt-2">
                <tr>
                  <td>Items Total</td>
                  <td className="text-right">
                    ₹ {_cart.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </td>
                </tr>
                <tr>
                  <td>GST and Restaurant Changes</td>
                  <td className="text-right">
                    ₹ {cartlist && Math.floor(cartlist.totalamount * 0.18)}
                  </td>
                </tr>
                <tr>
                  <td>Platform fee</td>
                  <td className="text-right">₹ {10}</td>
                </tr>
                <tr>
                  <td>
                    <div className="w-full h-px bg-black"></div>
                  </td>
                  <td className="py-2">
                    <div className="w-full h-px bg-black"></div>
                  </td>
                </tr>
                <tr>
                  <th className="text-left">To Pay</th>
                  <th className="text-right">
                    ₹ {cartlist && Math.floor(cartlist.totalamount * 1.18) + 10}
                  </th>
                </tr>
              </table>
            </div>

            <div className="fixed bottom-0 mb-4 left-1/2 -translate-x-1/2">
              <Button
                size={"lg"}
                onClick={async () => {
                  let resp = await fetch(
                    "http://192.168.0.103:3000/order/now/" + cartlist.orderid,
                    { credentials: "include" },
                  );
                  if (resp.ok) {
                    setActive(true);
                  }
                }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
