import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const phone =
    typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null;
  const especialidad =
    typeof body.especialidad === "string" && body.especialidad ? body.especialidad : null;
  const registroMedico =
    typeof body.registroMedico === "string" && body.registroMedico.trim()
      ? body.registroMedico.trim()
      : null;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Nombre, email y contraseña son obligatorios." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 8 caracteres." },
      { status: 400 },
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, phone, especialidad, registroMedico },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
