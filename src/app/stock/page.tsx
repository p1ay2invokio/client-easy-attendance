'use client'

import { useState, useEffect } from "react"
import Bottom from "../../../components/Bottom"
import Header from "../../../components/Header"
import { StockMethod } from "../../../methods/methods"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import dayjs from "dayjs"
import { BiTrash } from "react-icons/bi"
import { BsArrowRight } from "react-icons/bs"
import { HiDocument } from "react-icons/hi"
import { PiResizeFill } from "react-icons/pi"

const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className="bg-gray-300 text-black rounded font-[light]">{part}</span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

const Stock = () => {


    const [products, setProducts] = useState<object[]>([])
    const [barcode, setBarcode] = useState<string>('')

    let [select, setSelect] = useState(0)

    const [specificProduct, setSepecificProduct] = useState<any>(null)

    const [checkStockModal, setCheckStockModal] = useState<boolean>(false)

    const [count, setCount] = useState<string>('')

    const [list, setList] = useState<object[]>([])

    const [refresh, setRefresh] = useState<number>(0)

    const [loading, setLoading] = useState<boolean>(true)

    const [resize, setResize] = useState<boolean>(false)

    const init = async () => {
        // setList([
        //     {
        //         Barcode: '123124213',
        //         Timestamp: '16/06/25',
        //         Name: 'โบว์',
        //         Qty: 5,
        //         Count: 5,
        //         Diff: 1,
        //         ProductName: 'จานเปลไข่ 10 นิ้วสีฟ้า BASIC'
        //     }
        // ])

        let res: any = await new StockMethod().getCheckList()

        console.log(res.data)

        setList(res.data)
    }

    useEffect(() => {

        let select_storage: any = localStorage.getItem("select")
        let resize_storage = localStorage.getItem("resize-table") === 'true' ? true : false

        console.log(resize_storage)

        setResize(resize_storage)

        if (!select_storage) {
            localStorage.setItem('select', '0')
            setSelect(0)
            setLoading(false)
        } else {
            setSelect(Number(select_storage))
            setLoading(false)
        }

        console.log(select_storage)

        init()
    }, [refresh])

    if (loading) {
        return null
    }



    return (
        <div>
            <Header />


            {products && products.length > 0 ? <div onClick={(e) => {
                if (e.target == e.currentTarget) {
                    setProducts([])
                    setBarcode('')
                }
            }} className="w-full h-[100vh] fixed top-0 left-0 bg-black/50 z-3 flex flex-col justify-center items-center">
                <div className="w-[330px] rounded-lg shadow h-140 p-3 bg-white overflow-scroll translate-y-[-30px]">
                    <table className="w-full">
                        <thead className="font-[medium] sticky bg-white top-0 text-[14px] border-b-1 border-gray-500 text-center">
                            <tr className="shadow h-10">
                                {/* <td>บาร์โค้ด</td> */}
                                <td className="border-1 border-gray-300">ชื่อ</td>
                                <td className="border-1 border-gray-300">ราคา</td>
                                <td className="border-1 border-gray-300">จำนวน(ชิ้น)</td>
                            </tr>
                        </thead>
                        <tbody className="font-[light] text-center ">
                            {products && products.length > 0 ? products.map((item: any, index: number) => {
                                return (
                                    <>
                                        <tr className="h-2" /> {/* Spacer Row */}
                                        <tr onClick={() => {
                                            setSepecificProduct(item)
                                            setCheckStockModal(true)
                                        }} className={`text-[16px] h-10 ${index % 2 == 0 ? 'bg-slate-200' : 'bg-gray-100'}`}>
                                            {/* <td>{item.Barcode}</td> */}
                                            <td className="p-2 text-start text-black rounded-l-lg">
                                                <p className="text-start font-[medium]">{item.Name}</p>
                                                <p>{highlightText(item.Barcode, barcode)}</p>
                                                {/* <p>{highlightText(item.SecondaryBarcode, barcode)}</p> */}
                                            </td>
                                            <td className="text-black font-[medium]">{Number(item.RetailPrice).toLocaleString('TH-th')}</td>
                                            <td className="text-green-600 font-[bold] rounded-r-lg">{item.Qty}</td>

                                        </tr>

                                    </>

                                )
                            }) : null}
                        </tbody>
                    </table>
                </div>
            </div> : null}

            {checkStockModal && specificProduct ? <div onClick={(e) => {
                if (e.target == e.currentTarget) {
                    setCheckStockModal(false)
                }
            }} className="w-full h-[100vh] fixed top-0 left-0 flex justify-center items-center z-5 bg-black/70">
                <div className="w-[330px] h-[300px] p-3 bg-white rounded-xl">
                    <p className="font-[medium] text-[18px]">เช็คสต็อกสินค้า</p>
                    <div className="w-full h-[calc(100%-70px)] flex justify-center items-center flex-col">
                        <p className="font-[regular] text-[23px] mb-2 text-center">{specificProduct.Name}</p>
                        <input value={count} onChange={(e) => {
                            setCount(e.target.value)
                        }} type="tel" placeholder={specificProduct.Qty} className="w-full mb-3 h-9 border-1 border-gray-300 outline-none bg-gray-50 text-center font-[medium] text-[20px] rounded-lg"></input>
                        <button onClick={() => {
                            // navigate.push('/admin')



                            Swal.fire({
                                title: "คุณต้องการบันทึกการตรวจสอบหรือไม่?",
                                icon: "question",
                                showCancelButton: true
                            }).then(async (res) => {
                                if (res.isConfirmed) {
                                    if (count) {
                                        let today = dayjs().locale('th').format("DD/MM/YY")
                                        let res: any = await new StockMethod().AddListCheck(specificProduct.Barcode, specificProduct.Name, specificProduct.Qty, Number(count), today)

                                        if (res.status == 200) {
                                            toast.success("เพิ่มรายการเช็คสต็อกสำเร็จ")
                                            setCheckStockModal(false)
                                            setSepecificProduct(null)
                                            setProducts([])
                                            setBarcode('')
                                            setCount('')

                                            setRefresh(refresh + 1)
                                        } else if (res.status == 400) {
                                            toast.error(res.message)
                                            setCheckStockModal(false)
                                            setSepecificProduct(null)
                                            setProducts([])
                                            setBarcode('')
                                            setCount('')
                                        } else {
                                            toast.error(res.message)
                                            setCheckStockModal(false)
                                            setSepecificProduct(null)
                                            setProducts([])
                                            setBarcode('')
                                            setCount('')
                                        }
                                        console.log(res)
                                    } else {
                                        toast.error("ใส่ข้อมูลก่อน!")
                                        setCount('')
                                    }
                                }
                            })

                        }
                        } className="w-full h-10 border-1 mt-2 border-sky-600 rounded-lg bg-sky-400/10 text-sky-600 flex justify-center items-center gap-2">
                            {/* <BiSolidDashboard className="text-sky-600" size={30} /> */}
                            <p className="font-[medium]">บันทึก</p>
                        </button>
                        <button onClick={() => {
                            // navigate.push('/admin')
                            setCheckStockModal(false)
                            setSepecificProduct(null)
                            setCount('')
                        }} className="w-full h-10 border-1 mt-2 border-red-600 rounded-lg bg-red-400/10 text-red-600 flex justify-center items-center gap-2">
                            {/* <BiSolidDashboard className="text-sky-600" size={30} /> */}
                            <p className="font-[medium]">ยกเลิก</p>
                        </button>
                    </div>
                </div>
            </div> : null}


            <div className="flex justify-center">
                <div className="bg-white relative mt-3  w-[330px] rounded-lg flex gap-2 flex-col justify-center items-center">

                    {/* <div className="text-center">
                        <p className="font-[medium] text-[20px] text-black/70">ระบบค้นหาสินค้า</p>
                        <p className="font-[light] text-[12px] text-black/70">ร้านแม่ขานแฟร์</p>
                    </div> */}

                    <input value={barcode} type="text" className="outline-none border-1 border-gray-300 bg-white rounded-md h-10 w-full text-center font-[regular]" onChange={(e) => {
                        setBarcode(e.target.value)
                    }} placeholder="ค้นหาสินค้าด้วย Barcode"></input>

                    <button onClick={async () => {
                        if (barcode) {
                            let res: any = await new StockMethod().getProductWithBarcode(barcode)

                            console.log(res)

                            if (res.status == 200) {
                                if (res.data.length > 0) {
                                    setProducts(res.data)
                                } else {
                                    toast.error("ไม่พบ Barcode นี้!")
                                    setCheckStockModal(false)
                                    setSepecificProduct(null)
                                    setProducts([])
                                    setBarcode('')
                                    setCount('')
                                }
                            }


                        } else {
                            toast.error('กรอก barcode ก่อนค้นหา!')
                        }
                    }} className="w-15 h-8 absolute top-1 right-2 bg-blue-400/20 cursor-pointer border-1 border-blue-400 text-blue-400 rounded-lg">
                        <p className="font-[medium]">ค้นหา</p>
                    </button>
                </div>
            </div>

            <div className="w-full flex justify-center items-center mt-2">
                <p className="font-[light] text-red-500">***ต้องใช้ Wifi ของร้านเท่านั้น***</p>
            </div>

            <div className="w-full flex justify-center items-center gap-2 mt-2">
                <button onClick={() => {
                    setSelect(0)
                    localStorage.setItem('select', '0')
                }} className={`w-20 h-8 ${select == 0 ? 'bg-blue-400 text-white' : 'bg-blue-400/20'} cursor-pointer border-1 border-blue-400 text-blue-400 rounded-lg font-[medium]`}>แม่ขาน</button>
                <button onClick={() => {
                    setSelect(1)
                    localStorage.setItem('select', '1')
                }} className={`w-20 h-8 ${select == 1 ? 'bg-blue-400 text-white' : 'bg-blue-400/20'} cursor-pointer border-1 border-blue-400 text-blue-400 rounded-lg font-[medium]`}>สันป่าตอง</button>
            </div>


            <PiResizeFill onClick={() => {
                if (resize == false) {
                    toast.success("เปลี่ยนเป็นขนาดย่อ")
                    localStorage.setItem('resize-table', 'true')
                } else {
                    toast.success("เปลี่ยนเป็นขนาดเต็ม")
                    localStorage.setItem('resize-table', 'false')
                }
                setResize(!resize)
            }} size={40} className="ml-3" />

            <table className="w-full mt-2">
                <thead className="w-full text-center border-b-1 border-t-1 bg-white border-gray-400 font-[medium]">
                    <tr>
                        {resize ? null : <td className="text-[14px]">Barcode</td>}
                        {resize ? null : <td className="text-[14px]">พนักงาน</td>}
                        <td className="text-[14px]">ชื่อ</td>
                        {/* <td>บาร์โค้ด</td> */}
                        <td className="text-[14px]">จำนวน/นับ</td>
                        <td className="text-[14px]">ส่วนต่าง</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {list ? list.map((item: any, index: number) => {
                        return (
                            <tr className={`text-center ${resize ? 'font-[medium]' : 'font-[light]'} text-[14px] h-10 ${index % 2 == 0 ? "bg-slate-200" : ""}`}>
                                {resize ? null : <td className="font-[light] w-2">
                                    <p className="w-25 overflow-hidden text-ellipsis whitespace-nowarp">{item.Barcode}</p>
                                </td>}
                                {resize ? null : <td>
                                    <p>{item.Name}</p>
                                    <p className="text-[12px]">{item.Timestamp}</p>
                                </td>}
                                <td className={`${resize ? "" : '"w-[100px]"'}`}>{item.ProductName} </td>
                                <td className={`${resize ? "" : "w-[10px]"}`}>{item.Qty}/{item.Count}</td>
                                <td className={`${resize ? "" : "w-[10px]"} ${item.Diff == 0 ? 'text-green-600' : item.Diff >= 1 ? 'text-blue-500' : item.Diff <= -1 ? 'text-red-400' : 'text-black'}`}>{item.Diff > 0 ? '+' + item.Diff : item.Diff}</td>
                                <td><BiTrash className="text-red-600" onClick={async () => {
                                    Swal.fire({
                                        title: 'ต้องการลบออกจาก list?',
                                        showCancelButton: true
                                    }).then(async (res) => {
                                        if (res.isConfirmed) {
                                            let res: any = await new StockMethod().DeleteStockId(item.Id)

                                            if (res.status == 200) {
                                                toast.success(res.message)
                                                setRefresh(refresh + 1)
                                            }
                                        }
                                    })
                                }} size={20} /></td>
                            </tr>
                        )
                    }) : null}
                </tbody>
            </table>

            <Bottom />

            <Toaster position="bottom-center" />
        </div>
    )
}

export default Stock