import type { LatLng } from "../../types/route";

export function formatToLatLng(input: unknown): LatLng | null {
	// Check if input is an object and not null
	if (typeof input === 'object' && input !== null) {
	  // Check if input has 'lat' and 'lng' properties of type number
	  const obj = input as { lat?: unknown; lng?: unknown };
	  if (
		typeof obj.lat === 'number' &&
		typeof obj.lng === 'number'
	  ) {
		// Return the object as LatLng
		return {lat:obj.lat,lng:obj.lng}
	  }
	}
  
	// If checks fail, return null
	return null;
}