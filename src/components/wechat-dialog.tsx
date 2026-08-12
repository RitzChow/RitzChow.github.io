"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiMessageCircle, FiX } from "react-icons/fi";

interface WeChatDialogProps {
  qrSrc: string;
}

export function WeChatDialog({ qrSrc }: WeChatDialogProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeDialog() {
    if (typeof dialogRef.current?.close === "function") {
      dialogRef.current.close();
    }
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className="identity-contact"
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <FiMessageCircle aria-hidden="true" />
        <span>WeChat</span>
        <FiArrowUpRight className="identity-contact__marker" aria-hidden="true" />
      </button>

      {open ? (
        <dialog
          ref={dialogRef}
          className="wechat-dialog"
          open
          aria-modal="true"
          aria-labelledby="wechat-dialog-title"
          onCancel={(event) => {
            event.preventDefault();
            closeDialog();
          }}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeDialog();
          }}
        >
          <div className="wechat-dialog__heading">
            <h2 id="wechat-dialog-title">WeChat QR code</h2>
            <button
              ref={closeRef}
              className="wechat-dialog__close"
              type="button"
              onClick={closeDialog}
              aria-label="Close WeChat QR code"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
          <Image
            src={qrSrc}
            width={320}
            height={320}
            unoptimized
            alt="WeChat QR code for Ruizhe Zhou"
          />
        </dialog>
      ) : null}
    </>
  );
}
