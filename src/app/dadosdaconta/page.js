'use client'

import { useEffect, useState } from "react"
import Sidebar from "../components/sidebar"
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import Button from "../components/button"
import { ArrowsClockwise, PencilSimple, PaperPlaneTilt, LockSimple } from '@phosphor-icons/react'
import { signOut } from "next-auth/react"
import Loading from '../components/loading.js'
import EmailInput from "../components/emailinput"
import RequiredInput from "../components/requiredinput"
import CpfInput from "../components/cpfinput"
import { validateAllInputs } from "../util/validateallinputs"
import PasswordInput from "../components/passwordinput"

export default function DadosDaContal() {

    const { data: session, status } = useSession()
    if (status === "unauthenticated") {
        redirect("/", "replace")
    }

    const [iguais, setIguais] = useState(true)
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [valid, setValid] = useState(true)
    const [valid_pass, setValidPass] = useState(false)
    const [senhas, setSenhas] = useState({
        senhaantiga: "",
        senhanova: "",
        confirmacao: "",
    })
    const [dados, setDados] = useState({
        email: "",
        nome_completo: "",
        cpf: "",
        cargo: "",
        setor: "",
        id: "",
    })
    const [inputs_validation, setInputsValidation] = useState({
        email: true,
        nome_completo: true,
        cpf: true,
        cargo: true,
        setor: true,
        id: true,
    })

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/getdados"}`, {
                method: 'POST',
                body: JSON.stringify({ email: session?.user.email }),
                headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
            })
            const result = await res.json();
            setDados(result)
            setLoading(false)
        }
        fetchData()

    }, [])

    useEffect(() => {
        if (senhas.senhanova != senhas.confirmacao) {
            setIguais(false)
        }
        else {
            setIguais(true)
        }

    }, [senhas.senhanova, senhas.confirmacao])

    useEffect(() => {
        if (senhas.senhaantiga != "" && iguais && senhas.senhanova != "" && senhas.senhaantiga != ""){
            setValidPass(true)
        }
        else{
            setValidPass(false)
        }
    }, [iguais, senhas.senhaantiga])

    useEffect(() => {
        setValid(validateAllInputs(inputs_validation))
    },[inputs_validation])
    
    async function atualizacaoDados() {
        if (validateAllInputs(inputs_validation)) {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/updatedados"}`, {
                method: 'POST',
                body: JSON.stringify({
                    email: dados.email,
                    nome_completo: dados.nome_completo,
                    cpf: dados.cpf,
                    cargo: dados.cargo,
                    setor: dados.setor,
                    id: dados.id
                }),
                headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
            })
            const result = await res.json();
            setLoading(false)
            if (result === "sucesso") {
                alert("Dados atualizados com sucesso.")
                signOut({ callbackUrl: "/" })
            }
            else {
                alert("Houve um erro: " + result)
            }
        }
    }

    async function atualizacaoSenha() {

        if (valid_pass) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/updatesenha"}`, {
                method: 'POST',
                body: JSON.stringify({
                    senhaantiga: senhas.senhaantiga,
                    senhanova: senhas.senhanova,
                    id: dados.id
                }),
                headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
            })
            const result = await res.json();

            if (result === "sucesso") {
                alert("Senha atualizada com sucesso.")
                signOut({ callbackUrl: "/" })
            }
            else {
                alert("Houve um erro: " + result)
                location.reload()
            }
        }


    }

    function validateInputChange(nome_input, isValid) {
        setInputsValidation({ ...inputs_validation, [nome_input]: isValid })
    }



    return (
        <div className="flex flex-row h-screen">
            <Sidebar />
            <div className="flex flex-row my-16 px-40 w-4/5 gap-28 justify-between">
                <div className="w-2/5 text-white">
                    <span className="text-3xl font-bold">Dados Cadastrais</span>

                    <div className="grid grid-cols-1 font-semibold pt-10 gap-5 ">
                        <div className="flex flex-col">
                            <span>Nome Completo:</span>
                            <RequiredInput onValidateChange={(isValid) => validateInputChange("nome_completo", isValid)} disabled={!edit} css={edit ? "" : " text-gray-500"} value={dados?.nome_completo} onChange={(e) => { setDados({ ...dados, nome_completo: e.target.value }) }} />
                        </div>

                        <div className="flex flex-col">
                            <span>E-mail:</span>
                            <EmailInput onValidateChange={(isValid) => validateInputChange("email", isValid)} disabled={!edit} css={edit ? "" : " text-gray-500"} value={dados?.email} onChange={(e) => { setDados({ ...dados, email: e.target.value }) }} />
                        </div>

                        <div className="flex flex-col">
                            <span>CPF:</span>
                            <CpfInput onValidateChange={(isValid) => validateInputChange("cpf", isValid)} disabled={!edit} css={edit ? "" : " text-gray-500"} value={dados.cpf} onChange={(e) => { setDados({ ...dados, cpf: e.target.value }) }} />
                        </div>

                        <div className="flex flex-col">
                            <span>Cargo:</span>
                            <RequiredInput onValidateChange={(isValid) => validateInputChange("cargo", isValid)} disabled={!edit} css={edit ? "" : " text-gray-500"} value={dados.cargo} onChange={(e) => { setDados({ ...dados, cargo: e.target.value }) }} />
                        </div>

                        <div className="flex flex-col">
                            <span>Setor:</span>
                            <RequiredInput onValidateChange={(isValid) => validateInputChange("setor", isValid)} disabled={!edit} css={edit ? "" : " text-gray-500"} value={dados.setor} onChange={(e) => { setDados({ ...dados, setor: e.target.value }) }} />
                        </div>

                        <div className="justify-self-end">
                            {edit ?
                                <Button onClick={atualizacaoDados} texto="Enviar" icon={valid ? <PaperPlaneTilt size={24} /> : <LockSimple size={24} />} />
                                :
                                <Button onClick={() => setEdit(true)} texto="Editar" icon={<PencilSimple size={24} />} />
                            }

                        </div>

                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col border-[1px] border-emerald-600 px-5 py-5 rounded-md text-white">
                        <span className="text-3xl font-bold">Alterar Senha</span>

                        <div className="flex flex-col font-semibold pt-5 gap-5">
                            <div className="flex flex-col">
                                <span>Senha Atual:</span>
                                <PasswordInput value={senhas.senhaantiga} onChange={(e) => setSenhas({ ...senhas, senhaantiga: e.target.value })} />
                            </div>

                            <div className="flex flex-col">
                                <span>Nova Senha:</span>
                                <PasswordInput value={senhas.senhanova} onChange={(e) => setSenhas({ ...senhas, senhanova: e.target.value })} />
                            </div>

                            <div className="flex flex-col">
                                <span>Confirmar Nova Senha:</span>
                                <PasswordInput value={senhas.confirmacao} onChange={(e) => setSenhas({ ...senhas, confirmacao: e.target.value })} />
                            </div>

                            <div>
                                {!iguais ?
                                    <span className="text-sm text-red-600">As senhas não coincidem!</span>
                                    :
                                    <></>
                                }
                            </div>

                            <div className="self-end">
                                <Button onClick={atualizacaoSenha} texto="Alterar Senha"  icon={valid_pass ? <ArrowsClockwise size={24} /> : <LockSimple size={24} />} />
                            </div>

                        </div>
                    </div>


                </div>
            </div>
            {loading ?
                <Loading />
                :
                <></>
            }
        </div>
    )
}