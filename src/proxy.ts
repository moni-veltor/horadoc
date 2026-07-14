import { withAuth } from "next-auth/middleware";

// Protege toda la app: sin sesión → redirige a /sign-in.
// Las rutas públicas (registro, sign-in, endpoints de auth y assets) quedan
// excluidas por el matcher de abajo.
export default withAuth({
  pages: { signIn: "/sign-in" },
});

export const config = {
  matcher: [
    "/((?!sign-in|sign-up|api/auth|api/register|_next/static|_next/image|favicon.ico).*)",
  ],
};
