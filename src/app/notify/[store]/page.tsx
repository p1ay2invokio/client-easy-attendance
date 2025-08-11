'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { StockMethod } from "../../../../methods/methods"
import Bottom from "../../../../components/Bottom"

const Notify = () => {

    let [noti, setNoti] = useState<any>([])

    let { store } = useParams()

    const initial = async () => {
        let notifies: any = await new StockMethod().NotifyList(store)


        setNoti(notifies.data)

        // console.log(notifies)
    }

    useEffect(() => {
        initial()
    }, [])

    return (
        <div>
            <p className="text-center font-[medium] mt-5 text-blue-700 text-[20px]">ร้าน : {store}</p>
            <table className="w-full text-center">
                <thead>
                    <tr>
                        <td className="font-[regular] text-orange-700 pb-2">สินค้าเหลือน้อย</td>
                    </tr>
                </thead>
                <tbody>
                    {noti && noti.length > 0 ? noti.map((item: any, index: number) => {
                        return (
                            <tr>
                                <td className="pt-0.5 flex justify-center gap-2">
                                    <p>{item.Message.split("คงเหลือ")[0]}</p>
                                    <p className="text-red-700">คงเหลือ {item.Message.split("คงเหลือ")[1]}</p>
                                </td>
                            </tr>
                        )
                    }) : null}

                </tbody>
            </table>


            <Bottom/>
        </div>
    )
}


export default Notify