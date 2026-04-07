import type { RoutesVersions, StopsVersions } from "../../types/versions"
import { isNumber } from "../numbers"

export function parseRoutesVersions(content:string):RoutesVersions|null{
	const data = JSON.parse(content)
	if(!data || data !instanceof Map || Array.isArray(data)) return null

	return new Map(Object.entries(data))
}
export function parseStopsVersions(content:string):StopsVersions|null{
	const data=JSON.parse(content)
	if(!data) return null
	
	const formatVersions = Array.from(data["format-versions"]).filter(isNumber)

	const lastFormatVersion = data["last-format-version"]
	if(!isNumber(lastFormatVersion)) return null

	const lastStopsVersion = data["last-stops-versions"]
	
	// if(lastRoutesVersion !instanceof Object) return null

	return {
		formatVersions,
		lastFormatVersion,
		lastStopsVersion
	}
}