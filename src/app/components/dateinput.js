import React, { useEffect, useState } from "react";
import InputMask from 'react-input-mask';

function isValidDate(year, month, day) {
    var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
        return true;
    }
    return false;
}

export default function DateInput(props) {
    const [erro, setErro] = useState()

    function validate() {
        let valido = false
        let data_retorno = {
            ano: props?.value.slice(6,10),
            mes: props?.value.slice(3,5),
            dia: props?.value.slice(0,2),
        }
        let data_partida = {
            ano: props?.data_ref.slice(6,10),
            mes: props?.data_ref.slice(3,5),
            dia: props?.data_ref.slice(0,2),
        }

        let data_valida = isValidDate(data_retorno.ano, data_retorno.mes-1,data_retorno.dia)
        if (props.value.length < 10 || !data_valida) {
            valido = false
            setErro("Data Inválida!")
        }
        else if (new Date(data_partida.ano, data_partida.mes-1, data_partida.dia) > new Date(data_retorno.ano, data_retorno.mes-1, data_retorno.dia)){
            valido = false
            setErro("A data de retorno não pode ser menor que a data de partida!")
        }
        else {
            valido = true
            setErro()
        }

        props?.onValidateChange(valido)
    }



    return (

        <div className="flex w-full flex-col">
            <InputMask {...props} mask="99/99/9999" onBlur={validate} className={"bg-black border-[1px] border-emerald-600 rounded-md p-2 focus:outline-none font-normal placeholder:text-gray-600 " + props.css}></InputMask>
            {erro ?
                <span className="px-1 mt-2 text-white text-sm rounded-md bg-red-800 font-thin animate-bounce w-fit">{erro}</span>
                :
                <></>}

        </div>
    );
}