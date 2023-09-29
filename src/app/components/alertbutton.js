export default function AlertButton(props){
    return(
        <button className="text-red-600 font-semibold border-2 border-red-600 p-1 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-black duration-700" {...props}>{props.icon}{props.texto}</button>
    )
}
