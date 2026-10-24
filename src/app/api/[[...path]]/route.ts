import { handleApiRequest } from "@/server/main";

export const runtime = "nodejs";

export const GET = handleApiRequest;
export const POST = handleApiRequest;
export const PATCH = handleApiRequest;
export const DELETE = handleApiRequest;
