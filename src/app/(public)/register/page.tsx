import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | ChinsArt",
  description: "Create your free ChinsArt account to start exploring original artworks.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-wide">
            Join ChinsArt
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your free account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
