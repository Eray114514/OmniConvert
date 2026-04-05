import JSZip from 'jszip';
import { marked } from 'marked';
import { ConversionResult } from '../types';

export const convertToEpub = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<ConversionResult> => {
  try {
    onProgress?.(10);
    const text = await file.text();
    let htmlContent = '';

    onProgress?.(30);
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'md' || extension === 'markdown') {
      htmlContent = await marked.parse(text);
    } else {
      // Default as txt
      htmlContent = text
        .split('\n')
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('\n');
    }

    onProgress?.(50);
    
    // Clean HTML to be somewhat valid XHTML (basic cleaning)
    // E-readers are generally forgiving with EPUB3, but we should make sure it's valid
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${htmlContent}</body>`, 'text/html');
    
    // Ensure all images have alt tags and are closed (DOMParser + XMLSerializer does this)
    const serializer = new XMLSerializer();
    let xhtmlBody = '';
    
    try {
      // Try to serialize the body contents as XML
      xhtmlBody = Array.from(doc.body.childNodes)
        .map(node => serializer.serializeToString(node))
        .join('\n');
    } catch (e) {
      // Fallback
      xhtmlBody = htmlContent;
    }

    const title = file.name.replace(/\.[^/.]+$/, "");
    const uuid = crypto.randomUUID ? crypto.randomUUID() : '12345-67890';
    
    onProgress?.(70);

    const zip = new JSZip();

    // 1. mimetype (must be first, uncompressed)
    zip.file('mimetype', 'application/epub+zip');

    // 2. META-INF/container.xml
    const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
    zip.file('META-INF/container.xml', containerXml);

    // 3. OEBPS/content.opf
    const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${escapeHtml(title)}</dc:title>
    <dc:language>zh-CN</dc:language>
    <dc:identifier id="BookId">urn:uuid:${uuid}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`;
    zip.file('OEBPS/content.opf', contentOpf);

    // 4. OEBPS/toc.ncx
    const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
  </head>
  <docTitle>
    <text>${escapeHtml(title)}</text>
  </docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel>
        <text>Start</text>
      </navLabel>
      <content src="content.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`;
    zip.file('OEBPS/toc.ncx', tocNcx);

    // 5. OEBPS/nav.xhtml
    const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="content.xhtml">Start</a></li>
    </ol>
  </nav>
</body>
</html>`;
    zip.file('OEBPS/nav.xhtml', navXhtml);

    // 6. OEBPS/style.css
    const styleCss = `
body { font-family: sans-serif; line-height: 1.6; padding: 2% 5%; }
p { margin-bottom: 1em; }
h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
pre { background: #f4f4f4; padding: 1em; overflow-x: auto; }
code { font-family: monospace; background: #f4f4f4; padding: 0.2em 0.4em; }
blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 1em; }
    `;
    zip.file('OEBPS/style.css', styleCss);

    // 7. OEBPS/content.xhtml
    const contentXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
${xhtmlBody}
</body>
</html>`;
    zip.file('OEBPS/content.xhtml', contentXhtml);

    onProgress?.(85);

    // Generate the ZIP
    const blob = await zip.generateAsync({ 
      type: 'blob',
      mimeType: 'application/epub+zip',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });

    onProgress?.(100);

    return {
      success: true,
      blob
    };
  } catch (error) {
    console.error('EPUB conversion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during EPUB generation'
    };
  }
};

// Helper for escaping HTML special characters in plain text
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
