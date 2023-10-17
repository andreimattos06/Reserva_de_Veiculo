'use client'

import { LockSimple, SignIn } from '@phosphor-icons/react'
import Button from './components/button.js';
import { signIn } from "next-auth/react"
import { use, useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import Loading from './components/loading.js'
import EmailInput from './components/emailinput.js'
import PasswordInput from './components/passwordinput.js'
import { validateAllInputs } from './util/validateallinputs.js'


export default function Home() {

  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [valid, setValid] = useState(true)
  const [errada, setErrada] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputs_validation, setInputsValidation] = useState({
    email: true,
    password: true,

  })

  useEffect(() => {
    setValid(validateAllInputs(inputs_validation))
  }, [inputs_validation])

  useEffect(() => {
    setInputsValidation({email: true, password: true})
  },[])

  function validateInputChange(nome_input, isValid) {
    setInputsValidation({ ...inputs_validation, [nome_input]: isValid })
  }

  async function login() {
    if (valid) {
      setLoading(true)
      signIn("credentials", {redirect:false, email, senha, }).then(({ok}) => {
        if(ok){
          setErrada(true)
          setLoading(false)
        }
        else{
          setLoading(false)
        }
      })
    }

  }

  if (status === "authenticated") {
    redirect("/principal", "replace")
  }
 
  return (
    <>
      <div className='flex justify-center items-center h-screen w-screen text-white font-semibold tracking-wide'>
        <div className='bg-gradient-to-br from-emerald-500 to-emerald-800 rounded-md p-0.5'>
          <div className='bg-black rounded-md grid grid-row-2 px-16 py-10 gap-2'>
            <div className='text-2xl mb-10 border-b-[1px] border-emerald-500'>
              <span>Dados do Login</span>
            </div>
            <h1>E mail:</h1>
            <EmailInput onValidateChange={(isValid) => validateInputChange("email", isValid)} value={email} onChange={(target) => setEmail(target.target.value)} />

            <h1 className='pt-5'>Senha:</h1>
            <PasswordInput onValidateChange={(isValid) => validateInputChange("password", isValid)} value={senha} onChange={(target) => setSenha(target.target.value)} />

            <a className='text-sm font-normal'>Esqueceu a senha?</a>

            {errada ? <span className='text-white text-sm bg-red-800 px-1 rounded-md animate-bounce w-4/5 mt-1'>O e-mail e/ou a senha informada estão incorretos!</span> : <></>}

            <Button type="button" texto="Logar" icon={valid ? <SignIn size={24} /> : <LockSimple size={24} />} css="mt-5" onClick={login} /> 

          </div>
        </div>
      </div>

      {loading ?
        <Loading />
        :
        <></>}
    </>
  )
}

