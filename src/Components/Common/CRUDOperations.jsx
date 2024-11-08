import React from 'react';
import axios from 'axios';
import authentication from "react-azure-b2c";

function CRUDData(Method, URL, setResponseData, setToastConfig){

    const token = authentication.getAccessToken().accessToken; //get token
    
    return (
        axios({
            "method": Method,
            "url": URL,
            headers: {
                Authorization: `Bearer ${token}`,
              },
        })
            .then((response) => {
                setResponseData(response.data)
            })
            .catch((error) => {
                if(setToastConfig !== undefined){
                    setToastConfig(true, 'error', error.response.data);
                }
            })
        );
    }

export default {
    getCRUDData(Method, URL, setResponseData) {
        return CRUDData(Method, URL, setResponseData);
    }
}
