export interface component {
	type: string,
	init_x: number,
	init_y: number,
	inputs: input[]
}

export interface input {
	id: number
}