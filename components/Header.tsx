'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { EmployeeMethod } from "../methods/methods"

const Header = () => {

    const navigate = useRouter()

    let [name, setName] = useState('')
    let [user, setUser] = useState<any>(null)

    const initial = async () => {

        let id = localStorage.getItem("id")

        if (id) {
            let employee: any = await new EmployeeMethod().detail()

            console.log(employee)

            setUser(employee)
        }
    }

    useEffect(() => {
        let name_storage: any = localStorage.getItem('name')

        initial()



        setName(name_storage)
    }, [])

    return (
        <div className="w-full h-[80px] flex items-center bg-white justify-between p-[20px] shadow-sm">
            <div>
                <p onClick={() => {
                    navigate.push('/')
                }} className="font-[bold] text-[20px]">EasyAttendance</p>
                <p onClick={() => {
                    navigate.push('/')
                }} className="font-[light] text-gray-500 text-[14px] mt-[-5px]">โปรแกรมตอกบัตร</p>
            </div>
            <div className=" flex flex-col justify-end items-end">
                <p className="font-[medium] text-[18px]">{name}</p>
                <p className="font-[light] text-[14px]">{user && user.userData ? user.userData.department : null}</p>
            </div>
        </div>
    )
}

export default Header