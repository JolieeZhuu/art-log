import {GetHTTP, PostHTTP, PutHTTP, DeleteHTTP} from "@/restAPI/httpRequests";

export class Controller {
    
    httpGet: GetHTTP;
    httpPost: PostHTTP;
    httpPut: PutHTTP;
    httpDelete: DeleteHTTP;

    constructor() {
        this.httpGet = new GetHTTP();
        this.httpPost = new PostHTTP();
        this.httpPut = new PutHTTP();
        this.httpDelete = new DeleteHTTP();
    }
    
	async getAll(url: string) {
		try {
			const data = await this.httpGet.get(url);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
	async getById(url: string, id: number) {
		try {
			const data = await this.httpGet.get(url + id);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
	async add(url: string, data: any) {
		try {
			await this.httpPost.post(url, data);
			console.log('added data');
		} catch (error) {
			console.error('Error:', error);
		}
	}
	async edit(url: string, data: any) {
		try {
			await this.httpPut.put(url, data);
			console.log('updated data');
		} catch (error) {			
			console.error('Error:', error);
		}
	}
	async deleteById(url: string, id: number) {
		try {
			await this.httpDelete.delete(url + id);
			console.log('deleted data');
		} catch (error) {
			console.error('Error:', error);
		}		
	}
}

export class StudentController extends Controller {
    async getByDay(url: string, day: string) {
		try {
			const data = await this.httpGet.get(url + "day/" + day);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async getByDayAndExpectedTimeEnding(url: string, day: string, substring: string) {
		try {
			const data = await this.httpGet.get(url + "day-string/" + day + "/" + substring);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
}


export class AttendanceController extends Controller {
    async getByStudentIdAndPaymentNumber(url: string, studentId: number, paymentNumber: number) {
		try {
			const data = await this.httpGet.get(url + "student/" + studentId + "/" + paymentNumber);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}

    async getByPaymentNumberAndStudentIdAndClassNumber(url: string, paymentNumber: number, studentId: number, classNumber: number) {
        try {
            const data = await this.httpGet.get(url + "class/" + paymentNumber + "/" + studentId + "/" + classNumber)
            return data
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async deleteByStudentId(url: string, studentId: number) {
        try {
            await this.httpDelete.delete(url + "student/" + studentId);
			console.log('deleted data');
        } catch (error) {
			console.error('Error:', error);
		}
    }

    async getByDateExpectedAndStudentIdAndPaymentNumber(url: string, dateExpected: string, studentId: number, paymentNumber: number) {
        try {
            const params = new URLSearchParams({
                dateExpected: dateExpected,
                studentId: studentId.toString(),
                paymentNumber: paymentNumber.toString()
            });
            
            const data = await this.httpGet.get(url + "date?" + params.toString())
            return data
        } catch (error) {
            console.error('Error:', error)
        }
    }

    async getFirstAbsentWithinThirtyDays(url: string) {
        try {
            const data = await this.httpGet.get(url + "absent")
            return data
        } catch (error) {
            console.error('Error:', error);
        }
    }
}