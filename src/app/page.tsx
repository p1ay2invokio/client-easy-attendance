'use client'

import dayjs from "dayjs"
import 'dayjs/locale/th'
import Header from "../../components/Header"
import { AttendanceMethod } from "../../methods/methods"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import Bottom from "../../components/Bottom"
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { TbGpsFilled } from "react-icons/tb";

dayjs.extend(duration)

function getElapsedTime(startUnix: any) {
  const start = dayjs.unix(startUnix)
  const now = dayjs()
  const diffInSeconds = now.diff(start, 'second') // time passed since start

  const dur = dayjs.duration(diffInSeconds, 'seconds')

  const hours = String(dur.hours()).padStart(2, '0')
  const minutes = String(dur.minutes()).padStart(2, '0')
  const seconds = String(dur.seconds()).padStart(2, '0')

  return `${hours} hours ${minutes} minutes ${seconds} seconds`
}

dayjs.extend(relativeTime)

const HomePage = () => {

  let date = dayjs().locale('th').format('DD MMMM YYYY')

  let [attendance, setAttendance] = useState<any | null>(null)
  let [refresh, setRefresh] = useState<number>(0)
  let [loading, setLoading] = useState<boolean>(true)

  let [myLat, setMyLat] = useState<any>(null)
  let [myLong, setMyLong] = useState<any>(null)

  var count_up: any

  let [currentTime, setCurrentTime] = useState({
    hr: '00',
    min: '00',
    sec: '00'
  })
  let [loadTime, setLoadTime] = useState(true)

  const initial = async () => {
    let res: any = await new AttendanceMethod().todayData()

    if (res.status) {
      console.log(res.data)
      setTimeout(() => {
        setLoadTime(false)
      }, 1000)
      if (res.data.in_timestamp && res.data.out_timestamp) {
        clearInterval(count_up)
      } else {
        count_up = setInterval(() => {
          let stringTime = getElapsedTime(res.data?.in_timestamp)
          console.log(stringTime.split(" seconds")[0].split("minutes ")[1])
          setCurrentTime({
            hr: String(stringTime.split(" hours")[0]),
            min: String(stringTime.split(" minutes")[0].split("hours ")[1]),
            sec: String(stringTime.split(" seconds")[0].split("minutes ")[1]),
          })
          // console.log(getElapsedTime(res.data?.in_timestamp))
        }, 1000)
      }
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

      <div onClick={() => {
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
      }} className="fixed bottom-20 right-5">
        <TbGpsFilled size={40}></TbGpsFilled>
      </div>

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
            {attendance && attendance.in_timestamp && !attendance.out_timestamp ? <p className="font-[light] text-[16px] text-gray-700">ยอดสุทธิ {dayjs().diff(dayjs.unix(attendance.in_timestamp), 'hour') * 40} ฿</p> : null}
          </div>

          {attendance && !attendance.out_timestamp ? !loadTime ? <div className="fixed bottom-20 p-2 rounded-lg bg-white border-1 border-gray-300 shadow">
            <p className="font-[medium] text-[20px] text-gray-700">{currentTime.hr}:{currentTime.min}:{currentTime.sec}</p>
          </div> : <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg> : null}

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
                let response: any = await new AttendanceMethod().out(myLat, myLong)

                if (!response.status) {
                  Swal.fire({
                    title: response.message,
                    icon: 'error'
                  }).then((res) => {
                    if (res.isConfirmed) {
                      window.location.reload()
                    }
                  })
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