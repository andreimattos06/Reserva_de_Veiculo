'use client'

import Sidebar from '../components/sidebar.js';
import ItemCalendar from '../components/itemcalendar.js';
import Button from '../components/button.js'
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import InputMask from 'react-input-mask';
import { MagnifyingGlass } from '@phosphor-icons/react'


export default function Principal() {
    const { data: session, status } = useSession()
    if (status === "unauthenticated") {
        redirect("/", "replace")
    }

    const [calendario, setCalendario] = useState([])
    const [ano, setAno] = useState(new Date().getFullYear())
    const [mes, setMes] = useState(new Date().getMonth())
    const [primeiro_dia, setPrimeiroDia] = useState(0)
    const [busca, setBusca] = useState(0)

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }


    /** Use Effect inicial,para iniciar informações necessárias na execução */
    useEffect(() => {
        setPrimeiroDia(new Date(ano, mes, 1).getDay())

    }, [])

    //Use Effect usado para atualizar o primeiro dia o mês quando houver mudança na data.
    useEffect(() => {
        setPrimeiroDia(new Date(ano, mes-1, 1).getDay())
    }, [busca])

    //Use Effect usado para atualizar o calendário quando obtivermos o dia da semana em que o mês inicia.
    useEffect(() => {
        let array = []

        for (let i = (primeiro_dia * -1 + 1); i <= (daysInMonth(mes, ano)); i++) {
            array.push(i)

        }
        setCalendario(array)

    }, [primeiro_dia])

   

    function onChangeMes(mes) {
        if (mes < 1 || mes > 12) {
            setMes(1)
        }
        else {
            setMes(mes)
        }
    }

    function onChangeAno(ano) {
        if (ano.length === 4) {
            if (ano < 2023 || ano > 2028) {
                setAno(2023)
            }
            else{
                setAno(ano)
            }
        }
        else {
            setAno(ano)
        }
    }



    return (
        <>
            <div className="flex flex-row">
                <Sidebar />
                <div className='flex flex-col my-16 mx-16 w-4/5 gap-10'>
                    <div className='self-end flex text-white font-semibold gap-2 text-lg items-center border-b-[1px] border-emerald-600'>
                        <InputMask className='bg-black text-center w-5 focus:outline-none' mask="99" maskChar="" value={mes} onChange={(event) => { onChangeMes(event.target.value) }} />
                        <span className='text-2xl font-bold text-emerald-600'> / </span>
                        <InputMask className='bg-black text-center w-9 focus:outline-none' mask="9999" maskChar="" value={ano} onChange={(event) => { onChangeAno(event.target.value) }} />
                        <Button css="border-0" icon={<MagnifyingGlass size={20} />} onClick={() => setBusca(busca+1)}/>
                    </div>
                    <div className='w-full grid grid-cols-7 gap-3'>
                        {calendario.map((e, index) => {
                            if (e <= 0) {
                                return <div />
                            }
                            else {
                                return (
                                    <ItemCalendar dia={e} index={index} />
                                )
                            }
                        })}

                    </div>


                </div>
            </div>
        </>
    )
}