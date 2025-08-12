'use client'

import { useEffect, useState } from "react"
import { StockMethod } from "../../../methods/methods"
import axios from "axios"
import { uri_doilor, uri_maekhan } from "../../../methods/config"
import Bottom from "../../../components/Bottom"

const Dashboard = () => {


    let [recap, setRecap] = useState<any>([])

    let [search, setSearch] = useState<string>("")

    let [total, setTotal] = useState<object | any>()

    let initial = async (search_input: string) => {
        let stock: any = await new StockMethod().getProductMultiple(search_input)

        let maekhan_data = stock.maekhan
        let sanpatong_data = stock.sanpatong
        let doilor_data = stock.doilor

        //@ts-ignore
        let AllBarcodes = new Set([...maekhan_data.map(i => i.Barcode), ...sanpatong_data.map(i => i.Barcode), ...doilor_data.map(i => i.Barcode)])

        let MergeData = Array.from(AllBarcodes).map((Barcode: any) => {
            let m = maekhan_data.find((m: any) => m.Barcode == Barcode)
            let s = sanpatong_data.find((s: any) => s.Barcode == Barcode)
            let d = doilor_data.find((d: any) => d.Barcode == Barcode)

            return {
                Barcode: m ? m.Barcode : s ? s.Barcode : d ? d.Barcode : "Not found",
                Name: m ? m.Name : s ? s.Name : d ? d.Name : "Not found",
                RetailPrice: m ? m.RetailPrice : s ? s.RetailPrice : d ? d.RetailPrice : "Not found",
                Cost: m ? m.Cost : 0,
                maekhan: m ? m.Qty : 0,
                sanpatong: s ? s.Qty : 0,
                doilor: d ? d.Qty : 0,
            }
        })

        console.log(MergeData)

        console.log(stock)

        setRecap(MergeData)
    }

    let dashboardData = () => {
        axios.get(`${uri_maekhan}/api/orders/payment`).then((res) => {
            setTotal(res.data.Total)
        })
    }



    useEffect(() => {
        // initial()
        dashboardData()
    }, [])

    return (
        <div>

            {/* <p className="text-center mt-2 font-[medium]">ข้อมูลสินค้าทั้ง 3 ร้าน</p> */}

            <div className="w-full flex justify-center items-center mt-3 gap-3">
                <div className="w-25 h-15 flex flex-col justify-center items-center bg-blue-300/30 border-1 border-blue-400/40 rounded-lg">
                    <p>แม่ขาน</p>
                    <p className="text-green-700 font-semibold">{total ? total.maekhanTotal.toLocaleString("TH-th") : 0}</p>
                </div>

                <div className="p-4 w-25 h-15 flex flex-col justify-center items-center bg-blue-300/30 border-1 border-blue-400/40 rounded-lg">
                    <p>สันป่าตอง</p>
                    <p className="text-green-700 font-semibold">{total ? total.sanpatongTotal.toLocaleString("TH-th") : 0}</p>
                </div>

                <div className="p-4 w-25 h-15 flex flex-col justify-center items-center bg-blue-300/30 border-1 border-blue-400/40 rounded-lg">
                    <p>ดอยหล่อ</p>
                    <p className="text-green-700 font-semibold">{total ? total.doilorTotal.toLocaleString("TH-th") : 0}</p>
                </div>

            </div>

            <div className="w-full flex justify-center gap-3 items-center mt-3">
                <input onChange={(e) => {
                    setSearch(e.target.value)
                }} className="border-1 h-10 indent-4 rounded-sm border-gray-300"></input>
                <button onClick={async () => {
                    await initial(search)
                }} className="bg-blue-200 border border-blue-400/70 rounded-sm font-[medium] h-full p-2">ค้นหา</button>
            </div>

            <div className="p-0 mt-2">
                <table className="w-full mb-20">
                    <thead className="border-b-1 border-black sticky top-0 bg-slate-500 text-white backdrop-blur-sm">
                        <tr className="text-center font-[medium]">
                            <td className="w-60">ชื่อ</td>
                            <td className="w-15">ขาย</td>
                            <td className="w-15">มข</td>
                            <td className="w-15">สปต</td>
                            <td className="w-15">ดล</td>
                            <td className="w-15">ทุน</td>
                        </tr>
                    </thead>
                    <tbody>
                        {recap && recap.length > 0 ? recap.map((item: any, index: number) => {
                            return (
                                <tr className={`${index % 2 == 0 ? `bg-gray-300` : 'bg-white'} text-center h-8`}>
                                    <td className="pr-5 text-start">{item.Name}</td>

                                    <td>{item.RetailPrice}</td>
                                    <td className="text-blue-500">{item.maekhan}</td>
                                    <td className="text-orange-500">{item.sanpatong}</td>
                                    <td className="text-fuchsia-500">{item.doilor}</td>
                                    <td>{parseInt(item.Cost)}</td>

                                </tr>
                            )
                        }) : null}
                    </tbody>
                </table>
            </div>
            
            <Bottom/>
        </div>
    )
}

export default Dashboard