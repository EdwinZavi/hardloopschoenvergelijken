import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAdmin } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { companyInfo } from "@/lib/company";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: `Admin login | ${companyInfo.platformName}`
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) redirect("/admin");

  const params = await searchParams;
  const hasError = firstValue(params.error) === "1";
  const showLocalPasswordHint = process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD;

  return (
    <main className="admin-auth-page">
      <section className="admin-login-panel">
        <p className="eyebrow">Dataworkspace</p>
        <h1>Inloggen voor {companyInfo.platformName} beheer</h1>
        <p className="lead">
          Beheer de kwaliteit van schoenen, offers, aanbevelingen en publicatierisico's voordat nieuwe content live gaat.
        </p>
        <form action={loginAdmin} className="admin-login-form">
          <label>
            <span>Wachtwoord</span>
            <input autoComplete="current-password" name="password" required type="password" />
          </label>
          {hasError ? <p className="form-error">Dit wachtwoord klopt niet.</p> : null}
          <button className="button" type="submit">
            Log in
          </button>
        </form>
        {showLocalPasswordHint ? (
          <p className="admin-note">
            Lokaal wachtwoord: <strong>loopwijzer-admin</strong>
          </p>
        ) : null}
        <p className="admin-note">Alleen bedoeld voor beheerders van {companyInfo.platformName}.</p>
      </section>
    </main>
  );
}
