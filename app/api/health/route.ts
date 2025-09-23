import { NextResponse } from "next/server";

export async function GET(req: Request) {
    return NextResponse.json({
        status: "ok",
        page: "chat",
        uptime: process.uptime(),
    });
}
