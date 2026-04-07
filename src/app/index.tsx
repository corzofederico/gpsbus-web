import { getRoutesVersions, getStopsVersions } from "../conections/versions";
import { getRoutesFile } from "../conections/routes";
import { type CSSProperties, type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LatLng, Route, RoutesFile } from "../types/route";
import type { Stop, StopsFile } from "../types/stops";
import { getStopsFile } from "../conections/stops";
import { APIProvider, InfoWindow, Map, type MapCameraChangedEvent, type MapCameraProps, Marker, useMap } from "@vis.gl/react-google-maps";
import { Polyline } from "../components/map/polyline";
import { useStyleMode } from "../hooks/style";
import { darkMapStyle, lightMapStyle } from "../utils/mapStyle";
import { lines, linesID } from "../utils/lines";
import { BLACK, rgbToHex, WHITE, type Colors } from "../utils/colors";
import { Android, Close, Instagram, Schedule, Settings, Warning } from "@mui/icons-material";
import { Dialog } from "@mui/material";
import type { Line } from "../types/line";
import type { SchedulesFile } from "../schedules/types";
import { ref as storageRef, type StorageReference } from "firebase/storage";
import { database, readStringStorageFile, storage } from "../conections/initAuth";
import { formatSchedules } from "../schedules/file";
import { getNumberOrNull, zeroPad } from "../utils/numbers";
import { apiKey, days, defaultMinZoomVisibleStops, mapCenter, PlayStoreLink, StopsConfig } from "../utils/consts";
import { Header } from "../components/header";
import { formatToLatLng } from "../utils/format/position";
import { ref as databaseRef, onValue } from 'firebase/database';
import { useClock } from "../hooks/timer";
import { useGeolocated } from "react-geolocated";
import { useStaticSearchParams } from "../hooks/useSearchParams";
import { asArrayOrNull } from "../utils/arrays";

function updateSearchParams(name: string, value: string|null, searchParams: URLSearchParams){
	const newSearchParams = new URLSearchParams(searchParams.toString());
	if(value){
		newSearchParams.set(name, value)
	}else{
		newSearchParams.delete(name)
	}
	const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
	window.history.pushState(null, '', newUrl);
}
type Bus = {
	id: string
	line: string
}
type ServerBusFirebase = {
	bus: Bus
	routeIntersection: RouteIntersection | null
	history: ServerBusFirebaseState[]
}
function lastState(bus: ServerBusFirebase): ServerBusFirebaseState {
	return bus.history[bus.history.length - 1]
}
function position(bus: ServerBusFirebase): LatLng {
	return bus.routeIntersection?.position ?? lastState(bus).position
}
function angleOf(bus: ServerBusFirebase): number {
	return bus.routeIntersection?.angle ?? lastState(bus).angle
}
type RouteIntersection = {
	route: string
	item: string
	position: LatLng
	angle: number
	date: number
}
type ServerBusFirebaseState = {
	position: LatLng
	date: number
	angle: number
}
const defaultGroupName = "Principal"

