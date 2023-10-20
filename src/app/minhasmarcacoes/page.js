'use client'

import Sidebar from '../components/sidebar.js';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Button from "../components/button.js";
import { Plus, Trash, Check, X } from '@phosphor-icons/react'
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import AlertButton from '../components/alertbutton.js'
import CancelButton from '../components/cancelbutton.js'
import Loading from '../components/loading.js';
import { dateToLocalDate } from '../util/datetolocaldate.js';

export default function MinhasMarcacoes() {
    const [empresa, setEmpresa] = useState("")
    const [lista_marcacoes, setListaMarcacoes] = useState([])
    const [delete_dialog, setDeleteDialog] = useState(false)
    const [delete_id, setDeleteID] = useState("")
    const [loading, setLoading] = useState(false)

    const { data: session, status } = useSession()
    if (status === "unauthenticated" || session?.user?.administrador === false) {
        redirect("/", "replace")
    }

    useEffect(() => {
        setEmpresa(session?.user.empresa[0].id)
    }, [])

    useEffect(() => {
        setLoading()
        if (status === "authenticated") {
            setEmpresa(session?.user.empresa[0].id)
            setLoading(false)
        }
    }, [status])

    useEffect(() => {
        setLoading(true)
        async function getData() {
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/getreservas"}`, {
                method: 'POST',
                body: JSON.stringify({ email: session?.user?.email }),
                headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
            })
            const result = await res.json();
            setListaMarcacoes(result)
            setLoading(false)
        }
        getData()

    }, [empresa])
    console.log(delete_id)
    async function submitDelete(id) {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/deletereserva"}`, {
            method: 'POST',
            body: JSON.stringify({
                id: delete_id,
            }),
            headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
        })
        const result = await res.json();
        setLoading(false)

        if (result == "sucesso") {
            alert("Reserva excluída com sucesso!")
            location.reload()
        }
        else {
            alert("Houve algum erro!")
            location.reload()
        }
    }


    return (
        <div className="flex flex-row">
            <Sidebar />
            <div className="flex flex-col my-16 mx-16 w-4/5">
                <div className="self-end text-white items-center flex justify-between w-full">
                    <Select.Root value={empresa} onValueChange={(target) => setEmpresa(target)}>
                        <Select.Trigger className="font-semibold outline-none px-3 inline-flex items-center justify-between border-[1px] cursor-default border-emerald-600 h-full rounded-md w-2/6">
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
                    <Button icon={<Plus size={24} />} onClick={() => { novoVeiculo() }} />
                </div>

                <div className="text-white mt-11 border-[1px]  border-emerald-600 rounded-md">
                    <table className="table-auto border-collapse w-full text-center">
                        <thead className="bg-gray-900 font-black">
                            <tr>
                                <th className="px-5 py-3">Data da Saída</th>
                                <th>Data do Retorno</th>
                                <th>Destino</th>
                                <th>Veículo</th>
                                <th>Observação</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {lista_marcacoes.map
                                ?
                                lista_marcacoes.map((e, index) => {
                                    let par = false
                                    if (index % 2 === 0) {
                                        par = true
                                    }
                                    return (
                                        <tr key={e + index} className={"border-t-[1px] " + (par ? " border-emerald-600" : "border-emerald-900")}>
                                            <td className="px-5 py-2">{dateToLocalDate(e.data_inicio)}</td>
                                            <td>{dateToLocalDate(e.data_fim)}</td>
                                            <td>{e.destino}</td>
                                            <td>{e.carro.marca + " " + e.carro.modelo + " - " + e.carro.placa + " - " + e.carro.identificacao}</td>
                                            <td>{e.observacao}</td>
                                            <td className='py-1'>{<Button onClick={() => { setDeleteDialog(true), setDeleteID(e.id) }} icon={<Trash size={20} />} />}</td>
                                        </tr>
                                    )
                                })
                                :
                                <></>
                            }
                        </tbody>

                    </table>
                </div>
            </div>


            <AlertDialog.Root open={delete_dialog} onOpenChange={() => { setDeleteDialog(false) }}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className='fixed inset-0 bg-black opacity-80' />
                    <AlertDialog.Content className='px-5 py-5 text-white w-2/6 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-black border-2 border-emerald-600 rounded-md'>
                        <AlertDialog.Title className='font-bold text-3xl'> Você tem certeza?</AlertDialog.Title>
                        <AlertDialog.Description className='font-semibold text-gray-300 pt-5'>Essa ação irá excluir a reserva selecionada.</AlertDialog.Description>
                        <div className='flex pt-10 justify-end gap-5'>
                            <AlertDialog.Cancel>
                                <CancelButton texto="Cancelar" icon={<X size={32} />} />
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <AlertButton onClick={submitDelete} texto="Confirmar" icon={<Check size={32} />} />
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>

            {loading ?
                <Loading />
                :
                <></>
            }

        </div>
    )
}