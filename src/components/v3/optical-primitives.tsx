import Link, { type LinkProps } from "next/link";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode
} from "react";

type GlassVariant = "optical" | "smoked" | "clear" | "clinical";
type ButtonVariant = "primary" | "secondary" | "quiet";
type SurfaceTone = "dark" | "light";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: GlassVariant;
};

export function GlassPanel({
  variant = "optical",
  className,
  children,
  ...props
}: GlassPanelProps) {
  return <div
    className={classes("v3-glass", className)}
    data-glass={variant}
    {...props}
  >{children}</div>;
}

export type MachinedSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: SurfaceTone;
  inset?: boolean;
};

export function MachinedSurface({
  tone = "dark",
  inset = false,
  className,
  children,
  ...props
}: MachinedSurfaceProps) {
  return <div
    className={classes("v3-machined", className)}
    data-tone={tone}
    data-state={inset ? "inset" : "raised"}
    {...props}
  >{children}</div>;
}

export type MachinedFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  description?: string;
  containerClassName?: string;
};

export function MachinedField({
  id,
  label,
  description,
  containerClassName,
  className,
  ...props
}: MachinedFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return <div className={classes("v3-field", containerClassName)}>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      className={classes("v3-field-control", className)}
      aria-describedby={descriptionId}
      {...props}
    />
    {description ? <small id={descriptionId}>{description}</small> : null}
  </div>;
}

export type SurgicalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function SurgicalButton({
  variant = "secondary",
  className,
  type = "button",
  children,
  ...props
}: SurgicalButtonProps) {
  return <button
    type={type}
    className={classes("v3-button", className)}
    data-variant={variant}
    {...props}
  >{children}</button>;
}

export type SurgicalLinkProps = LinkProps & {
  className?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  ariaLabel?: string;
};

export function SurgicalLink({
  variant = "secondary",
  className,
  children,
  ariaLabel,
  ...props
}: SurgicalLinkProps) {
  return <Link
    className={classes("v3-button", className)}
    data-variant={variant}
    aria-label={ariaLabel}
    {...props}
  >{children}</Link>;
}

export function TechnicalReadout({
  label,
  value,
  className
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return <span className={classes("v3-readout", className)}>
    <span>{label}</span>
    <strong>{value}</strong>
  </span>;
}

export function SectionIndex({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={classes("v3-section-index", className)}>{children}</p>;
}

export function V3Surface({
  tone = "dark",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: SurfaceTone }) {
  return <div
    className={classes("v3-surface", className)}
    data-tone={tone}
    {...props}
  >{children}</div>;
}
