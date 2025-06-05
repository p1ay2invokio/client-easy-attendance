'use client'

import { useEffect, useState } from "react"
import Bottom from "../../../components/Bottom"
import Header from "../../../components/Header"
import { AttendanceMethod } from "../../../methods/methods"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
// dayjs.locale('th')

const SalaryCal=(in_timestamp: number, rate: number)=>{
  let salary = Math.floor((dayjs().diff(dayjs.unix(in_timestamp), 'minutes') / 30)) * (rate / 12) / 2

  return salary
}

const History = () => {

    const [histories, setHistories] = useState<any>([])

    const initial = async () => {
        let res = await new AttendanceMethod().history()

        console.log(res)
        setHistories(res.data)
    }

    useEffect(() => {
        initial()
    }, [])

    return (
        <div>
            <Header />

            <div className="h-[calc(100vh-170px)] p-4 overflow-scroll">
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
                        {histories && histories.length > 0 ? histories.map((item:any, index: number)=>{

                            let start_time = item.in_timestamp
                            let end_time = item.out_timestamp

                            console.log(start_time)

                            let diffMs = end_time - start_time

                            let min = diffMs / (1000 * 60)
                            let hrs = diffMs / (1000 * 60 * 60)

                            console.log(hrs)
                            console.log(min)




                            return(
                                <tr className={`font-[regular] text-[14px] ${index % 2 != 0 ? 'bg-slate-200/50' : null}`} key={item.id}>
                                    <td className="pt-2 pb-2">{item.work_timestamp}</td>
                                    <td>{dayjs.unix(item.in_timestamp).format('HH:mm:ss')}</td>
                                    <td>{dayjs.unix(item.out_timestamp).format('HH:mm:ss')}</td>
                                    <td className="text-green-700 font-[medium]">{SalaryCal(item.in_timestamp, item.employee.rate)}฿</td>
                                </tr>
                            )
                        }) : <tr><td className="font-[light] h-20" colSpan={4}>ยังไม่มีการเข้างาน</td></tr>}
                    </tbody>
                </table>
            </div>

            <Bottom />
        </div>
    )
}


export default History