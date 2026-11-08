/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB limit
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/x-pdf',
  'application/acrobat',
  'applications/vnd.pdf',
  'text/pdf',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePdfFile(file: { name: string; size: number; type?: string }): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file was provided.' };
  }

  const fileName = file.name ? file.name.toLowerCase() : '';
  if (!fileName.endsWith('.pdf')) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a standard PDF document (.pdf).',
    };
  }

  // Allow standard PDF mimes, as well as octet-stream or empty type when the file extension is .pdf
  const mime = (file.type || '').toLowerCase();
  const isAcceptedMime =
    ALLOWED_MIME_TYPES.includes(mime) ||
    mime === '' ||
    mime === 'application/octet-stream';

  if (!isAcceptedMime) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type}". Only valid PDF files are accepted.`,
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'The uploaded file appears to be empty (0 bytes).',
    };
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb} MB). The maximum allowed PDF size is 25 MB.`,
    };
  }

  return { valid: true };
}
