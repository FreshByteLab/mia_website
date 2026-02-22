import { NextResponse } from "next/server";
import { runExPostStudy } from "@/lib/research/exPost";
import { validateStudyRequest } from "@/lib/research/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateStudyRequest("ex_post", body);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const output = await runExPostStudy(validation.value);
    return NextResponse.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json(
      { error: `Unable to run ex-post study: ${message}` },
      { status: 500 }
    );
  }
}