export default function Home() {
	const now = useClock()
	const styleMode = useStyleMode()
	const mapStyle = useMemo(()=> styleMode=="light" ? lightMapStyle : darkMapStyle,[styleMode])
	const mapColors = useMemo<Colors>(()=> styleMode=="light" ? {bg: WHITE, onColor: BLACK} : {bg: BLACK, onColor: WHITE},[styleMode])

	const searchParams = useStaticSearchParams()
    const lineID = searchParams.get('linea_id') ?? searchParams.get('line_id')
    const lineName = searchParams.get('linea') ?? searchParams.get('line')
    const lineIDByURL = useMemo(()=>{
        const lineByName = lineName ? lines.find(line=> line.name.includes(lineName))?.id : null
        return lineByName ?? lineID
    },[lineName,lineID])

	const [stopsFile, setStopsFile] = useState<StopsFile | null>(null);
	const [routesFile, setRoutesFile] = useState<RoutesFile | null>(null);
	const [serverBuses, setBuses] = useState<Record<string, ServerBusFirebase[]>>({});
	
	const buses = useMemo(()=> Object.values(serverBuses).flat(), [serverBuses])
	const [busIDSelected, setBusIDSelected] = useState<string|null>(null);
	const busSelected = useMemo(()=> buses.find(bus=>bus.bus.id==busIDSelected), [busIDSelected, buses])
	
	useEffect(() => {
		getStopsVersions().then((versions) => {
			versions && getStopsFile(versions).then((data) => data && setStopsFile(data))
		});
	}, []);
	useEffect(()=>{
		getRoutesVersions().then((versions) => {
			versions && getRoutesFile(versions).then((data) => data && setRoutesFile(data))
		});
	},[])
    
	const [currentLineID, setLine] = useState(() => lineIDByURL ?? null);
	useEffect(() => {
		if (!currentLineID) {
			setLine(window.localStorage.getItem("currentLine"));
		}
	}, []); // runs once on mount, client-only

	const currentLine = useMemo(()=> lines.find(line=> line.id==currentLineID)??null, [currentLineID])
	useEffect(()=>{
		if(currentLineID!=null){
			const ref = databaseRef(database, "/buses/bhi/"+currentLineID)
			onValue(ref, (snapshot) => {
				const data = snapshot.val();
				if (data) {
					function getRecordOrNull(value: unknown): Record<string, any|null> | null {
						if (value == null || typeof value != "object" || Array.isArray(value)) return null
						return value
					}
					function parseState(value: unknown): ServerBusFirebaseState | null {
						const record = getRecordOrNull(value)
						if (record == null) return null

						const position = formatToLatLng(record.position);if(!position) return null
						const angle = getNumberOrNull(record.angle);if(!angle) return null
						const date = getNumberOrNull(record.date);if(!date) return null
						return { position, angle, date }
					}
					function parseRouteIntersection(value: unknown): RouteIntersection | null {
						const record = getRecordOrNull(value)
						if (record == null) return null

						const route = typeof record.id == "string" ? record.id : null
						const item = typeof record.item == "string" ? record.item : null
						if(!route || !item) return null

						const position = formatToLatLng(record.position);if(!position) return null
						const angle = getNumberOrNull(record.angle);if(!angle) return null
						const date = getNumberOrNull(record.date);if(!date) return null
						
						return { position, angle, date, route, item }
					}
					const busesData: ServerBusFirebase[] = Object.entries(data).map(([id, value]) => {
						const bus = getRecordOrNull(value)
						if (bus == null) return null
						
						const history = asArrayOrNull(bus.history)?.mapNotNull(parseState)
						if (history == null || history.length == 0) return null

						const routeIntersection = parseRouteIntersection(bus.route)

						return {
							bus: {
								id,
								line: currentLineID,
							},
							history,
							routeIntersection
						}
					}).filterNotNull();
					setBuses((prevbuses) => ({ ...prevbuses, [currentLineID]: busesData }));
				}
			})
		}
	},[currentLineID])
	useEffect(() => {
		if(currentLine && (searchParams.has("linea") || searchParams.has("linea_id"))){
			if(searchParams.has("linea")) updateSearchParams("linea", currentLine.name, searchParams)
			if(searchParams.has("linea_id")) updateSearchParams("linea_id", currentLine.name, searchParams)
		}
	}, [currentLine]);
    
	const [minZoomVisibleStops, setMinZoomVisibleStops] = useState(defaultMinZoomVisibleStops);
	useEffect(() => {
		const x = window.localStorage.getItem("minZoomVisibleStops");
		if (x) {
			const parsed = parseFloat(x);
			if (!isNaN(parsed)) setMinZoomVisibleStops(parsed);
		}
	}, []);
	
	const [stopsConfig, setStopsConfig] = useState<StopsConfig>(StopsConfig.OnlyOnZoom);
	useEffect(() => {
		const x = window.localStorage.getItem("stopsConfig");
		if (x === StopsConfig.OnlyOnZoom || x === StopsConfig.ShowAll) setStopsConfig(x);
	}, []);
    
	const currentLineRoutes = useMemo(()=> routesFile ? routesFile.routes.filter(route=> route.lineID==currentLineID) : [],[currentLineID,routesFile])
	const realLines = useMemo(() => {
		if (!routesFile) return lines;

		const linesInFiles = routesFile.routes.map((route) => route.lineID).flat();
		const uniqueLinesID = linesInFiles.concat(linesID).filter((lineID, i) => linesInFiles.indexOf(lineID) == i);
		return uniqueLinesID.map((lineID) =>
			lines.find((line) => line.id == lineID) ?? {
                id: lineID,
                name: `#${lineID}`,
			},
		);
	}, [routesFile]);
	const currentLineGroups = useMemo(
		() => currentLineRoutes
			.map(route => route.group ?? defaultGroupName)
			.distinct(value => value),
		[currentLineRoutes]
	)
	const [showSchedules,setVisibilitySchedulesInternal] = useState(()=> searchParams.get('horarios')=="visible")
	function setVisibilitySchedules(visible: boolean){
		setVisibilitySchedulesInternal(visible)
		updateSearchParams('horarios', visible ? "visible" : null, searchParams)
	}
	const [visibleGroups,setVisibleGroups] = useState<string[]>(()=> currentLineGroups)
	useEffect(()=> setVisibleGroups(currentLineGroups), [currentLineGroups])


	const installAndroidRef = useRef<HTMLDivElement>(null);
	const [visibleSettings,setVisibilitySettings] = useState(()=> false);
	const [visibleInstallAndroid,setVisibleInstallAndroid] = useState(()=> typeof window !== 'undefined' && window.localStorage.getItem("installAndroid")!="hidden");
	function setInstallAndroid(visible:boolean){
		if(visible){
			window.localStorage.setItem("installAndroid","hidden");
		}else{
			window.localStorage.removeItem("installAndroid");
		}
		setVisibleInstallAndroid(visible)
	}

	useEffect(() => {
		// if android hide #installAndroid
		const userAgent = typeof window!="undefined" ? window.navigator.userAgent.toLowerCase() : "windows"
		if (userAgent.indexOf("android") == -1) {
			installAndroidRef.current?.classList.add("hidden");
			setInstallAndroid(false)
		}
	}, [installAndroidRef])

	const INITIAL_CAMERA:MapCameraProps = {
		center: mapCenter,
		zoom: 13,
		heading: 45.0
	  };
	const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA);
	const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => setCameraProps(ev.detail), [])

    const { coords } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
			watchPosition: true,
			watchLocationPermissionChange: true
        });

	return <>
		<Header>
			<button onClick={()=> setVisibilitySettings(true)} className="cursor-pointer"><Settings/></button>
		</Header>
		<main className="w-dvw h- dvh flex flex-col gap-4 p-4">
			<h2 className="font-medium text-xl">Consulta posición en vivo, recorridos y paradas de los colectivos</h2>
			<label className={`bg-(--light-orange) text-(--dark-orange) rounded-md p-4 grid gap-2`}>
				<h1 className="text-lg font-semibold">Linea</h1>
				<select
					className="bg-(--dark-orange) text-orange-100 rounded-md p-2"
					value={currentLineID ?? ""}
					onChange={e => {
						const line = e.target.value;
						if (line) {
							window.localStorage.setItem("currentLine", line);
						} else {
							window.localStorage.removeItem("currentLine");
						}
						setLine(line == "" ? null : line);
					}}
				>
					<option>--Seleccione una linea--</option>
					{realLines.map((line) => <option key={line.id} value={line.id}>{line.name}</option> )}
				</select>
				<button
					onClick={()=>setVisibilitySchedules(true)}
					className="bg-(--orange) rounded-md text-white px-4 py-2 cursor-pointer flex w-fit items-center gap-2
						hover:shadow-[inset_0_0_4px_black]
						transition-all
					"
				>
					<Schedule/> Mostrar horarios
				</button>
				{currentLineGroups && currentLineGroups.length > 1 && <>
					<hr />
					<b>Grupos</b>
					{currentLineGroups.map(group=>{
						const visible = visibleGroups.includes(group)

						return <label className="flex items-center gap-2" key={"group-"+group}>
							<input checked={visible} type="checkbox" onChange={()=> setVisibleGroups(groups=> visible ? groups.filter(g=>g!=group) : groups.concat(group))} />
							<p>{group}</p>
						</label>
					})}
				</>}
			</label>
			<APIProvider apiKey={apiKey}>
				<Map
					{...cameraProps}
					onCameraChanged={handleCameraChange}
					className="w-full h-full min-h-[500px] grid"
					styles={mapStyle}
					streetViewControl={false}
					mapTypeControl={false}
					scaleControl={false}
					headingInteractionEnabled={true}
					gestureHandling={"greedy"}
				>
					{coords && <Marker
						key={"my-position"}
						position={{lat: coords.latitude, lng: coords.longitude}}
						icon={{
							path: "M12,2 C12.3796958,2 12.693491,2.28215388 12.7431534,2.64822944 L12.75,2.75 L12.7490685,4.53770881 L12.7490685,4.53770881 C16.292814,4.88757432 19.1124257,7.70718602 19.4632195,11.2525316 L19.5,11.25 L21.25,11.25 C21.6642136,11.25 22,11.5857864 22,12 C22,12.3796958 21.7178461,12.693491 21.3517706,12.7431534 L21.25,12.75 L19.4616558,12.7490368 L19.4616558,12.7490368 C19.1124257,16.292814 16.292814,19.1124257 12.7474684,19.4632195 L12.75,19.5 L12.75,21.25 C12.75,21.6642136 12.4142136,22 12,22 C11.6203042,22 11.306509,21.7178461 11.2568466,21.3517706 L11.25,21.25 L11.2509632,19.4616558 L11.2509632,19.4616558 C7.70718602,19.1124257 4.88757432,16.292814 4.53678051,12.7474684 L4.5,12.75 L2.75,12.75 C2.33578644,12.75 2,12.4142136 2,12 C2,11.6203042 2.28215388,11.306509 2.64822944,11.2568466 L2.75,11.25 L4.53770881,11.2509315 L4.53770881,11.2509315 C4.88757432,7.70718602 7.70718602,4.88757432 11.2525316,4.53678051 L11.25,4.5 L11.25,2.75 C11.25,2.33578644 11.5857864,2 12,2 Z M12,6 C8.6862915,6 6,8.6862915 6,12 C6,15.3137085 8.6862915,18 12,18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 Z M12,8 C14.209139,8 16,9.790861 16,12 C16,14.209139 14.209139,16 12,16 C9.790861,16 8,14.209139 8,12 C8,9.790861 9.790861,8 12,8 Z",
							scaledSize: new google.maps.Size(30, 30, "px", "px"),
							fillColor: rgbToHex(mapColors.onColor),
							fillOpacity: 1,
							strokeColor: rgbToHex(mapColors.onColor),
							anchor: new google.maps.Point(15, 15),
						}}
						zIndex={1}
						clickable={false}
					/>}
					{busSelected && <InfoWindow
						position={position(busSelected)}
						onClose={()=> setBusIDSelected(null)}
						onCloseClick={()=> setBusIDSelected(null)}
					>
						<main className="grid gap-2 text-black max-w-sm">
							<b>Linea {realLines.find(line=>line.id==busSelected.bus.line)?.name ?? `#${busSelected.bus.line}`}</b>
							<p>Ultima actualización hace {Math.round(now - lastState(busSelected).date)}s</p>
							<i>#{busSelected.bus.id}</i>
						</main>
					</InfoWindow>}
					{buses.map((bus)=> {
						const angle = angleOf(bus) - (cameraProps.heading??0)// + 180
						const visible = currentLineID == bus.bus.line
						const route = currentLineRoutes.find(route=> route.id == bus.routeIntersection?.route)

						return <Marker
							key={`bus-${bus.bus.id}`}
							visible={visible}
							position={position(bus)}
							icon={{
								/* url: "/bus.svg", */
								path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,//"M45.23,0C20.25,0,0,20.25,0,45.23c0,36,45.23,79.77,45.23,79.77,0,0,45.23-43.77,45.23-79.77,0-24.98-20.25-45.23-45.23-45.23ZM69.95,43.86c0,1.08-.9,1.95-2.02,1.95h-1.75v16.06h-2.23v4.36c0,1.53-1.28,2.78-2.86,2.78h-3.9c-1.58,0-2.86-1.24-2.86-2.78v-4.36h-18.3v4.36c0,1.53-1.28,2.78-2.86,2.78h-3.9c-1.58,0-2.86-1.24-2.86-2.78v-4.36h-2.12v-16.06h-1.75c-1.12,0-2.02-.88-2.02-1.95v-9.9c0-1.08.9-1.95,2.02-1.95h1.75v-5.75c0-4.41,3.85-6.67,8.09-6.67h25.72c4.24,0,8.09,2.26,8.09,6.67v5.75h1.75c1.12,0,2.02.88,2.02,1.95,0,0,0,9.9,0,9.9ZM34.04,54.66c0,1.8-1.51,3.26-3.37,3.26s-3.37-1.46-3.37-3.26,1.51-3.27,3.37-3.27,3.37,1.46,3.37,3.27ZM27.84,28.88h14.98v17.37h-14.98v-17.37ZM62.62,46.26h-14.98v-17.37h14.98v17.37ZM63.15,54.66c0,1.8-1.51,3.26-3.37,3.26s-3.37-1.46-3.37-3.26,1.51-3.27,3.37-3.27,3.37,1.46,3.37,3.27Z"
								rotation: angle,
								scale: 5,
								fillColor: rgbToHex(route?.direction?.color ?? mapColors.bg),
								fillOpacity: 1,
								strokeColor: rgbToHex(route?.direction?.onColor ?? mapColors.onColor),
								strokeWeight: 2,
								strokeOpacity: 1
							}}
							zIndex={2}
							onClick={()=> setBusIDSelected(bus.bus.id)}
						/>
					})}
					{
						currentLineRoutes.map((route) => (
							<Polyline
								key={route.id}
								path={route.path}
								strokeColor={rgbToHex(route.direction.color)}
								strokeWeight={4}
								clickable={false}
								visible={visibleGroups.includes(route.group??defaultGroupName)}
							/>
						))
					}
					{stopsFile && routesFile && 
						<Stops
							stopsFile={stopsFile}
							routesFile={routesFile}
							routes={currentLineRoutes}
							stopsConfig={stopsConfig}
							minZoom={minZoomVisibleStops}
						/>
					}
				</Map>
			</APIProvider>
			<footer className="flex flex-wrap items-center justify-center gap-4 p-4">
				<a href="https://www.instagram.com/colectivosbahiablanca/" target="_blank" rel="noreferrer" className="flex items-center gap-2 underline underline-offset-2">
					<Instagram/>
					<p>@colectivosbahiablanca</p>
				</a>
				<a href={PlayStoreLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline underline-offset-2">
					<Android />
					<p>Google Play Store</p>
				</a>
				<p>Desarrollado por <a href="https://federico.corzo.ar" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 underline underline-offset-2">Federico Corzo</a></p>
			</footer>
		</main>
		<Dialog open={visibleSettings} onClose={()=> setVisibilitySettings(false)} maxWidth="md">
			<main className={`bg-(--light-orange) text-(--dark-orange) rounded-md p-4 grid gap-2 w-fit h-fit`}>
				<h1 className="text-lg">Configuración</h1>
				<hr />
				<label className="grid gap-2 w-fit">
					<b>Paradas de colectivo en el mapa</b>
					<select
						className="bg-(--dark-orange) text-orange-100 p-1 rounded-sm"
						value={stopsConfig}
						onChange={(e) => {
							const rawNewConfig = e.target.value;
							const newConfig = (rawNewConfig==StopsConfig.OnlyOnZoom || rawNewConfig==StopsConfig.ShowAll) ? rawNewConfig : StopsConfig.OnlyOnZoom
							if (newConfig) {
								window.localStorage.setItem("stopsConfig", newConfig);
							} else {
								window.localStorage.removeItem("stopsConfig");
							}
							setStopsConfig(newConfig);
						}}
					>
						<option key={StopsConfig.OnlyOnZoom} value={StopsConfig.OnlyOnZoom}>Mostrar al hacer zoom</option>
						<option key={StopsConfig.ShowAll} value={StopsConfig.ShowAll}>Mostrar siempre</option>
					</select>
				</label>
				{stopsConfig==StopsConfig.OnlyOnZoom && <>
					<hr />
					<label className="grid gap-2 w-fit">
						<b>Zoom minimo para mostrar paradas de colectivo</b>
						<input
							className="bg-(--dark-orange) text-orange-100 p-1 rounded-sm"
							value={minZoomVisibleStops}
							type="range"
							max={18}
							min={14}
							onChange={(e) => {
								const raw = parseFloat(e.target.value);
								const newV = isNaN(raw) ? null : raw;
								if (newV) {
									window.localStorage.setItem("minZoomVisibleStops", newV.toString());
								} else {
									window.localStorage.removeItem("minZoomVisibleStops");
								}
								setMinZoomVisibleStops(newV ?? defaultMinZoomVisibleStops);
							}}
						/>
					</label>
				</>}
			</main>
		</Dialog>
		<LineShedulesView line={currentLine} visible={showSchedules} setVisible={visible=>setVisibilitySchedules(visible)} />
		{visibleInstallAndroid && (
			<div className={`fixed bottom-0 left-0 w-dvw bg-(--blue) text-white p-4 flex items-center gap-6 justify-between`} ref={installAndroidRef}>
				<a href={PlayStoreLink} target="_blank" rel="noreferrer"  className="flex flex-col gap-2 flex-1">
					<h1 className="font-semibold text-lg">Instalar APP para Android</h1>
					<p>Encuentra todas las funciones, como el modo sin conexión</p>
				</a>
				<button onClick={()=> setInstallAndroid(false)} className="p-2 cursor-pointer">
					<Close />
				</button>
			</div>
		)}
	</>
}

