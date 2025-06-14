'use client'

import { useEffect, useState } from "react"
import { AdminMethod, EmployeeMethod, StockMethod } from "../../../methods/methods"
import Header from "../../../components/Header"
import Bottom from "../../../components/Bottom"
import { useRouter } from "next/navigation"
import { BiFile, BiSolidDashboard, BiTrash } from "react-icons/bi"
import dayjs from "dayjs"
import toast from "react-hot-toast"
import Swal from "sweetalert2"

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

                {userData && userData.role == 1 ? <div className="grid grid-cols-2 gap-3">
                    <div className="flex w-full justify-start">
                        <button onClick={() => {
                            navigate.push('/admin')
                        }} className="w-30 h-12 border-1 border-sky-600 rounded-lg bg-sky-400/10 text-sky-600 flex justify-center items-center gap-2">
                            <BiSolidDashboard className="text-sky-600" size={30} />
                            <p className="font-[medium]">Admin</p>
                        </button>
                    </div>

                    <div className="flex w-full justify-start">
                        <button onClick={async () => {
                            let res: any = await new StockMethod().DownloadStockUpdate()

                            const blob = res; // <-- ไม่ต้อง .blob()
                            const url = window.URL.createObjectURL(blob);



                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `stock-file-${dayjs().format("DD-MM-YYYY")}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        }} className="w-30 h-12 border-1 border-green-600 rounded-lg bg-green-400/10 text-green-600 flex justify-center items-center gap-2">
                            <BiFile className="text-green-600" size={30} />
                            <p className="font-[medium]">Export</p>
                        </button>
                    </div>

                    <div className="flex w-full justify-start">
                        <button onClick={async () => {
                            Swal.fire({
                                title: "ลบข้อมูลใน stock?",
                                icon: 'warning',
                                showCancelButton: true
                            }).then(async (res) => {
                                if (res.isConfirmed) {
                                    let res: any = await new StockMethod().DeleteStock()

                                    if (res.status == 200) {
                                        toast.success(res.message)
                                    }
                                    console.log(res)
                                }
                            })

                            // if(res)
                        }} className="w-30 h-12 border-1 border-red-600 rounded-lg bg-red-400/10 text-red-600 flex justify-center items-center gap-2">
                            <BiTrash className="text-red-600" size={30} />
                            <p className="font-[medium]">Delete</p>
                        </button>
                    </div>
                </div> : null}

            </div>


            <Bottom />
        </div>
    )
}

export default User