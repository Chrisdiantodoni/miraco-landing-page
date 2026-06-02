import { NextResponse } from "next/server";

export const jsonResponse = (data: object, status = 200) =>
  NextResponse.json(data, { status });

export const errorResponse = (message: string, status = 400) =>
  jsonResponse({ success: false, message }, status);
