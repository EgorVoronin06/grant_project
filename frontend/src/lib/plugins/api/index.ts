export class ApiError extends Error {
	status: number;
	body: ErrorObject;

	constructor(status: number, body: ErrorObject) {
		super(body.message);
		this.status = status;
		this.body = body;
	}
}

interface ErrorObject {
	message: string;
	// errors: Record<string, string[]>;
	errors: {
		[key: string]: string[];
	};
}
