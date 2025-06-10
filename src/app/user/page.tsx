'use client'

import { useEffect, useState } from "react"
import { EmployeeMethod } from "../../../methods/methods"
import Header from "../../../components/Header"
import Bottom from "../../../components/Bottom"
import { useRouter } from "next/navigation"

const User = () => {

    let [userData, setUserData] = useState<any>(null)
    let [summary, setSummary] = useState<any>(0)
    let navigate = useRouter()


    const initial = async () => {
        let res: any = await new EmployeeMethod().detail()

        console.log(res)

        setSummary(Number(res?.summary_total))

        setUserData(res?.userData)


    }

    useEffect(() => {
        initial()
    }, [])

    return (
        <div>
            <Header />

            <div className="h-[calc(100vh-170px)] p-10 font-[light] text-[18px] flex flex-col gap-4">
                {userData ? <div className="flex flex-col gap-2 bg-white p-5 rounded-lg border-1 border-gray-300">
                    <div className="flex justify-between">
                        <p className="font-[medium]">ID</p>
                        <p>{userData.id}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-[medium]">ชื่อ</p>
                        <p>{userData.name}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-[medium]">เบอร์โทรศัพท์</p>
                        <p>{userData.phoneNumber}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-[medium]">พนักงานร้าน</p>
                        <p>{userData.store.store_name}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-[medium]">ตำแหน่ง</p>
                        <p>{userData.department}</p>
                    </div>
                </div> : null}

                <div className="flex flex-col gap-2 bg-white p-5 rounded-lg border-1 border-gray-300">

                    <div className="flex justify-between">
                        <p className="font-[medium]">รายได้ปัจจุบัน</p>
                        {userData ? <p className="text-green-700">{userData.cash} ฿</p> : null}

                    </div>

                    <div className="flex justify-between">
                        <p className="font-[medium] ">รายได้ทั้งหมด</p>
                        <p className="text-green-700">{summary} ฿</p>

                    </div>
                </div>

                <div className="flex w-full justify-center">
                    <button onClick={() => {
                        navigate.push('/admin')
                    }} className="w-30 h-12 border-1 border-sky-600 rounded-lg bg-sky-400/10 text-sky-600">
                        <p className="font-[medium]">Admin</p>
                    </button>
                </div>
            </div>


            <Bottom />
        </div>
    )
}

export default User