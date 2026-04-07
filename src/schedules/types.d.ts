import { LatLng } from "@/types/position";

export type Place = {
    id: string; // internal
    name: string;
    position: LatLng|null;
}
export type Time = {
    id: string; // internal
    hour: number;
    minute: number;
}
export type Schedule = {
    id: string; // internal
    days: number[] | null;
    places: Place[];
    times: Time[][];
}
export type SchedulesFile = {
    id: string; // internal
    formatVersion: number;
    line: string;
    schedules: Schedule[];
}