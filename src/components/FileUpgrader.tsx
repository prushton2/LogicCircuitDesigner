import { useEffect, useState } from "react";

const latestVersion = "0.0.2"

export function upgrade(file: string) {
	let parsed = JSON.parse(file);
	if(parsed.version === latestVersion) {
		return file;
	}

	if(parsed.version === "0.0.1" || parsed.version === undefined) {
		let newWires = parsed.wires;
		for(let i in parsed.wires) {
			newWires[i] = JSON.stringify(parsed.wires[i]).replaceAll("[", "").replaceAll("]", "").replaceAll(",", "").replaceAll("null", "").replaceAll("false", "0").replaceAll("true", "1")
		}
		parsed.wires = newWires;
		parsed.version = "0.0.2"
	}
	return JSON.stringify(parsed);
}