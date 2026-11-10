"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X, Check } from "lucide-react";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={false}
      className={className}
      whileInView={reduced ? {} : { y: [14, 0] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
export function Modal({
  title,
  close,
  children,
  className = "",
}: {
  title: string;
  close: () => void;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const trigger = document.activeElement;
    const el = ref.current;
    el?.showModal();
    return () => {
      el?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-labelledby="modal-heading"
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="dialog-header">
        <h2 id="modal-heading">{title}</h2>
        <button
          className="icon-button"
          onClick={close}
          aria-label="Cerrar ventana"
        >
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Notice({ children }: { children: string }) {
  return (
    <div
      className={`notification ${children ? "visible" : ""}`}
      role="status"
      aria-live="polite"
    >
      {children && (
        <>
          <Check size={18} />
          <span>{children}</span>
        </>
      )}
    </div>
  );
}
