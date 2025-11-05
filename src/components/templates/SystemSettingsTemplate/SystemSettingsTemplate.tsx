"use client";
import React, { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { Modal } from '@/components/molecules/Modal/Modal';
import { AdminPageHeader } from '@/components/molecules';
import { TagGroup } from "@/components/molecules/TagGroup/TagGroup";
import { CategoryManager } from "@/components/organisms/CategoryManager/CategoryManager";
import { BankDetailsManager } from "@/components/organisms/BankDetailsManager";
import { Typography, Input, GridContainer, GridItem, Button } from "@/components/atoms";
import { FormTextArea } from "@/components/atoms/FormTextArea";
import styles from "./SystemSettingsTemplate.module.scss";

interface Category {
  id: string;
  name: string;
  description: string;
  icon_name: string;
}

interface Company {
  id: string;
  name: string;
  description: string;
  username: string;
  categories?: Category[];
  currency?: string;
  created_at?: string;
  updated_at?: string;
  version?: number;
}

interface SystemSettingsTemplateProps {
  company: Company | null;
  loading: boolean;
  availableTags: { id: string; label: string }[];
  backLink?: { label: string; href: string };
  adminContext?: string;
}

export const SystemSettingsTemplate: React.FC<SystemSettingsTemplateProps> = ({ 
  company, 
  loading, 
  availableTags,
  backLink,
  adminContext 
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
    const [form, setForm] = useState({
      name: "",
      description: "",
      username: "",
      // Add more fields as needed
    });

    // Manage categories as tags
    const [selectedTags, setSelectedTags] = useState<{ id: string; label: string }[]>([]);

    useEffect(() => {
      if (company?.categories) {
        setSelectedTags(company.categories.map((cat: Category) => ({ id: cat.id, label: cat.name })));
      }
      if (company) {
        setForm({
          name: company.name || "",
          description: company.description || "",
          username: company.username || "",
        });
      }
    }, [company]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRemoveTag = (id: string) => {
      setSelectedTags(selectedTags.filter(tag => tag.id !== id));
    };

    const handleAddTag = (tag: { id: string; label: string }) => {
      if (!selectedTags.some(t => t.id === tag.id)) {
        setSelectedTags([...selectedTags, tag]);
      }
    };


    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsModalOpen(true);
    };

    const handleModalConfirm = async () => {
      setIsSaving(true);
      setSaveError(null);
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          },
        });
        // Compose payload
        const payload = {
          ...form,
          categoryIds: selectedTags.map(tag => tag.id),
          version: company?.version,
        };
        // API endpoint (assume company.id is available)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${company?.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to save changes');
        setIsModalOpen(false);
      } catch (err: any) {
        setSaveError(err.message || 'Unknown error');
      } finally {
        setIsSaving(false);
      }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
      <>
      <AdminPageHeader
        title="System Settings"
        description="Manage your merchant settings, categories, and business information"
        backLink={backLink}
        adminContext={adminContext}
      />
      <form className={styles.form} onSubmit={handleSubmit}>
        <GridContainer>
          {/* Basic Info Section */}
          <GridItem sm={16} md={8}>
            <div className={styles.section}>
              <Typography variant="heading-4" as="h3">Basic Info</Typography>

              <Input
                id="company-name"
                name="name"
                label="Company Name"
                value={form.name}
                onChange={e => handleChange(e)}
                fullWidth
              />
              <Input
                id="company-username"
                name="username"
                label="Username"
                value={form.username}
                onChange={e => handleChange(e)}
                fullWidth
              />
              <FormTextArea
                id="company-description"
                label="Description"
                value={form.description}
                onChange={e => handleChange(e)}
                rows={3}
              />
            </div>
          </GridItem>

          {/* Categories Section */}
          <GridItem sm={16} md={8}>
            <div className={styles.section}>
              <CategoryManager
                availableTags={availableTags}
                selectedTags={selectedTags}
                onRemoveTag={handleRemoveTag}
                onAddTag={handleAddTag}
              />
            </div>
          </GridItem>

          {/* Bank Details Section */}
          <GridItem sm={16} md={8}>
            <div className={styles.section}>
              <BankDetailsManager
                merchantId={company?.id || ''}
                onUpdate={() => {
                  // Optionally reload company data after bank details update
                  console.log('Bank details updated');
                }}
                onError={(error) => {
                  setSaveError(error);
                }}
              />
            </div>
          </GridItem>

          {/* Other Details Section */}
          <GridItem sm={16} md={8}>
            <div className={styles.section}>
              <Typography variant="heading-4" as="h3">Other Details</Typography>
              <div className={styles.otherDetails}>
                <div><strong>Currency:</strong> {company?.currency}</div>
                <div><strong>Created:</strong> {company?.created_at ? new Date(company.created_at).toLocaleDateString() : '-'}</div>
                <div><strong>Updated:</strong> {company?.updated_at ? new Date(company.updated_at).toLocaleDateString() : '-'}</div>
              </div>
            </div>
          </GridItem>

          <GridItem sm={16} md={8}>
            <Button type="submit" variant="primary">Save Changes</Button>
          </GridItem>
        </GridContainer>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Save Changes Warning"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} isDisabled={isSaving}>Cancel</Button>
            <Button variant="primary" onClick={handleModalConfirm} isDisabled={isSaving}>Continue & Save</Button>
          </>
        }
      >
        <Typography variant="body-medium">Are you sure you want to save these changes? This will update the company settings immediately.</Typography>
        {saveError && <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>}
      </Modal>
      </>
    );
  };
