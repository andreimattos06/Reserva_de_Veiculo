import Sidebar from '../components/sidebar.js';
import ItemCalendar from '../components/itemcalendar.js';


export default function Principal() {
    return (
        <>
            <div className="flex flex-row">
                <Sidebar />
                <div className='flex flex-col my-16 mx-16 w-4/5 gap-10'>
                    <div className='text-5xl text-white font-bold'>
                        Calendário
                    </div>
                    <div className='self-end border-2'>

                    </div>
                    <div className='w-full grid grid-cols-7 gap-3'>
                        <ItemCalendar dia={1} diasemana="Seg"/>
                        <ItemCalendar dia={2} diasemana="Ter"/>
                        <ItemCalendar dia={3} diasemana="Qua"/>
                        <ItemCalendar dia={4} diasemana="Qui"/>
                        <ItemCalendar dia={5} diasemana="Sex"/>
                        <ItemCalendar dia={6} diasemana="Sab"/>
                        <ItemCalendar dia={7} diasemana="Dom"/>

                        <ItemCalendar dia={8} diasemana="Seg"/>
                        <ItemCalendar dia={9} diasemana="Ter"/>
                        <ItemCalendar dia={10} diasemana="Qua"/>
                        <ItemCalendar dia={11} diasemana="Qui"/>
                        <ItemCalendar dia={12} diasemana="Sex"/>
                        <ItemCalendar dia={13} diasemana="Sab"/>
                        <ItemCalendar dia={14} diasemana="Dom"/>

                        <ItemCalendar dia={15} diasemana="Seg"/>
                        <ItemCalendar dia={16} diasemana="Ter"/>
                        <ItemCalendar dia={17} diasemana="Qua"/>
                        <ItemCalendar dia={18} diasemana="Qui"/>
                        <ItemCalendar dia={19} diasemana="Sex"/>
                        <ItemCalendar dia={20} diasemana="Sab"/>
                        <ItemCalendar dia={21} diasemana="Dom"/>

                        <ItemCalendar dia={1} diasemana="Seg"/>
                        <ItemCalendar dia={2} diasemana="Ter"/>
                        <ItemCalendar dia={3} diasemana="Qua"/>
                        <ItemCalendar dia={4} diasemana="Qui"/>
                        <ItemCalendar dia={5} diasemana="Sex"/>
                        <ItemCalendar dia={6} diasemana="Sab"/>
                        <ItemCalendar dia={7} diasemana="Dom"/>

                        <ItemCalendar dia={1} diasemana="Seg"/>
                        <ItemCalendar dia={2} diasemana="Ter"/>
                        <ItemCalendar dia={3} diasemana="Qua"/>
                        <ItemCalendar dia={4} diasemana="Qui"/>
                        <ItemCalendar dia={5} diasemana="Sex"/>
                        <ItemCalendar dia={6} diasemana="Sab"/>
                        <ItemCalendar dia={7} diasemana="Dom"/>
                    </div>
                    

                </div>
            </div>
        </>
    )
}