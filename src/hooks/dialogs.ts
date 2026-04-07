"use client";

import { useEffect, useRef } from "react";

export function useDialog(visible:boolean){
	const dialogRef = useRef<HTMLDialogElement | null>(null)
	
    useEffect(()=>{
		const el = dialogRef.current
		if(!el) return

		if(!visible){
			el.close()
		}else el.showModal()
	},[visible])

	return dialogRef
}