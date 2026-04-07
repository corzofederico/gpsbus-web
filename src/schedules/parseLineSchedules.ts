import { v4 as uuidV4 } from "uuid";
import type { Time } from "./types";

export function generateTime(
    hour: number = Number.NaN,
    minute: number = Number.NaN
):Time{
    return {
        id: uuidV4(),
        hour,
        minute
    }
}
function schedulesNull($td: HTMLElement):null[]{
    const content = $td.getAttribute("colspan")?.trim()
    const cols = parseInt(content??"")
    if(Number.isSafeInteger(cols)) return Array(cols).fill(()=> generateTime());
    return [null]
}
export function checkTimeHour<T extends number|null>(hour:T|null,def:T):T{
    if(hour===null || !Number.isSafeInteger(hour)) return def
    if(hour>=0 && hour<24) return hour
    return def
}
export function checkTimeMinutes<T extends number|null>(minutes:T|null,def:T):T{
    if(minutes===null || !Number.isFinite(minutes)) return def
    if(minutes>=0 && minutes<60) return minutes
    return def
}
// @ts-expect-error
function parseTime($td: HTMLElement):Time[]{
    const text = $td.innerText
    if(!Boolean(text)) return schedulesNull($td).map(()=> generateTime())

    const timeList = text.split(":").map(num=> parseInt(num)).filter(Number.isSafeInteger)
    const hour = checkTimeHour(timeList.at(0) ?? null, null)
    const minute = checkTimeMinutes(timeList.at(1) ?? null, null)
    if(hour===null || minute===null) return schedulesNull($td).map(()=> generateTime());
    
    const time = generateTime(hour,minute)
    return [time]
}

