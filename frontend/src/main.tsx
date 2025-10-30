// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ Import React Query
const queryClient = new QueryClient(); // ✅ Create a Query Client
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
