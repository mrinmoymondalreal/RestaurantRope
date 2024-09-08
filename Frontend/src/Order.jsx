import { LucideArrowLeft, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Separator } from "./components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Order() {
  return (
    <>
      <div className="item flex items-center hover:scale-95 cursor-pointer transition-transform">
        <div className="">
          <div className="image bg-gray-600 w-20 rounded-md aspect-square"></div>
        </div>
        <div className="name flex-1 box-border px-4 ">
          <div className="text-lg font-bold">Order to [Restaurant Name]</div>
          <div className="text-gray-500">
            on 17th May, 2024{" "}
            <a href="#" className="underline block md:inline-block md:ml-4">
              View Details
            </a>
          </div>
        </div>
        <div className="price">
          <div className="font-bold">Total: </div>
          <div>$ 780</div>
        </div>
      </div>
      <Separator />
    </>
  );
}

export default function Orders() {
  return (
    <>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
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
              <Order />
              <Order />
              <Order />
              <Order />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
