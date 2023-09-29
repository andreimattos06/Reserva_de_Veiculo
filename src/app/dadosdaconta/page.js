'use client'

import { useState } from "react"
import Sidebar from "../components/sidebar"
import InputAlt from "../components/inputalt"

export default function DadosDaContal() {
    const [dados, setDados] = useState({
        email: "",
        nome_completo: "",
        cpf: "",
        cargo: "",
        setor: "",
    })

    return (
        <div className="flex flex-row">
            <Sidebar />
            <div className="flex flex-row my-16 mx-16 w-full gap-28">
                <div className="w-2/5 text-white">
                    <span className="text-3xl font-bold">Dados Cadastrais</span>

                    <div className="grid grid-cols-1 font-semibold pt-10 gap-5 ">
                        <div className="flex flex-col">
                            <span>Nome Completo:</span>
                            <InputAlt />
                        </div>

                        <div className="flex flex-col">
                            <span>CPF:</span>
                            <InputAlt />
                        </div>

                        <div className="flex flex-col">
                            <span>Cargo:</span>
                            <InputAlt />
                        </div>

                        <div className="flex flex-col">
                            <span>Setor:</span>
                            <InputAlt />
                        </div>

                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col border-[1px] border-emerald-600 px-5 py-5 rounded-md text-white">
                        <span className="text-3xl font-bold">Alterar Senha</span>

                        <div className="flex flex-col font-semibold pt-5 gap-5">
                            <div className="flex flex-col">
                                <span>Senha Atual:</span>
                                <InputAlt />
                            </div>

                            <div className="flex flex-col">
                                <span>Nova Senha:</span>
                                <InputAlt />
                            </div>

                            <div className="flex flex-col">
                                <span>Confirmar Nova Senha:</span>
                                <InputAlt />
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}