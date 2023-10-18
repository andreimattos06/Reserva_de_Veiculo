import React, { useEffect, useState } from "react";
import InputMask from 'react-input-mask';

export default function HourInput(props) {
    const [erro, setErro] = useState()

    function validate() {
        let valido = false
        if (props.value.length < 5) {
            valido = false
            setErro("Horário Inválido!")
        }
        else if (props.validar_data && props.hora_ref >= props.value){
            valido = false
            setErro("A hora de retorno não pode ser maior que a hora de partida!")
        }

        else {
            valido = true
            setErro()
        }

        props?.onValidateChange(valido)
    }



    return (

        <div className="flex w-full flex-col">
            <InputMask {...props} mask="99:99" onBlur={validate} className={"bg-black border-[1px] border-emerald-600 rounded-md p-2 focus:outline-none font-normal placeholder:text-gray-600 " + props.css}></InputMask>
            {erro ?
                <span className="px-1 mt-2 text-white text-sm rounded-md bg-red-800 font-thin animate-bounce w-fit">{erro}</span>
                :
                <></>}

        </div>
    );
}