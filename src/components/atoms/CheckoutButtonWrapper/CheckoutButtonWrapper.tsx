import React from 'react';
import styles from './CheckoutButtonWrapper.module.scss';

interface CheckoutButtonWrapperProps {
  children: React.ReactNode;
}

const CheckoutButtonWrapper: React.FC<CheckoutButtonWrapperProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default CheckoutButtonWrapper;
