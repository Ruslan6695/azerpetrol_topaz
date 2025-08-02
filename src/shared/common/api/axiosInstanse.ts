import axios from 'axios'

export const axiosIntsanse = axios.create({
    baseURL: 'https://demo.azscontrol.ru/adapters/primary/mobile_app/',
})