function getSchedulesFileRef(lineID:string):StorageReference{
    return storageRef(storage,`api/schedules/v1/schedules.${lineID}.json`)
}
async function getSL(line: Line){
	const data = await readStringStorageFile(getSchedulesFileRef(line.id))
	if(!data) return null
	const raw = JSON.parse(data)
	return formatSchedules(raw)
}
async function runTaskWithTimeoutOrNull<T>(
	task: () => Promise<T>,
	time: number
):Promise<T|null>{
    try {
        return new Promise((resolve, reject) => {
			setTimeout(()=>reject(new Error(`timeout after ${time}`)), Math.abs(time));
			resolve(task())
		})
    } catch(e){
		console.error(e);
        return null
    }
}
function LineShedulesView(
	{
		line,
		visible,
		setVisible
	}:PropsWithChildren<{line: Line|null, visible: boolean, setVisible: (visible:boolean)=>void}>
){
	const [file,setFile] = useState<SchedulesFile|null>(()=> null)
	const [loading,setLoading] = useState(()=> true)
	const [error,setError] = useState(()=> false)
	const [selectedScheduleID,selectScheduleID] = useState<string|undefined>(()=> undefined)
	useEffect(()=>{
		setFile(null)
		setLoading(line!=null)
		setError(false)
		if(line!=null) {
			runTaskWithTimeoutOrNull(async ()=> getSL(line), 10*1000).then(data=>{
				setFile(data)
				setError(data==null)
				if(data!=null) selectScheduleID(data.schedules[0].id)
			}).catch(()=>{
				setFile(null)
				setError(true)
			}).finally(()=> setLoading(false))
		}
	},[line])
	const currentSchedule = useMemo(()=> file?.schedules?.find(s=>s.id==selectedScheduleID),[file,selectedScheduleID])

	return <>
		<Dialog open={visible} onClose={()=>{setVisible(false)}} maxWidth={false} fullScreen={false}>
			<main className="flex flex-col gap-4 p-4 bg-(--light-orange) text-(--dark-orange) overflow-hidden w-full h-full md:w-fit md:h-fit">
				<div className="flex flex-wrap items-center gap-4">
					<button onClick={()=>{setVisible(false)}}><Close /></button>
					<h1 className="font-bold text-xl">Horarios {line?.name}</h1>
				</div>
				{file ? <>
					<select onChange={e=>selectScheduleID(e.currentTarget.value)} value={selectedScheduleID} className="w-full">
						{file.schedules.map(schedule=>
							<option key={schedule.id} value={schedule.id}>{schedule.days?.map(day=> days[day])?.filterNotNull()?.join(", ") ?? "Siempre"}</option>
						)}
					</select>
					{currentSchedule && <div
						className="grid overflow-scroll text-center justify-items-center items-center gap-2 w-full"
						style={{
							gridTemplateColumns: `repeat(${currentSchedule.places.length}, 150px)`,
							gridTemplateRows: `80px repeat(${currentSchedule.times.length}, 40px)`,
						}}
					>
						{currentSchedule.places.map((place,i)=>{
							const className = "sticky z-10 top-0 rounded-md w-full h-full flex justify-center items-center text-center bg-(--blue) text-white font-bold p-1"
							const style: CSSProperties = {gridColumn: i+1, gridRow: 1}
							
							return place.position ? 
								<a
									href={`https://www.google.com/maps/search/?api=1&query=${place.position.lat},${place.position.lng}`}
									target="_blank"
									rel="noreferrer"
									className={className}
									key={place.id}
									style={style}
								>
									{place.name}
								</a> :
								<div className={className} key={place.id} style={style}>{place.name}</div>
						})}
						{currentSchedule.times.map((rows, columnIndex)=>
							rows.map((time, rowIndex) => {
								const available = !Number.isNaN(time.hour) && !Number.isNaN(time.minute)
								return <div
									className={`${available ? "bg-white text-black" : "bg-red-700 text-white"} rounded-md w-full h-full flex justify-center items-center text-center`}
									key={time.id}
									style={{gridColumn: rowIndex+1, gridRow: columnIndex+2}}>
									{ available ? <b >{zeroPad(time.hour, 2)}:{zeroPad(time.minute, 2)}</b> : <Warning/> }
								</div>
							})
						)}
					</div>}
				</> : loading ?
					<b>Cargando horarios...</b> : error &&
					<b>Error al cargar horarios</b>
				}
			</main>
		</Dialog>
	</>
}


