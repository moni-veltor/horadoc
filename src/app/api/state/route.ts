import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const EMPTY = { clinics: [], entries: [], perfil: {}, cuentas: [] };

// Estado (clínicas + horas) del médico autenticado.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const row = await prisma.appState.findUnique({ where: { userId: session.user.id } });
  return NextResponse.json(row?.data ?? EMPTY);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: {
    clinics?: unknown;
    entries?: unknown;
    perfil?: unknown;
    cuentas?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const data = {
    clinics: Array.isArray(body.clinics) ? body.clinics : [],
    entries: Array.isArray(body.entries) ? body.entries : [],
    perfil: body.perfil && typeof body.perfil === "object" ? body.perfil : {},
    cuentas: Array.isArray(body.cuentas) ? body.cuentas : [],
  };

  await prisma.appState.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, data },
    update: { data },
  });

  return NextResponse.json({ ok: true });
}
