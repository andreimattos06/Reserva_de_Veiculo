'use client'

import Sidebar from '../components/sidebar.js';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import Button from "../components/button.js";
import { Plus, Pencil, Trash, PaperPlaneTilt } from '@phosphor-icons/react'

export default function Veiculos() {
    const [empresa, setEmpresa] = useState("")
    const [lista_veiculos, setListaVeiculos] = useState([])
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
                    <Button icon={<Plus size={24} />} onClick={() => { novoUsuario() }} />
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
                                        <td>{<Button onClick={() => { getUsersInfo(e.id) }} css="my-1" icon={<Pencil size={20} />} />}</td>
                                        <td>{<Button icon={<Trash size={20} />} />}</td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    )
}