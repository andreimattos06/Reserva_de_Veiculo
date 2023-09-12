'use client'

import * as Avatar from '@radix-ui/react-avatar';
import ButtonSide from './buttonside.js'
import { House, UserCircleGear, CarSimple, UsersFour } from '@phosphor-icons/react'
import Link from 'next/link.js';

export default function Sidebar(props) {
    return (
        <div className="bg-gradient-to-br from-emerald-300 to-emerald-950">
            <div className="h-screen w-fit bg-black flex justify-center mr-[2px]">
                <div className="flex flex-col">
                    <div className="px-5 py-5 flex flex-col items-center justify-center text-white gap-5 border-b-[1px] border-zinc-700">

                        <text className='text-xl font-bold tracking-wider'>Bem-Vindo</text>

                        <Avatar.Root className='m-[1px] w-24 border-2 border-emerald-700 rounded-full inline-flex bg-black'>
                            <Avatar.Image className='h-full w-full' src="./logosicredi.png">
                            </Avatar.Image>
                        </Avatar.Root>

                        <text className='text-lg font-semibold'>Andrei dos Santos Mattos</text>
                        <text className='font-semibold text-amber-300'>Administrador</text>

                    </div>
                    <div className='text-white pt-10 px-3'>
                        <Link href="/">
                            <ButtonSide texto="Página Principal" icon={<House size={22} />} />
                        </Link>
                        <ButtonSide texto="Dados da Conta" icon={<UserCircleGear size={22} />} />
                        <ButtonSide texto="Adm. Veículos" icon={<CarSimple size={22} />} />
                        <ButtonSide texto="Adm. Usuários" icon={<UsersFour size={22} />} />
                    </div>


                </div>

            </div>
        </div>
    )
}