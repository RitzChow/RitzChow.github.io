"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RoughMark } from "./rough-mark";

type SiteHeaderProps = {
  cv?: string;
};

const links = [
  { label: "About", href: "/#about" },
  { label: "Publications", href: "/publications/" },
  { label: "Education", href: "/#education" },
  { label: "Experience", href: "/#experience" },
  { label: "News", href: "/#news" },
] as const;

function NavLinks({ cv, onSelect }: SiteHeaderProps & { onSelect?: () => void }) {
  return (
    <>
      {links.map((link) => (
        <Link href={link.href} key={link.label} onClick={onSelect}>
          {link.label}
        </Link>
      ))}
      {cv ? (
        <a
          aria-label="CV (opens in a new tab)"
          href={cv}
          onClick={onSelect}
          rel="noreferrer"
          target="_blank"
        >
          CV
        </a>
      ) : null}
    </>
  );
}

export function SiteHeader({ cv }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Ruizhe Zhou, home">
          <span>Ruizhe Zhou</span>
          <RoughMark className="site-header__mark" variant="underline" />
        </Link>

        <nav aria-label="Primary" className="site-header__desktop-nav">
          <NavLinks cv={cv} />
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="site-header__menu-button"
          onClick={() => setOpen((value) => !value)}
          ref={buttonRef}
          type="button"
        >
          <span />
          <span />
        </button>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="site-header__mobile-nav" id="mobile-navigation">
          <NavLinks cv={cv} onSelect={() => setOpen(false)} />
        </nav>
      ) : null}
    </header>
  );
}
