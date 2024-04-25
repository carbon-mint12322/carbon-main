export function processDocumentName(input : string) {
  var processedName = input.replace(/.*?(Documents)/, function(match, group) {
    return group ? group.toLowerCase() : input;
  });

  return processedName;
}