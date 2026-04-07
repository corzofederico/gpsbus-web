import { getDirectionOrNull } from "../../types/directions"
import { getStringOrNull } from "../strings"
import { notNull } from "../arrays"
import type { Route, RoutesFile } from "../../types/route"
import { formatToLatLng } from "./position"

export function formatRoute(data:any):Route|null{
	if(!data) return null
	
	const id = getStringOrNull(data["id"])
	if(!id) return null
	
	const lineID = getStringOrNull(data["lineID"])
	if(!lineID) return null

	const direction = getDirectionOrNull(data.direction)
	if(!direction) return null

	const path = Array.from(data["path"]).map(formatToLatLng).filter(notNull)
	if(!path) return null

	return {
		id,
		lineID,
		direction,
		path,
		group: getStringOrNull(data["group"])
	}
}
export function routesFileToString(file:RoutesFile):string{
    const rawFile = {
        routes: file.routes.map(route=> ({ ...route, direction: route.direction.id })),
        "routes-version": file.routesVersion,
        "format-version": file.formatVersion,
    }

    return JSON.stringify(rawFile)
}