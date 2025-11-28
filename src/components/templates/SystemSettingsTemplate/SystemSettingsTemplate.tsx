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
import { getAuthToken } from '@/utils/devAuth';
import styles from "./SystemSettingsTemplate.module.scss";

interface Category {
  id: string;
  name: string;
  description: string;
  icon_name: string;
}

interface ComplianceDocument {
  id: string;
  document_type: string;
  document_name: string;
  document_url: string;
  issue_date?: string;
  expiry_date?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface ComplianceStatus {
  merchant_id: string;
  overall_status: 'compliant' | 'pending_review' | 'non_compliant' | 'expired_documents';
  can_accept_orders: boolean;
  food_hygiene_rating?: number;
  has_valid_food_safety_cert: boolean;
  has_valid_business_license: boolean;
  has_valid_insurance: boolean;
  compliance_notes?: string;
  last_reviewed_at?: string;
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
  
  // Compliance state
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [complianceLoading, setComplianceLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [hygieneRating, setHygieneRating] = useState<number | null>(null);
  const [showHygieneModal, setShowHygieneModal] = useState(false);

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

  // Load compliance data
  useEffect(() => {
    if (company?.id) {
      loadComplianceData();
    }
  }, [company?.id]);

  const loadComplianceData = async () => {
    if (!company?.id) return;
    
    try {
      setComplianceLoading(true);
      const token = await getAuthToken(getAccessTokenSilently);
      
      // Load compliance status
      const complianceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${company.id}/compliance`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (complianceRes.ok) {
        const data = await complianceRes.json();
        setComplianceStatus(data);
      }
      
      // Load documents
      const docsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${company.id}/documents`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData);
      }
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setComplianceLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File, documentType: string, inputElement: HTMLInputElement) => {
    if (!company?.id) return;
    
    try {
      setUploadingDoc(true);
      const token = await getAuthToken(getAccessTokenSilently);
      
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('document', file);
      formData.append('merchantId', company.id);
      formData.append('documentType', 'compliance');
      
      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/compliance`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      );
      
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      
      // Save document record
      const docRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${company.id}/documents`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_type: documentType,
            document_name: file.name,
            document_url: uploadData.document?.cloudinaryUrl || uploadData.url,
          }),
        }
      );
      
      if (!docRes.ok) throw new Error('Failed to save document');
      
      // Reload compliance data
      await loadComplianceData();
    } catch (error) {
      console.error('Document upload failed:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingDoc(false);
      // Reset the input value so the same file can be selected again
      inputElement.value = '';
    }
  };

  const handleUpdateHygieneRating = async () => {
    if (!company?.id || hygieneRating === null) return;
    
    try {
      const token = await getAuthToken(getAccessTokenSilently);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/merchants/${company.id}/hygiene-rating`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating: hygieneRating,
            rating_date: new Date().toISOString().split('T')[0],
          }),
        }
      );
      
      if (!response.ok) throw new Error('Failed to update rating');
      
      setShowHygieneModal(false);
      await loadComplianceData();
    } catch (error) {
      console.error('Failed to update hygiene rating:', error);
      alert('Failed to update rating. Please try again.');
    }
  };

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

          {/* Compliance Section */}
          <GridItem sm={16}>
            <div className={styles.section}>
              <div className={styles.complianceHeader}>
                <Typography variant="heading-4" as="h3">📋 Compliance & Documents</Typography>
                {!complianceLoading && complianceStatus && (
                  <div className={`${styles.complianceBadge} ${styles[`complianceBadge--${complianceStatus.overall_status}`]}`}>
                    {complianceStatus.overall_status === 'compliant' && '✅ Compliant'}
                    {complianceStatus.overall_status === 'pending_review' && '⏳ Pending Review'}
                    {complianceStatus.overall_status === 'non_compliant' && '❌ Non-Compliant'}
                    {complianceStatus.overall_status === 'expired_documents' && '⚠️ Expired Documents'}
                  </div>
                )}
              </div>

              {!complianceLoading && complianceStatus && !complianceStatus.can_accept_orders && (
                <div className={styles.complianceWarning}>
                  <Typography variant="heading-6">⚠️ URGENT: Cannot Accept Orders</Typography>
                  <Typography variant="body-medium">
                    Your merchant account is currently <strong>non-compliant</strong> and cannot accept orders.
                    Please upload the required documents and update your hygiene rating to restore order acceptance.
                  </Typography>
                </div>
              )}

              <GridContainer>
                <GridItem sm={16} md={8}>
                  <Typography variant="heading-6" style={{ marginBottom: '1rem' }}>Required Documents</Typography>
                  
                  {/* Food Safety Certificate */}
                  <div className={styles.documentItem}>
                    <div className={styles.documentHeader}>
                      <Typography variant="body-medium"><strong>Food Safety Certificate</strong></Typography>
                      {complianceStatus?.has_valid_food_safety_cert ? (
                        <span className={styles.documentStatus}>✅ Valid</span>
                      ) : (
                        <span className={`${styles.documentStatus} ${styles.documentStatusMissing}`}>❌ Required</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocumentUpload(file, 'food_safety_certificate', e.target);
                      }}
                      disabled={uploadingDoc}
                      className={styles.fileInput}
                    />
                  </div>

                  {/* Business License */}
                  <div className={styles.documentItem}>
                    <div className={styles.documentHeader}>
                      <Typography variant="body-medium"><strong>Business License</strong></Typography>
                      {complianceStatus?.has_valid_business_license ? (
                        <span className={styles.documentStatus}>✅ Valid</span>
                      ) : (
                        <span className={`${styles.documentStatus} ${styles.documentStatusMissing}`}>❌ Required</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocumentUpload(file, 'business_license', e.target);
                      }}
                      disabled={uploadingDoc}
                      className={styles.fileInput}
                    />
                  </div>

                  {/* Insurance Certificate */}
                  <div className={styles.documentItem}>
                    <div className={styles.documentHeader}>
                      <Typography variant="body-medium"><strong>Liability Insurance</strong></Typography>
                      {complianceStatus?.has_valid_insurance ? (
                        <span className={styles.documentStatus}>✅ Valid</span>
                      ) : (
                        <span className={`${styles.documentStatus} ${styles.documentStatusMissing}`}>❌ Required</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDocumentUpload(file, 'insurance_certificate', e.target);
                      }}
                      disabled={uploadingDoc}
                      className={styles.fileInput}
                    />
                  </div>
                </GridItem>

                <GridItem sm={16} md={8}>
                  <Typography variant="heading-6" style={{ marginBottom: '1rem' }}>Food Hygiene Rating</Typography>
                  
                  <div className={styles.hygieneRating}>
                    {complianceStatus?.food_hygiene_rating ? (
                      <div className={styles.currentRating}>
                        <Typography variant="heading-2">{complianceStatus.food_hygiene_rating}/5</Typography>
                        <Typography variant="body-small">Current Rating</Typography>
                        {complianceStatus.food_hygiene_rating < 3 && (
                          <Typography variant="body-small" style={{ color: 'var(--color-error-main)', marginTop: '0.5rem' }}>
                            ⚠️ Minimum rating of 3 required
                          </Typography>
                        )}
                      </div>
                    ) : (
                      <Typography variant="body-medium">No rating on file</Typography>
                    )}
                    
                    <div style={{ marginTop: '1rem' }}>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setHygieneRating(complianceStatus?.food_hygiene_rating || 0);
                          setShowHygieneModal(true);
                        }}
                      >
                        Update Rating
                      </Button>
                    </div>
                  </div>

                  <Typography variant="heading-6" style={{ marginTop: '2rem', marginBottom: '1rem' }}>Uploaded Documents</Typography>
                  <div className={styles.documentsList}>
                    {documents.length === 0 ? (
                      <Typography variant="body-small">No documents uploaded</Typography>
                    ) : (
                      documents.map((doc) => (
                        <div key={doc.id} className={styles.uploadedDocument}>
                          <Typography variant="body-small">
                            <strong>{doc.document_type.replace(/_/g, ' ')}</strong>
                          </Typography>
                          <Typography variant="body-small">
                            {doc.document_name}
                          </Typography>
                          <Typography variant="body-small">
                            {doc.is_verified ? '✅ Verified' : '⏳ Pending'}
                            {doc.expiry_date && ` • Expires: ${new Date(doc.expiry_date).toLocaleDateString()}`}
                          </Typography>
                        </div>
                      ))
                    )}
                  </div>
                </GridItem>
              </GridContainer>
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

      <Modal
        isOpen={showHygieneModal}
        onClose={() => setShowHygieneModal(false)}
        title="Update Food Hygiene Rating"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowHygieneModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateHygieneRating}>Save Rating</Button>
          </>
        }
      >
        <Typography variant="body-medium" style={{ marginBottom: '1rem' }}>
          Enter your current Food Standards Agency hygiene rating (0-5):
        </Typography>
        <div className={styles.ratingButtons}>
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              className={`${styles.ratingButton} ${hygieneRating === rating ? styles.ratingButtonActive : ''}`}
              onClick={() => setHygieneRating(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
        <Typography variant="body-small" style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          Minimum rating of 3 required to accept orders
        </Typography>
      </Modal>
      </>
    );
  };
