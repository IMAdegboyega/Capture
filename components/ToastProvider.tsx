"use client";

import { Toaster } from "react-hot-toast";

const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 500,
      },
    }}
  />
);

export default ToastProvider;
