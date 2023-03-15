import { useEffect, useState } from "react";


export const latestVersion = "0.0.5"


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

	if(parsed.version === "0.0.2") {
		let newWires = JSON.parse("{}")
		let newComponents = parsed.components
		for(let i in parsed.wires) {
			newWires[`${i}.Y`] = parsed.wires[i]
		}

		for(let i in parsed.components) {
			for(let j in parsed.components[i].inputs) {
				try {
					newComponents[i].inputs[j].id = parsed.components[i].inputs[j].id + ".Y";
				} catch {}
			}
		}

		parsed.components = newComponents;
		parsed.wires = newWires;
		parsed.version = "0.0.3"
	}

	if(parsed.version === "0.0.3") {
		parsed.componentData = parsed.components.map(() => {return {}})
		parsed.version = "0.0.4"
	}

	if(parsed.version === "0.0.4") {

		let newWires = JSON.parse("{}");
		let newComponents = parsed.components;

		for(let i in parsed.wires) {
			newWires[`${i.split(".")[0]}.-${i.split(".")[1]}`] = parsed.wires[i];
		}

		for(let i in parsed.components) {
			for(let j in parsed.components[i].inputs) {
				if(newComponents[i].inputs[j] === null) {continue;}
				let split = newComponents[i].inputs[j].id.split(".")
				newComponents[i].inputs[j].id = `${split[0]}.-${split[1]}`
			}
		}

		parsed.wires = newWires;
		parsed.components = newComponents;
		parsed.version = "0.0.5";
	}
  
	return JSON.stringify(parsed);
}