import { Navbar } from "@/components";
import AuthGuard from "@/components/AuthGuard";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthGuard>
      <Navbar />
      {children}
    </AuthGuard>
  );
};

export default RootLayout;
