import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { BiAddToQueue, BiAlarm, BiHome, BiLogOut, BiNotification, BiUser } from "react-icons/bi"
import { BsCalendarDate } from "react-icons/bs"
import { FiHome } from "react-icons/fi"
import Swal from "sweetalert2"
import { EmployeeMethod } from "../methods/methods"
import { IoSearch } from "react-icons/io5"

const Bottom = () => {

    let navigate = useRouter()

    return (
        <div className="w-full h-[70px] fixed bottom-0 bg-white shadow border-t-1 border-gray-300 grid grid-cols-4">

            <div onClick={() => {
                navigate.push("/")
            }} className=" flex justify-center items-center flex-col gap-1">
                <FiHome size={25} />
                <p className="font-[medium] text-[14px]">หน้าหลัก</p>
            </div>

            <div onClick={() => {
                navigate.push("/history")
            }} className=" flex justify-center items-center flex-col gap-1">
                <BsCalendarDate size={25} />
                <p className="font-[medium] text-[14px]">ประวัติ</p>
            </div>

            <div onClick={() => {
                navigate.push("/user")
            }} className=" flex justify-center items-center flex-col gap-1">
                <BiUser size={25} />
                <p className="font-[medium] text-[14px]">ข้อมูล</p>
            </div>

            <div onClick={() => {
                navigate.push("/stock")
                // Swal.fire({
                //     title: "แจ้งปัญหา",
                //     text: 'LINE ID: pzonenet',
                //     icon: 'info'
                // })
            }} className=" flex justify-center items-center flex-col gap-1">
                <IoSearch  size={25} />
                <p className="font-[medium] text-[14px]">สต๊อกสินค้า</p>
            </div>

            {/* <div onClick={() => {
                Swal.fire({
                    title: "คุณต้องการออกจากระบบ?",
                    icon: "question",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "ใช่",
                    cancelButtonText: "ไม่"
                }).then(async (res) => {
                    if (res.isConfirmed) {
                        localStorage.removeItem("id")
                        localStorage.removeItem("name")

                        Swal.fire({
                            title: "กำลังออกจากระบบ..",
                            icon: 'success',
                            showConfirmButton: false,
                            timerProgressBar: true
                        })

                        setTimeout(() => {
                            window.location.href = "/login"
                        }, 1500)
                    }
                })
            }} className=" flex justify-center items-center flex-col gap-2">
                <BiLogOut size={25} />
                <p className="font-[medium] text-[14px]">ออกจากระบบ</p>
            </div> */}
        </div>
    )
}

export default Bottom