import { createContext, useState } from "react";

const IpType =createContext();

const IpContext = ({children}) => {

    const [ip, setIp] = useState("172.16.129.115");
    return(
        <IpType.Provider value={{ip,setIp}}>
            {children}
        </IpType.Provider>
    )
}

export{IpType,IpContext};