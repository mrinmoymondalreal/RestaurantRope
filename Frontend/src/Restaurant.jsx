import {
  ArrowLeft,
  CircleArrowRight,
  FastForward,
  LucideArrowLeft,
  Minus,
  Phone,
  Plus,
  Search,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React, { Suspense, useEffect, useState } from "react";
import { cart } from "./lib/states";
import { useAtom, useSetAtom } from "jotai";
import Confetti from "react-confetti";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

async function getCart() {
  let resp = await fetch("http://192.168.0.103:3000/order/list", {
    credentials: "include",
  });
  resp = await resp.json();

  return resp;
}

function DishCard({ name, id, description, price, imageurl, initQuantity }) {
  let [_cart, setCart] = useAtom(cart);

  let f = _cart.find((e) => e.id == id);
  const [quantity, _setQuantity] = useState((f && f.quantity) || 0);

  let restaurantId = useParams().id;

  const setQuantity = (_v) => {
    setCart((v) => {
      let isChanged = false;
      v = v.map((el) => {
        if (el.id == id) {
          el.quantity = _v(quantity);
          isChanged = true;
        }
        return el;
      });
      if (!isChanged) v.push({ id, name, price, quantity: _v(quantity) });
      return v;
    });

    _setQuantity(_v);
    fetch(
      `http://192.168.0.103:3000/order/add/restaurant/${restaurantId}/dish/${id}/q/${_v(quantity)}`,
      {
        credentials: "include",
      },
    );
  };

  return (
    <div className="py-0">
      <div className="rounded-md flex">
        <div className="flex-[4] flex flex-col md:space-y-1">
          <div className="name font-bold text-xl">{name}</div>
          <div className="price text-lg">₹ {price}</div>
          <div className="description text-sm text-gray-400 pr-2">
            {description}
          </div>
        </div>
        <div className="image relative flex justify-center items-center">
          <div
            className="w-[156px] h-[144px] bg-gray-500 rounded-lg relative"
            style={{
              backgroundImage: `url("${imageurl}")`,
              backgroundSize: "cover",
            }}
          >
            <div className="absolute w-[80%] bottom-0 bg-white left-1/2 -translate-x-1/2 translate-y-1 py-2 rounded-md shadow-md font-bold uppercase flex px-4 justify-center">
              {quantity == 0 ? (
                <button type="button" onClick={() => setQuantity(() => 1)}>
                  Add
                </button>
              ) : (
                <>
                  <button className="flex-1">
                    <Minus
                      onClick={() => setQuantity((q) => (q > 0 ? q - 1 : q))}
                    />
                  </button>
                  <div>{quantity}</div>
                  <button className="flex-1 flex justify-end">
                    <Plus
                      onClick={() => setQuantity((q) => (q < 7 ? q + 1 : q))}
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Separator className="mt-8" />
    </div>
  );
}

function DishHeader() {
  const [isVisible, setVisible] = useState(false);

  return (
    <div className="flex py-4 pb-8 items-center">
      <div className={"flex-1 " + (!isVisible ? "flex" : "hidden")}>
        <h1 className="text-3xl font-bold w-fit relative before:absolute before:bottom-[-2px] before:rounded-full before:w-[40%] before:h-[2px] before:bg-black flex-1">
          Dishes
        </h1>
      </div>
      <form
        action="/"
        method="get"
        className="hidden items-center w-full flex-[2] md:flex"
      >
        <Search className="absolute ml-4 text-[#919196]" color="currentColor" />
        <input
          type="text"
          className="w-full pl-[3.5rem] py-4 rounded-md shadow-md border border-gray-200 px-4 placeholder:tracking-wide outline-none"
          placeholder="Search for dishes.."
        />
      </form>
      <div
        className={
          "flex-1 flex justify-end " + (!isVisible ? "flex" : "hidden")
        }
      >
        <button onClick={() => setVisible(true)}>
          <Search size={30} className="flex-0 md:hidden" />
        </button>
      </div>

      <form
        action="/"
        method="get"
        className={
          "items-center w-full flex-[2] " + (isVisible ? "flex" : "hidden")
        }
      >
        <ArrowLeft
          className="absolute ml-4 text-[#262626]"
          onClick={() => setVisible(false)}
          size={30}
        />
        <button
          type="button"
          className="absolute right-0 mr-8 p-2 hover:bg-gray-200 rounded-md"
        >
          <Search className="text-[#262626]" />
        </button>
        <input
          type="text"
          className="w-full py-4 rounded-md shadow-md border border-gray-200 px-[3.5rem] placeholder:tracking-wide outline-none"
          placeholder="Search for dishes.."
        />
      </form>
    </div>
  );
}

function DishContainer() {
  const { id } = useParams();

  const {
    data: dishes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["dishes-list"],
    queryFn: async () => {
      return await (
        await fetch(`http://192.168.0.103:3000/restaurants/${id}/dishes/list`)
      ).json();
    },
  });

  return (
    <div className="mt-4 space-y-6">
      {dishes &&
        dishes.map(
          (
            { dishid, imageurl, isavailable, name, price, description },
            index,
          ) => {
            // let temp =
            //   usercart &&
            //   Array.isArray(usercart.list) &&
            //   usercart.list.find((e) => e.dishid == dishid);
            return (
              isavailable && (
                <DishCard
                  {...{ id: dishid, imageurl, name, price, description }}
                  // initQuantity={temp && temp.quantity}
                  key={index}
                />
              )
            );
          },
        )}
    </div>
  );
}

function Checkout({ usercart }) {
  let [cartValue, setCart] = useAtom(cart);
  let sum = cartValue.reduce((a, c) => a + c.price * c.quantity, 0);

  useEffect(() => {
    if (usercart)
      setCart(
        usercart.list.map((e) => ({
          id: e.dishid,
          name: e.name,
          price: e.price,
          quantity: e.quantity,
        })),
      );
  }, [JSON.stringify(usercart)]);

  return (
    sum > 0 && (
      <>
        <Confetti
          recycle={false}
          height={document.body.scrollHeight}
          confettiSource={{ x: window.innerWidth / 4 }}
          gravity={0.5}
          initialVelocityY={20}
          initialVelocityX={10}
        />
        <Link
          to="/cart"
          className="fixed z-[10] overflow-hidden flex justify-center items-center bottom-0 bg-gray-500 w-full text-white font-bold text-xl text-center shadow-lg"
        >
          <div className="w-full max-w-7xl py-6 flex justify-center items-center">
            <div className="ml-4">
              <button className="shadow-md p-2 flex items-center bg-white text-black text-sm box-border rounded-md border">
                Fast Checkout
                <FastForward className="inline ml-2" size={15} />
              </button>
            </div>
            <div className="flex-[2] flex justify-center items-center">
              <div className="animate absolute">
                Yupp Cart is ready to checkout !! 🥳🥳
              </div>
              <div className="animate-2 flex items-center">
                View Cart | ₹ {sum}{" "}
                <CircleArrowRight
                  color="#ffffff"
                  strokeWidth={3}
                  absoluteStrokeWidth
                  className="inline ml-2"
                />
              </div>
            </div>
          </div>
        </Link>
      </>
    )
  );
}

export default function Restaurant() {
  const { id } = useParams();

  const {
    data: restaurantInfo,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["restaurants-info"],
    queryFn: async () => {
      return await (
        await fetch("http://192.168.0.103:3000/restaurants/list/" + id)
      ).json();
    },
  });

  const { data: _user_cart } = useQuery({
    queryKey: ["cart-list"],
    queryFn: async () => {
      return await getCart();
    },
  });

  let usercart;

  if (
    _user_cart &&
    _user_cart.restaurantid == id &&
    _user_cart.orderstatus == "Pending"
  ) {
    usercart = _user_cart;
  }

  return (
    restaurantInfo && (
      <div className="w-full flex justify-center">
        <div className="wrapper px-6 py-6 w-full max-w-7xl">
          <header className="fixed z-[10]">
            <LucideArrowLeft size={30} onClick={() => window.history.back()} />
          </header>
          <div className="flex flex-col gap-4 pt-16">
            <div
              className="bg-red-500 w-full max-h-[400px] h-full min-h-[200px] absolute left-0"
              style={{
                backgroundImage: `url("${restaurantInfo.photos && restaurantInfo.photos[0]}")`,
                backgroundSize: "contain",
                backgroundAttachment: "fixed",
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute w-full h-full bg-gradient-to-b from-white to-transparent"></div>
                <div className="w-full h-full bg-gradient-to-t from-white to-transparent"></div>
              </div>
            </div>
            <div className="z-[1] space-y-4">
              <div className="restaurant text-5xl font-black">
                {restaurantInfo.name}
              </div>
              <div className="description">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised
              </div>
              <div className="flex gap-x-4 items-center">
                <Phone /> <div>{restaurantInfo.phonenumber}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-semibold">Opening Hours</div>
                <div>{restaurantInfo.openinghours}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xl font-semibold">Address</div>
                <div>{restaurantInfo.address}</div>
              </div>
            </div>
          </div>
          <div className="relative py-6 z-[2]">
            <DishHeader />

            <DishContainer usercart={usercart} />
          </div>
        </div>

        <Checkout usercart={usercart} />
      </div>
    )
  );
}
