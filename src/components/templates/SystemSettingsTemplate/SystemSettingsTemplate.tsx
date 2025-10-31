"use client";
import React, { useState, useEffect } from "react";
import { TagGroup } from "@/components/molecules/TagGroup/TagGroup";
import { CategoryManager } from "@/components/organisms/CategoryManager/CategoryManager";
import { Typography, Input } from "@/components/atoms";
import { FormTextArea } from "@/components/atoms/FormTextArea";
import styles from "./SystemSettingsTemplate.module.scss";
import { Button } from "@/components/atoms";

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
}

interface SystemSettingsTemplateProps {
  company: Company | null;
  loading: boolean;
  availableTags: { id: string; label: string }[];
}

  export const SystemSettingsTemplate: React.FC<SystemSettingsTemplateProps> = ({ company, loading, availableTags }) => {
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
      // TODO: Call API to update company details and categories
      alert("Company details updated (API integration pending)");
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
      <form className={styles.form} onSubmit={handleSubmit}>
        <Typography variant="heading-2" as="h2">System Settings</Typography>
        {/* Basic Info Section */}
        <div className={styles.section}>
          <Typography variant="heading-4" as="h3">Basic Info</Typography>
          <div className={styles._label}>
            <Input
              id="company-name"
              name="name"
              label="Company Name"
              value={form.name}
              onChange={e => handleChange(e)}
              fullWidth
            />
          </div>
          <div className={styles._label}>
            <FormTextArea
              id="company-description"
              label="Description"
              value={form.description}
              onChange={e => handleChange(e)}
              rows={3}
            />
          </div>
          <div className={styles._label}>
            <Input
              id="company-username"
              name="username"
              label="Username"
              value={form.username}
              onChange={e => handleChange(e)}
              fullWidth
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className={styles.section}>
          <CategoryManager
            availableTags={availableTags}
            selectedTags={selectedTags}
            onRemoveTag={handleRemoveTag}
            onAddTag={handleAddTag}
          />
        </div>

        {/* Other Details Section (optional) */}
        <div className={styles.section}>
          <Typography variant="heading-4" as="h3">Other Details</Typography>
          <div className={styles.otherDetails}>
            <div><strong>Currency:</strong> {company?.currency}</div>
            <div><strong>Created:</strong> {company?.created_at ? new Date(company.created_at).toLocaleDateString() : '-'}</div>
            <div><strong>Updated:</strong> {company?.updated_at ? new Date(company.updated_at).toLocaleDateString() : '-'}</div>
          </div>
        </div>

        <Button type="submit" variant="primary">Save Changes</Button>
      </form>
    );
  };
