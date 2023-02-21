import React, { useEffect, useState } from "react";

import { wire } from "../models/wire";
import { pos } from "../models/pos";

const Gate = ({A, B, Y, comp, label}: {A: wire, B: wire, Y: (Y: boolean) => void, comp: (A: boolean, B: boolean) => boolean, label: string}) => {
	
	const [pos, setPos] = useState({x: 0, y: 0} as pos);
	const [following, setFollowing] = useState(false);

	
		
	useEffect(() => {
		console.log("change");
		Y(comp(A.value, B.value));
	}, [A, B])


	function FollowMouse(e: any) {
		if(following) {
			setPos({x: e.pageX - 45, y: e.pageY - 45} as pos);
		}	
	}
	
	return (
		<div style={{position: "absolute", top: `${pos.y}px`, left: `${pos.x}px`, width: "90px", height: "90px", border: "1px solid red"}}
			onMouseDown={() => {setFollowing(true)}}
			onMouseUp={() => {setFollowing(false)}}
			onMouseMove={(e) => {FollowMouse(e)}}>
			
			{label} GATE <br />
			A: {A.value ? "1":"0"}<br /> B: {B.value ? "1":"0"} <br/> O: {comp(A.value, B.value) ? "1":"0"}

		</div>
	)
}

export function AND({A, B, Y}: {A: wire, B: wire, Y: (Y: boolean) => void}) {
	return <Gate A={A} B={B} Y={(o) => {Y(o)}} comp={(A, B) => { return A && B; }} label={"AND"}/>
}

export function OR({A, B, Y}: {A: wire, B: wire, Y: (Y: boolean) => void}) {
	return <Gate A={A} B={B} Y={(o) => {Y(o)}} comp={(A, B) => { return A || B; }} label={"OR"}/>
}