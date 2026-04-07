"use client";

import { useEffect, useState } from "react"
import {} from "react-router-dom"

export function useStaticPathName(): string {
    var [params,setParams] = useState(() => typeof window !== "undefined" ? window.location.pathname : "")

    useEffect(() => {
        const handler: () => void = () => {
            setParams(window.location.pathname)
        }

        // fires on back/forward navigation
        window.addEventListener("popstate", handler)
        // fires on programmatic pushState / replaceState
        window.addEventListener("locationchange", handler)

        return () => {
            window.removeEventListener("popstate", handler)
            window.removeEventListener("locationchange", handler)
        }
    }, [])

    return params
}