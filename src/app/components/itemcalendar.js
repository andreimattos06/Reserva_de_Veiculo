export default function ItemCalendar(props) {
const dias_semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
let indice_semana = props.index%7

    return (
        <div className={"w-full flex flex-col border-2 border-emerald-700 rounded-lg text-white h-full px-3 py-1 gap-11 hover:bg-emerald-800 duration-500" + (props.dia <= 0 ? " invisible" : "")}>
            <div className="w-full flex items-center justify-between ">
                <text className="text-lg font-semibold">
                    {props.dia}
                </text>
                <text className={(indice_semana === 0 ? "text-red-500" : "") + (indice_semana === 6 ? "text-gray-500" : "")}>
                    {dias_semana[indice_semana]}
                </text>
            </div>
            <div className="mt-5 place-self-end">
                Setembro
            </div>

        </div>
    )
}