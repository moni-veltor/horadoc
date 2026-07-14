import { Suspense } from "react";
import { SignInForm } from "@/modules/auth/SignInForm";

export default function Page() {
  // SignInForm uses useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
