import { useEffect, useState } from "react";

import { wire } from "../models/wire";

import { AND } from "./gate"

function Render() {
	
	const [wo, swo] = useState({"value": 0} as wire);

	let wa = {"value": 1} as wire;
	let wb = {"value": 1} as wire;

	useEffect(() => {
		console.log(wo);
	}, [wo]);

	return (
		<a>
			<AND A={wa} B={wb} Y={(Y) => {swo({"value": Y} as wire); }}/>
		</a>
	)
}

export default Render;