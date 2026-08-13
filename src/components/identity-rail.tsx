"use client";

import Image from "next/image";
import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight, FiMail, FiMessageCircle } from "react-icons/fi";
import { SiGooglescholar } from "react-icons/si";
import type { IconType } from "react-icons";
import { researchInterests } from "@/data/research";
import type { Profile, ResearchInterest } from "@/data/types";
import { normalizeContactHref } from "@/lib/content";
import { sitePath } from "@/lib/site-path";
import { WeChatDialog } from "./wechat-dialog";

interface IdentityRailProps {
  profile: Profile;
  interests?: ResearchInterest[];
}

const contactIcons: Record<string, IconType> = {
  GitHub: FaGithub,
  "Google Scholar": SiGooglescholar,
  LinkedIn: FaLinkedin,
  WeChat: FiMessageCircle,
  Email: FiMail,
  X: FaXTwitter,
};

function Portrait({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="identity-portrait-frame">
        <div className="identity-portrait identity-portrait--fallback">
          <span className="identity-portrait__head" aria-hidden="true" />
          <span className="identity-portrait__shoulders" aria-hidden="true" />
          <span className="sr-only">Portrait not yet provided</span>
        </div>
      </div>
    );
  }

  return (
    <div className="identity-portrait-frame">
      <div className="identity-portrait">
        <Image
          className="identity-portrait__image"
          src={sitePath(src)}
          alt={`Portrait of ${name}`}
          fill
          sizes="(max-width: 760px) 9rem, 16rem"
          unoptimized
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}

export function IdentityRail({ profile, interests = researchInterests }: IdentityRailProps) {
  const contacts = profile.contacts
    .filter((contact) => contact.label !== "WeChat")
    .map((contact) => ({
      ...contact,
      href: normalizeContactHref(contact.href ?? ""),
    }))
    .filter((contact) => contact.href || contact.label === "X");
  const hasWeChat = Boolean(profile.wechatQr?.trim());

  return (
    <aside className="identity-rail" aria-label="Academic identity">
      <Portrait name={profile.name} src={profile.portrait} />
      <div className="identity-rail__text">
        <h1 className="identity-rail__name">{profile.name}</h1>
        {profile.role ? <p className="identity-rail__role">{profile.role}</p> : null}
        <p className="identity-rail__institution">{profile.institution}</p>
      </div>
      <nav className="identity-contacts" aria-label="Contact links">
        {contacts.map((contact) => {
          const Icon = contactIcons[contact.label] ?? FiArrowUpRight;
          const href = contact.href;

          if (!href) {
            return (
              <div
                aria-label={`${contact.label} profile address not yet provided`}
                className="identity-contact identity-contact--inactive"
                key={contact.label}
              >
                <Icon aria-hidden="true" />
                <span>{contact.label}</span>
              </div>
            );
          }

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
      {interests.length > 0 ? (
        <section className="identity-interests" aria-labelledby="identity-interests-heading">
          <p id="identity-interests-heading">Research Interests</p>
          <ul>
            {interests.map((interest) => (
              <li key={interest.title}>{interest.title}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
