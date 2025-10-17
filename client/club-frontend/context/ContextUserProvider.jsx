import axios from "axios";
import { useState, useEffect } from "react";
import { ContextUser } from "./contextUser";

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(undefined); 

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/profile', { withCredentials: true });
        setUser(data ?? null); 
      } catch (err) {
        setUser(null);
        console.error(err);
      }
    })();
  }, []);

  return (
    <ContextUser.Provider value={{ user, setUser }}>
      {children}
    </ContextUser.Provider>
  );
}