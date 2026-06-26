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
    let [withdrawModal, setWithdrawModal] = useState<boolean>(false)
    let [withdrawAmount, setWithdrawAmount] = useState<string>("")
    let navigate = useRouter()

    const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let clean = value.replace(/[^0-9.]/g, '');
        
        const parts = clean.split('.');
        if (parts.length > 2) {
            clean = parts[0] + '.' + parts.slice(1).join('');
        }

        if (clean) {
            const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const decimalPart = parts[1] !== undefined ? '.' + parts[1] : '';
            setWithdrawAmount(integerPart + decimalPart);
        } else {
            setWithdrawAmount("");
        }
    }

    const handleRequestWithdrawal = async () => {
        const amount = Number(withdrawAmount.replace(/,/g, ''))
        if (isNaN(amount) || amount <= 0) {
            Swal.fire("กรุณากรอกจำนวนเงินให้ถูกต้อง", "", "error")
            return
        }

        if (userData && (userData.cash || 0) < amount) {
            Swal.fire("ยอดเงินคงเหลือไม่เพียงพอสำหรับการเบิก!", "", "error")
            return
        }

        let res: any = await new EmployeeMethod().withdraw(amount)
        if (res.status) {
            Swal.fire("ส่งคำร้องขอเบิกเงินสำเร็จ!", `จำนวนเงิน ${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿`, "success")
            setWithdrawModal(false)
            initial() // refresh cash data
        } else {
            Swal.fire(res.message || "เกิดข้อผิดพลาด", "", "error")
        }
    }


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

                <div className="flex flex-col gap-3 bg-white p-5 rounded-lg border-1 border-gray-300">

                    <div className="flex justify-between items-center border-gray-100">
                        <p className="font-[medium]  text-[15px]">รายได้ปัจจุบัน</p>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setWithdrawAmount("")
                                    setWithdrawModal(true)
                                }}
                                className="px-3 py-1.5 border border-amber-500 rounded-lg bg-amber-500/10 text-amber-600 flex justify-center items-center gap-2 cursor-pointer font-[medium] hover:bg-amber-500/20 active:scale-95 transition duration-150 text-[13px]"
                            >
                                เบิกเงิน
                            </button>
                            {userData ? <p className="text-green-700 font-[medium] text-[18px]">{Number(userData.cash).toFixed(2)} ฿</p> : null}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="font-[medium]  text-[15px]">รายได้ทั้งหมด</p>
                        <p className="text-green-700 font-[medium] text-[18px]">{Number(summary).toLocaleString('TH-th',{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        })} ฿</p>

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

                    <div className="flex w-full justify-start">
                        <button onClick={async () => {

                            navigate.push("/dashboard")

                            // if(res)
                        }} className="w-30 h-12 border-1 border-purple-600 rounded-lg bg-purple-400/10 text-purple-600 flex justify-center items-center gap-2">
                            <BiSolidDashboard className="text-purple-600" size={30} />
                            <p className="font-[medium]">Stock</p>
                        </button>
                    </div>

                </div>

                    : null}

            </div>


            {withdrawModal ? (
                <div onClick={(e) => {
                    if (e.target === e.currentTarget) setWithdrawModal(false)
                }} className="w-full h-screen fixed top-0 left-0 bg-black/30 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-[350px] rounded-xl p-6 flex flex-col gap-4 border border-gray-300 shadow-lg">
                        <h3 className="font-[bold] text-[20px] text-gray-800">เบิกเงินสดล่วงหน้า</h3>
                        <p className="font-[regular] text-[15px] text-gray-500 -mt-2">
                            รายได้ปัจจุบันคงเหลือ: <span className="font-[medium] text-green-700">{userData ? Number(userData.cash).toFixed(2) : 0} ฿</span>
                        </p>
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="font-[medium] text-[15px] text-gray-700">จำนวนเงินที่ต้องการเบิก (บาท)</label>
                            <input
                                type="text"
                                placeholder="0.00"
                                value={withdrawAmount}
                                onChange={handleWithdrawAmountChange}
                                className="w-full px-3 py-2 text-[18px] font-[medium] outline-none border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => setWithdrawModal(false)}
                                className="flex-1 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded-lg font-[medium] cursor-pointer hover:bg-gray-200 transition"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleRequestWithdrawal}
                                className="flex-1 py-2 bg-amber-500 border border-amber-600 text-white rounded-lg font-[medium] cursor-pointer hover:bg-amber-600 transition"
                            >
                                ร้องขอ
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <Bottom />
        </div>
    )
}

export default User