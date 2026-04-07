import { getBytes, ref } from "firebase/storage"
import { storage } from "./initAuth"
import { parseRoutesVersions, parseStopsVersions } from "../utils/format/versions"

const routesVersionsRef=ref(storage,"/api/routes/versions.json")
export const stopsVersionsRef=ref(storage,"/api/stops/versions.json")
export async function getRoutesVersions(){
    try{
        const response = await getBytes(routesVersionsRef)
        const text = new TextDecoder().decode(response)
        const versions = parseRoutesVersions(text)
        return versions
    }catch(e){
        console.error(e);
        return null
    }
}
export async function getStopsVersions(){
    try{
        const response = await getBytes(stopsVersionsRef)
        const text = new TextDecoder().decode(response)
        const versions = parseStopsVersions(text)
        return versions
    }catch(e){
        console.error(e);
        return null
    }
}