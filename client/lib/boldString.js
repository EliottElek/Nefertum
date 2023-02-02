export const renderBoldStrings = (string, words) => {
  // gets words parameters as array
  if (!words || words.length === 0 || !string) return;
  for (const word in words) {
    let re = new RegExp(`\\b${words[word]}s?\\b`, "gi");
    if (word == 0)
      string = string.replace(
        re,
        `<span style = "color : #cf46ca; font-weight: bold">${words[
          word
        ].toLowerCase()}</span>`
      );
    else
      string = string.replace(
        re,
        `<strong style = "color : orange; font-weight: bold">${words[
          word
        ].toLowerCase()}</strong>`
      );
  }
  return `"${string}"`;
};
