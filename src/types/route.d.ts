import { Direction } from "./directions";

export type LatLng={
	lat: number;
	lng: number;
}
export type Route={
	id: string;
	lineID: string;
	direction: Direction;
	path: LatLng[];
	group: string|null;
}
export type RoutesFile={
	formatVersion:number;
	routesVersion:number;
	routes:Route[];
}