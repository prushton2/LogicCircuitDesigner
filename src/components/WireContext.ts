import { createContext } from 'react';

export const WireContext =  createContext<WireContent>({wires: [], setWires: () => {}} as WireContent);

export type WireContent = {
	wires: boolean[],
	setWires:(wires: boolean[]) => void
  }