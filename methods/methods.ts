import axios, { AxiosError } from "axios"
import { uri, uri_maekhan } from "./config"

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

            if (!userId) {
                window.location.href = "/login"
            }

            axios.get(`/api/product/${barcode}`).then((res) => {
                resolve(res.data)
            })
        })
    }
}