import { createContext, useState } from "react";

const IpType =createContext();

const IpContext = ({children}) => {

    const [ip, setIp] = useState("192.168.1.5");
    return(
        <IpType.Provider value={{ip,setIp}}>
            {children}
        </IpType.Provider>
    )
}

export{IpType,IpContext};