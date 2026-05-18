import { NextRequest, NextResponse } from "next/server";
import { todos } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const todo = todos.find((t) => t._id === id);
  if (!todo) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json(todo);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = todos.findIndex((t) => t._id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }
  const body = await req.json();
  todos[idx] = { ...todos[idx], ...body };
  return NextResponse.json(todos[idx]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idx = todos.findIndex((t) => t._id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }
  todos.splice(idx, 1);
  return NextResponse.json({ success: true });
}
