import {GetHTTP, PostHTTP, PutHTTP, DeleteHTTP} from "@/restAPI/httpRequests";

const httpGet = new GetHTTP()
const httpPost = new PostHTTP()
const httpPut = new PutHTTP()
const httpDelete = new DeleteHTTP()

export async function getAll(url: string) {
    try {
        const data = await httpGet.get(url);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getById(url: string, id: number) {
    try {
        const data = await httpGet.get(url + id);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function add(url: string, data: any) {
    try {
        await httpPost.post(url, data);
        console.log('added data');
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function edit(url: string, data: any) {
    try {
        await httpPut.put(url, data);
        console.log('updated data');
    } catch (error) {			
        console.error('Error:', error);
    }
}

export async function deleteById(url: string, id: number) {
    try {
        await httpDelete.delete(url + id);
        console.log('deleted data');
    } catch (error) {
        console.error('Error:', error);
    }		
}

export async function getByDay(url: string, day: string) {
    try {
        const data = await httpGet.get(url + "day/" + day);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByDayAndExpectedTimeEnding(url: string, day: string, substring: string) {
    try {
        const data = await httpGet.get(url + "day-string/" + day + "/" + substring);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByStudentIdAndPaymentNumber(url: string, studentId: number, paymentNumber: number) {
    try {
        const data = await httpGet.get(url + "student/" + studentId + "/" + paymentNumber);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByPaymentNumberAndStudentIdAndClassNumber(url: string, paymentNumber: number, studentId: number, classNumber: number) {
    try {
        const data = await httpGet.get(url + "class/" + paymentNumber + "/" + studentId + "/" + classNumber)
        return data
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function deleteByStudentId(url: string, studentId: number) {
    try {
        await httpDelete.delete(url + "student/" + studentId);
        console.log('deleted data');
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByDateExpectedAndStudentIdAndPaymentNumber(url: string, dateExpected: string, studentId: number, paymentNumber: number) {
    try {
        const params = new URLSearchParams({
            dateExpected: dateExpected,
            studentId: studentId.toString(),
            paymentNumber: paymentNumber.toString()
        });
        
        const data = await httpGet.get(url + "date?" + params.toString())
        return data
    } catch (error) {
        console.error('Error:', error)
    }
}

export async function getFirstAbsentWithinThirtyDays(url: string) {
    try {
        const data = await httpGet.get(url + "absent")
        return data
    } catch (error) {
        console.error('Error:', error);
    }
}