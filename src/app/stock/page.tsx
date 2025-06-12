'use client'

import { useState, useEffect } from "react"
import Bottom from "../../../components/Bottom"
import Header from "../../../components/Header"
import { StockMethod } from "../../../methods/methods"
import toast, { Toaster } from "react-hot-toast"

const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={i} className="bg-red-600 text-white rounded font-[medium]">{part}</span>
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

    return (
        <div>
            <Header />


            {products && products.length > 0 ? <div onClick={(e) => {
                if (e.target == e.currentTarget) {
                    setProducts([])
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
                                        <tr className={`text-[16px] h-10 ${index % 2 == 0 ? 'bg-slate-200' : 'bg-gray-100'}`}>
                                            {/* <td>{item.Barcode}</td> */}
                                            <td className="p-2 text-start text-black/70 rounded-l-lg">
                                                <p className="text-start font-[regular]">{item.Name}</p>
                                                <p>{highlightText(item.Barcode, barcode)}</p>
                                                {/* <p>{highlightText(item.SecondaryBarcode, barcode)}</p> */}
                                            </td>
                                            <td className="text-green-600 font-[bold]">{Number(item.RetailPrice).toLocaleString('TH-th')}฿</td>
                                            <td className="text-blue-600 font-[bold] rounded-r-lg">{item.Qty}</td>

                                        </tr>

                                    </>

                                )
                            }) : null}
                        </tbody>
                    </table>
                </div>
            </div> : null}


            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="bg-white border-1 border-gray-300 p-3 w-[330px] rounded-lg flex gap-2 flex-col justify-center items-center">

                    <div className="text-center">
                        <p className="font-[medium] text-[20px] text-black/70">ระบบค้นหาสินค้า</p>
                        <p className="font-[light] text-[12px] text-black/70">ร้านแม่ขานแฟร์</p>
                    </div>

                    <input type="tel" className="outline-none border-1 border-gray-300 bg-gray-50 rounded-md h-10 w-full text-center font-[regular]" onChange={(e) => {
                        setBarcode(e.target.value)
                    }} placeholder="ค้นหาสินค้าด้วย Barcode"></input>
                    <button onClick={async () => {
                        if (barcode) {
                            let res: any = await new StockMethod().getProductWithBarcode(barcode)

                            if (res.status == 200) {
                                if (res.data.length > 0) {
                                    setProducts(res.data)
                                } else {
                                    toast.error("ไม่พบ Barcode นี้!")
                                }
                            }


                        } else {
                            toast.error('กรอก barcode ก่อนค้นหา!')
                        }
                    }} className="w-full h-9 bg-blue-400/20 cursor-pointer border-1 border-blue-400 text-blue-400 rounded-lg">
                        <p className="font-[medium]">ค้นหาสินค้า</p>
                    </button>
                </div>
            </div>
            <Bottom />

            <Toaster position="bottom-center" />
        </div>
    )
}

export default Stock