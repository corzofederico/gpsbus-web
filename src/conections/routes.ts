import type { RoutesFile } from "../types/route.d";
import { storage } from "./initAuth";
import { getBytes, ref } from "firebase/storage";
import type { RoutesVersions } from "../types/versions";
import { parseFileRoute } from "../utils/format/mapFiles";

function getPath(formatVersion:number,routesVersion:number){
    if(formatVersion==1) return "/api/v1/routes.json"
    return `/api/routes/v${formatVersion}/routes.${routesVersion}.json`
}

    
export async function getRoutesFile(versions: RoutesVersions):Promise<RoutesFile|null>{
    const version = versions.get("2")
    if(!version) return null
    const path = getPath(2, version)

    try{
        const response = await getBytes(ref(storage,path))
        const data = new TextDecoder().decode(response)
        const file = parseFileRoute(data)
        
        if(!file) return null
        return file
    }catch(e){
        console.error(e);
        return null
    }
}