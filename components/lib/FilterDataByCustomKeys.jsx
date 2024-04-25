export function filterDataByCustomKeys(data, searchvalue, keys) {
  const lowerSearchValue = searchvalue.replace(/\s+/g, ' ').trim().toLowerCase();
  return data.filter((item) => {
    return keys.some((key) => {
      const nestedKeys = key.split('.'); // Split nested keys by dot (.)
      return hasSearchValue(item, nestedKeys, lowerSearchValue);
    });
  });
}

// Helper function to check if the object has the search value in any of its keys or arrays
function hasSearchValue(obj, keys, searchvalue) {
  if (keys.length === 0) {
    // Base case: No more keys to traverse, check if object value matches search value
    if (
      (typeof obj === 'string' || typeof obj === 'number') &&
      obj.toString().toLowerCase().includes(searchvalue)
    ) {
      return true;
    }
    if (Array.isArray(obj)) {
      return obj.some((item) => hasSearchValue(item, keys, searchvalue));
    }
    return false;
  }

  const [currentKey, ...remainingKeys] = keys;
  if (Object.prototype.hasOwnProperty.call(obj, currentKey)) {
    const currentValue = obj[currentKey];
    if (Array.isArray(currentValue)) {
      return currentValue.some((item) => {
        if (hasSearchValue(item, remainingKeys, searchvalue)) {
          return true;
        } else {
          return false;
        }
      });
    }
    return hasSearchValue(currentValue, remainingKeys, searchvalue);
  }
  return false;
}
