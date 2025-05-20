function flattenLandingLinks(links) {
  const result = [];

  function traverse(linkArray) {
    linkArray.forEach(({ key, element, children }) => {
      if (key && element) {
        result.push({
          path: key,
          element: element
        });
      }
      if (children) {
        traverse(children);
      }
    });
  }

  traverse(links);
  return result;
}

const findItemByKey = (links, key) => {
  for (const link of links) {
    if (link.key === key && link.element) {
      return link;
    }
    if (link.children) {
      const found = findItemByKey(link.children, key);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

export { flattenLandingLinks, findItemByKey };
