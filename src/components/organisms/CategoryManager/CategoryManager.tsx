import React, { useEffect, useState } from "react";
import { TagGroup } from "@/components/molecules/TagGroup/TagGroup";
import { Typography, Button, SearchableSelect } from "@/components/atoms";
import type { SearchableSelectOption } from "@/components/atoms";
import styles from "./CategoryManager.module.scss";

export interface CategoryTag {
  id: string;
  label: string;
}

export interface CategoryManagerProps {
  availableTags: CategoryTag[];
  selectedTags: CategoryTag[];
  onRemoveTag: (id: string) => void;
  onAddTag: (tag: CategoryTag) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ availableTags, selectedTags, onRemoveTag, onAddTag }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Convert CategoryTag to SearchableSelectOption format
  const searchableOptions: SearchableSelectOption[] = availableTags
    .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
    .map(tag => ({
      id: tag.id,
      label: tag.label,
      value: tag.id,
    }));

  const handleSelectChange = (option: SearchableSelectOption | null) => {
    if (option) {
      setSelectedCategory(option.id);
      // Automatically add the category when selected
      const found = availableTags.find(cat => cat.id === option.id);
      if (found && !selectedTags.some(tag => tag.id === found.id)) {
        onAddTag(found);
        setSelectedCategory(""); // Reset selection after adding
      }
    }
  };

  return (
    <div className={styles.manager}>
      <Typography variant="heading-4" as="h3">Categories</Typography>
      <TagGroup tags={selectedTags} onRemoveTag={onRemoveTag} />
      <div className={styles.addCategoryRow}>
        <SearchableSelect
          id="category-select"
          options={searchableOptions}
          value={selectedCategory}
          onChange={handleSelectChange}
          placeholder="Search and select a category..."
          searchPlaceholder="Type to search categories..."
          noResultsText="No categories found"
          fullWidth
        />
      </div>
    </div>
  );
}
