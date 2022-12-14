export const parseDetails = (str = ""): any[] => {
  if (!str) return [];
  const details = str
    .replace(/<\/?p>/gim, "")
    .replace(/<br>/gim, "\n")
    .replace("\n{2,}", "\n\n")
    .split("\n")
    .map((el) => {
      return el
        .split(/:(?!\/\/|\d)/)
        .map((s) => s.trim())
        .filter((s) => s)
        .map((s) =>
          parseMarkdown(s)
            .replace(/^<p>/, "")
            .replace(/<\/p>\n$/, "")
            .replace(" href", ' target="_blank" href'),
        );
    })
    .map((row) => {
      if (row[1]) {
        row[0] = `${row[0]}:`;
      }
      return row;
    });

  return details;
};