type StopsComponentProps = {
	stopsFile:StopsFile;
	routesFile: RoutesFile;
	routes: Route[];
	stopsConfig: StopsConfig;
	minZoom: number;
}
function Stops({stopsFile,routes,stopsConfig,routesFile,minZoom}:StopsComponentProps){
	const map = useMap();
	const [bounds,setBounds] = useState(()=> map?.getBounds()??null)
	const [zoom,setZoom] = useState(()=> map?.getZoom()??0)
	useEffect(() => {
		if (!map) return;
		map.addListener("zoom_changed",()=> setZoom(map.getZoom()??0))
		map.addListener("bounds_changed",()=> setBounds(map.getBounds()??null))
	}, [map]);

	const [selected,setSelected] = useState<Stop | null>(null)
	useEffect(()=> setSelected(null),[routes])

	const iconSize = useMemo(() => new google.maps.Size(15, 15, "px", "px"), []);

	return <>
		{selected && <>
			<InfoWindow position={selected.position} onClose={()=> setSelected(null)}>
				<main className="grid gap-2 text-black max-w-sm">
					<h2 className="font-semibold">Parada de colectivo</h2>
					<ul className="flex gap-1 flex-wrap">
						{selected.routes.map(routeID=>{
							const route = routesFile.routes.find(route=> route.id==routeID)
							const line = lines.find(line=> line.id == route?.lineID)
							const color = route?.direction?.color
							const onColor = route?.direction?.onColor
							const bgColor = color ? rgbToHex(color) : "var(--orange)"
							const textColor = onColor ? rgbToHex(onColor) : "white"

							return <>
								<b
									key={routeID}
									style={{
										backgroundColor: bgColor,
										color: textColor
									}}
									className="px-2 py-1 rounded-md"
									>
										{line?.name??`#${routeID}`}
								</b>
							</>
						})}
					</ul>
				</main>
			</InfoWindow>
		</>}
		{
			stopsFile.stops.filter(stop=> isStopInRoutes(stop,routes)).map((stop) => {
				const isOnViewport = bounds?.contains(stop.position) ?? false
				const visible = isOnViewport && (stopsConfig==StopsConfig.ShowAll || (stopsConfig==StopsConfig.OnlyOnZoom && zoom >= minZoom))
		
				return (
					<Marker
						onClick={()=> setSelected(stop)}
						key={stop.id.toString()}
						position={stop.position}
						visible={visible}
						icon={{
							url: "/stop.svg",
							scaledSize: iconSize
						}}
					/>
				)
			})
		}
	</>
}
function isStopInRoutes(stop:Stop,routes:Route[]):boolean{
	const routesID = routes.map(route=> route.id)
	return stop.routes.some((routeID) => {
		return routesID.includes(routeID);
	})
}