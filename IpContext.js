import { createContext, useState } from "react";

const IpType =createContext();

const IpContext = ({children}) => {

    const [ip, setIp] = useState("192.168.1.6");
    return(
        <IpType.Provider value={{ip,setIp}}>
            {children}
        </IpType.Provider>
    )
}

export{IpType,IpContext};