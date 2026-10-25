"use client";

import dynamic from "next/dynamic";

import { ScreenLoading } from "@/shared/ui/ScreenBoundary";

// Data is fetched in the browser (`callApi` uses relative URLs): the server render only
// carries the screen frame, and the loading state shows while the screen's code arrives.
export const ClientBoard = dynamic(() => import("./AuthGate"), { ssr: false, loading: ScreenLoading });
