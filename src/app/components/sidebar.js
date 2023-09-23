'use client'

import * as Avatar from '@radix-ui/react-avatar';
import ButtonSide from './buttonside.js'
import { UserCircleGear, CarSimple, UsersFour, CalendarBlank, SignOut } from '@phosphor-icons/react'
import Link from 'next/link.js';
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"


export default function Sidebar(props) {
    const { data: session, status } = useSession()


    return (
        <div className="bg-gradient-to-br from-emerald-300 to-emerald-950">
            <div className="h-full w-fit bg-black flex justify-center mr-[2px]">
                <div className="flex flex-col">
                    <div className="px-5 py-5 flex flex-col items-center justify-center text-white gap-5 border-b-[1px] border-zinc-700 text-center">

                        <text className='text-xl font-bold tracking-wider'>Bem-Vindo</text>

                        <Avatar.Root className='m-[1px] w-24 border-2 border-emerald-700 rounded-full inline-flex bg-black'>
                            <Avatar.Image className='h-full w-full' src="./logosicredi.png">
                            </Avatar.Image>
                        </Avatar.Root>

                        <text className='text-lg font-semibold'>{session?.user.nome_completo}</text>
                        {session?.user.administrador ? <text className='font-semibold text-amber-300'>Administrador</text> : <></>}
                        

                    </div>
                    <div className='text-white pt-10 px-3'>
                        <Link href="/principal">
                            <ButtonSide texto="Calendário" icon={<CalendarBlank size={22} />} />
                        </Link>
                        <ButtonSide texto="Dados da Conta" icon={<UserCircleGear size={22} />} />
                        <ButtonSide texto="Adm. Veículos" icon={<CarSimple size={22} />} />
                        <ButtonSide texto="Adm. Usuários" icon={<UsersFour size={22} />} />
                        <ButtonSide texto="Logout" onClick={() => signOut({ callbackUrl: "/" })} icon={<SignOut size={22}/>} />
                    </div>


                </div>

            </div>
        </div>
    )
}