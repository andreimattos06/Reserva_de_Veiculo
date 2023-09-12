import { CaretRight } from '@phosphor-icons/react'

export default function ButtonSide(props){
    return(
        <button className="flex items-center gap-2 py-2 px-2 w-full text-base font-semibold 
                        hover:bg-emerald-800 hover:text-black rounded-md duration-700 mb-3"><CaretRight className='mr-3' size={22} />{props.icon}{props.texto}</button>
    )
}