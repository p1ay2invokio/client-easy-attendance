'use client'
import { useEffect, useState } from "react"
import Bottom from "../../../components/Bottom"
import Header from "../../../components/Header"
import { AdminMethod } from "../../../methods/methods"
import dayjs from "dayjs"
import 'dayjs/locale/th'
import Swal from "sweetalert2"

const Admin = () => {

    const [employees, setEmployees] = useState<any>([])

    let [modal, setModal] = useState<boolean>(false)

    const [dates, setDates] = useState<any>([])

    let [fix, setFix] = useState<boolean>(false)

    let [revenueNew, setRevenueNew] = useState(0)

    let [attend, setAttend] = useState<any>(null)

    let [refresh, setRefresh] = useState<any>(0)

    // Withdrawal states & handlers
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
    const [withdrawRequests, setWithdrawRequests] = useState<any>([])
    const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false)

    const loadWithdrawals = async (eid: number) => {
        let res: any = await new AdminMethod().getWithdrawals(eid)
        setWithdrawRequests(res || [])
        setWithdrawModalOpen(true)
    }

    const handleApproveWithdrawal = async (id: number) => {
        Swal.fire({
            title: "ยืนยันการอนุมัติการเบิกเงิน?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, อนุมัติ",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res: any = await new AdminMethod().approveWithdraw(id)
                if (res.status) {
                    Swal.fire("อนุมัติสำเร็จ!", "", "success")
                    if (selectedEmployee) {
                        let updatedRes: any = await new AdminMethod().getWithdrawals(selectedEmployee.id)
                        setWithdrawRequests(updatedRes || [])
                    }
                    setRefresh((prev: any) => prev + 1) // reload employee cash lists
                } else {
                    Swal.fire(res.message || "เกิดข้อผิดพลาด", "", "error")
                }
            }
        })
    }

    const handleRejectWithdrawal = async (id: number) => {
        Swal.fire({
            title: "ยืนยันการปฏิเสธการเบิกเงิน?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ใช่, ปฏิเสธ",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res: any = await new AdminMethod().rejectWithdraw(id)
                if (res.status) {
                    Swal.fire("ปฏิเสธเรียบร้อยแล้ว", "", "success")
                    if (selectedEmployee) {
                        let updatedRes: any = await new AdminMethod().getWithdrawals(selectedEmployee.id)
                        setWithdrawRequests(updatedRes || [])
                    }
                } else {
                    Swal.fire(res.message || "เกิดข้อผิดพลาด", "", "error")
                }
            }
        })
    }

    const init = async () => {
        let employees_res = await new AdminMethod().getEmployees()

        console.log(employees_res)
        setEmployees(employees_res)
    }

    useEffect(() => {
        init()
    }, [refresh])

    return (
        <div>
            <Header />

            {fix ? <div onClick={(e) => {
                if (e.target == e.currentTarget) {
                    setFix(false)
                }
            }} className="w-full h-[100vh] fixed top-0 left-0 bg-black/30 flex justify-center items-center z-5">
                <div className="bg-gray-50 w-90 h-50 overflow-scroll rounded-lg p-10 flex flex-col gap-2 border-1 border-gray-300 shadow">
                    <input placeholder={attend.revenue} className="w-full bg-gray-50 text-[24px] font-[medium] outline-none border-1 rounded-lg text-center h-11" onChange={(e) => {
                        setRevenueNew(Number(e.target.value))
                    }}></input>
                    <button className="w-full h-10 mt-2 bg-blue-600/20 font-[medium] border-1 border-blue-600 text-blue-600 rounded-lg" onClick={async () => {
                        let res: any = await new AdminMethod().revenueUpdate(attend.id, revenueNew)

                        console.log(res)

                        Swal.fire(res.message)
                        setFix(false)
                        setModal(false)
                        setRevenueNew(0)
                        setAttend([])
                        setRefresh(refresh + 1)
                    }}>อัพเดท</button>
                </div>
            </div> : null}

            {modal ? <div onClick={(e) => {
                if (e.target == e.currentTarget) {
                    setModal(false)
                }
            }} className="w-full h-[100vh] fixed top-0 left-0 bg-black/30 flex justify-center items-center z-3">
                <div className="bg-gray-50 w-90 h-120 overflow-scroll rounded-lg p-10 flex flex-col gap-2 border-1 border-gray-300 shadow">
                    <p className="font-[medium] text-[20px]">พนักงาน : {dates && dates.name ? dates.name : null}</p>
                    {dates.dates && dates.dates.length > 0 ? dates.dates.map((item: any) => {
                        return (
                            <div key={item.id} className={`bg-white p-3 border-1 border-gray-300 rounded-lg`}>
                                {item.revenue <= 0 ? <span className="relative flex size-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                                </span> : null}
                                <div>
                                    <p className="text-[18px] font-[bold] mb-1">{item.work_timestamp}</p>
                                    <p className="text-[16px] font-[light]">ค่าแรง : {item.revenue}฿</p>
                                    <table className="w-full mt-3 mb-3">
                                        <thead className="text-center font-[bold]">
                                            <tr className="h-9">
                                                <td className="bg-green-600/20 text-green-600 rounded-tl-lg">เข้างาน</td>
                                                <td className="bg-red-600/20 text-red-600 rounded-tr-lg">ออกงาน</td>

                                            </tr>
                                        </thead>
                                        <tbody className="text-center">
                                            <tr className="bg-gray-100 h-9">
                                                <td className="text-[16px] rounded-bl-lg font-[regular]">{item.in_timestamp ? dayjs(item.in_timestamp * 1000).locale('th').format('HH:mm:ss') : null}</td>
                                                <td className="text-[16px] rounded-br-lg font-[regular]">{item.out_timestamp ? dayjs(item.out_timestamp * 1000).locale('th').format('HH:mm:ss') : null}</td>
                                            </tr>
                                        </tbody>
                                        {/* <div className="flex gap-1">
                                            <p className="font-[medium]">เข้างาน :</p>
                                            <p className="text-[16px] font-[light]"> {dayjs(item.in_timestamp * 1000).locale('th').format('HH:mm:ss')}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <p className="font-[medium]">ออกงาน : </p>
                                            <p className="text-[16px] font-[light]">{item.out_timestamp ? dayjs(item.out_timestamp * 1000).locale('th').format('HH:mm:ss') : 'ไม่ได้ออกงาน'}</p>
                                        </div> */}
                                    </table>
                                    {/* {item.in_timestamp && item.out_timestamp ? <div className="flex gap-2 items-center">
                                        <p className="font-[light]">สถานะ : </p>
                                        <p className="text-[16px] font-[bold] text-green-700">Success</p>
                                    </div> : <div className="flex gap-2 items-center">
                                        <p className="font-[light]">สถานะ : </p>
                                        <p className="text-[16px] font-[bold] text-red-700">Not Success</p>
                                    </div>} */}

                                    <button className="w-full h-9 mt-2 bg-orange-600/20 font-[medium] border-1 border-orange-600 text-orange-600 rounded-lg" onClick={() => {
                                        setAttend(item)
                                        setFix(true)

                                    }}>แก้ไข</button>
                                </div>
                            </div>
                        )
                    }) : null}
                </div>
            </div> : null}


            <div className="p-5 flex gap-2 flex-col h-[200vh] overflow-scroll">
                {employees && employees.length > 0 ? employees.map((item: any) => {
                    return (
                        <div key={item.id} onClick={async (e) => {

                            if (e.target == e.currentTarget) {
                                // setDate 
                                let dates_res: any = await new AdminMethod().getDateUser(item.id)

                                // console.log(dates_res)
                                // console.log(item)

                                let data = {
                                    name: item.name,
                                    dates: dates_res
                                }

                                // console.log("Data : ", data)
                                setDates(data)

                                setModal(true)
                            }


                        }} className="bg-white p-3 rounded-lg border-1 border-gray-300 flex justify-between items-center">
                            <div>
                                <p className="font-[medium]">{item.name}</p>
                                <p className="font-[regular] text-[14px] text-gray-500">{item.department}</p>
                                <p className="font-[regular] text-[14px] text-gray-500">รายได้ {item.cash} บาท</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation()
                                        setSelectedEmployee(item)
                                        await loadWithdrawals(item.id)
                                    }}
                                    className="p-2 bg-amber-600/20 font-[medium] border-1 border-amber-600 text-amber-600 rounded-lg cursor-pointer hover:bg-amber-600/30 active:scale-95 transition"
                                >
                                    รายการเบิก
                                </button>

                                <button className="p-2 bg-green-600/20 font-[medium] border-1 border-green-600 text-green-600 rounded-lg cursor-pointer" onClick={async (e) => {
                                    if (e.target == e.currentTarget) {
                                        Swal.fire({
                                            title: `ต้องการจ่ายเงินเดือนให้พนักงาน ${item.name}`,
                                            text: `${item.cash}฿`,
                                            confirmButtonText: 'ใช่',
                                            cancelButtonText: 'ไม่',
                                            showCancelButton: true,
                                            confirmButtonColor: '#0ea5e9',
                                            cancelButtonColor: '#ef4444',
                                            icon: 'info'
                                        }).then(async(res) => {
                                            if (res.isConfirmed) {
                                                let res = await new AdminMethod().paidSalary(item.id)

                                                Swal.fire({
                                                    title: `จ่ายเงินเดือนให้ ${item.name} สำเร็จ!`,
                                                    text: `${item.cash}฿`,
                                                    icon: 'success'
                                                })

                                                setRefresh(refresh + 1)
                                            }
                                        })
                                    }
                                }}>จ่ายเงิน</button>
                            </div>
                        </div>
                    )
                }) : null}
            </div>

            {withdrawModalOpen ? (
                <div onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setWithdrawModalOpen(false)
                    }
                }} className="w-full h-[100vh] fixed top-0 left-0 bg-black/30 flex justify-center items-center z-4">
                    <div className="bg-gray-50 w-90 h-[500px] overflow-scroll rounded-lg p-6 flex flex-col gap-4 border-1 border-gray-300 shadow">
                        <div>
                            <p className="font-[medium] text-[20px] text-gray-800">รายการเบิกเงิน</p>
                            <p className="font-[regular] text-[15px] text-gray-500">พนักงาน : {selectedEmployee?.name}</p>
                        </div>
                        
                        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
                            {withdrawRequests && withdrawRequests.length > 0 ? (
                                withdrawRequests.map((reqItem: any) => (
                                    <div key={reqItem.id} className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-[bold] text-[16px] text-gray-800">
                                                {Number(reqItem.amount).toFixed(2)} ฿
                                            </span>
                                            <span className={`text-[12px] px-2 py-0.5 rounded font-[medium] ${
                                                reqItem.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                reqItem.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {reqItem.status === 'PENDING' ? 'รอดำเนินการ' :
                                                 reqItem.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                                            </span>
                                        </div>
                                        <div className="text-[12px] text-gray-400 font-[light]">
                                            ขอเมื่อ: {dayjs(reqItem.requested_at).locale('th').format('DD/MM/YYYY HH:mm')}
                                        </div>
                                        
                                        {reqItem.status === 'PENDING' && (
                                            <div className="flex gap-2 mt-1">
                                                <button 
                                                    onClick={() => handleRejectWithdrawal(reqItem.id)}
                                                    className="flex-1 py-1 text-[13px] bg-red-50 text-red-600 border border-red-200 rounded font-[medium] cursor-pointer hover:bg-red-100 transition"
                                                >
                                                    ปฏิเสธ
                                                </button>
                                                <button 
                                                    onClick={() => handleApproveWithdrawal(reqItem.id)}
                                                    className="flex-1 py-1 text-[13px] bg-green-50 text-green-600 border border-green-200 rounded font-[medium] cursor-pointer hover:bg-green-100 transition"
                                                >
                                                    อนุมัติ
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-10 font-[light] text-[15px]">
                                    ไม่มีประวัติการเบิกเงิน
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => setWithdrawModalOpen(false)}
                            className="w-full py-2 bg-gray-200 text-gray-700 font-[medium] rounded-lg cursor-pointer hover:bg-gray-300 text-[15px] transition"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            ) : null}


            <Bottom />
        </div>
    )
}

export default Admin