"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";
import ImageWithFallback from "./ImageWithFallback";

const Navbar = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <header className="navbar">
      <nav>
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="SnapChat Logo"
            width={32}
            height={32}
          />
          <h1>Capture</h1>
        </Link>

        {user && (
          <figure>
            <button onClick={() => router.push(`/profile/${user.id}`)}>
              <ImageWithFallback
                src={user.image ?? ""}
                alt="User"
                width={36}
                height={36}
                className="rounded-full aspect-square"
              />
            </button>
            <button
              onClick={() => {
                signOut();
                router.push("/sign-in");
              }}
              className="cursor-pointer"
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
                className="rotate-180"
              />
            </button>
          </figure>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
