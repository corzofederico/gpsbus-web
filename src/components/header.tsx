import { useStaticPathName } from "../hooks/usePathName";
import { type PropsWithChildren, useState } from "react";
import { Close, Map, Menu, Newspaper } from "@mui/icons-material";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";

export function Header({children}:PropsWithChildren) {
    const [menuVisible, setMenuVisibility] = useState(false)

    return <>
        <header className={`sticky top-0 z-10 left-0 w-dvw bg-(--orange) text-white p-4 flex items-center gap-6`}>
            <img src="/logo.svg" alt="ColectivosYA Logo" className="w-10 object-contain" />
            <h1 className="font-bold text-xl md:text-2xl lg:text-4xl flex-1">ColectivosYa</h1>
            <button className="cursor-pointer hover:scale-105 md:hidden" onClick={()=>setMenuVisibility(true)}><Menu/></button>
            <HeaderMenu />
            {children}
        </header>
        <Dialog open={menuVisible} onClose={()=>setMenuVisibility(false)} maxWidth="md" fullWidth={true}>
            <main className="flex flex-col gap-2 p-4">
                <button className="cursor-pointer hover:scale-105" onClick={()=>setMenuVisibility(false)}><Close /></button>
                <h1 className="font-bold text-2xl">Menu</h1>
                <Link to="/" className="cursor-pointer ransition-all hover:scale-105 hover:underline"><Map/> Servicio WEB</Link>
                <Link to="/historia" className="cursor-pointer transition-all hover:scale-105 hover:underline"><Newspaper/> Historia</Link>
            </main>
        </Dialog>
    </>
}
function HeaderMenu() {
    const page = useStaticPathName()
    return <menu className="gap-6 hidden md:flex">
        {page!="/" && <Link to="/" className="cursor-pointer ransition-all hover:scale-105 hover:underline"><li><Map/> Servicio WEB</li></Link>}
        {!page.includes("historia") && <Link to="/historia" className="cursor-pointer transition-all hover:scale-105 hover:underline"><li><Newspaper/> Historia</li></Link>}
    </menu>
}