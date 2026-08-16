import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { UserProvider } from "@/contexts/UserContext";
import { getUserSession } from "@/lib/auth/user-session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();
  return (
    <UserProvider initialUser={user}>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </UserProvider>
  );
}
