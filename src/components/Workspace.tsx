import { useEffect, useState } from "react";

import { wire } from "../models/wire";

import { AND, OR } from "./gate"

function Render() {
	
	const [wo, swo] = useState({"value": false} as wire);
	const [wo2, swo2] = useState({"value": false} as wire);

	let wa = {"value": true} as wire;
	let wb = {"value": false} as wire;

	useEffect(() => {
		console.log(wo);
	}, [wo]);

	return (
		<a>
			<AND A={wa} B={wb} Y={(Y) => {swo({"value": Y} as wire); }}/>
			<OR  A={wa} B={wb} Y={(Y) => {swo2({"value": Y} as wire); }}/>
		</a>
	)
}

export default Render;