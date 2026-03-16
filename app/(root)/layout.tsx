import { Navbar } from "@/components";
import AuthGuard from "@/components/AuthGuard";
import PageTransition from "@/components/PageTransition";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthGuard>
      <Navbar />
      <PageTransition>{children}</PageTransition>
    </AuthGuard>
  );
};

export default RootLayout;
