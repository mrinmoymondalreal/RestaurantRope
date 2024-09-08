import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import App from "./customer/App";
import Restaurant from "./customer/Restaurant";
import Cart from "./customer/Cart";
import Order from "./customer/Order";
import Login from "./customer/Login";
import Signup from "./customer/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/restaurant/:id",
    element: <Restaurant />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/orders",
    element: <Order />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
