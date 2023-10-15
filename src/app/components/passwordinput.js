import React, { useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { Eye, EyeClosed } from '@phosphor-icons/react'



export default function PasswordInput(props) {

    const [valid, setValid] = useState(props?.valid || false)
    const [erro, setErro] = useState()
    const [visible, setVisible] = useState(false)

    function validate() {
        if (props.value == "") {
            setValid(false)
            setErro("Preenchimento obrigatório!")
        }
        else {
            setValid(true)
            setErro()
        }
    }

    //    useEffect(() => {
    //        props.onValidateChange(valid)
    //    },[valid])

    return (
        <div className="flex w-full flex-col">
            <div className="flex w-full justify-between items-center border-[1px] rounded-md border-emerald-600 font-normal p-2">
                <InputMask {...props} type={visible ? "" : "password"} onBlur={validate} className={"bg-black focus:outline-none font-normal w-full" + props.css}></InputMask>
                <button type="button" className="ml-2 text-emerald-600 hover:animate-pulse" onClick={(e) => setVisible(!visible)}>
                    {visible ?
                    <EyeClosed size={24} /> :
                    <Eye size={24} />
                }</button>
            </div>

            {erro ?
                <span className="px-1 mt-2 text-white text-sm rounded-md bg-red-800 font-thin animate-bounce w-fit">{erro}</span>
                :
                <></>}

        </div>


    );
}