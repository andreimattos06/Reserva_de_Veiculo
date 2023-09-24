'use client'

import { useSession } from "next-auth/react"
import Sidebar from '../components/sidebar.js';
import { redirect } from 'next/navigation'
import Button from "../components/button.js";
import { Plus } from '@phosphor-icons/react'
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from "react";



export default function Usuarios() {

    const [empresa, setEmpresa] = useState("")
    const [lista_users, setListaUser] = useState([])
   

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

    console.log(lista_users)

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
                    <Button icon={<Plus size={24} />} />
                </div>
                <div>
                    <ul>
                        <li>
                            a
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
