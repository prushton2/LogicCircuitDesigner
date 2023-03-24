import "./Workspace.css"

import { useEffect, useState, useRef } from "react";
import { ComponentRefContext, ComponentRefContent, ConfigContext, ConfigContent, ComponentDataContent, ComponentDataContext, ComponentContext, ComponentContent } from "./Context";

import { Xwrapper } from "react-xarrows";

import MouseFollower from "./MouseFollower";
import WireRenderer from "./WireRenderer";
import { latestVersion, upgrade } from "./FileUpgrader"

import { component } from "../models/component";
import ComponentRenderer from "./ComponentRenderer";
import { pos } from "../models/pos";

function Workspace() {

	let componentRendererRef = useRef<any>(null);
	let wireRendererRef = useRef<any>(null);
	
	const [config, setConfig] = useState({"hideDetails": false, "hideWireStates": false, "selectedComponent": -1});

	const [wires, setWires] = useState(JSON.parse("{}"));
	const [components, setComponents] = useState<component[]>([]);
	const [componentData, setComponentData] = useState([]);
	const [selectedComponentHTML, setSelectedComponentHTML] = useState(<label>Right click a component to select</label>)

	useEffect(() => {
		setSelectedComponentHTML(
			config["selectedComponent"] === -1 ? 
			<label>Right click a component to select</label>
			: 
			<a>
				{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}
				{components[config["selectedComponent"]].type}{'\u00A0'}
				(ID {config["selectedComponent"]}){'\u00A0'}
				<button className="interactBtn" style={{width: "fit-content"}} onClick={(e) => {componentRendererRef.current?.remove(config["selectedComponent"])}     }>Delete</button>{'\u00A0'}
				<button className="interactBtn" style={{width: "fit-content"}} onClick={(e) => {componentRendererRef.current?.clearInputs(config["selectedComponent"])}}>Clear Inputs</button>{'\u00A0'}
			</a>
		)
	}, [config])

	function setPos(pos: pos, id: string) {
		let newComponents = structuredClone(components);
		newComponents[parseInt(id)].init_pos = structuredClone(pos);
		setComponents(newComponents);
	}

	useEffect(() => { //for escaping wire placement
		const handleKeyDown = (event: KeyboardEvent) => {		
			if (event.key === 'Escape') {
				let newConfig = structuredClone(config);
				newConfig["selectedComponent"] = -1;
				setConfig(newConfig);
				console.log(componentRendererRef);
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => { document.removeEventListener('keydown', handleKeyDown); };
	}, [])

	function toggleConfig(param: string) {
		let newConfig = structuredClone(config);
		newConfig[param] = !newConfig[param];
		setConfig(newConfig);
	}

	function save() {
		let fileContent = JSON.stringify({
			version: latestVersion,
			components: components,
			wires: wires,
			componentData: componentData
		})

		const blob = new Blob([fileContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.download = "circuit.lcf";
		link.href = url;

		link.click();
	}
	
	function loadLCF(lcf: string) {
		let parsedFile = JSON.parse(upgrade(lcf));
		let comps, wrs, compData;
		try {
			comps = parsedFile.components;
			compData = parsedFile.componentData;
			wrs = parsedFile.wires;
		} catch {
			return;
		}

		let newComponents = comps as component[];

		let newComponentData = compData as [];

		let newWires = wrs;
		setComponents(newComponents);
		setComponentData(newComponentData);
		setWires(newWires);
		setTimeout(() => {
			wireRendererRef.current?.resetWires();
		}, 100);
	}

	function handleFile(e: any) {
		e.preventDefault();
		const reader = new FileReader();
		reader.onload = async (e: any) => { 
			const text = (e.target.result);
			loadLCF(text);
		};
		reader.readAsText(e.target.files[0]);
	}


	return (
	<div>
		<table>
		<tbody>
			<tr>
				<td>Save</td>
				<td><button className="interactBtn" onClick={(e) => {save()}}>Save</button></td>
				<td>
					<label htmlFor="contained-button-file">
						<input type="file" id="contained-button-file" onChange={(e) => {handleFile(e)}} hidden/>
						<button className="interactBtn" onClick={(e) => {document.getElementById("contained-button-file")?.click()}}>Upload</button>
					</label>
				</td>
				<td><button className="interactBtn" onClick={(e) => {
					setComponents([]);
					setWires(JSON.parse("{}"));
					setTimeout(() => {
						setComponentData([]);
					}, 500)
					}}>Clear</button></td>
			</tr>
			<tr>
				<td>I/O</td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("SW")}}>SW</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("SWBUS")}}>SW [7:0]</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("LED")}}>LED</button></td>
			</tr>
			<tr>
				<td>Gates</td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("AND")}}>AND</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("OR")}}>OR</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("XOR")}}>XOR</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("NAND")}}>NAND</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("NOR")}}>NOR</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("XNOR")}}>XNOR</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("NOT")}}>NOT</button></td>
			</tr>
			<tr>
				<td>Busses</td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("BUS")}}>BUS</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("MUX")}}>MUX</button></td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("ADDER")}}>ADDER</button></td>
			</tr>
			<tr>
				<td />
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("SPLITTER")}}>SPLITTER</button></td>
			</tr>
			<tr>
				<td>Memory</td>
				<td><button className="interactBtn" onClick={(e) => {componentRendererRef.current?.create("REG")}}>REG</button></td>

			</tr>
			<tr>
				<td>Config</td>
				<td><button className="interactBtn" onClick={(e) => {toggleConfig("hideDetails")}}>Details</button></td>
				<td><button className="interactBtn" onClick={(e) => {toggleConfig("hideWireStates")}}>Wires</button></td>
				<td><button className="interactBtn" onClick={(e) => {wireRendererRef.current?.resetWires()}}>Fix Wires</button></td>
			</tr>
		</tbody>
		</table>

		<div style={{position: "absolute", top: "0px", left: "25em"}}>
			{selectedComponentHTML}
		</div>
		

		<Xwrapper>
			<ConfigContext.Provider value={{config, setConfig} as ConfigContent}>
			<ComponentRefContext.Provider value={{refs: wires, setRefs: setWires} as ComponentRefContent}>
			<ComponentDataContext.Provider value={{componentData, setComponentData} as ComponentDataContent}>
			<ComponentContext.Provider value={{components, setComponents} as ComponentContent}>

				<WireRenderer ref={wireRendererRef}/>
				<ComponentRenderer ref={componentRendererRef} connect={(side, id) => wireRendererRef.current?.connect(side, id)} setPos={(pos, id) => {setPos(pos, id)}}/>
				<MouseFollower />

			</ComponentContext.Provider>
			</ComponentDataContext.Provider>
			</ComponentRefContext.Provider>
			</ConfigContext.Provider>
		</Xwrapper>
	</div> )
}

export default Workspace;