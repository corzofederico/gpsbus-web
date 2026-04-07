import { LatLng } from "./route";

export type Stop = {
    id: string;
    position:LatLng;
    routes:string[];
}
export type StopsFile = {
    id: Symbol;
    formatVersion: number; // 1
    stopsVersion: number; // 1
    stops:Stop[];
    completedRoutes:string[];// {[route.id]: [completed], ...}
}