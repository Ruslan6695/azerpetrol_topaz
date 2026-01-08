import axios from 'axios'

export const axiosIntsanse = axios.create({
    baseURL: 'https://demo.azs-control.ru/adapters/primary/mobile_app/',
})
