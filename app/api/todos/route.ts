import { NextRequest, NextResponse } from "next/server";
import { todos } from "@/lib/store";

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "제목을 입력해주세요." }, { status: 400 });
  }

  const newTodo = {
    _id: String(Date.now()),
    title,
    memo: "",
    isCompleted: false,
  };

  todos.push(newTodo);
  return NextResponse.json(newTodo, { status: 201 });
}
