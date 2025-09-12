//import {GetHTTP, PostHTTP, PutHTTP, DeleteHTTP} from "@/restAPI/httpRequests";
import axiosInstance from "@/axiosConfig";

/*const httpGet = new GetHTTP()
const httpPost = new PostHTTP()
const httpPut = new PutHTTP()
const httpDelete = new DeleteHTTP()*/

export async function getAll(url: string) {
    try {
        const response = await axiosInstance.get(url);
        return response.data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getById(url: string, id: number) {
    try {
        const response = await axiosInstance.get(url + id);
        return response.data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function add(url: string, data: any) {
    try {
        const response = await axiosInstance.post(url, data);
        console.log('added data', data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function edit(url: string, data: any) {
    try {
        const response = await axiosInstance.put(url, data);
        console.log('updated data');
        return response.data;
    } catch (error) {			
        console.error('Error:', error);
        throw error;
    }
}

export async function deleteById(url: string, id: number) {    
    try {
        const response = await axiosInstance.delete(url + id);
        console.log('deleted data');
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByDay(url: string, day: string) {
    try {
        const response = await axiosInstance.get(url + "day/" + day);
        return response.data
    } catch (error) {
        console.error('Error:', error);
        throw error
    }
}

export async function getByDayAndExpectedTime(url: string, day: string) {    
    try {
        const response = await axiosInstance.get(url + "day-string/" + day);
        return response.data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getByStudentIdAndPaymentNumber(url: string, studentId: number, paymentNumber: number) {
    try {
        const response = await axiosInstance.get(url + "student/" + studentId + "/" + paymentNumber);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByPaymentNumberAndStudentIdAndClassNumber(url: string, paymentNumber: number, studentId: number, classNumber: number) { 
    try {
        const response = await axiosInstance.get(url + "class/" + paymentNumber + "/" + studentId + "/" + classNumber)
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteByStudentId(url: string, studentId: number) {
    try {
        await axiosInstance.delete(url + "student/" + studentId);
        console.log('deleted data');
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByDateExpectedAndStudentIdAndPaymentNumber(url: string, dateExpected: string, studentId: number, paymentNumber: number) {
    try {
        const response = await axiosInstance.get(url + "date", {
            params: {
                dateExpected: dateExpected,
                studentId: studentId.toString(),
                paymentNumber: paymentNumber.toString()
            }
        })
        return response.data || [];
    } catch (error) {
        console.error('Error:', error)
        return [];
    }
}

export async function getFirstAbsentWithinThirtyDays(url: string) {
    try {
        const response = await axiosInstance.get(url + "absent")
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}