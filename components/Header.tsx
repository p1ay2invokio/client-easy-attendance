'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

const Header = () => {

    const navigate = useRouter()

    let [name, setName] = useState('')

    useEffect(() => {
        let name_storage: any = localStorage.getItem('name')
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
            <p onClick={(e) => {
                // Swal.fire({
                //     title: "คุณต้องการออกจากระบบ?",
                //     icon: "question",
                //     showConfirmButton: true,
                //     showCancelButton: true,
                //     confirmButtonText: "ใช่",
                //     cancelButtonText: "ไม่"
                // }).then(async (res) => {
                //     if (res.isConfirmed) {
                //         localStorage.removeItem("id")
                //         localStorage.removeItem("name")
                //         window.location.href = "/login"
                //     }
                // })
            }} className="font-[light] text-[18px]">{name}</p>
        </div>
    )
}

export default Header