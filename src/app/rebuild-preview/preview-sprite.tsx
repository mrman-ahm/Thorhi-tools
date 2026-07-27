import styles from "./preview.module.css";

type PreviewSpriteProps = {
  name: string;
  position: string;
  className?: string;
};

export function PreviewSprite({ name, position, className = "" }: PreviewSpriteProps) {
  return <span
    className={`${styles.sprite} ${className}`}
    role="img"
    aria-label={name}
    style={{ backgroundPosition: position }}
  />;
}
