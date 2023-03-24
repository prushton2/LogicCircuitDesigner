import { pos } from "./pos"

export interface component {
	type: string,
	init_pos: pos,
	inputs: connection[],
	outputs: connection[]
}

export interface connection {
	id: keyof {}
}