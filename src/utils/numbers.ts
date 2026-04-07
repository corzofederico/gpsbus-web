export function getNumberOrNull(value: unknown):number|null{
	if(value == null || !isNumber(value)) return null
	return value
}
export function isNumber(item:unknown):item is number{
	return item!=null && !Number.isNaN(item)
}
export function zeroPad(num:number, places:number):string {
	return String(num).padStart(places, '0')
}