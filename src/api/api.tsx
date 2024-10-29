import instance from "./instance";
import { Electricity } from "../types/ty";

const getAllEnergyUsed = () => {
    return instance.get('/electricity')
}
const energyUsed = (energyUsed: Electricity) => {
    return instance.post('/electricity', energyUsed)
}
const saveBill = (billData: { inputEnergy: number; totalAmount: number; timestamp: string }) => {
    return instance.post('/bills', billData);
};
const getAllBill = ()=> {
    return instance.get('/bills')
}
export {energyUsed,getAllEnergyUsed,saveBill,getAllBill}