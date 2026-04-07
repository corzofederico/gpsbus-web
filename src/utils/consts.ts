import type { LatLng } from "../types/route";

export const PlayStoreLink = "https://play.google.com/store/apps/details?id=app.facts.gpsbus"

export const days:Record<number,string> = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miercoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sabado"
}

export const mapCenter: LatLng = { lat: -38.7184694, lng: -62.2670398 };
export const apiKey = "AIzaSyATBOgTXdpTeqdYt7S7k4TY6QuAnJyYN9o"; // API 5 // activar localhost en google cloud console para que funcione en desarrollo
export enum StopsConfig {
    ShowAll = "ShowAll",
    OnlyOnZoom = "OnlyOnZoom"
} 
export const defaultMinZoomVisibleStops = 15.5;