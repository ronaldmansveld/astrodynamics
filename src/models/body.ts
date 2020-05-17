import { Orbit } from './orbit';

export interface Body {
  name: string;
  r: number;
  mu: number;
  m: number;
  rot: number;
  rot_e: number;
  tl: boolean;
  atm: number;
  atm_p?: number;
  orbit?: Orbit;
}
