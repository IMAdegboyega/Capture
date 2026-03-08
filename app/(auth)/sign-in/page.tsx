"use client";

import Link from "next/link";
import Image from "next/image";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GOOGLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
  `${typeof window !== "undefined" ? window.location.origin : ""}/api/auth/callback/google`;

const SignIn = () => {
  const handleGoogleSignIn = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <main className="sign-in">
      <aside className="testimonial">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="SnapChat Logo"
            width={32}
            height={32}
          />
          <h1>Capture</h1>
        </Link>

        <div className="description">
          <section>
            <figure>
              {Array.from({ length: 5 }).map((_, index) => (
                <Image
                  src="/assets/icons/star.svg"
                  alt="Star Icon"
                  width={20}
                  height={20}
                  key={index}
                />
              ))}
            </figure>
            <p>
              Capture makes screen recording flawless. From quick breakdowns to
              full presentations, it&apos;s quick, seamless, smooth, and
              shareable within seconds
            </p>
            <article>
              <Image
                src="/assets/images/marvelous.png"
                alt="marvelous"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h2>Marvelous Tommy</h2>
                <p>Product Designer, Developer, IMA</p>
              </div>
            </article>
          </section>
        </div>
        <p>© capture 2026</p>
      </aside>
      <aside className="google-sign-in">
        <section>
          <Link href="/">
            <Image
              src="/assets/icons/logo.svg"
              alt="SnapChat Logo"
              width={40}
              height={40}
            />
            <h1>Capture</h1>
          </Link>
          <p>
            Create and share your very first <span>Capture video</span> in no
            time!
          </p>

          <button onClick={handleGoogleSignIn}>
            <Image
              src="/assets/icons/google.svg"
              alt="Google Icon"
              width={22}
              height={22}
            />
            <span>Sign in with Google</span>
          </button>
        </section>
      </aside>
      <div className="overlay" />
    </main>
  );
};

export default SignIn;
