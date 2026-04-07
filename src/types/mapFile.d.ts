import { RoutesFile } from "./route";

export enum FileFrom{
    firebase="FB",
    storage="storage",
    gpsBahia="gpsbahia"
}
export type MapFile={
	id: Symbol;
	name: string;
	from: FileFrom;
	file: RoutesFile;
}