// Browser-native lightweight Markdown frontmatter parser (No Node Buffer dependency)

export function parseFrontmatter(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') {
    return { frontmatter: {}, content: '' };
  }

  const str = rawContent.trimStart();
  if (!str.startsWith('---')) {
    return { frontmatter: {}, content: rawContent };
  }

  const match = str.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: rawContent };
  }

  const yamlBlock = match[1];
  const bodyContent = match[2] || '';
  const frontmatter = {};

  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let valStr = trimmed.slice(colonIdx + 1).trim();

    // Strip wrapping quotes
    if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
      valStr = valStr.slice(1, -1);
    }

    // Parse booleans
    if (valStr === 'true') {
      frontmatter[key] = true;
    } else if (valStr === 'false') {
      frontmatter[key] = false;
    } 
    // Parse array format: ["React", "Tailwind"]
    else if (valStr.startsWith('[') && valStr.endsWith(']')) {
      try {
        const jsonStr = valStr.replace(/'/g, '"');
        frontmatter[key] = JSON.parse(jsonStr);
      } catch {
        frontmatter[key] = valStr.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
    } 
    else {
      frontmatter[key] = valStr;
    }
  }

  return { frontmatter, content: bodyContent };
}

// Helper to load all raw markdown files from a directory glob
export function loadMarkdownCollection(globModules) {
  const items = [];

  for (const path in globModules) {
    const rawContent = globModules[path];
    const { frontmatter, content } = parseFrontmatter(rawContent);
    const filename = path.split('/').pop().replace(/\.md$/, '');

    items.push({
      id: filename,
      path,
      frontmatter,
      content,
    });
  }

  return items;
}

// Get single markdown file content
export function loadSingleMarkdown(rawContent) {
  return parseFrontmatter(rawContent);
}
