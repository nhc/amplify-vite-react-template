export function parseS3Filename(filename: string) {
  //console.log("FILENAME _ ", filename, filename.length);
  const parts = filename.split("/");
  const user = parts.pop();
  const name = user?.split("/").pop();
  return { user, name };
}

export const extractValues = (jsonString: string) => {
  // First remove the outer quotes and parse escaped characters

  const cleanString = jsonString
    .slice(1, -1)
    // eslint-disable-next-line no-useless-escape
    .replace(/\\\"/g, '"')
    .replace(/\\n/g, "\n");

  // Split into individual JSON objects
  const lines = cleanString.split("\n");

  // Extract values and filter empty lines
  const values = lines
    .map((line) => {
      const final = line.replace(/\\/g, "").replace(/\\n/g, "\n");
      //console.log("final _ ");
      try {
        const parsed = JSON.parse(final);
        //console.log("parsed _ ", parsed);
        return parsed.Text;
      } catch (e) {
        return "";
      }
    })
    .filter((text) => text); // Remove empty lines and single hyphens

  // Join with newlines
  return values.join("\n");
};
