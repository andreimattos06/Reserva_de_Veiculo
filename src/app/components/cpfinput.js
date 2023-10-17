import React, { useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { cpfValidate } from "../util/cpfvalidate";



export default function CpfInput(props) {

    const [erro, setErro] = useState()

    function validate(){
        let valido = false
        if (props.value == ""){
            valido = false
            setErro("Preenchimento obrigatório!")
        }
        else if(props.value.length < 14 || (!cpfValidate(props.value))){
            valido = false
            setErro("CPF inválido!")            
        }
        else{
            valido = true
            setErro()
        }
        props.onValidateChange(valido)
    }


    return (
        <div className="flex w-full flex-col">
            <InputMask {...props} mask='999.999.999-99' onBlur={validate} className={"bg-black border-[1px] border-emerald-600 rounded-md p-2 focus:outline-none font-normal w-full" + props.css}></InputMask>
            
            {erro ? 
            <span className="px-1 mt-2 text-white text-sm rounded-md bg-red-800 font-thin animate-bounce w-fit">{erro}</span>
            : 
            <></>}
            
        </div>


    );
}