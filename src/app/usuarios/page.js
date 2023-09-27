'use client'

import { useSession } from "next-auth/react"
import Sidebar from '../components/sidebar.js';
import { redirect } from 'next/navigation'
import Button from "../components/button.js";
import { Plus, Pencil, Trash, PaperPlaneTilt } from '@phosphor-icons/react'
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import InputAlt from '../components/inputalt.js'
import Checkbox from '../components/checkbox.js'


export default function Usuarios() {

    const [empresa, setEmpresa] = useState("")
    const [lista_users, setListaUser] = useState([])
    const [dialog, setDialog] = useState(false)
    const [adicionarUser, setAdicionarUser] = useState(false)
    const [dados_usuario, setDadosUsuario] = useState({
        email: "",
        nome_completo: "",
        cpf: "",
        cargo: "",
        setor: "",
        senha: "",
        administrador: false
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
            const res = await fetch('http://localhost:3334/getusers', {
                method: 'POST',
                body: JSON.stringify({ empresaid: empresa }),
                headers: { "Content-Type": "application/json" }
            })
            const result = await res.json();
            setListaUser(result)

        }
        getData()

    }, [empresa])

    function limparDadosUsuario(){
        setDadosUsuario({
            email: "",
            nome_completo: "",
            cpf: "",
            cargo: "",
            setor: "",
            senha: "",
            administrador: false
        })
    }

    function novoUsuario() {
        limparDadosUsuario()
        setAdicionarUser(true)
        setDialog(true)
    }

    console.log(dados_usuario)
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
                    <Button icon={<Plus size={24} />} onClick={() => {novoUsuario()}} />
                </div>
                <div className="text-white mt-11 border-[1px]  border-emerald-600 rounded-md">
                    <table className="table-auto border-collapse w-full text-center">
                        <thead className="bg-gray-900 font-black">
                            <tr>
                                <th className="px-5 py-3">ID</th>
                                <th>Email</th>
                                <th>Nome Completo</th>
                                <th>CPF</th>
                                <th>Administrador</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {lista_users.map((e, index) => {
                                let par = false
                                if (index % 2 === 0) {
                                    par = true
                                }
                                return (
                                    <tr className={"cursor-pointer border-t-[1px] " + (par ? " border-emerald-600" : "border-emerald-900")}>
                                        <td className="px-5 py-2">{e.id}</td>
                                        <td>{e.email}</td>
                                        <td>{e.nome_completo}</td>
                                        <td>{e.cpf}</td>
                                        <td>{e.administrador ? "Sim" : "Não"}</td>
                                        <td>{<Button onClick={() => { setAdicionarUser(false), setDialog(true) }} css="my-1" icon={<Pencil size={20} />} />}</td>
                                        <td>{<Button icon={<Trash size={20} />} />}</td>
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
                            {adicionarUser ? "Adicionar Usuario" : "Alterar Usuario"}
                        </Dialog.Title>
                        <form>
                            <div className="grid grid-cols1 text-white pt-8 gap-5 font-semibold">

                                <div className="grid grid-cols-1">
                                    <span>Nome Completo:</span>
                                    <InputAlt value={dados_usuario.nome_completo} onChange={(e) => setDadosUsuario({ ...dados_usuario, nome_completo: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>CPF:</span>
                                    <InputAlt value={dados_usuario.cpf} onChange={(e) => setDadosUsuario({ ...dados_usuario, cpf: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>Setor:</span>
                                    <InputAlt value={dados_usuario.setor} onChange={(e) => setDadosUsuario({ ...dados_usuario, setor: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>Cargo:</span>
                                    <InputAlt value={dados_usuario.cargo} onChange={(e) => setDadosUsuario({ ...dados_usuario, cargo: e.target.value })} />
                                </div>


                                <div className="flex items-center gap-3">
                                    <span>Administrador:</span>
                                    <Checkbox checked={dados_usuario.administrador} onCheckedChange={(e) => setDadosUsuario({ ...dados_usuario, administrador: e })} />
                                </div>

                                <div className="justify-self-end">
                                    <Button texto="Enviar" icon={<PaperPlaneTilt size={24} />} />
                                </div>

                            </div>
                        </form>
                        <Dialog.Close />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}
