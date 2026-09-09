import { useState } from 'react';
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
 * Shows the generated output structure (file tree) plus the content of each generated file in a
 * tabbed code panel.
 */
export const GeneratedOutput = ({ fileTree, files, caption }: GeneratedOutputProps) => {
  const [active, setActive] = useState(0);
  const file = files[active] ?? files[0];

  return (
    <div>
      <pre className="sb-filetree">{fileTree}</pre>
      {caption && <p className="sb-caption">{caption}</p>}
      <div style={{ height: '1.25rem' }} />
      <div className="sb-tabs">
        {files.map((f, i) => (
          <button
            key={f.id}
            type="button"
            className={`sb-tab ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <CodeBlock code={file.code} language="typescript" maxHeight={520} />
    </div>
  );
};

export default GeneratedOutput;
