import React, {useState} from 'react';
import { formatPrice } from '@/utils/menu';

import { BasketItem, BasketSummaryProps } from './BasketSummary.types';
import styles from './BasketSummary.module.scss';
import { Typography } from '@/components/atoms';

const BasketSummary: React.FC<BasketSummaryProps> = ({ items, total }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.container} onClick={() => setIsOpen(!isOpen)}>
            <Typography variant='heading-6' as='span'>Basket Summary</Typography>
            <ul className={`${styles.items} ${isOpen ? styles['items--open'] : ''}`}>
                {items.map((item, idx) => (
                    <li key={idx}>
                        <Typography variant='body-small' as='span' className={styles.mainItem}>
                            {item.quantity} x {item.title}: {formatPrice(item.item_total)}
                        </Typography>
                        {item.customizations && item.customizations.length > 0 && (
                            <ul className={styles.subItems}>
                                {item.customizations.map((sub, subIdx) => (
                                    <li key={subIdx} className={styles.subItem}>
                                        <Typography variant='body-small' as='span'>{sub.sub_item_name}</Typography>
                                        {sub.price_modifier !== 0 && (
                                            <Typography variant='body-small' as='span'>
                                                {sub.price_modifier > 0 ? '+' : ''}{formatPrice(sub.price_modifier)}
                                            </Typography>
                                        )}
                                        {sub.quantity > 1 ? ` x${sub.quantity}` : ''}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            <Typography variant='heading-7' as='span'>Total: {formatPrice(total)}</Typography>
        </div>
    );
}

export default BasketSummary;
