"use client";

import { useEffect, useState } from "react"

export function useStaticSearchParams(): URLSearchParams {
    var [params,setParams] = useState(typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams())

    useEffect(() => {
        const handler: () => void = () => {
            setParams(new URLSearchParams(window.location.search))
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