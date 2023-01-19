export const renderBoldStrings = (string, words) => {
  // gets words parameters as array
  if (!words || words.length === 0 || !string) return;
  for (const word in words) {
    let re = new RegExp(`\\b${words[word]}s?\\b`, "gi");
    string = string.replace(
      re,
      `<strong style = "color : rgb(147 51 234); font-weight: bold">${words[
        word
      ].toLowerCase()}</strong>`
    );
  }
  return `"${string}"`;
};
