import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      {
        message: "Successfully logged out",
        success: true,
      },
      { status: 200 }
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      // @ts-ignore
      expiresIn: new Date(0)
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}