'use client'

import dayjs from "dayjs"
import 'dayjs/locale/th'
import Header from "../../components/Header"
import { AttendanceMethod } from "../../methods/methods"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import Bottom from "../../components/Bottom"

const HomePage = () => {

  let date = dayjs().locale('th').format('DD MMMM YYYY')

  let [attendance, setAttendance] = useState<any | null>(null)
  let [refresh, setRefresh] = useState<number>(0)
  let [loading, setLoading] = useState<boolean>(true)

  let [myLat, setMyLat] = useState<any>(null)
  let [myLong, setMyLong] = useState<any>(null)

  const initial = async () => {
    let res = await new AttendanceMethod().todayData()

    if (res.status) {
      console.log(res.data)
      setAttendance(res.data)
    } else {
      console.log("Fetching Data Error!")
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos.coords)
      setMyLat(pos.coords.latitude)
      setMyLong(pos.coords.longitude)
    }, (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        Swal.fire("ไม่ได้เปิด Location", '', 'warning')
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        Swal.fire("Location ไม่ถูกให้ใช้")
      } else if (err.code === err.TIMEOUT) {
        Swal.fire("Location request timeout")
      } else {
        Swal.fire("Location occurred unknow error")
      }
    })
  }

  useEffect(() => {
    initial()
    setLoading(false)
  }, [refresh])

  if (loading) {
    return null
  }


  return (
    <div>
      <Header />
      <div className="flex flex-col gap-0 justify-center items-center h-[calc(100vh-250px)]">

        <div className="w-[360px] p-2  rounded-xl border bg-white shadow-sm border-gray-200 flex flex-col justify-start items-center gap-5">

          <div className="w-full flex justify-center overflow-hidden rounded-lg mb-2 shadow">
            {/* <p>{attendance.in_timestamp ? dayjs.unix(Number(attendance.in_timestamp)).format("HH:mm:ss") : null}</p>
              <p>{attendance.out_timestamp ? dayjs.unix(Number(attendance.out_timestamp)).format("HH:mm:ss") : null}</p> */}
            <table className="w-full text-center ">
              <thead className="bg-red-400">
                <tr className="font-[regular] text-[20px] text-white">
                  <td className="h-[40px]">เวลาเข้างาน</td>
                  <td>เวลาออกงาน</td>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white font-[light] text-[18px] text-gray-600">
                  {attendance ?
                    <>
                      <td className="h-[50px]">{attendance.in_timestamp ? dayjs.unix(Number(attendance.in_timestamp)).format("HH:mm:ss") : null}</td>
                      <td>{attendance.out_timestamp ? dayjs.unix(Number(attendance.out_timestamp)).format("HH:mm:ss") : null}</td>
                    </> : <td colSpan={2} className="h-[50px]">ไม่พบบันทึกเวลางานในวันนี้</td>}
                  {/* {!attendance ? <td>ไม่พบบันทึกเวลางานในวันนี้</td> : null} */}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-0 items-center w-full">
            <p className="font-[bold] text-[20px] text-gray-700">{date}</p>
          </div>

          {attendance ? !attendance.in_timestamp ? <button className="w-[40%] h-[48px] bg-red-400/20 border-red-300 text-red-500 border rounded-lg font-[regular] text-[20px] cursor-pointer hover:bg-red-400/30 duration-100" onClick={async () => {
            if (myLat && myLong) {
              let response: any = await new AttendanceMethod().attend(myLat, myLong)

              if (!response.status) {
                Swal.fire(response.message, "", 'error')
              } else {
                Swal.fire(response.message, "", 'success')
              }

              setRefresh(refresh + 1)

            } else {
              Swal.fire("Location ยังไม่ถูกเปิด", "", "warning")
            }

          }}>เข้างาน</button> : !attendance.out_timestamp ? <button className="w-[90%] h-[48px] bg-red-400/20 border-red-300 text-red-500 border rounded-lg font-[regular] text-[20px] cursor-pointer hover:bg-red-400/30 duration-100" onClick={async () => {

            Swal.fire({
              title: "คุณต้องการออกจากงาน?",
              icon: "question",
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "ใช่",
              cancelButtonText: "ไม่"
            }).then(async (res) => {
              if (res.isConfirmed) {
                let response: any = await new AttendanceMethod().out()

                if (!response.status) {
                  Swal.fire(response.message, "", 'error')
                } else {
                  Swal.fire(response.message, "", 'success')
                }

                setRefresh(refresh + 1)
              }
            })


          }}>ออกงาน</button> : <p className="font-[light] text-green-600 text-[20px]">คุณได้ลงเวลาเข้าออกงานเรียบร้อยแล้ว !</p> : <button className="w-[90%] h-[48px] bg-blue-400/20 border-blue-300 text-blue-500 border rounded-lg font-[medium] text-[20px] cursor-pointer hover:bg-blue-400/30 duration-100" onClick={async () => {
            if (myLat && myLong) {
              let response: any = await new AttendanceMethod().attend(myLat, myLong)

              if (!response.status) {
                Swal.fire(response.message, "", 'error')
              } else {
                Swal.fire(response.message, "", 'success')
              }

              setRefresh(refresh + 1)

            } else {
              Swal.fire("Location ยังไม่ถูกเปิด", "", "warning")
            }

          }}>เข้างาน</button>}
        </div>
      </div>

      <Bottom />
    </div>
  )
}

export default HomePage