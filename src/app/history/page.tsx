'use client'

import { useEffect, useState } from "react"
import Bottom from "../../../components/Bottom"
import Header from "../../../components/Header"
import { AttendanceMethod } from "../../../methods/methods"
import dayjs from "dayjs"

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
                        <tr className="font-[medium]">
                            <td className="w-30">วันที่</td>
                            <td>เข้างาน</td>
                            <td>ออกงาน</td>
                        </tr>
                    </thead>
                    <tbody>
                        {histories && histories.length > 0 ? histories.map((item:any)=>{
                            return(
                                <tr key={item.id}>
                                    <td>{item.work_timestamp}</td>
                                    <td>{dayjs.unix(item.in_timestamp).format('HH:mm:ss')}</td>
                                    <td>{dayjs.unix(item.out_timestamp).format('HH:mm:ss')}</td>
                                </tr>
                            )
                        }) : <tr><td className="font-[light] h-20" colSpan={3}>ยังไม่มีการเข้างาน</td></tr>}
                    </tbody>
                </table>
            </div>

            <Bottom />
        </div>
    )
}


export default History