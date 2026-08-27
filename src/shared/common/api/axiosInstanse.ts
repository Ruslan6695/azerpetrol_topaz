import axios from 'axios'

export const axiosIntsanse = axios.create({
    baseURL: 'https://topaz.poteryashka.pro/adapters/primary/mobile_app/',
})
