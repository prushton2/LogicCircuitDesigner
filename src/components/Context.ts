import { createContext } from 'react';
import { component } from '../models/component';

export const ComponentRefContext =  createContext<ComponentRefContent>({refs: [], setRefs: () => {}} as ComponentRefContent);
export const ConfigContext =  createContext<ConfigContent>({config: {}, setConfig: () => {}} as ConfigContent);
export const ComponentContext =  createContext<ComponentContent>({components: [], setComponents: () => {}} as ComponentContent);
export const ComponentDataContext =  createContext<ComponentDataContent>({componentData: [], setComponentData: () => {}} as ComponentDataContent);

export type ComponentRefContent = {
	refs: object,
	setRefs:(wires: object) => void
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