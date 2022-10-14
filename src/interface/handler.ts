export interface HandlerFn {
	(req: Request): Promise<Response>
}

export interface Handler {
	handlers: [string, HandlerFn][]
}