async function getFaviconHref(url: string) {
  try {
    const faviconUrl = url+'/favicon.ico';
    const response = await fetch(faviconUrl);
    if (response.ok) {
      return faviconUrl; // 如果可访问,直接返回这个路径
    }
  } catch (error) {
    
  }
    const response = await fetch(url);
    const text = await response.text();
  
    const faviconTest = /<link\s+(?:rel=['"]shortcut icon['"]|rel=['"]icon['"])\s+href=['"](.*?)['"]/;
    console.log('text',text)
    const match = faviconTest.exec(text);
  
    if (match) {
      console.log('match',match)
      return match[1];
    } else {
      throw 'Favicon not found';
    }
}
  
export default getFaviconHref