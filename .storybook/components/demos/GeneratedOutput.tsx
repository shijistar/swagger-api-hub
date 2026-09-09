import { useState } from 'react';
import { Tabs, type TabsProps, Typography } from 'antd';
import { CodeBlock } from '../CodeBlock';

export interface GeneratedFile {
  id: string;
  label: string;
  code: string;
}

interface GeneratedOutputProps {
  fileTree: string;
  files: GeneratedFile[];
  caption?: string;
}

/**
 * Shows the generated output structure (file tree) plus the content of each generated file in antd
 * Tabs + a highlighted code panel.
 */
export const GeneratedOutput = ({ fileTree, files, caption }: GeneratedOutputProps) => {
  const [active, setActive] = useState(files[0]?.id);
  const file = files.find((f) => f.id === active) ?? files[0];

  const tabs: TabsProps['items'] = files.map((f) => ({ key: f.id, label: f.label }));

  return (
    <div>
      <pre className="sb-filetree">{fileTree}</pre>
      {caption && (
        <Typography.Text type="secondary" className="sb-caption">
          {caption}
        </Typography.Text>
      )}
      <div style={{ height: '1.25rem' }} />
      <Tabs size="small" items={tabs} activeKey={active} onChange={setActive} tabBarStyle={{ marginBottom: 12 }} />
      <CodeBlock code={file.code} language="typescript" maxHeight={520} />
    </div>
  );
};

export default GeneratedOutput;
