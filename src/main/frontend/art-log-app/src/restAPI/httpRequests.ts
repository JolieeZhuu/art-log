// GET REQUEST -------------------------------------------------------
export class GetHTTP {
	async get(url: string) {
		const response = await fetch(url, {
			method: 'GET'
		});
		const resData = await response.json(); // awaits response.json()
		return resData;
	}
}

// POST REQUEST ------------------------------------------------------
export class PostHTTP {
	// HTTP POST Request
	
	async post(url: string, data: any) {
		
		// fetch request containing information for
		// method, header, content-type, and body
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		
		const resData = await response.json(); // awaits response.json()
		return resData;
	}
}

// PUT REQUEST -------------------------------------------------------
export class PutHTTP {
	// HTTP PUT Request
	
	async put(url: string, data: any) {
		
		// fetch request containing information for
		// method, header, content-type, and body
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		
		const resData = await response.json(); // awaits response.json()
		return resData;
	}
}

// DELETE REQUEST ----------------------------------------------------
export class DeleteHTTP { 
  
    // HTTP DELETE Request
    async delete(url: string) { 
  
		// fetch request containing information for
		// method, header, content-type, and body
        await fetch(url, { 
            method: 'DELETE', 
            headers: { 
                'Content-type': 'application/json'
            } 
        }); 

        const resData = 'resource deleted';  // awaits response.json()  
        return resData; 
    } 
}