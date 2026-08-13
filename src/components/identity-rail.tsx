"use client";

import Image from "next/image";
import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowUpRight, FiMail, FiMessageCircle } from "react-icons/fi";
import { SiGooglescholar } from "react-icons/si";
import type { IconType } from "react-icons";
import type { Profile } from "@/data/types";
import { normalizeContactHref } from "@/lib/content";
import { WeChatDialog } from "./wechat-dialog";

interface IdentityRailProps {
  profile: Profile;
}

const contactIcons: Record<string, IconType> = {
  GitHub: FaGithub,
  "Google Scholar": SiGooglescholar,
  LinkedIn: FaLinkedin,
  WeChat: FiMessageCircle,
  Email: FiMail,
};

function Portrait({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="identity-portrait identity-portrait--fallback">
        <span className="identity-portrait__head" aria-hidden="true" />
        <span className="identity-portrait__shoulders" aria-hidden="true" />
        <span className="sr-only">Portrait not yet provided</span>
      </div>
    );
  }

  return (
    <div className="identity-portrait">
      <Image
        src={src}
        alt={`Portrait of ${name}`}
        fill
        sizes="(max-width: 760px) 9rem, 16rem"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function IdentityRail({ profile }: IdentityRailProps) {
  const definedLinks = profile.contacts.filter(
    (contact) => contact.href?.trim() && contact.label !== "WeChat",
  );
  const hasWeChat = Boolean(profile.wechatQr?.trim());

  return (
    <aside className="identity-rail" aria-label="Academic identity">
      <Portrait name={profile.name} src={profile.portrait} />
      <div className="identity-rail__text">
        <p className="identity-rail__name">{profile.name}</p>
        <p className="identity-rail__role">{profile.role}</p>
        <p className="identity-rail__institution">{profile.institution}</p>
      </div>
      <nav className="identity-contacts" aria-label="Contact links">
        {definedLinks.map((contact) => {
          const Icon = contactIcons[contact.label] ?? FiArrowUpRight;
          const href = normalizeContactHref(contact.href!);
          const external = /^https?:\/\//.test(href);

          return (
            <a
              className="identity-contact"
              href={href}
              key={contact.label}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              aria-label={external ? `${contact.label} (opens in a new tab)` : contact.label}
            >
              <Icon aria-hidden="true" />
              <span>{contact.label}</span>
              <FiArrowUpRight className="identity-contact__marker" aria-hidden="true" />
            </a>
          );
        })}
        {hasWeChat ? <WeChatDialog qrSrc={profile.wechatQr!} /> : null}
      </nav>
    </aside>
  );
}
