import type { RoutesFile } from "../../types/route"
import { formatRoute } from "./routes"
import { notNull } from "../arrays"

export function parseFileRoute(content:string):RoutesFile|null{
	const data=JSON.parse(content)
	if(!data) return null

	const formatVersion = data["format-version"]
	if(!Number.isSafeInteger(formatVersion)) return null

	const routesVersion = data["routes-version"]
	if(!Number.isSafeInteger(routesVersion)) return null

	const routes = Array.from(data["routes"])?.map(formatRoute)?.filter(notNull)
	if(!routes) return null

	return {
		formatVersion,
		routesVersion,
		routes
	}
}