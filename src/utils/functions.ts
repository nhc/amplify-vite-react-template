export function parseS3Filename(filename: string) {
  //console.log("FILENAME _ ", filename, filename.length);
  const parts = filename.split("/");
  const user = parts.pop();
  const name = user?.split("/").pop();
  return { user, name };
}
