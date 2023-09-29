'use client'

import Sidebar from '../components/sidebar.js';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Button from "../components/button.js";
import * as Dialog from '@radix-ui/react-dialog';
import InputAlt from '../components/inputalt.js'
import { Plus, Pencil, Trash, PaperPlaneTilt, Check, X } from '@phosphor-icons/react'
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import AlertButton from '../components/alertbutton.js'
import CancelButton from '../components/cancelbutton.js'

export default function Veiculos() {
    const [empresa, setEmpresa] = useState("")
    const [lista_veiculos, setListaVeiculos] = useState([])
    const [dialog, setDialog] = useState(false)
    const [delete_dialog, setDeleteDialog] = useState(false)
    const [delete_id, setDeleteID] = useState("")
    const [adicionarVeiculo, setAdicionarVeiculo] = useState(false)
    const [dados_veiculo, setDadosVeiculo] = useState({
        id: "",
        marca: "",
        modelo: "",
        placa: "",
        identificacao: ""
    })

    const { data: session, status } = useSession()
    if (status === "unauthenticated" || session?.user?.administrador === false) {
        redirect("/", "replace")
    }

    useEffect(() => {
        setEmpresa(session?.user.empresa[0].id)


    }, [])

    useEffect(() => {
        async function getData() {
            const res = await fetch('http://localhost:3334/getveiculos', {
                method: 'POST',
                body: JSON.stringify({ empresaid: empresa }),
                headers: { "Content-Type": "application/json" }
            })
            const result = await res.json();
            setListaVeiculos(result)

        }
        getData()

    }, [empresa])

    function limparDadosVeiculo() {
        setDadosVeiculo({
            id: "",
            marca: "",
            modelo: "",
            placa: "",
            identificacao: "",
        })
    }

    function novoVeiculo() {
        limparDadosVeiculo()
        setAdicionarVeiculo(true)
        setDialog(true)
    }

    async function submitNovo() {
        const res = await fetch('http://localhost:3334/addveiculo', {
            method: 'POST',
            body: JSON.stringify({
                empresaid: empresa,
                marca: dados_veiculo.marca,
                modelo: dados_veiculo.modelo,
                placa: dados_veiculo.placa,
                identificacao: dados_veiculo.identificacao,

            }),
            headers: { "Content-Type": "application/json" }
        })
        const result = await res.json();

        if (result == "sucesso") {
            alert("Veiculo adicionado com sucesso!")
            location.reload()
        }
        else {
            alert("Foram encontrados os seguintes erros: " + result)
            location.reload()
        }
    }

    async function submitAlteracao() {
        const res = await fetch('http://localhost:3334/updatedadosveiculo', {
            method: 'POST',
            body: JSON.stringify({
                id: dados_veiculo.id,
                marca: dados_veiculo.marca,
                modelo: dados_veiculo.modelo,
                placa: dados_veiculo.placa,
                identificacao: dados_veiculo.identificacao,
            }),
            headers: { "Content-Type": "application/json" }
        })
        const result = await res.json();

        if (result == "sucesso") {
            alert("Veiculo atualizado com sucesso!")
            location.reload()
        }
        else {
            alert("Houve algum erro!")
            location.reload()
        }
    }

    async function submitDelete(id) {
        const res = await fetch('http://localhost:3334/deleteveiculo', {
            method: 'POST',
            body: JSON.stringify({
                id: delete_id,
            }),
            headers: { "Content-Type": "application/json" }
        })
        const result = await res.json();

        if (result == "sucesso") {
            alert("Veiculo excluído com sucesso!")
            location.reload()
        }
        else {
            alert("Houve algum erro!")
            location.reload()
        }
    }

    function submitEnviar() {
        if (adicionarVeiculo) {
            submitNovo()
        }
        else {
            submitAlteracao()
        }
    }

    async function getVeiculoInfo(id) {
        const res = await fetch('http://localhost:3334/getdadosveiculo', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: { "Content-Type": "application/json" }
        })
        const result = await res.json();
        setDadosVeiculo({ ...result })
        setAdicionarVeiculo(false)
        setDialog(true)

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
                                        {session?.user?.empresa.map(e => {
                                            let aux = e.numero + " - " + e.nome
                                            return (
                                                <Select.Item className="hover:bg-emerald-600 hover:text-black p-2 rounded-sm outline-none cursor-default" key={e.id} value={e.id}>
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
                                <th className="px-5 py-3">ID</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Placa</th>
                                <th>Identificação</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {lista_veiculos.map((e, index) => {
                                let par = false
                                if (index % 2 === 0) {
                                    par = true
                                }
                                return (
                                    <tr className={"cursor-pointer border-t-[1px] " + (par ? " border-emerald-600" : "border-emerald-900")}>
                                        <td className="px-5 py-2">{e.id}</td>
                                        <td>{e.marca}</td>
                                        <td>{e.modelo}</td>
                                        <td>{e.placa}</td>
                                        <td>{e.identificacao}</td>
                                        <td>{<Button onClick={() => { getVeiculoInfo(e.id) }} css="my-1" icon={<Pencil size={20} />} />}</td>
                                        <td>{<Button onClick={() => {setDeleteDialog(true), setDeleteID(e.id)}} icon={<Trash size={20} />} />}</td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>
            </div>

            <Dialog.Root open={dialog} onOpenChange={() => setDialog(false)} className="">
                <Dialog.Trigger />
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black opacity-80 inset-0 fixed" />
                    <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-3/12 bg-black border-2 border-emerald-600 rounded-md py-10 px-10">
                        <Dialog.Title className="text-white text-2xl font-bold">
                            {adicionarVeiculo ? "Adicionar Veiculo" : "Alterar Veiculo"}
                        </Dialog.Title>
                        <form>
                            <div className="grid grid-cols1 text-white pt-8 gap-5 font-semibold">

                                <div className="grid grid-cols-1">
                                    <span>Marca:</span>
                                    <InputAlt value={dados_veiculo.marca} onChange={(e) => setDadosVeiculo({ ...dados_veiculo, marca: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>Modelo:</span>
                                    <InputAlt value={dados_veiculo.modelo} onChange={(e) => setDadosVeiculo({ ...dados_veiculo, modelo: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>Placa:</span>
                                    <InputAlt value={dados_veiculo.placa} onChange={(e) => setDadosVeiculo({ ...dados_veiculo, placa: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>Identificação:</span>
                                    <InputAlt value={dados_veiculo.identificacao} onChange={(e) => setDadosVeiculo({ ...dados_veiculo, identificacao: e.target.value })} />
                                </div>


                                <div className="justify-self-end">
                                    <Button onClick={submitEnviar} type="button" texto="Enviar" icon={<PaperPlaneTilt size={24} />} />
                                </div>

                            </div>
                        </form>
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <AlertDialog.Root open={delete_dialog} onOpenChange={() => { setDeleteDialog(false) }}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className='fixed inset-0 bg-black opacity-80' />
                    <AlertDialog.Content className='px-5 py-5 text-white w-2/6 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-black border-2 border-emerald-600 rounded-md'>
                        <AlertDialog.Title className='font-bold text-3xl'> Você tem certeza?</AlertDialog.Title>
                        <AlertDialog.Description className='font-semibold text-gray-300 pt-5'>Essa ação irá excluir o veiculo selecionado da base de dados assim como todas as marcações vinculadas a ele.</AlertDialog.Description>
                        <div className='flex pt-10 justify-end gap-5'>
                            <AlertDialog.Cancel>
                                <CancelButton  texto="Cancelar" icon={<X size={32} />} />
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <AlertButton onClick={submitDelete} texto="Confirmar" icon={<Check size={32} />} />
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>

        </div>
    )
}