'use client';

import React, { useState } from 'react';
import { Typography, Button, FormInput } from '@/components/atoms';
import { Modal } from '@/components/molecules/Modal/Modal';
import api from '@/utils/api';
import type { CreateTablesModalProps, TableInput } from './CreateTablesModal.types';
import styles from './CreateTablesModal.module.scss';

export const CreateTablesModal: React.FC<CreateTablesModalProps> = ({
  isOpen,
  onClose,
  merchantId,
  onTablesCreated,
}) => {
  const [tables, setTables] = useState<TableInput[]>([
    { table_number: '1', capacity: 4, location_notes: '' }
  ]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTable = () => {
    const nextNumber = (tables.length + 1).toString();
    setTables([...tables, { table_number: nextNumber, capacity: 4, location_notes: '' }]);
  };

  const removeTable = (index: number) => {
    if (tables.length > 1) {
      setTables(tables.filter((_, i) => i !== index));
    }
  };

  const updateTable = (index: number, field: keyof TableInput, value: string | number) => {
    const updated = [...tables];
    updated[index] = { ...updated[index], [field]: value };
    setTables(updated);
  };

  const handleCreate = async () => {
    // Validation
    const invalidTables = tables.filter(t => !t.table_number || t.capacity < 1);
    if (invalidTables.length > 0) {
      setError('All tables must have a table number and capacity of at least 1');
      return;
    }

    // Check for duplicate table numbers
    const tableNumbers = tables.map(t => t.table_number);
    const duplicates = tableNumbers.filter((num, idx) => tableNumbers.indexOf(num) !== idx);
    if (duplicates.length > 0) {
      setError(`Duplicate table numbers found: ${duplicates.join(', ')}`);
      return;
    }

    setCreating(true);
    setError(null);

    try {
      await api.post(`/api/tables/merchant/${merchantId}`, { tables });
      onTablesCreated?.();
      onClose();
      // Reset form
      setTables([{ table_number: '1', capacity: 4, location_notes: '' }]);
    } catch (err: any) {
      console.error('Error creating tables:', err);
      setError(err.message || 'Failed to create tables');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setTables([{ table_number: '1', capacity: 4, location_notes: '' }]);
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Tables"
      footer={
        <>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            isDisabled={creating}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreate}
            isDisabled={creating}
          >
            {creating ? 'Creating...' : `Create ${tables.length} Table${tables.length > 1 ? 's' : ''}`}
          </Button>
        </>
      }
    >
      <div className={styles.createTablesModal}>
        {error && (
          <div className={styles.error}>
            <Typography variant="body-small">⚠️ {error}</Typography>
          </div>
        )}

        <Typography variant="body-medium" className={styles.description}>
          Add tables to your restaurant floor plan. You can add multiple tables at once.
        </Typography>

        <div className={styles.tablesList}>
          {tables.map((table, index) => (
            <div key={index} className={styles.tableRow}>
              <div className={styles.tableFields}>
                <div className={styles.field}>
                  <FormInput
                    label="Table Number"
                    value={table.table_number}
                    onChange={(e) => updateTable(index, 'table_number', e.target.value)}
                    placeholder="1"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <FormInput
                    label="Capacity"
                    type="number"
                    value={table.capacity.toString()}
                    onChange={(e) => updateTable(index, 'capacity', parseInt(e.target.value) || 1)}
                    min={1}
                    max={20}
                    required
                  />
                </div>

                <div className={styles.fieldWide}>
                  <FormInput
                    label="Location Notes (optional)"
                    value={table.location_notes || ''}
                    onChange={(e) => updateTable(index, 'location_notes', e.target.value)}
                    placeholder="e.g., Window seat, Near kitchen"
                  />
                </div>
              </div>

              {tables.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTable(index)}
                  className={styles.removeButton}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={addTable}
          className={styles.addButton}
        >
          + Add Another Table
        </Button>

        <div className={styles.summary}>
          <Typography variant="body-small" className={styles.summaryText}>
            Total tables: <strong>{tables.length}</strong> • 
            Total capacity: <strong>{tables.reduce((sum, t) => sum + t.capacity, 0)} seats</strong>
          </Typography>
        </div>
      </div>
    </Modal>
  );
};
