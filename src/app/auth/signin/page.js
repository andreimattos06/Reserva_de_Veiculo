'use client'

import Input from '../../components/input.js';
import { Key, User, SignIn } from '@phosphor-icons/react'
import Button from '../../components/button.js';
import Link from 'next/link.js';
import { signIn } from "next-auth/react"
import { useEffect, useState } from 'react';


export default function Home() {

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  return (
    <>
      <div className='flex justify-center items-center h-screen w-screen text-white font-semibold tracking-wide'>
        <div className='bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-md p-0.5'>
          <div className='bg-black rounded-md grid grid-row-2 px-16 py-10 gap-2'>
            <div className='text-2xl mb-10 border-b-[1px] border-emerald-500'>
              <span>Dados do Login</span>
            </div>
            <h1>E mail:</h1>
            <Input icon={<User size={24} />} onChange={(target) => setEmail(target.target.value)}/>

            <h1 className='pt-5'>Senha:</h1>
            <Input icon={<Key size={24} />} onChange={(target) => setSenha(target.target.value)}/>

            <a className='text-sm font-normal'>Esqueceu a senha?</a>

            <Link href={"/principal"}>
              <Button texto="Logar" icon={<SignIn size={24} />} css="mt-5" onClick={() => signIn("credentials", {email, senha, callbackUrl: '/'})}/>
            </Link>

          </div>
        </div>
      </div>
    </>
  )
}

