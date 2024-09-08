import {
  BaggageClaim,
  ChevronDown,
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

function App() {
  const {
    data: restaurants,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["restaurants-list"],
    queryFn: async () => {
      return await (
        await fetch("http://192.168.0.103:3000/restaurants/list")
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
        await fetch("http://192.168.0.103:3000/auth/get_user", {
          credentials: "include",
        })
      ).json();
    },
  });

  console.log(user);

  return (
    <>
      <header className="w-full flex flex-col items-center box-border py-4 md:py-8 px-6 md:px-12 gap-y-4 bg-green-500">
        <div className="wrapper items-center flex w-full max-w-7xl">
          <div className="flex gap-x-2 items-center flex-1 text-white">
            <LocateFixed size={30} className="text-white" />
            <div>Location</div>
            <button type="button" className="hover:bg-gray-600/20 rounded-md">
              <ChevronDown />
            </button>
          </div>
          <form action="/" className="flex-[2] px-6 lg:block hidden">
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
          </form>
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
        <form action="/" className="w-full flex-2 lg:hidden">
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
        </form>
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
            <div className="img lg:px-24">
              <div className="wrapp bg-gray-500 rounded-md w-20 h-20"></div>
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
    </>
  );
}

export default App;
