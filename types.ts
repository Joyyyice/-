export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Particle {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
  offset: number;
}
