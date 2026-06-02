import fs from 'fs/promises';
import path from 'path';

const MARKDOWN_PATH = process.argv[2] || path.resolve(process.cwd(), 'docs', 'user-portal-documentation.md');
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;
const NOTION_PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

if (!NOTION_API_KEY) {
  console.error('Missing NOTION_API_KEY environment variable.');
  process.exit(1);
}

if (!NOTION_PAGE_ID && !NOTION_PARENT_PAGE_ID) {
  console.error('Provide either NOTION_PAGE_ID or NOTION_PARENT_PAGE_ID.');
  process.exit(1);
}

function blockFromLine(line) {
  if (!line.trim()) return null;

  if (line.startsWith('### ')) {
    return { type: 'heading_3', heading_3: { rich_text: [{ type: 'text', text: { content: line.slice(4) } }] } };
  }
  if (line.startsWith('## ')) {
    return { type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: line.slice(3) } }] } };
  }
  if (line.startsWith('# ')) {
    return { type: 'heading_1', heading_1: { rich_text: [{ type: 'text', text: { content: line.slice(2) } }] } };
  }
  if (line.startsWith('- ')) {
    return { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: line.slice(2) } }] } };
  }
  if (/^\d+\.\s/.test(line)) {
    const text = line.replace(/^\d+\.\s/, '');
    return { type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: text } }] } };
  }
  if (line.startsWith('```')) {
    return { type: 'code', code: { rich_text: [{ type: 'text', text: { content: '' } }], language: 'plain text' } };
  }
  return { type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: line } }] } };
}

function parseMarkdownToBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let inCode = false;
  let codeLines = [];

  for (const raw of lines) {
    const line = raw.replace(/\t/g, '    ');
    if (line.startsWith('```')) {
      if (inCode) {
        blocks.push({
          type: 'code',
          code: {
            rich_text: [{ type: 'text', text: { content: codeLines.join('\n') } }],
            language: 'plain text'
          }
        });
        codeLines = [];
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const block = blockFromLine(line);
    if (block) blocks.push(block);
  }

  return blocks;
}

async function fetchNotion(apiPath, options) {
  const url = `https://api.notion.com/v1/${apiPath}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Notion API error ${response.status}: ${body}`);
  }
  return response.json();
}

async function main() {
  const markdown = await fs.readFile(MARKDOWN_PATH, 'utf8');
  const lines = markdown.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'User Portal Export';
  const blocks = parseMarkdownToBlocks(markdown);

  if (NOTION_PARENT_PAGE_ID) {
    const payload = {
      parent: { page_id: NOTION_PARENT_PAGE_ID },
      properties: {
        title: {
          title: [{ type: 'text', text: { content: title } }]
        }
      },
      children: blocks
    };
    const result = await fetchNotion('pages', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    console.log('Created Notion page:', result.id);
    return;
  }

  const payload = { children: blocks };
  const result = await fetchNotion(`blocks/${NOTION_PAGE_ID}/children`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  console.log('Updated Notion page children for page:', NOTION_PAGE_ID);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
