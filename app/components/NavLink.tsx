import Link from "next/link";
import React from "react";

// Define the props that this component will accept
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  // The shared classes are now here in one place
  const linkClasses =
    "hover:text-blue-400 p-5 transition duration-300 text-2xl active:text-blue-600";

  return (
    <li>
      <Link href={href} className={linkClasses}>
        {children}
      </Link>
    </li>
  );
}

// Generated from Gemini 2.5 flash
