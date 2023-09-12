import React from "react";

export default function Button(props){

    return(
        <button className={"border-2 border-emerald-600 flex justify-center items-center gap-3 w-fit rounded-lg p-3 hover:bg-emerald-600 hover:text-black transition-colors duration-700 delay-0 " + props.css} {...props}>
            {props.icon != null ? props.icon : false}
            {props.texto}
        </button>
    );
}