import React from "react";
import InputMask from 'react-input-mask';

export default function InputAlt(props) {
    return (

        <InputMask {...props} className={"bg-black border-[1px] border-emerald-600 rounded-md p-2 focus:outline-none font-normal" + props.css}></InputMask>

    );
}