import React from "react";

export default function Input(props){
    return(
        <div className="flex justify-center items-center bg-black">
            <div className="border-l-[1px] border-t-[1px] border-b-[1px] border-emerald-600 rounded-l-lg p-2 ">{props.icon}</div>
            <input {...props} className="bg-black border-[1px] border-emerald-600 rounded-r-lg p-2"></input>
        </div>
    );
}