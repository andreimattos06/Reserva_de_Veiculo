import React, { useEffect, useState } from "react";
import InputMask from 'react-input-mask';



export default function EmailInput(props) {

    const [valid, setValid] = useState(props?.valid || false)
    const [erro, setErro] = useState()

    function validate(){
        if (props.value == ""){
            setValid(false)
            setErro("Preenchimento obrigatório!")
        }
        else if(!props.value.endsWith("@sicredi.com.br")){
            setValid(false)
            setErro("E-mail inválido!")            
        }
        else{
            setValid(true)
            setErro()
        }
    }

    useEffect(() => {
        props.onValidateChange(valid)
    },[valid])

    return (
        <div className="flex w-full flex-col">
            <InputMask {...props} onBlur={validate} placeholder="theo@sicredi.com.br" className={"bg-black border-[1px] border-emerald-600 rounded-md p-2 focus:outline-none font-normal w-full" + props.css}></InputMask>
            
            {erro ? 
            <span className="px-1 mt-2 text-white text-sm rounded-md bg-red-800 font-thin animate-bounce w-fit">{erro}</span>
            : 
            <></>}
            
        </div>


    );
}