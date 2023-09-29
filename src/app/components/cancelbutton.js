export default function CancelButton(props){
    return(
        <button className="bg-gray-500 text-gray-800 font-semibold border-2 border-gray-700 p-1 rounded-lg flex items-center justify-center hover:bg-gray-700 hover:text-white duration-700" {...props}>{props.icon}{props.texto}</button>
    )
}
