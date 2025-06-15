import axios, { AxiosError } from "axios"
import { uri, uri_maekhan, uri_sanpatong } from "./config"

export class AttendanceMethod {
    public attend = (aid: number, my_lat: number, my_long: number) => {
        return new Promise((resolve, reject) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.post(`${uri}/api/attend`, {
                id: userId,
                aid: aid,
                my_lat: my_lat,
                my_long: my_long
            }).then((res) => {
                resolve(res.data)
            }).catch((err: AxiosError) => {
                resolve(err.response?.data)
            })

        })
    }

    public out = (my_lat: number, my_long: number) => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.post(`${uri}/api/out`, {
                id: Number(userId),
                my_lat: my_lat,
                my_long: my_long
            }).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                resolve(err.response?.data)
            })
        })
    }

    public todayData = (): Promise<{ status: boolean, data: object }> => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${uri}/api/today_data/${userId}`).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                resolve(err.response?.data)
                // localStorage.removeItem('id')
                // localStorage.removeItem('name')
            })
        })
    }

    public history = (): Promise<{ status: boolean, data: object, message: string }> => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${uri}/api/history/${userId}`).then((res) => {
                resolve(res.data)
            })
        })
    }
}

export class AuthenMethod {
    public Login = (phoneNumber: string) => {
        return new Promise((resolve) => {

            axios.post(`${uri}/api/login`, {
                phoneNumber: phoneNumber
            }).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                resolve(err.response?.data)
            })
        })
    }
}

export class EmployeeMethod {
    public detail = () => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${uri}/api/detail/${userId}`).then((res) => {
                resolve(res.data)
            })
        })
    }
}

export class AdminMethod {
    public getEmployees = () => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${uri}/api/employees`).then((res) => {
                resolve(res.data)
            })
        })
    }

    public getDateUser = (id: number) => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${uri}/api/employee/date/${id}`).then((res) => {
                resolve(res.data)
            })
        })
    }

    public revenueUpdate = (aid: number, revenue_new: number) => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.patch(`${uri}/api/employee/revenue`, {
                aid: aid,
                revenue_new: revenue_new
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    public paidSalary = (eid: number) => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")

            if (!userId) {
                window.location.href = "/login"
            }

            axios.patch(`${uri}/api/employee/paid/salary`, {
                eid: eid,
            }).then((res) => {
                resolve(res.data)
            })
        })
    }
}


export class StockMethod {
    public getProductWithBarcode = (barcode: String) => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")
            let select = Number(localStorage.getItem('select'))

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${select == 0 ? uri_maekhan : select == 1 ? uri_sanpatong : uri_maekhan}/api/product/${barcode}`).then((res) => {
                resolve(res.data)
            })
        })
    }

    public AddListCheck = (barcode: string, product_name: string, qty: number, count: number, today: string) => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")
            let name = localStorage.getItem("name")
            let select = Number(localStorage.getItem('select'))

            if (!userId) {
                window.location.href = "/login"
            }

            axios.post(`${select == 0 ? uri_maekhan : select == 1 ? uri_sanpatong : uri_maekhan}/api/stock/check`, {
                barcode: barcode,
                product_name: product_name,
                name: name,
                qty: qty,
                count: count,
                today: today.toString()
            }).then((res) => {
                resolve(res)
            }).catch((err) => {
                resolve(err.response?.data);
            })
        })
    }

    public getCheckList = () => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")
            let select = Number(localStorage.getItem('select'))

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${select == 0 ? uri_maekhan : select == 1 ? uri_sanpatong : uri_maekhan}/api/stock`).then((res) => {
                resolve(res.data)
            })
        })
    }

    public DownloadStockUpdate = () => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")
            let select = Number(localStorage.getItem('select'))

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`${select == 0 ? uri_maekhan : select == 1 ? uri_sanpatong : uri_maekhan}/api/stock/update`, {
                responseType: "blob"
            }).then((res) => {
                console.log(res.data)
                resolve(res.data)
            })
        })
    }


    public DeleteStock = () => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")
            let select = Number(localStorage.getItem('select'))

            if (!userId) {
                window.location.href = "/login"
            }

            axios.delete(`${select == 0 ? uri_maekhan : select == 1 ? uri_sanpatong : uri_maekhan}/api/stock`).then((res) => {
                resolve(res.data)
            })
        })
    }

    public DeleteStockId = (sid: number) => {
        return new Promise((resolve) => {

            let userId = localStorage.getItem("id")
            let select = Number(localStorage.getItem('select'))

            if (!userId) {
                window.location.href = "/login"
            }

            axios.delete(`${select == 0 ? uri_maekhan : select == 1 ? uri_sanpatong : uri_maekhan}/api/stock/${sid}`).then((res) => {
                resolve(res.data)
            })
        })
    }
}