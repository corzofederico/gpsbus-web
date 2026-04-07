import type { StopsFile } from "../types/stops";
import type { StopsVersions } from "../types/versions";
import { getBytes, ref } from "firebase/storage";
import { storage } from "./initAuth";
import { formatStopsFile } from "../utils/format/stops";

function getPath(formatVersion: number, stopsVersion: number): string {
    // /api/stops/v1/stops.0.json
    return `/api/stops/v${formatVersion}/stops.${stopsVersion}.json`;
  }
  export async function getStopsFile(
    versions: StopsVersions,
  ): Promise<StopsFile | null> {
    const path = getPath(
      versions.lastFormatVersion,
      versions.lastStopsVersion[versions.lastFormatVersion] ?? 0,
    );
  
    try {
      const response = await getBytes(ref(storage, path));
      const data = new TextDecoder().decode(response);
      return formatStopsFile(data);
    } catch (e) {
      console.error(e);
      return null;
    }
  }