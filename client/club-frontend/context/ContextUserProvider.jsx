import axios from "axios";
import { useState, useEffect } from "react";
import { ContextUser } from "./contextUser";

export function UserContextProvider({ children }) { 
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        if (!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data);
            });
        }
    }, [user]);
    
    return (
        <ContextUser.Provider value={{user, setUser}}>
            {children}
        </ContextUser.Provider>
    );
}