import { CircleNotch } from '@phosphor-icons/react'

export default function Loading(props){
    return(
       <div className='z-50 w-full h-full inset-0 fixed bg-black/50 flex items-center justify-center text-emerald-600'>
            <CircleNotch className='animate-spin' size={120} />
       </div>
    )
}
