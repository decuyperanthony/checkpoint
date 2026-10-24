"use client";

import dynamic from "next/dynamic";

// Data is fetched in the browser: the server render only carries the screen frame.
export const ClientBoard = dynamic(() => import("./Board"), { ssr: false });
