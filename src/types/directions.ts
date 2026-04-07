import { WHITE, type RGB } from "../utils/colors";

const ORANGE: RGB = {r:255,g:102,b:0}
export const GOING = {
    id: "going",
    external: "ida",
    color: ORANGE,
    onColor: WHITE
}

const BLUE: RGB = {r:63,g:148,b:201};
export const RETURN = {
    id: "return",
    external: "vuelta",
    color: BLUE,
    onColor: WHITE
}

// Tipo que representa las posibles direcciones
export type Direction = typeof GOING | typeof RETURN;

// Mapa de búsqueda
const directionMap: { [key: string]: Direction } = {
    [GOING.id]: GOING,
    [RETURN.id]: RETURN,
};

// Función para obtener el objeto Direction a partir de su ID
export const getDirectionOrNull = (id: string) => directionMap[id]??null;