import {
  BaggageClaim,
  ChevronDown,
  Dot,
  ListFilter,
  LocateFixed,
  LogOut,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  UserCircle,
} from "lucide-react";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import "../App.css";
import { useQuery } from "@tanstack/react-query";
import dealsImage from "../../public/deals.png";
import { useState } from "react";

function Card({ name, restaurantid, photo, rating, city, lowest_price }) {
  return (
    <Link
      to={"/restaurant/" + restaurantid}
      className="card w-full cursor-pointer hover:scale-95 transition-transform"
    >
      <div
        className="image aspect-[3/2] overflow-hidden relative bg-red-500 rounded-md flex items-end p-4 box-border shadow-md"
        style={{
          backgroundImage: `url("${photo}")`,
          backgroundSize: "cover",
        }}
      >
        <div className="bg-gradient-to-t from-red-600/50 to-transparent w-full h-1/2 absolute bottom-0 left-0"></div>
        <div className="z-[1] starts uppercase font-extrabold tracking-wide text-2xl text-white">
          From Rs. {lowest_price}
        </div>
      </div>
      <div className="details px-2 py-3">
        <div className="title font-bold text-xl">{name}</div>
        <div className="flex items-center gap-x-2">
          <div className="rating flex gap-x-2 items-center">
            <Star size={15} className="text-green-500" /> {rating}
          </div>
          <div className="location">{city}</div>
        </div>
      </div>
    </Link>
  );
}
function SearchForm({ className }) {
  const [enabled, setEnable] = useState(false);
  const [result, setResult] = useState([]);

  let timeout;

  function handleInput(e) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(sendData, 500);
    async function sendData() {
      if (e.target.value.trim() != "") {
        let _r = await (
          await fetch(
            `${import.meta.env.VITE_NAME_URL}/restaurants/list?name=` +
              e.target.value.toLowerCase(),
          )
        ).json();
        setResult(_r);
      }
    }

    if (e.target.value.trim() != "") {
      setEnable(true);
    } else setEnable(false);
  }

  return (
    <form
      action="/"
      className={
        "flex flex-col flex-[2] relative w-full shadow-md " + className
      }
    >
      <div className="flex flex-1 items-center w-full">
        <Search className="absolute ml-4 text-[#919196]" color="currentColor" />
        <input
          type="text"
          className="w-full pl-[3.5rem] py-4 rounded-md border border-gray-200 px-4 placeholder:tracking-wide outline-none"
          placeholder="Search for restaurants.."
          onChange={handleInput}
        />
      </div>
      {enabled && (
        <div className="animate-in overflow-y-auto absolute max-h-[calc(100vh-200px)] w-full min-h-48 top-full bg-white translate-y-2 rounded-md space-y-4 py-2 z-[100] shadow-md">
          {result &&
            result.map((e) => (
              <Link
                key={e.restaurantid}
                to={`/restaurant/${e.restaurantid}`}
                className="flex gap-x-4 hover:bg-gray-300 px-3 py-2"
              >
                <div className="image flex-grow w-24 aspect-square overflow-hidden rounded-md">
                  <img className="max-w-full h-full" src={e.photos[0]} alt="" />
                </div>
                <div className="w-[calc(100%-6rem)] flex flex-col justify-center">
                  <div className="font-bold">{e.name}</div>
                  <div className="flex">
                    <div className="rating flex gap-x-2 items-center">
                      <Star size={15} className="text-green-500" /> 3.4
                    </div>
                    <div className="flex">
                      <Dot /> {e.city}
                    </div>
                  </div>
                  <div>{e.address}</div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </form>
  );
}

function App() {
  const {
    data: restaurants,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["restaurants-list"],
    queryFn: async () => {
      return await (
        await fetch(`${import.meta.env.VITE_NAME_URL}/restaurants/list`)
      ).json();
    },
  });

  const {
    data: user,
    error: userDataError,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await (
        await fetch(`${import.meta.env.VITE_NAME_URL}/auth/get_user`, {
          credentials: "include",
        })
      ).json();
    },
  });

  return (
    <>
      <header className="w-full flex flex-col items-center box-border py-4 md:py-8 px-6 md:px-12 gap-y-4 bg-green-500">
        <div className="wrapper items-center flex w-full max-w-7xl">
          <div className="flex gap-x-2 items-center flex-1 text-white">
            <LocateFixed size={30} className="text-white" />
            <div>Kolkata</div>
            <button type="button" className="hover:bg-gray-600/20 rounded-md">
              <ChevronDown />
            </button>
          </div>
          <SearchForm className="lg:block hidden" />
          <div className="flex-1 flex justify-end text-white gap-x-6">
            {!user ? (
              <>
                <Link to="/signup">
                  <button
                    type="button"
                    className="py-2 font-semibold hover:text-black"
                  >
                    Sign up
                  </button>
                </Link>
                <Link to="/login">
                  <button
                    type="button"
                    className="py-2 font-semibold hover:text-black"
                  >
                    Log in
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/cart">
                  <ShoppingCart />
                </Link>
                <UserCircle />
                <Link to="/orders">
                  <ShoppingBag />
                </Link>
                <Link to="/logout">
                  <LogOut />
                </Link>
              </>
            )}
          </div>
        </div>
        <SearchForm className="lg:hidden" />
        {/* <form action="/" className="w-full flex-[2] lg:hidden">
          <div className="flex items-center w-full">
            <Search
              className="absolute ml-4 text-[#919196]"
              color="currentColor"
            />
            <input
              type="text"
              className="w-full pl-[3.5rem] py-4 rounded-md shadow-md border border-gray-200 px-4 placeholder:tracking-wide outline-none"
              placeholder="Search for restaurants.."
            />
          </div>
        </form> */}
      </header>

      <section className="bg-green-500 w-full h-48 flex justify-center py-4 shadow-md">
        <div className="wrapper flex flex-col w-full max-w-7xl overflow-hidden">
          <div className="deals flex px-6 items-center">
            <div className="flex-1 lg:px-24 h-full">
              <div className="title font-semibold text-lg w-fit h-fit">
                Crazy Deals
              </div>
              <Confetti recycle={false} />
              <div className="deal text-2xl md:text-3xl animate-[colorBlink_600ms_3] font-black">
                Untimated Party
                <br /> Discount & More
              </div>
            </div>
            <div className="img">
              <img src={dealsImage} alt="" className="-mt-6 max-w-full w-48" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 px-6 flex justify-center">
        <div className="wrapper flex flex-col w-full max-w-7xl gap-y-4">
          <h1 className="text-3xl font-bold">Restaurants near you</h1>
          <div className="filter flex gap-4">
            <div className="flex items-center justify-center gap-1 w-fit px-4 py-2 rounded-full border-[1.5px] shadow border-gray-300">
              <div>Filter</div> <ListFilter className="text-gray-500" />
            </div>
          </div>
          <div className="grid xl:grid-cols-4 sm:grid-cols-3 gap-4">
            {isLoading
              ? "Loading"
              : restaurants &&
                restaurants.map((props, index) => (
                  <Card
                    key={index}
                    {...props}
                    lowest_price={parseInt(props.lowest_price)}
                    rating={3.4}
                    photo={props.photos[0]}
                  />
                ))}
          </div>
        </div>
      </section>
      <footer className="w-full px-6 py-4 bg-[#262626] flex flex-col items-center text-white">
        <div>This website is designed and created by Mrinmoy Mondal</div>
        <div>
          [
          <a
            className="underline text-blue-500"
            href="https://github.com/mrinmoymondalreal"
          >
            Github
          </a>
          ] [
          <a
            className="underline text-blue-500"
            href="https://www.linkedin.com/in/mrinmoy-mondal-319861167/"
          >
            Linkedin
          </a>
          ] [
          <a
            className="underline text-blue-500"
            href="https://mrinmoymondalreal.github.io/Portfolio/"
          >
            Portfolio
          </a>
          ]
        </div>
        <div>
          If you want more detail about the website check the github page{" "}
          <a
            className="underline text-blue-500"
            href="https://github.com/mrinmoymondalreal/RestaurantRope"
          >
            here
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
