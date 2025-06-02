'use client'

import { useState } from "react"
import Header from "../../../components/Header"
import { AuthenMethod } from "../../../methods/methods"
import Swal from "sweetalert2"

const Signin = () => {

    const [phoneNumber, setPhoneNumber] = useState<string>('')

    return (
        <div>
            <Header />
            <div className="h-[calc(100vh-170px)] flex justify-center items-center flex-col">

                {/* 
                <div className="mb-10 text-center">
                    <p className="font-[medium] text-[24px] text-gray-700">ระบบเวลาเข้าออกงาน</p>
                    <p className="font-[light] text-gray-700 text-[18px]">สันป่าตองแฟร์, แม่ขานแฟร์, ดอยหล่อแฟร์</p>

                </div> */}



                <div className="w-[360px] h-[300px] p-8 flex justify-center items-center flex-col rounded-lg gap-2">
                    {/* <p className="font-[medium] text-[24px] mb-3">ลงทะเบียนเข้าใช้งาน</p> */}

                    <div className="text-center mb-4">
                        <p className="font-[medium] text-[24px] text-gray-700">ระบบเวลาเข้าออกงาน</p>
                        <p className="font-[light] text-gray-700/70 text-[16px]">สันป่าตองแฟร์, แม่ขานแฟร์, ดอยหล่อแฟร์</p>
                    </div>
                    <input value={phoneNumber} onChange={async (e) => {
                        setPhoneNumber(e.target.value)
                    }} onKeyDown={async (e) => {
                        if (e.key == 'Enter') {
                            let res: any = await new AuthenMethod().Login(phoneNumber)

                            if (res.status) {
                                localStorage.setItem("id", res.data.id)
                                localStorage.setItem("name", res.data.name)
                                // รอร้าน
                                Swal.fire({
                                    title: "เข้าสู่ระบบสำเร็จ",
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timerProgressBar: true
                                })

                                setTimeout(() => {
                                    window.location.href = "/"
                                }, 1000);
                            } else {
                                Swal.fire(res.message, "", "error")
                                setPhoneNumber('')
                            }
                            console.log(res)
                        }
                    }} placeholder="เบอร์โทร" className="w-[100%] border-1 border-gray-400 h-13 rounded-lg font-[medium] text-center text-[20px]  outline-none bg-gray-100" type="tel" maxLength={10}></input>
                    <button onClick={async () => {
                        let res: any = await new AuthenMethod().Login(phoneNumber)

                        if (res.status) {
                            localStorage.setItem("id", res.data.id)
                            localStorage.setItem("name", res.data.name)
                            // รอร้าน
                            Swal.fire({
                                title: "เข้าสู่ระบบสำเร็จ",
                                icon: 'success',
                                showConfirmButton: false,
                                timerProgressBar: true
                            })

                            setTimeout(() => {
                                window.location.href = "/"
                            }, 1000);
                        } else {
                            Swal.fire(res.message, "", "error")
                            setPhoneNumber('')
                        }
                        console.log(res)
                    }} className="w-50 h-11 bg-green-600/20 border-green-600 mt-5 text-green-600 font-[medium] rounded-lg border-1 text-blue-5">เข้าสู่ระบบ</button>
                </div>
            </div>
        </div>
    )
}

export default Signin