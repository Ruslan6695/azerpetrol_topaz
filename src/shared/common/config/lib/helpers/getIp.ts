import * as Network from 'expo-network'

export async function getIp() {
    return await Network.getIpAddressAsync()
}
