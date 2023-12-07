import { NextResponse } from "next/server";

export function ok() {
  return new NextResponse("Ok", {
    status: 200,
    statusText: "Ok",
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
