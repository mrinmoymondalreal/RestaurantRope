import { LucideArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

function Order({ name, createdat, totalamount, photos, orderstatus }) {
  let color = {
    Preparing: "bg-yellow-500 text-gray-500",
    Completed: "bg-green-400",
    Cancelled: "bg-black text-white",
  };

  return (
    <>
      <div className="item flex items-center hover:scale-95 cursor-pointer transition-transform">
        <div className="">
          <div
            className="image bg-gray-600 w-24 rounded-md aspect-square"
            style={{
              backgroundImage: `url("${photos[0]}")`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
        <div className="name flex-1 box-border px-4 ">
          <div className="text-lg font-bold">Order to {name}</div>
          <div className="text-gray-500">
            on {new Date(createdat).toLocaleDateString("en-in")}{" "}
            <a href="#" className="underline block md:inline-block md:ml-4">
              View Details
            </a>
          </div>
          <div
            className={
              "text-gray-500 w-fit mt-2 px-4 rounded-full py-1 " +
              color[orderstatus]
            }
          >
            {orderstatus}
          </div>
        </div>
        <div className="price">
          <div className="font-bold">Total: </div>
          <div>₹ {Math.floor(Number(totalamount) * 1.18 + 10)}</div>
        </div>
      </div>
      <Separator />
    </>
  );
}

export default function Orders() {
  const {
    data: orders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["order-list"],
    queryFn: async () => {
      return await (
        await fetch(`${import.meta.env.VITE_NAME_URL}/order/orders`, {
          credentials: "include",
        })
      ).json();
    },
  });

  return (
    <>
      <Dialog>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              // TODO This action cannot be undone. This will permanently delete
              your account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="w-full flex justify-center bg-gray-200 min-h-screen">
        <div className="wrapper w-full max-w-7xl flex justify-center relative">
          <header className="fixed left-0 px-6 py-4 flex items-center gap-x-6">
            <LucideArrowLeft size={30} onClick={() => window.history.back()} />
            <div className="font-bold text-xl">Orders</div>
          </header>
          <div className="billWrapper px-6 py-20 md:px-12 w-full max-w-2xl min-h-screen bg-white">
            <div className="items space-y-6">
              {orders &&
                orders.map((props) => <Order key={props.orderid} {...props} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
