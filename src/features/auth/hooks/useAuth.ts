// import { useState } from "react";

export function useAuth() {
  //   const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for the dummy implementation
  const isAuthenticated = true;

  // You would typically handle authentication here (e.g., check for tokens, make API calls)

  return { isAuthenticated };
}
