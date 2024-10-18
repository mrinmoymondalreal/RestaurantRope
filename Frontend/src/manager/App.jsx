import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Order({ name, list, person_name, totalamount, orderid }) {
  const [completed, setComplete] = useState(false);

  return (
    <div className="order min-w-full rounded-md cursor-pointer space-y-2 border border-black px-4 py-6 ">
      <div className="text-lg font-bold">Order #{orderid}</div>
      <div>Order from {person_name}</div>
      <div>Total Amount: ₹ {Math.floor(totalamount * 1.18) + 10}</div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Dishes Ordered</AccordionTrigger>
          <AccordionContent className="px-12">
            <ul className="list-disc">
              {list.map((e, index) => (
                <li key={index}>
                  {e.name} x {e.quantity}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="space-x-4">
        <Button
          onClick={async () => {
            await fetch(
              `${import.meta.env.VITE_NAME_URL}/manager/order/done/` + orderid,
              {
                credentials: "include",
              },
            );
            setComplete(true);
          }}
        >
          {completed ? "Completed" : "Mark Completed"}
        </Button>
        {!completed && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  Order.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Leave</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await fetch(
                      `${import.meta.env.VITE_NAME_URL}/manager/order/cancel/` +
                        orderid,
                      {
                        credentials: "include",
                      },
                    );
                    location.reload();
                  }}
                >
                  Cancel Order
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

export default function ManagerPage() {
  const { data, isLoading, error } = useQuery({
    queryFn: async () => {
      let g = await fetch(`${import.meta.env.VITE_NAME_URL}/manager/details`, {
        credentials: "include",
      });
      let g2 = await fetch(
        `${import.meta.env.VITE_NAME_URL}/manager/orders/list`,
        {
          credentials: "include",
        },
      );
      g = await g.json();
      g2 = await g2.json();
      return {
        details: g,
        orders: g2,
      };
    },
    queryKey: ["manager"],
  });

  return data ? (
    <section className="w-full h-48 flex justify-center py-4 min-h-screen">
      <div className="wrapper flex flex-col w-full max-w-7xl overflow-hidden px-12 gap-y-8">
        <div className="text-xl font-bold">Hello {data.details.name}</div>
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500 ">Restaurant</div>
          <div className="text-3xl font-black">
            {data.details.restaurantname}
          </div>
        </div>
        <div>
          <div className="heading text-lg font-bold">Latest Orders</div>
          <div className="orders space-y-4 mt-6">
            {data.orders.map((props) => (
              <Order {...props} key={props.orderid} />
            ))}
            {data.orders.length <= 0 && "No orders avialable"}
          </div>
        </div>
      </div>
    </section>
  ) : (
    "Loading"
  );
}
