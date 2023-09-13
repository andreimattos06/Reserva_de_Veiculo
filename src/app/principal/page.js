'use client'

import Sidebar from '../components/sidebar.js';
import ItemCalendar from '../components/itemcalendar.js';
import { useEffect, useState } from 'react';


function daysInMonth(month, year) {
    return new Date(year, (month + 1), 0).getDate();
}



export default function Principal() {
    const [calendario, setCalendario] = useState([])
    const [ano, setAno] = useState(new Date().getFullYear())
    const [mes, setMes] = useState(new Date().getMonth())
    const [primeiro_dia, setPrimeiroDia] = useState(0)

    //console.log(new Date(data_hoje.getFullYear(), 11, 1).getDay())


    /** Use Effect inicial,para iniciar informações necessárias na execução */
    useEffect(() => {
        setPrimeiroDia(new Date(ano, mes, 1).getDay())

    }, [])

    //Use Effect usado para atualizar o primeiro dia o mês quando houver mudança na data.
    useEffect(() => {
        setPrimeiroDia(new Date(ano, mes, 1).getDay())
    },[ano, mes])

    //Use Effect usado para atualizar o calendário quando obtivermos o dia da semana em que o mês inicia.
    useEffect(() => {
        let array = []

        for (let i = (primeiro_dia * -1 + 1); i <= (daysInMonth(mes, ano)); i++) {
            array.push(i)

        }
        setCalendario(array)

    }, [primeiro_dia])


    return (
        <>
            <div className="flex flex-row">
                <Sidebar />
                <div className='flex flex-col my-16 mx-16 w-4/5 gap-10'>
                    <div className='text-5xl text-white font-bold'>
                        Calendário
                    </div>
                    <div className='self-end border-2'>

                    </div>
                    <div className='w-full grid grid-cols-7 gap-3'>
                        {calendario.map((e, index) => {
                            return (
                                <ItemCalendar dia={e} index={index} />
                            )
                        })}

                    </div>


                </div>
                <button onClick={() => {setMes(mes-1)}}>aaaaaa</button>
            </div>
        </>
    )
}