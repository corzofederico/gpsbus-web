export type RoutesVersions = Map<string, number>
export type StopsVersions = {
	formatVersions: number[];
	lastFormatVersion: number;
	lastStopsVersion: Record<string,number>
}