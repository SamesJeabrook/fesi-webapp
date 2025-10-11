import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import type { BackLinkProps } from './BackLink.types';
import styles from './BackLink.module.scss';

export const BackLink: React.FC<BackLinkProps> = ({
  href,
  label,
  className,
  'data-testid': dataTestId,
}) => {
  const linkClasses = classNames(
    styles.backLink,
    className
  );

  return (
    <Link 
      href={href} 
      className={linkClasses}
      data-testid={dataTestId}
    >
      ← {label}
    </Link>
  );
};