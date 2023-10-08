import { CircleNotch } from '@phosphor-icons/react'

export default function Loading(props){
    return(
       <div className='z-50 w-screen h-screen top-0 left-0 absolute bg-black/50 flex items-center justify-center text-emerald-600'>
            <CircleNotch className='animate-spin' size={120} />
       </div>
    )
}
