'use client'

import { useEffect, useState } from "react"
import { EmployeeMethod } from "../../../methods/methods"
import Header from "../../../components/Header"
import Bottom from "../../../components/Bottom"

const User = () => {

    let [userData, setUserData] = useState<any>(null)

    const initial = async () => {
        let res = await new EmployeeMethod().detail()

        console.log(res)

        setUserData(res)


    }

    useEffect(() => {
        initial()
    }, [])

    return (
        <div>
            <Header />

            <div className="h-[calc(100vh-170px)] p-10 font-[light] text-[20px]">
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
                </div> : null}
            </div>


            <Bottom />
        </div>
    )
}

export default User