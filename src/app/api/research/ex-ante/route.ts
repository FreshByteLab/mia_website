import { NextResponse } from "next/server";
import { runExAnteStudy } from "@/lib/research/exAnte";
import { validateStudyRequest } from "@/lib/research/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateStudyRequest("ex_ante", body);
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const output = await runExAnteStudy(validation.value);
    return NextResponse.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json(
      { error: `Unable to run ex-ante study: ${message}` },
      { status: 500 }
    );
  }
}
