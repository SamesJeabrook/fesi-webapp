import React, { useState } from "react";
import { Tag } from "./Tag";

export default {
  title: "Atoms/Tag",
  component: Tag,
};

export const Default = () => <Tag label="Example Tag" />;

export const Closable = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Tag label="Closable Tag" onClose={() => setVisible(false)} /> : null;
};
