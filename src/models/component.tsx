import { connection } from "./connection"
import { pos } from "./pos"

export interface component {
	type: string,
	init_pos: pos,
	inputs: connection[]
}