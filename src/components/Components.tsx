import { useContext, useEffect, useState } from "react";
import { WireContext, ConfigContext } from "./Context";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";

export function BUS({id,A,B,C,D,E,F,G,H,onClick}: {id: string, A: number, B: number, C: number, D: number, E: number, F: number, G: number, H: number, onClick: (id: string) => void}) {

	const {wires, setWires} = useContext(WireContext);
	const {config, setConfig} = useContext(ConfigContext);

	const [display, setDisplay] = useState("inline"); //for hiding the gate configuration

	const updateXarrow = useXarrow();

	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	useEffect(() => {
		let bus;
		try {
			bus = [wires[A][0], wires[B][0], wires[C][0], wires[D][0], wires[E][0], wires[F][0], wires[G][0], wires[H][0]]
		} catch {
			return;
		}
		
		if(JSON.stringify(wires[id as keyof []]) === JSON.stringify(bus)) {
			return;
		}

		let newWires = structuredClone(wires)
		newWires[id as keyof []] = bus;
		setWires(newWires);
	}, [wires])

	useEffect(() => {
		setDisplay(!config["hideDetails" as keyof object] ? "inline": "none");
	}, [config])

	return (
		<div>
			<Draggable grid={[5,5]} onDrag={updateXarrow} onStop={updateXarrow}>
				<div style={{width: "90px", height: "400px", border: "1px solid white"}}>
					<div id={`${id}.A`} style={{left: "0%", top: "25px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.A`)} style={{marginLeft: "1.3em", display: display}}>A</button><br /> 
					</div>
					<div id={`${id}.B`} style={{left: "0%", top: "75px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.B`)} style={{marginLeft: "1.3em", display: display}}>B</button><br /> 
					</div>
					<div id={`${id}.C`} style={{left: "0%", top: "125px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.C`)} style={{marginLeft: "1.3em", display: display}}>C</button><br /> 
					</div>
					<div id={`${id}.D`} style={{left: "0%", top: "175px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.D`)} style={{marginLeft: "1.3em", display: display}}>D</button><br /> 
					</div>
					<div id={`${id}.E`} style={{left: "0%", top: "225px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.E`)} style={{marginLeft: "1.3em", display: display}}>E</button><br /> 
					</div>
					<div id={`${id}.F`} style={{left: "0%", top: "275px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.F`)} style={{marginLeft: "1.3em", display: display}}>F</button><br /> 
					</div>
					<div id={`${id}.G`} style={{left: "0%", top: "325px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.G`)} style={{marginLeft: "1.3em", display: display}}>G</button><br /> 
					</div>
					<div id={`${id}.H`} style={{left: "0%", top: "375px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.H`)} style={{marginLeft: "1.3em", display: display}}>H</button><br /> 
					</div>

					<div id={`${id}.Y`} style={{right: "0%", top: "200px", position: "absolute", transform: "translate(0%, -50%)"}}>
						<button onClick={(e) => onClick(`${id}.Y`)} style={{marginRight: "1.3em", display: display}}>Y</button>
					</div>

				</div>
			</Draggable>
		</div>
	);
}

