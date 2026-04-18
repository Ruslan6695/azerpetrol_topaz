import axios from 'axios'

export const axiosIntsanse = axios.create({
    baseURL: 'https://21vek.azs-control.ru/adapters/primary/mobile_app/',
})
