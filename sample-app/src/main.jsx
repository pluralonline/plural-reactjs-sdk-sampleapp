import React from "react";
import ReactDOM from "react-dom/client";
import Create from "./Create.jsx";
import Fetch from "./Fetch.jsx";
import Emi from "./Emi.jsx";
import Hash from "./Hash.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Create />,
  },

  {
    path: "/fetch",
    element: <Fetch />,
  },
  {
    path: "/emi",
    element: <Emi />,
  },
  {
    path: "/hash",
    element: <Hash />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
