if (typeof window !== 'undefined') {
  if (window.lazySizes === undefined) {
    import('lazysizes').catch(error => false);
    // If we do this import it will break the SVGSpritemapPlugin during webpack build.
    // import('lazysizes/plugins/attrchange/ls.attrchange').catch(error => false);
  } else {
    window.lazySizes.loader.checkElems();
  }
}

console.log('Client Side Rendering');