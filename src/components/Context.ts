import { createContext } from 'react';

export const WireContext =  createContext<WireContent>({wires: [], setWires: () => {}} as WireContent);
export const ConfigContext =  createContext<ConfigContent>({config: {}, setConfig: () => {}} as ConfigContent);

export type WireContent = {
	wires: object,
	setWires:(wires: object) => void
}

export type ConfigContent = {
	config: object,
	setConfig: (config: object) => void
}