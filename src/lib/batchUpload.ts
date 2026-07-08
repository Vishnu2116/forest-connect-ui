// Uploads files in sequential batches of a given size.
// Calls uploader(batch) for each chunk; failures are captured but the loop continues.
// onProgress reports { uploaded, total, batchIndex, totalBatches } after each attempt.

export interface BatchProgress {
  uploaded: number;
  total: number;
  batchIndex: number;
  totalBatches: number;
}

export interface BatchResult {
  uploaded: number;
  failed: number;
  errors: { batchIndex: number; error: unknown }[];
}

export async function batchUpload(
  files: File[],
  batchSize: number,
  uploader: (batch: File[]) => Promise<unknown>,
  onProgress?: (p: BatchProgress) => void
): Promise<BatchResult> {
  const total = files.length;
  const totalBatches = Math.ceil(total / batchSize);
  let uploaded = 0;
  let failed = 0;
  const errors: { batchIndex: number; error: unknown }[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const batch = files.slice(i * batchSize, i * batchSize + batchSize);
    onProgress?.({ uploaded, total, batchIndex: i + 1, totalBatches });
    try {
      await uploader(batch);
      uploaded += batch.length;
    } catch (error) {
      failed += batch.length;
      errors.push({ batchIndex: i + 1, error });
    }
    onProgress?.({ uploaded, total, batchIndex: i + 1, totalBatches });
  }

  return { uploaded, failed, errors };
}
