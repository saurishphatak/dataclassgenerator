export abstract class ActionResult {
	public constructor(
		public result: any,
		public message = "",
		public code: number
	) { }
}

export class ActionSuccess extends ActionResult {
	public constructor(
		public result: any,
		public message = "Success",
		public code = 1
	) {
		super(result, message, code);
	}
}

export class ActionFailure extends ActionResult {
	public constructor(
		public result: any,
		public message = "Failure",
		public code = -1
	) {
		super(result, message, code);
	}
}