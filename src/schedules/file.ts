"use client";

import { checkTimeHour, checkTimeMinutes, generateTime } from "./parseLineSchedules";
import type { Place, Schedule, SchedulesFile, Time } from "./types";
import { notNull } from "../utils/arrays";
import { formatToLatLng } from "../utils/format/position";
import { v4 as uuidV4 } from "uuid";


export function parseTime(data:any):Time{
    let hour = Number.NaN
    if(typeof data?.hour=="number" && Number.isFinite(data?.hour)){
        hour = data.hour
    }
    
    let minute=Number.NaN
    if(typeof data?.minute=="number" && Number.isFinite(data?.minute)){
        minute = data.minute
    }

    return generateTime(hour,minute)
}
export function formatPlace(data:any):Place|null{
    if(!data) return null

    const name = data.name
    if(!name || typeof name!="string") return null

    const position = formatToLatLng(data.position)

    return {
        id: uuidV4(),
        name,
        position
    }
}
export function formatAsArray<T>(data: unknown, transform: ((item: any)=>T) = (item => item)):T[]|null{
    if(!data || !Array.isArray(data)) return null
    return data.map(transform)
}
function formatDays(data:any):number[]|null{
    const list = formatAsArray(data, day => parseInt(day))
    if(!list) return null
    
    const days = list.filter(Number.isSafeInteger).filter(day=> day>=0 && day<7)
    if(days.length==0) return null
    return days
}
export function formatSchedule(data:any):Schedule|null{
    if(!data) return null

    const days = formatDays(data.days)
    
    const places = formatAsArray(data.places, formatPlace)?.filter(notNull)
    if(!places) return null
    
    const times = formatAsArray(data.times, times=> formatAsArray(times, parseTime))?.filter(notNull)
    if(!times) return null

    return {
        id: uuidV4(),
        days,
        places,
        times
    }
}
export function formatSchedules(data:any):SchedulesFile|null{
    if(!data) return null

    const formatVersion = data["format-version"]
    if(!formatVersion || !Number.isSafeInteger(formatVersion)) return null

    const line = data.lineID
    if(!line || typeof line!="string") return null

    const schedules = formatAsArray(data.schedules, formatSchedule)?.filter(notNull)
    if(!schedules) return null

    return {
        id: uuidV4(),
        line,
        formatVersion,
        schedules,
    }
}





// RAW

export function timeToRaw(time:Time):Object|null{
    const hour = checkTimeHour(time.hour, null)
    const minute = checkTimeMinutes(time.minute, null)
    if(hour==null || minute==null) return null;

    return {
        hour,
        minute
    }
}
function placeToRaw(place: Place):Object{
    return {
        name: place.name,
        position: place.position
    }
}
function scheduleToRaw(schedule:Schedule):Object{
    return {
        places: schedule.places.map(placeToRaw),
        days: schedule.days,
        times: schedule.times.map(l=> l.map(timeToRaw))
    }
}
export function schedulesFileToRaw(file:SchedulesFile):Object{
    return {
        "format-version": file.formatVersion,
        schedules: file.schedules.map(scheduleToRaw),
        lineID: file.line
    }
}