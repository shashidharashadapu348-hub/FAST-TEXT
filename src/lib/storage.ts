export interface TextEntry {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number | null; // null = never
  burnAfterRead: boolean;
  password?: string;
  views: number;
}

export interface ImageEntry {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  dataUrl: string; // base64 data URL for localStorage demo
  width?: number;
  height?: number;
  createdAt: number;
  expiresAt: number | null;
  burnAfterRead: boolean;
  password?: string;
  views: number;
}

export interface FileEntry {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  dataUrl: string;
  createdAt: number;
  expiresAt: number | null;
  burnAfterRead: boolean;
  password?: string;
  views: number;
}

const TEXT_PREFIX = 'ft_text_';
const IMAGE_PREFIX = 'ft_image_';
const FILE_PREFIX = 'ft_file_';

function isExpired(entry: { expiresAt: number | null }): boolean {
  if (!entry.expiresAt) return false;
  return Date.now() > entry.expiresAt;
}

// Text storage
export function saveText(entry: TextEntry): void {
  localStorage.setItem(TEXT_PREFIX + entry.id, JSON.stringify(entry));
}

export function getText(id: string): TextEntry | null {
  const raw = localStorage.getItem(TEXT_PREFIX + id);
  if (!raw) return null;
  const entry: TextEntry = JSON.parse(raw);
  if (isExpired(entry)) {
    localStorage.removeItem(TEXT_PREFIX + id);
    return null;
  }
  return entry;
}

export function markTextViewed(id: string): void {
  const entry = getText(id);
  if (!entry) return;
  entry.views += 1;
  if (entry.burnAfterRead && entry.views >= 1) {
    // Keep it for this view but mark for deletion
    entry.expiresAt = Date.now(); 
  }
  localStorage.setItem(TEXT_PREFIX + id, JSON.stringify(entry));
}

export function deleteText(id: string): void {
  localStorage.removeItem(TEXT_PREFIX + id);
}

// Image storage
export function saveImage(entry: ImageEntry): void {
  localStorage.setItem(IMAGE_PREFIX + entry.id, JSON.stringify(entry));
}

export function getImage(id: string): ImageEntry | null {
  const raw = localStorage.getItem(IMAGE_PREFIX + id);
  if (!raw) return null;
  const entry: ImageEntry = JSON.parse(raw);
  if (isExpired(entry)) {
    localStorage.removeItem(IMAGE_PREFIX + id);
    return null;
  }
  return entry;
}

export function markImageViewed(id: string): void {
  const entry = getImage(id);
  if (!entry) return;
  entry.views += 1;
  if (entry.burnAfterRead && entry.views >= 1) {
    entry.expiresAt = Date.now();
  }
  localStorage.setItem(IMAGE_PREFIX + id, JSON.stringify(entry));
}

// File storage
export function saveFile(entry: FileEntry): void {
  localStorage.setItem(FILE_PREFIX + entry.id, JSON.stringify(entry));
}

export function getFile(id: string): FileEntry | null {
  const raw = localStorage.getItem(FILE_PREFIX + id);
  if (!raw) return null;
  const entry: FileEntry = JSON.parse(raw);
  if (isExpired(entry)) {
    localStorage.removeItem(FILE_PREFIX + id);
    return null;
  }
  return entry;
}

export function markFileViewed(id: string): void {
  const entry = getFile(id);
  if (!entry) return;
  entry.views += 1;
  if (entry.burnAfterRead && entry.views >= 1) {
    entry.expiresAt = Date.now();
  }
  localStorage.setItem(FILE_PREFIX + id, JSON.stringify(entry));
}

// Share code system — maps short uppercase codes to content paths
const CODE_PREFIX = 'ft_code_';

interface CodeMapping {
  code: string;
  entryId: string;
  type: 'text' | 'image' | 'file';
  path: string;
  createdAt: number;
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function registerCode(entryId: string, type: 'text' | 'image' | 'file', path: string): string {
  const code = generateShareCode();
  const mapping: CodeMapping = { code, entryId, type, path, createdAt: Date.now() };
  localStorage.setItem(CODE_PREFIX + code, JSON.stringify(mapping));
  return code;
}

export function lookupCode(code: string): CodeMapping | null {
  const raw = localStorage.getItem(CODE_PREFIX + code.toUpperCase());
  if (!raw) return null;
  return JSON.parse(raw);
}

// Expiration helpers
export function getExpirationMs(option: string): number | null {
  switch (option) {
    case '1h': return 60 * 60 * 1000;
    case '1d': return 24 * 60 * 60 * 1000;
    case '7d': return 7 * 24 * 60 * 60 * 1000;
    case 'never': return null;
    default: return 24 * 60 * 60 * 1000;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
