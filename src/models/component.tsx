import { pos } from "./pos"

export interface component {
	type: string,
	init_pos: pos,
	inputs: input[]
}

export interface input {
	id: keyof {}
}