export type RGB = {
    r: number
    g: number
    b: number
}

export type Colors = {
    bg: RGB
    onColor: RGB
}

export const BLACK={r:0,g:0,b:0}
export const WHITE={r:255,g:255,b:255}

export const randomColor=():RGB=>{
    const colorComponent = () => Math.floor(Math.random() * 255)
    return {
        r: colorComponent(),
        g: colorComponent(),
        b: colorComponent()
    };
}

export function blend(first:RGB,second:RGB,balance:number){
    if(first===second) return first
    if(balance===0) return first
    if(balance===1) return second
    
    const blendComponent=(c1:number,c2:number,balance:number)=>{
        const cA = c1*balance;
        const cB = c2*(1-balance);
        return Math.round(cA+cB)
    }

    return {
        r: blendComponent(first.r, second.r, balance),
        g: blendComponent(first.g, second.g, balance),
        b: blendComponent(first.b, second.b, balance)
    };
}
export function hexToRgb(hex:string):RGB|null{
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(!result) return null

    const [r,g,b] = result
    return { r: parseInt(r,16), g: parseInt(g,16), b: parseInt(b,16) }
}

export function rgbToHex({ r, g, b }:RGB):string{
    function componentToHex(c:number):string{
        const hex = c.toString(16)
        return hex.length === 1 ? "0" + hex : hex
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}