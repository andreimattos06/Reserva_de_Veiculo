'use client'

import { useSession } from "next-auth/react"
import Sidebar from '../components/sidebar.js';
import { redirect } from 'next/navigation'
import Button from "../components/button.js";
import { Plus, Pencil, Trash, PaperPlaneTilt, X, Check, LockSimple } from '@phosphor-icons/react'
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import Checkbox from '../components/checkbox.js'
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import AlertButton from '../components/alertbutton.js'
import CancelButton from '../components/cancelbutton.js'
import Loading from '../components/loading.js'
import RequiredInput from "../components/requiredinput.js";
import CpfInput from "../components/cpfinput.js";
import PasswordInput from "../components/passwordinput.js";
import EmailInput from "../components/emailinput.js";
import { validateAllInputs } from "../util/validateallinputs.js";


export default function Usuarios() {


    const [empresa, setEmpresa] = useState("")
    const [lista_users, setListaUser] = useState([])
    const [dialog, setDialog] = useState(false)
    const [valid, setValid] = useState(false)
    const [delete_dialog, setDeleteDialog] = useState(false)
    const [delete_id, setDeleteID] = useState("")
    const [adicionarUser, setAdicionarUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dados_usuario, setDadosUsuario] = useState({
        email: "",
        nome_completo: "",
        cpf: "",
        cargo: "",
        setor: "",
        senha: "",
        administrador: false
    })
    const [inputs_validation, setInputsValidation] = useState({
        email: false,
        nome_completo: false,
        cpf: false,
        cargo: false,
        setor: false,
        password: false,
    })



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
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/getusers"}`, {
                method: 'POST',
                body: JSON.stringify({ empresaid: empresa }),
                headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
            })
            const result = await res.json();
            setListaUser(result)
            setLoading(false)

        }
        getData()

    }, [empresa])

    useEffect(() => {
        if (dialog) {
            if (adicionarUser) {
                setInputsValidation({
                    email: false,
                    nome_completo: false,
                    cpf: false,
                    cargo: false,
                    setor: false,
                    password: false,
                })
            }
            else {
                setInputsValidation({
                    email: true,
                    nome_completo: true,
                    cpf: true,
                    cargo: true,
                    setor: true,
                    password: true,
                })
            }
        }
        else {
            setInputsValidation({})
        }


    }, [dialog])

    function limparDadosUsuario() {
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

    async function submitNovo() {
        if (valid) {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/adduser"}`, {
                method: 'POST',
                body: JSON.stringify({
                    empresaid: empresa,
                    nome_completo: dados_usuario.nome_completo,
                    email: dados_usuario.email,
                    cpf: dados_usuario.cpf,
                    setor: dados_usuario.setor,
                    cargo: dados_usuario.cargo,
                    administrador: dados_usuario.administrador,
                    senha: dados_usuario.senha
                }),
                headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
            })
            const result = await res.json();
            setLoading(false)

            if (result == "sucesso") {
                alert("Cadastro adicionado com sucesso!")
                location.reload()
            }
            else {
                alert("Foram encontrados os seguintes erros: " + result)
                location.reload()
            }
        }

    }

    async function submitAlteracao() {
        if (valid) {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/updatedadosusers"}`, {
                method: 'POST',
                body: JSON.stringify({
                    id: dados_usuario.id,
                    nome_completo: dados_usuario.nome_completo,
                    email: dados_usuario.email,
                    cpf: dados_usuario.cpf,
                    setor: dados_usuario.setor,
                    cargo: dados_usuario.cargo,
                    administrador: dados_usuario.administrador
                }),
                headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
            })
            const result = await res.json();
            setLoading(false)

            if (result == "sucesso") {
                alert("Cadastro atualizado com sucesso!")
                location.reload()
            }
            else {
                alert("Houve algum erro!")
                location.reload()
            }
        }

    }

    async function submitDelete(id) {
        setLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/deleteuser"}`, {
            method: 'POST',
            body: JSON.stringify({
                id: delete_id,
            }),
            headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
        })
        const result = await res.json();
        setLoading(false)

        if (result == "sucesso") {
            alert("Usuario excluído com sucesso!")
            location.reload()
        }
        else {
            alert("Houve algum erro!")
            location.reload()
        }
    }

    function submitEnviar() {
        if (adicionarUser) {
            submitNovo()
        }
        else {
            submitAlteracao()
        }
    }

    async function getUsersInfo(id) {
        setInputsValidation({ ...inputs_validation, password: true })
        const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL + "/getdadosusers"}`, {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: { "Content-Type": "application/json", "authorization": session?.user?.token }
        })

        const result = await res.json();
        setDadosUsuario({ ...result })
        setAdicionarUser(false)

        setDialog(true)

    }

    function validateInputChange(nome_input, isValid) {
        setInputsValidation({ ...inputs_validation, [nome_input]: isValid })
    }

    useEffect(() => {
        setValid(validateAllInputs(inputs_validation))
    }, [inputs_validation])

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
                    <Button icon={<Plus size={24} />} onClick={() => { novoUsuario() }} />
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
                            {lista_users.map
                                ?
                                lista_users.map((e, index) => {
                                    let par = false
                                    if (index % 2 === 0) {
                                        par = true
                                    }
                                    return (
                                        <tr key={e.cpf} className={"cursor-pointer border-t-[1px] " + (par ? " border-emerald-600" : "border-emerald-900")}>
                                            <td className="px-5 py-2">{e.id}</td>
                                            <td>{e.email}</td>
                                            <td>{e.nome_completo}</td>
                                            <td>{e.cpf}</td>
                                            <td>{e.administrador ? "Sim" : "Não"}</td>
                                            <td>{<Button onClick={() => { getUsersInfo(e.id) }} css="my-1" icon={<Pencil size={20} />} />}</td>
                                            <td>{<Button onClick={() => { setDeleteDialog(true), setDeleteID(e.id) }} icon={<Trash size={20} />} />}</td>
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
                                    <RequiredInput onValidateChange={(isValid) => validateInputChange("nome_completo", isValid)} value={dados_usuario?.nome_completo} onChange={(e) => { setDadosUsuario({ ...dados_usuario, nome_completo: e.target.value }) }} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>E-mail:</span>
                                    <EmailInput onValidateChange={(isValid) => validateInputChange("email", isValid)} value={dados_usuario.email} onChange={(e) => setDadosUsuario({ ...dados_usuario, email: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>CPF:</span>
                                    <CpfInput onValidateChange={(isValid) => validateInputChange("cpf", isValid)} value={dados_usuario.cpf} onChange={(e) => setDadosUsuario({ ...dados_usuario, cpf: e.target.value })} />
                                </div>

                                {adicionarUser ?
                                    <div className="grid grid-cols-1">
                                        <span>Senha:</span>
                                        <PasswordInput onValidateChange={(isValid) => validateInputChange("password", isValid)} value={dados_usuario.senha} onChange={(e) => setDadosUsuario({ ...dados_usuario, senha: e.target.value })} />
                                    </div>
                                    :
                                    <></>
                                }


                                <div className="grid grid-cols-1">
                                    <span>Setor:</span>
                                    <RequiredInput onValidateChange={(isValid) => validateInputChange("setor", isValid)} value={dados_usuario.setor} onChange={(e) => setDadosUsuario({ ...dados_usuario, setor: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1">
                                    <span>Cargo:</span>
                                    <RequiredInput onValidateChange={(isValid) => validateInputChange("cargo", isValid)} value={dados_usuario.cargo} onChange={(e) => setDadosUsuario({ ...dados_usuario, cargo: e.target.value })} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <span>Administrador:</span>
                                    <Checkbox checked={dados_usuario.administrador} onCheckedChange={(e) => setDadosUsuario({ ...dados_usuario, administrador: e })} />
                                </div>

                                <div className="justify-self-end">
                                    <Button onClick={submitEnviar} type="button" texto="Enviar" icon={valid ? <PaperPlaneTilt size={24} /> : <LockSimple size={24} />} />
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
                        <AlertDialog.Description className='font-semibold text-gray-300 pt-5'>Essa ação irá excluir o usuario selecionado da base de dados assim como todas as marcações vinculadas a ele.</AlertDialog.Description>
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
