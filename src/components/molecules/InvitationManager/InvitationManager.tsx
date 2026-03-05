import React, { useState } from 'react';
import { Typography, Button } from '@/components/atoms';
import styles from './InvitationManager.module.scss';

export interface InvitationManagerProps {
  groupEventId: string;
  onSendInvitations: (emails: string[], message: string) => Promise<void>;
  isLoading?: boolean;
}

export const InvitationManager: React.FC<InvitationManagerProps> = ({
  groupEventId,
  onSendInvitations,
  isLoading = false
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [errors, setErrors] = useState<{ emails?: string; general?: string }>({});

  const parseEmails = (input: string): string[] => {
    // Split by comma, semicolon, or newline
    return input
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const emails = parseEmails(emailInput);

    if (emails.length === 0) {
      setErrors({ emails: 'Please enter at least one email address' });
      return;
    }

    // Validate email format
    const invalidEmails = emails.filter(email => !validateEmail(email));
    if (invalidEmails.length > 0) {
      setErrors({
        emails: `Invalid email format: ${invalidEmails.slice(0, 3).join(', ')}${
          invalidEmails.length > 3 ? ` and ${invalidEmails.length - 3} more` : ''
        }`
      });
      return;
    }

    try {
      await onSendInvitations(emails, customMessage);
      // Clear form on success
      setEmailInput('');
      setCustomMessage('');
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to send invitations' });
    }
  };

  const emailCount = parseEmails(emailInput).length;

  return (
    <div className={styles.invitationManager}>
      <div className={styles.header}>
        <Typography variant="heading-4">📨 Invite Merchants</Typography>
        <Typography variant="body-small" className={styles.subtitle}>
          Send invitations to merchants to participate in this event
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="emails" className={styles.label}>
            <Typography variant="body-medium">Merchant Email Addresses *</Typography>
          </label>
          <textarea
            id="emails"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className={`${styles.textarea} ${errors.emails ? styles.inputError : ''}`}
            placeholder="Enter email addresses (comma, semicolon, or newline separated)&#10;&#10;Example:&#10;merchant1@example.com&#10;merchant2@example.com, merchant3@example.com"
            rows={6}
            disabled={isLoading}
          />
          {emailCount > 0 && !errors.emails && (
            <Typography variant="body-small" className={styles.helpText}>
              ✓ {emailCount} email{emailCount !== 1 ? 's' : ''} detected
            </Typography>
          )}
          {errors.emails && (
            <Typography variant="body-small" className={styles.errorText}>
              {errors.emails}
            </Typography>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            <Typography variant="body-medium">Custom Message (Optional)</Typography>
          </label>
          <textarea
            id="message"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className={styles.textarea}
            placeholder="Add a personal message to the invitation..."
            rows={4}
            disabled={isLoading}
          />
          <Typography variant="body-small" className={styles.helpText}>
            This message will be included in the invitation email
          </Typography>
        </div>

        {errors.general && (
          <div className={styles.errorBanner}>
            <Typography variant="body-small">{errors.general}</Typography>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            isDisabled={isLoading || emailCount === 0}
          >
            {isLoading ? 'Sending...' : `Send ${emailCount > 0 ? emailCount : ''} Invitation${emailCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </form>

      <div className={styles.infoBox}>
        <Typography variant="body-small">
          <strong>Note:</strong> Each merchant will receive a professional invitation email with:
        </Typography>
        <ul className={styles.infoList}>
          <li>Event details and location</li>
          <li>Your custom message</li>
          <li>Secure accept/decline links</li>
          <li>Information about revenue sharing</li>
        </ul>
        <Typography variant="body-small">
          Invitations expire after 30 days and can be resent if needed.
        </Typography>
      </div>
    </div>
  );
};

export default InvitationManager;
