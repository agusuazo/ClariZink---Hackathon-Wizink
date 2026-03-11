import React from 'react';

interface Props {
  content: string;
  boldClass?: string;
  normalClass?: string;
}

function parseLine(line: string): React.ReactNode[] {
  if (!line) return ['\u00a0'];
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

const MarkdownResponse = ({
  content,
  boldClass = 'font-semibold mt-4 mb-2',
  normalClass = 'mb-2',
}: Props) => {
  const lines = content
    .replace(/^"|"$|^&quot;|&quot;$/g, '')
    .replace(/&quot;/g, '"')
    .replace(/\\n/g, '\n')
    .split('\n');

  return (
    <>
      {lines.map((line, index) => {
        const hasBold = /\*\*[^*]+\*\*/.test(line);
        return (
          <p key={index} className={hasBold ? boldClass : normalClass}>
            {parseLine(line)}
          </p>
        );
      })}
    </>
  );
};

export default MarkdownResponse;
