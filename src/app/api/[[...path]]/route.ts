import { handleApiRequest } from "@/server/main";

export const runtime = "nodejs";

// Every path under /api goes to the Effect API, which routes it from the contract (`Api.prefix("/api")`).
export const GET = handleApiRequest;
export const POST = handleApiRequest;
export const PATCH = handleApiRequest;
export const DELETE = handleApiRequest;
