export default function ItemCalendar(props) {
    return (
        <div className="w-full flex flex-col border-2 border-emerald-700 rounded-lg text-white h-full px-3 py-1 gap-11 hover:bg-emerald-800 duration-500">
            <div className="w-full flex items-center justify-between ">
                <text>
                    {props.dia}º
                </text>
                <text>
                    {props.diasemana}
                </text>
            </div>
            <div className="mt-5 place-self-end">
                Setembro
            </div>

        </div>
    )
}