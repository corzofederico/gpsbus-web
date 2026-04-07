import type { Line } from "../types/line"

export const lines:Line[] = [
    { id: "3", name: "319" },
    { id: "4", name: "500" },
    { id: "34", name: "502" },
    { id: "6", name: "503" },
    { id: "39", name: "503 (UNS Palihue a centro)" },
    { id: "uns", name: "Colectivo UNS" },
    { id: "7", name: "504" },
    { id: "8", name: "505" },
    { id: "9", name: "506" },
    { id: "10", name: "507" },
    { id: "1", name: "509" },
    { id: "11", name: "512" },
    { id: "12", name: "513" },
    { id: "13", name: "513 EX" },
    { id: "14", name: "514" },
    { id: "15", name: "516" },
    { id: "16", name: "517" },
    { id: "17", name: "518" },
    { id: "18", name: "519" },
    { id: "19", name: "519 A" },
    { id: "30", name: "520" },
    { id: "40", name: "520 Aeropuerto" },
    { id: "37", name: "521 Bosque Alto" },
    { id: "38", name: "521 Carrindanga" },
]
export const linesID = lines.map(line=> line.id)