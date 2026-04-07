"use client";

import { useEffect, useState } from "react";

export function useStyleMode(): "light" | "dark" {
    const [mode, setMode] = useState<"light" | "dark">('light');
	useEffect(() => {
        if (!window) return

		// Add listener to update styles
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setMode(e.matches ? 'dark' : 'light'));
	  
		// Setup dark/light mode for the first time
		setMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	  
		// Remove listener
		return () => {
		  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {
		  });
		}
    }, []);
    return mode
}