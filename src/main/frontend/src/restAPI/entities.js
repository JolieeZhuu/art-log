import {GetHTTP, PostHTTP, PutHTTP, DeleteHTTP} from "./httpRequests.js";

export class Controller {
    constructor() {
        this.httpGet = new GetHTTP();
        this.httpPost = new PostHTTP();
        this.httpPut = new PutHTTP();
        this.httpDelete = new DeleteHTTP();
    }
	async getAll(url) {
		try {
			const data = await this.httpGet.get(url);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
	async getById(url, id) {
		try {
			const data = await this.httpGet.get(url + id);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
	async add(url, data) {
		try {
			await this.httpPost.post(url, data);
			console.log('added data');
		} catch (error) {
			console.error('Error:', error);
		}
	}
	async edit(url, data) {
		try {
			await this.httpPut.put(url, data);
			console.log('updated data');
		} catch (error) {			
			console.error('Error:', error);
		}
	}
	async deleteById(url, id) {
		try {
			await this.httpDelete.delete(url + id);
			console.log('deleted data');
		} catch (error) {
			console.error('Error:', error);
		}		
	}
}

export class StudentController extends Controller {
    async getByDay(url, day) {
		try {
			const data = await this.httpGet.get(url + "day/" + day);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async getByDayAndExpectedTimeEnding(url, day, substring) {
		try {
			const data = await this.httpGet.get(url + "day-string/" + day + "/" + substring);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
}


export class AttendanceController extends Controller {
    async getByStudentIdAndPaymentNumber(url, studentId, paymentNumber) {
		try {
			const data = await this.httpGet.get(url + "student/" + studentId + "/" + paymentNumber);
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}
}