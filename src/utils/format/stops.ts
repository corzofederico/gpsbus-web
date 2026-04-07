import type { StopsFile } from "../../types/stops.d";
import { isNumber } from "../numbers";
import { notNull } from "../arrays";
import { v4 as uuid } from "uuid";

export function stopsFileToString(stopsFile:StopsFile):string{
    return JSON.stringify({
        "completed-routes": stopsFile.completedRoutes,
        "format-version": stopsFile.formatVersion,
        "stops-version": stopsFile.stopsVersion,
        stops: stopsFile.stops.map(stop=> ({ position: stop.position, routes: stop.routes })),
    })
}
export function formatStopsFile(content:string):StopsFile|null{
    const data = JSON.parse(content)

    const formatVersion = data["format-version"]
    if(formatVersion==null || !isNumber(formatVersion)) return null

    const stopsVersion = data["stops-version"]
    
    if(stopsVersion==null || !isNumber(stopsVersion)) return null

    const rawStops=data["stops"]
    if(rawStops==null || !Array.isArray(rawStops)) return null
    const stops = rawStops.map(stop => {
        const position = stop["position"]
        if(!position.lat || !position.lng) return null

        const rawRoutes=stop["routes"]
        if(!Array.isArray(rawRoutes)) return null
        const routes = rawRoutes.map(id => (typeof id=="string")?id:null).filter(notNull)

        return { id: uuid(), position, routes }
    }).filter(notNull)
    
    const completedRoutes = data["completed-routes"]
    if(completedRoutes==null || typeof completedRoutes !== 'object' || !Array.isArray(completedRoutes)) return null
    // if(!Object.values(completedRoutes).every(line=> line instanceof Boolean)) return null

    return {
        id: Symbol(),
        formatVersion,
        stopsVersion,
        stops,
        completedRoutes
    }
}