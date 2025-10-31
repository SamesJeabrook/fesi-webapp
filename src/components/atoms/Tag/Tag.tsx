import React from "react";
import styles from "./Tag.module.scss";

export interface TagProps {
  label: string;
  onClose?: () => void;
}

export const Tag: React.FC<TagProps> = ({ label, onClose }) => (
  <span className={styles.tag}>
    {label}
    {onClose && (
      <button className={styles.close} onClick={onClose} aria-label="Remove tag">×</button>
    )}
  </span>
);
