async function getFaviconHref(url: string) {
    const response = await fetch(url);
    const text = await response.text();
  
    const faviconTest = /<link\s+(?:rel=['"]shortcut icon['"]|rel=['"]icon['"])\s+href=['"](.*?)['"]/;
    const match = faviconTest.exec(text);
  
    if (match) {
      return match[1];
    } else {
      throw 'Favicon not found';
    }
  }
  
export default getFaviconHref