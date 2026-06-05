/**
 * Extracts the original filename from a UUID-prefixed path.
 * Format: /uploads/.../uuid-original-name.ext
 * UUID is 36 chars + 1 hyphen = skip first 37 chars
 */
export const getOriginalFilename = (filePath: string): string => {
  if (!filePath) return 'download';
  const filename = filePath.split('/').pop() || 'download';
  // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx = 36 chars
  // Plus one hyphen separator = 37 chars total to skip
  if (filename.length > 37) {
    return filename.substring(37);
  }
  return filename;
};
