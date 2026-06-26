'use client'

import { useEffect, useState } from "react"
import Bottom from "../../../components/Bottom"
import Header from "../../../components/Header"
import { AttendanceMethod } from "../../../methods/methods"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
// dayjs.locale('th')

const SalaryCal = (in_timestamp: number, out_timestamp: number, rate: number) => {
    let salary = Math.floor((dayjs.unix(out_timestamp).diff(dayjs.unix(in_timestamp), 'minutes') / 30)) * (rate / 12) / 2

    return salary
}

const History = () => {

    const [histories, setHistories] = useState<any>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 20

    const initial = async () => {
        let res = await new AttendanceMethod().history()

        console.log(res)
        setHistories(res.data)
    }

    useEffect(() => {
        initial()
    }, [])

    const totalPages = Math.ceil(histories.length / itemsPerPage)
    const currentData = histories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div>
            <Header />

            <div className="h-[calc(100vh-230px)] p-4 overflow-scroll">
                <table className="w-full text-center">
                    <thead>
                        <tr className="font-[medium] border-b-1 border-gray-500 text-[16px]">
                            <td className="w-25">วันที่</td>
                            <td>เข้างาน</td>
                            <td>ออกงาน</td>
                            <td>เงินที่ได้รับ</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData && currentData.length > 0 ? currentData.map((item: any, index: number) => {

                            let start_time = item.in_timestamp
                            let end_time = item.out_timestamp

                            console.log(start_time)

                            let diffMs = end_time - start_time

                            let min = diffMs / (1000 * 60)
                            let hrs = diffMs / (1000 * 60 * 60)

                            console.log(hrs)
                            console.log(min)




                            return (
                                <tr className={`font-[regular] text-[16px] ${index % 2 != 0 ? 'bg-slate-200/50' : null}`} key={item.id}>
                                    <td className="pt-2 pb-2">{item.work_timestamp}</td>
                                    <td>{item.in_timestamp ? dayjs.unix(item.in_timestamp).format('HH:mm:ss') : null}</td>
                                    <td>{item.out_timestamp ? dayjs.unix(item.out_timestamp).format('HH:mm:ss') : null}</td>
                                    {item.revenue ? <td className="text-green-700 font-[medium]">{Number(item.revenue).toFixed(2)} ฿</td> : item.in_timestamp ? item.out_timestamp ? <td className="text-green-700 font-[medium]">0฿</td> : <td className="text-[#f39c12] font-[medium]">waiting</td> : <td className="text-red-500 font-[medium]">ยังไม่ได้เข้างาน</td>}
                                </tr>
                            )
                        }) : <tr><td className="font-[light] h-20" colSpan={4}>ยังไม่มีการเข้างาน</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="w-full h-[60px] fixed bottom-[70px] bg-white border-t border-gray-200 flex justify-between items-center px-6 shadow-sm">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || totalPages === 0}
                    className={`px-4 py-1.5 rounded-lg text-[14px] font-[medium] transition-all duration-200 cursor-pointer ${
                        currentPage === 1 || totalPages === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 active:scale-95"
                    }`}
                >
                    ก่อนหน้า
                </button>

                <div className="text-[14px] font-[regular] text-gray-500">
                    หน้า <span className="font-[medium] text-gray-700">{totalPages === 0 ? 0 : currentPage}</span> จาก <span className="font-[medium] text-gray-700">{totalPages}</span> ({histories.length} รายการ)
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-4 py-1.5 rounded-lg text-[14px] font-[medium] transition-all duration-200 cursor-pointer ${
                        currentPage === totalPages || totalPages === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 active:scale-95"
                    }`}
                >
                    ถัดไป
                </button>
            </div>

            <Bottom />
        </div>
    )
}


export default History