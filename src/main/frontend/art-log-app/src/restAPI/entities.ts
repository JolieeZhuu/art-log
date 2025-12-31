import axiosInstance from "../axiosConfig";

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

// Student controller methods
export async function getByDay(url: string, day: string) {
    try {
        const response = await axiosInstance.get(url + "day/" + day);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
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

// Attendance controller methods
export async function getByStudentIdAndTermId(url: string, studentId: number, currTermId: number) {
    try {
        const response = await axiosInstance.get(url + "student/" + studentId + "/" + currTermId);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getByTermIdAndStudentIdAndClassNumber(url: string, currTermId: number, studentId: number, classNumber: number) { 
    try {
        const response = await axiosInstance.get(url + "class/" + currTermId + "/" + studentId + "/" + classNumber);
        return response.data;
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

export async function getByDateExpectedAndStudentIdAndTermId(url: string, dateExpected: string, studentId: number, termId: number) {
    try {
        const response = await axiosInstance.get(url + "date", {
            params: {
                dateExpected: dateExpected,
                studentId: studentId.toString(),
                paymentNumber: termId.toString()
            }
        });
        return response.data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getFirstAbsentWithinThirtyDays(url: string) {
    try {
        const response = await axiosInstance.get(url + "absent");
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Term controller methods
export async function getTermTableByStudentIdAndTableNum(url: string, studentId: number, tableNum: number) {
    try {
        const response = await axiosInstance.get(url + studentId + "/" + tableNum);
        return response.data;
    } catch (error) {
        console.log('Error:', error);
    }
}