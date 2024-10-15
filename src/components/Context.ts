import { createContext } from 'react';
import { component } from '../models/component';

export const WireContext =  createContext<WireContent>({wires: [], setWires: () => {}} as WireContent);
export const ConfigContext =  createContext<ConfigContent>({config: {}, setConfig: () => {}} as ConfigContent);
export const ComponentContext =  createContext<ComponentContent>({components: [], setComponents: () => {}} as ComponentContent);
export const ComponentDataContext =  createContext<ComponentDataContent>({componentData: [], setComponentData: () => {}} as ComponentDataContent);

export type WireContent = {
	wires: object,
	setWires:(wires: object) => void
}

export type ConfigContent = {
	config: object,
	setConfig: (config: object) => void
}

export type ComponentContent = {
	components: object,
	setComponents: (components: component[]) => void
}


export type ComponentDataContent = {
	componentData: object,
	setComponentData: (config: object) => void
}