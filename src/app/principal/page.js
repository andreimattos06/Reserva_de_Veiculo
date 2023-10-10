'use client'

import Sidebar from '../components/sidebar.js';
import ItemCalendar from '../components/itemcalendar.js';
import Button from '../components/button.js'
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import InputMask from 'react-input-mask';
import { MagnifyingGlass, PaperPlaneTilt, Car, PencilSimple, User, AirplaneTakeoff, AirplaneLanding, CarProfile, MapPin } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog';
import InputAlt from '../components/inputalt.js';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Loading from '../components/loading.js'
import { dateToLocalDate } from '../util/datetolocaldate.js';


export default function Principal() {
    const { data: session, status } = useSession()
    if (status === "unauthenticated") {
        redirect("/", "replace")
    }

    const [calendario, setCalendario] = useState([])
    const [dia, setDia] = useState()
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(true)
    const [ano, setAno] = useState(new Date().getFullYear())
    const [mes, setMes] = useState(new Date().getMonth() + 1)
    const [dialog, setDialog] = useState(false)
    const [dialog_marcacoes, setDialogMarcacoes] = useState(false)
    const [empresa, setEmpresa] = useState("")
    const [marcacoes_dia, setMarcacoesDia] = useState([])
    const [veiculo, setVeiculo] = useState()
    const [lista_veiculos, setListaVeiculos] = useState([])
    const [mesextenso, setMesExtenso] = useState(new Date().getMonth() + 1)
    const [primeiro_dia, setPrimeiroDia] = useState(0)
    const [busca, setBusca] = useState(0)
    const [nova_marcacao, setNovaMarcacao] = useState({
        destino: "",
        data_partida: "",
        hora_partida: "",
        data_retorno: "",
        hora_retorno: "",
        veiculo: "",
        observacao: "",
    })

    function clearNovaMarcacao() {
        setNovaMarcacao({
            destino: "",
            data_partida: "",
            hora_partida: "",
            data_retorno: "",
            hora_retorno: "",
            veiculo: "",
            observacao: "",
        })
    }
    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
    /** Use Effect inicial,para iniciar informações necessárias na execução */
    useEffect(() => {
        setEmpresa(session?.user.empresa[0].id)
        setPrimeiroDia(new Date(ano, mes, 1).getDay())

    }, [])

    useEffect(() => {
        setLoading()
        if (status === "authenticated"){
            setEmpresa(session?.user.empresa[0].id)
            setLoading(false)
        }
        
    },[status])

    //Use Effect usado para atualizar o primeiro dia o mês quando houver mudança na data.
    useEffect(() => {
        setPrimeiroDia(new Date(ano, mes - 1, 1).getDay())
        setMesExtenso(mes)
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
            else {
                setAno(ano)
            }
        }
        else {
            setAno(ano)
        }
    }

    async function getVeiculosDisponiveis() {
        setEdit(false)
        setLoading(true)

        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/getveiculos"}`, {
            method: 'POST',
            body: JSON.stringify({ empresaid: empresa }),
            headers: { "Content-Type": "application/json" }
        })
        const veiculos = await res.json();

        const res2 = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/getcarrosindisponiveis"}`, {
            method: 'POST',
            body: JSON.stringify({
                empresa: empresa,
                ultimodia: new Date("".concat(nova_marcacao.data_retorno.slice(6, 10), "-", nova_marcacao.data_retorno.slice(3, 5), "-", nova_marcacao.data_retorno.slice(0, 2), "T", nova_marcacao.hora_retorno[0], nova_marcacao.hora_retorno[1], ":", nova_marcacao.hora_retorno[3], nova_marcacao.hora_retorno[4], ":00", ".000Z")),
                primeirodia: new Date("".concat(ano, "-", mes, "-", dia, "T", nova_marcacao.hora_partida[0], nova_marcacao.hora_partida[1], ":", nova_marcacao.hora_partida[3], nova_marcacao.hora_partida[4], ":00", ".000Z")),
            }),
            headers: { "Content-Type": "application/json" }
        })
        const veiculos_indisponiveis = await res2.json();


        let array = veiculos.filter(e => {
            e.indisponivel = false
            for (let i = 0; i < veiculos_indisponiveis.length; i++) {
                if (e.id == veiculos_indisponiveis[i].carro.id) {
                    e.indisponivel = true
                }
            }
            if (!e.indisponivel) {
                return e
            }
        })
        setLoading(false)

        if (array.length > 0) {
            setListaVeiculos(array)
            setVeiculo(array[0].id)
        }
        else {
            alert("Nenhum carros disponível.")
        }

    }

    function editNovaMarcacao() {
        setListaVeiculos([])
        setEdit(true)
    }

    async function showDialog(dia) {
        setEdit(true)
        setVeiculo(undefined)
        setListaVeiculos([])

        if (dia < 10) {
            dia = "0" + dia
        }
        setDia(dia)
        setNovaMarcacao({
            destino: "",
            data_partida: dia + "/" + mes + "/" + ano,
            hora_partida: "",
            data_retorno: "",
            hora_retorno: "",
            veiculo: "",
            observacao: "",
        })
        setDialog(true)
    }

    async function showDialogMarcacoes(dia){
        if (dia < 10){
            dia = "0" + dia
        }
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/getmarcacoesdia"}`, {
            method: 'POST',
            body: JSON.stringify({ 
                empresa: empresa,
                data: ano + "-" + mes + "-" + dia
            }),
            headers: { "Content-Type": "application/json" }
        })
        const result = await res.json();
        setMarcacoesDia(result)
        setDialogMarcacoes(true)
        setLoading(false)

    }

    async function newMarcacao() {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/addmarcacao"}`, {
            method: 'POST',
            body: JSON.stringify({
                destino: nova_marcacao.destino,
                observacao: nova_marcacao.observacao,
                data_partida: new Date("".concat(ano, "-", mes, '-', nova_marcacao.data_partida.slice(0, 2), "T", nova_marcacao.hora_partida.slice(0, 2), ":", nova_marcacao.hora_partida.slice(3, 5), ":00.000Z")),
                data_retorno: new Date("".concat(nova_marcacao.data_retorno.slice(6, 10), "-", nova_marcacao.data_retorno.slice(3, 5), "-", nova_marcacao.data_retorno.slice(0, 2), "T", nova_marcacao.hora_retorno.slice(0, 2), ":", nova_marcacao.hora_retorno.slice(3, 5), ":00.000Z")),
                veiculo: veiculo,
                email: session?.user.email,
                empresa: empresa,
            }),
            headers: { "Content-Type": "application/json" }
        })
        const result = await res.json();
        setLoading(false)
        if (result == "sucesso") {
            alert("Marcação criada com sucesso.")
            clearNovaMarcacao()
            setDialog(false)

        }
        else {
            alert("Houve um erro.")
        }
    }
    console.log(marcacoes_dia)
    return (
        <>
            <div className="flex flex-row">
                <Sidebar />
                <div className='flex flex-col my-16 mx-16 w-4/5 gap-10'>
                    <div className='flex w-full items-center justify-between'>
                        <Select.Root value={empresa} onValueChange={(target) => setEmpresa(target)}>
                            <Select.Trigger className=" text-white font-semibold outline-none px-3 inline-flex items-center justify-between border-[1px] cursor-default border-emerald-600 h-full rounded-md w-2/6">
                                <Select.Value></Select.Value>
                                <Select.Icon className="text-white">
                                    <ChevronDownIcon />
                                </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                                <Select.Content className="overflow-auto outline-none border-[1px] flex border-emerald-600 text-white font-semibold rounded-md w-full bg-black">
                                    <Select.Viewport className="p-3">
                                        <Select.Group>
                                            {session?.user?.empresa.map((e, index) => {
                                                let aux = e.numero + " - " + e.nome
                                                return (
                                                    <Select.Item key={index + aux} className="hover:bg-emerald-600 hover:text-black p-2 rounded-sm outline-none cursor-default" value={e.id}>
                                                        <Select.ItemText>{aux}</Select.ItemText>
                                                    </Select.Item>
                                                )
                                            })}
                                        </Select.Group>

                                    </Select.Viewport>
                                </Select.Content>
                            </Select.Portal>
                        </Select.Root>

                        <div className='self-end flex text-white font-semibold gap-2 text-base items-center'>
                            <InputMask className='bg-black text-center w-5 focus:outline-none' mask="99" maskChar="" value={mes} onChange={(event) => { onChangeMes(event.target.value) }} />
                            <span className='text-2xl font-bold text-emerald-600'> / </span>
                            <InputMask className='bg-black text-center w-9 focus:outline-none' mask="9999" maskChar="" value={ano} onChange={(event) => { onChangeAno(event.target.value) }} />
                            <Button css="border-0" icon={<MagnifyingGlass size={18} />} onClick={() => setBusca(busca + 1)} />
                        </div>
                    </div>
                    <div className='w-full grid grid-cols-7 gap-3'>
                        {calendario.map((e, index) => {
                            if (e <= 0) {
                                return <div />
                            }
                            else {
                                return (
                                    <ItemCalendar onClick2={() => showDialogMarcacoes(e)} onClick={() => showDialog(e)} key={index + mes + ano} dia={e} index={index} mes={mesextenso} />
                                )
                            }
                        })}

                    </div>


                </div>
            </div>

            <Dialog.Root open={dialog} onOpenChange={() => setDialog(false)} className="">
                <Dialog.Trigger />
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black opacity-80 inset-0 fixed" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-3/12 bg-black border-2 border-emerald-600 rounded-md py-10 px-10">
                        <Dialog.Title className="text-white text-2xl font-bold">
                            Nova Reserva
                        </Dialog.Title>
                        <form>
                            <div className="grid grid-cols1 text-white pt-8 gap-5 font-semibold">

                                <div className="grid grid-cols-1">
                                    <span>Destino:</span>
                                    <InputAlt placeholder="Cristalina - GO" value={nova_marcacao.destino} onChange={(e) => setNovaMarcacao({ ...nova_marcacao, destino: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2">
                                    <span>Data e Hora da Partida:</span>
                                    <div />
                                    <InputAlt css=" text-gray-500" mask="99/99/9999" maskChar=" " disabled value={nova_marcacao.data_partida} onChange={(e) => setNovaMarcacao({ ...nova_marcacao, data_partida: e.target.value })} />
                                    <InputAlt disabled={!edit} css={!edit ? " text-gray-500" : ""} mask="99:99" maskChar=" " placeholder="08:00" value={nova_marcacao.hora_partida} onChange={(e) => setNovaMarcacao({ ...nova_marcacao, hora_partida: e.target.value })} />

                                </div>

                                <div className="grid grid-cols-2">
                                    <span>Data e Hora do Retorno:</span>
                                    <div />
                                    <InputAlt disabled={!edit} css={!edit ? " text-gray-500" : ""} mask="99/99/9999" maskChar=" " placeholder="01/01/2023" value={nova_marcacao.data_retorno} onChange={(e) => setNovaMarcacao({ ...nova_marcacao, data_retorno: e.target.value })} />
                                    <InputAlt disabled={!edit} css={!edit ? " text-gray-500" : ""} mask="99:99" maskChar=" " placeholder="08:00" value={nova_marcacao.hora_retorno} onChange={(e) => setNovaMarcacao({ ...nova_marcacao, hora_retorno: e.target.value })} />
                                </div>

                                <div className='flex'>
                                    {(lista_veiculos.length > 0) ?
                                        <Select.Root key={veiculo} value={veiculo} onValueChange={(target) => setVeiculo(target)}>
                                            <Select.Trigger className="text-white font-semibold outline-none px-3 py-2 inline-flex items-center justify-between border-[1px] cursor-default border-emerald-600 h-full rounded-md w-full">
                                                <Select.Value placeholder="Selecione um veículo..."></Select.Value>
                                                <Select.Icon>
                                                    <ChevronDownIcon />
                                                </Select.Icon>
                                            </Select.Trigger>
                                            <Select.Portal>
                                                <Select.Content className="overflow-auto outline-none border-[1px] flex border-emerald-600 text-white font-semibold rounded-md w-full bg-black">
                                                    <Select.Viewport className="p-3">
                                                        <Select.Group>
                                                            <Select.Label className="text-gray-300">Veículos Disponíveis:</Select.Label>
                                                            {lista_veiculos.map((e) => {
                                                                let aux = e.marca + " " + e.modelo + " - " + e.placa + " - " + e.identificacao
                                                                return (
                                                                    <Select.Item key={e.id} className="hover:bg-emerald-600 hover:text-black p-2 rounded-sm outline-none cursor-default text-white" value={e.id}>
                                                                        <Select.ItemText>
                                                                            <div className='flex items-center gap-3'>
                                                                                <Car size={22} />
                                                                                {aux}
                                                                            </div>
                                                                        </Select.ItemText>
                                                                    </Select.Item>
                                                                )
                                                            })}
                                                        </Select.Group>
                                                    </Select.Viewport>
                                                </Select.Content>
                                            </Select.Portal>
                                        </Select.Root>

                                        :
                                        <></>
                                    }
                                    {(lista_veiculos.length > 0) ?
                                        <Button type="button" onClick={editNovaMarcacao} icon={<PencilSimple size={24} />} />
                                        :
                                        <Button type="button" onClick={getVeiculosDisponiveis} icon={<MagnifyingGlass size={30} />} texto="Verificar Disponibilidade dos Veículos" />
                                    }

                                </div>

                                <div className="grid grid-cols-1">
                                    <span>Observacao:</span>
                                    <InputAlt placeholder="Deslocamento para treinamento" value={nova_marcacao.observacao} onChange={(e) => setNovaMarcacao({ ...nova_marcacao, observacao: e.target.value })} />
                                </div>

                                <div className="justify-self-end">
                                    <Button onClick={newMarcacao} type="button" texto="Enviar" icon={<PaperPlaneTilt size={24} />} />
                                </div>

                            </div>
                        </form>
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={dialog_marcacoes} onOpenChange={() => setDialogMarcacoes(false)} className="">
                <Dialog.Trigger />
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black opacity-80 inset-0 fixed" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-11/12 bg-black border-2 border-emerald-600 rounded-md px-10">
                        <div className="text-white mt-11">
                            <table className="table-auto border-collapse w-full text-emerald-600 text-center">
                                <thead>
                                    <tr>
                                        <th> <div className="flex justify-center pb-5"><User size={30} /></div></th>
                                        <th><div className='flex justify-center pb-5'><CarProfile size={30} /></div></th>
                                        <th><div className='flex justify-center pb-5'><AirplaneTakeoff size={30} /></div></th>
                                        <th><div className='flex justify-center pb-5'><AirplaneLanding size={30} /></div></th>
                                        <th><div className='flex justify-center pb-5'><MapPin size={30} /></div></th>
                                        <th><div className='flex justify-center pb-5'><MagnifyingGlass size={30} /></div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marcacoes_dia.map((e, index) => {
                                        let par = false
                                        if (index % 2 === 0) {
                                            par = true
                                        }
                                        return (
                                            <tr key={e.placa} className={"text-white border-t-[1px] " + (par ? " border-emerald-600" : "border-emerald-900")}>
                                                <td className="py-5">{e.usuario.nome_completo}</td>
                                                <td className="py-5">{e.carro.marca + " " + e.carro.modelo + " - " + e.carro.placa + " - " + e.carro.identificacao}</td>
                                                <td className="py-5">{dateToLocalDate(e.data_inicio)}</td>
                                                <td className="py-5">{dateToLocalDate(e.data_fim)}</td>
                                                <td className="py-5">{e.destino}</td>
                                                <td className="py-5">{e.observacao}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {loading ?
                <Loading />
                :
                <></>
            }

        </>
    )
}