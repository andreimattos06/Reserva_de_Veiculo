import Sidebar from '../components/sidebar'


export default function Loading() {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <div className="flex flex-col my-16 mx-16 w-4/5">
                <div className="self-end text-white items-center flex justify-between w-full">


                </div>

                <div className="text-white mt-11 border-[1px]  border-emerald-600 rounded-md">
                    <table className="table-auto border-collapse w-full text-center">
                        <thead className="bg-gray-900 font-black">
                            <tr>
                                <th className="px-5 py-3">Data da Saída</th>
                                <th>Data do Retorno</th>
                                <th>Destino</th>
                                <th>Veículo</th>
                                <th>Observação</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="">
                        </tbody>

                    </table>
                </div>
            </div>


        </div>
    )

}
