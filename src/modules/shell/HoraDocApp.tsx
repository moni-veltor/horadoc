"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Building2,
  Home,
  LogOut,
  PieChart,
  PlusCircle,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { fontBody, fontDisplay, theme } from "@/core/theme";
import type { Entry } from "@/domain/types";
import { GradientText } from "@/shared/ui/GradientText";
import { Inicio } from "@/modules/inicio/Inicio";
import { Registrar } from "@/modules/registro/Registrar";
import { Clinicas } from "@/modules/clinicas/Clinicas";
import { Resumen } from "@/modules/resumen/Resumen";
import { Factura } from "@/modules/factura/Factura";
import { Historico } from "@/modules/historico/Historico";
import { HistoricoDetalle } from "@/modules/historico/HistoricoDetalle";
import { Cartera } from "@/modules/cartera/Cartera";
import { Perfil } from "@/modules/perfil/Perfil";
import { NavBtn } from "./NavBtn";
import { useHoraDoc } from "./useHoraDoc";

type Tab =
  | "inicio"
  | "registrar"
  | "clinicas"
  | "resumen"
  | "factura"
  | "historico"
  | "historicoDetalle"
  | "cartera"
  | "perfil";

export default function HoraDocApp() {
  const { data: session } = useSession();
  const store = useHoraDoc();
  const [tab, setTab] = useState<Tab>("inicio");
  const [facturaClinic, setFacturaClinic] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState<string | null>(null);

  // Editar un registro (desde Inicio o Histórico): carga el form y abre Registrar.
  function handleEditar(entry: Entry) {
    store.editarRegistro(entry);
    setTab("registrar");
  }

  const resumenActive =
    tab === "resumen" ||
    tab === "factura" ||
    tab === "historico" ||
    tab === "historicoDetalle" ||
    tab === "cartera";

  if (store.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: theme.bg, color: theme.muted, ...fontBody }}
      >
        Cargando…
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ background: theme.bg, color: theme.ink, ...fontBody }}
    >
      <div className="w-full max-w-sm min-h-screen flex flex-col relative" style={{ background: theme.bg }}>
        {/* Header */}
        <div className="px-5 pt-6 pb-3 no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: theme.gradient }}
              >
                <Stethoscope size={16} color="#fff" />
              </div>
              <span className="text-xl" style={fontDisplay}>
                Hora<GradientText>Doc</GradientText>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTab("perfil")}
                className="flex items-center text-xs"
                style={{ color: tab === "perfil" ? theme.primary : theme.muted }}
                aria-label="Mi perfil"
              >
                <UserRound size={16} />
              </button>
              {session?.user && (
                <button
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="flex items-center gap-1 text-xs"
                  style={{ color: theme.muted }}
                >
                  <LogOut size={14} /> Salir
                </button>
              )}
            </div>
          </div>
          <div className="text-[11px] mt-0.5 ml-10" style={{ color: theme.muted }}>
            {session?.user?.name
              ? `Hola, ${session.user.name}`
              : "Registra tus horas. Enfocado en lo que importa."}
          </div>
        </div>

        {/* Toast */}
        {store.toast && (
          <div
            className="mx-5 mb-2 px-3 py-2 rounded-lg text-sm"
            style={{
              background: store.toast.type === "error" ? "#F6E4E1" : theme.primaryLight,
              color: store.toast.type === "error" ? theme.danger : theme.primary,
            }}
          >
            {store.toast.text}
          </div>
        )}

        <div className="flex-1 px-5 pb-24 overflow-y-auto">
          {tab === "inicio" && (
            <Inicio
              hoyTotal={store.hoyTotal}
              resumen={store.resumen}
              todayEntries={store.todayEntries}
              clinics={store.clinics}
              totalMesAnterior={store.totalMesAnterior}
              onRegistrar={() => setTab("registrar")}
              onEditar={handleEditar}
              onEliminar={store.eliminarRegistro}
            />
          )}
          {tab === "registrar" && (
            <Registrar
              clinics={store.clinics}
              form={store.form}
              setForm={store.setForm}
              onGuardar={() => {
                if (store.guardarRegistro()) setTab("inicio");
              }}
              editingId={store.editingId}
              onCancelarEdicion={store.cancelarEdicion}
            />
          )}
          {tab === "clinicas" && (
            <Clinicas
              clinics={store.clinics}
              resumen={store.resumen}
              onAgregar={store.agregarClinica}
              onActualizarTarifa={store.actualizarTarifa}
              onActualizarNit={store.actualizarNit}
              onAgregarEspecialidad={store.agregarEspecialidad}
              onEliminarEspecialidad={store.eliminarEspecialidad}
            />
          )}
          {tab === "resumen" && (
            <Resumen
              resumen={store.resumen}
              onVerFactura={(id) => {
                setFacturaClinic(id);
                setTab("factura");
              }}
              onVerHistorico={() => setTab("historico")}
              onVerCartera={() => setTab("cartera")}
            />
          )}
          {tab === "factura" && (
            <Factura
              clinics={store.clinics}
              resumen={store.resumen}
              selected={facturaClinic}
              setSelected={setFacturaClinic}
              perfil={store.perfil}
              cuentas={store.cuentas}
              onVolver={() => setTab("resumen")}
              onVerPerfil={() => setTab("perfil")}
              onEmitir={store.emitirCuenta}
            />
          )}
          {tab === "historico" && (
            <Historico
              clinics={store.clinics}
              entries={store.entries}
              onVolver={() => setTab("resumen")}
              onSeleccionarMes={(key) => {
                setMesSeleccionado(key);
                setTab("historicoDetalle");
              }}
            />
          )}
          {tab === "historicoDetalle" && mesSeleccionado && (
            <HistoricoDetalle
              clinics={store.clinics}
              entries={store.entries}
              mesKey={mesSeleccionado}
              onVolver={() => setTab("historico")}
              onEditar={handleEditar}
              onEliminar={store.eliminarRegistro}
            />
          )}
          {tab === "cartera" && (
            <Cartera
              cuentas={store.cuentas}
              onMarcarPagada={store.marcarPagada}
              onVolver={() => setTab("resumen")}
            />
          )}
          {tab === "perfil" && (
            <Perfil
              perfil={store.perfil}
              onActualizar={store.actualizarPerfil}
              onVolver={() => setTab("inicio")}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div
          className="fixed bottom-0 w-full max-w-sm flex justify-around py-2 border-t no-print"
          style={{ background: theme.surface, borderColor: theme.primaryLight }}
        >
          <NavBtn icon={Home} label="Inicio" active={tab === "inicio"} onClick={() => setTab("inicio")} />
          <NavBtn icon={PlusCircle} label="Registrar" active={tab === "registrar"} onClick={() => setTab("registrar")} />
          <NavBtn icon={Building2} label="Clínicas" active={tab === "clinicas"} onClick={() => setTab("clinicas")} />
          <NavBtn icon={PieChart} label="Resumen" active={resumenActive} onClick={() => setTab("resumen")} />
        </div>
      </div>
    </div>
  );
}
