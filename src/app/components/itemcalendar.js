import Button from "./button"
import { Plus } from '@phosphor-icons/react'

export default function ItemCalendar(props) {
const dias_semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
let indice_semana = props.index%7

    return (
        <div onClick={props.onClick2} className={"w-full flex flex-col border-2 border-emerald-700 rounded-lg span-white h-full px-3 py-1 gap-11 hover:bg-emerald-800 duration-500 text-white" + (props.dia <= 0 ? " invisible" : "")}>
            <div className="w-full flex items-center justify-between">
                <span className="text-lg font-semibold">
                    {props.dia}
                </span>
                <span className={(indice_semana === 0 ? "text-red-500" : "") + (indice_semana === 6 ? "text-gray-500" : "")}>
                    {dias_semana[indice_semana]}
                </span>
            </div>
            <div className="mt-5 flex items-center justify-between">
                <Button onClick={(e) => {props.onClick(), e.stopPropagation()}} css="bg-emerald-900 p-0 text-black border-none hover:bg-emerald-600" icon={<Plus size={20} />}/>
                {meses[Number(props.mes)-1]}
            </div>

        </div>
    )
}