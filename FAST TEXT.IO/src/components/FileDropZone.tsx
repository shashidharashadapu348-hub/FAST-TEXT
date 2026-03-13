import { useCallback, useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { formatFileSize } from '@/lib/storage';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
  maxSize: number; // bytes
  label: string;
  selectedFile: File | null;
  preview: string | null;
  onClear: () => void;
}

const FileDropZone = ({ onFileSelect, accept, maxSize, label, selectedFile, preview, onClear }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError('');
    if (file.size > maxSize) {
      setError(`File too large. Max ${formatFileSize(maxSize)}`);
      return;
    }
    onFileSelect(file);
  }, [maxSize, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        break;
      }
    }
  }, [handleFile]);

  if (selectedFile && preview) {
    return (
      <div className="relative rounded-lg border border-border bg-secondary/50 p-4">
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-4">
          {selectedFile.type.startsWith('image/') ? (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-md border border-border"
            />
          ) : (
            <div className="h-24 w-24 flex items-center justify-center rounded-md border border-border bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatFileSize(selectedFile.size)}</p>
            <p className="text-xs text-muted-foreground">{selectedFile.type}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onPaste={handlePaste}
      onClick={() => inputRef.current?.click()}
      tabIndex={0}
      className={`
        relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all
        ${isDragging
          ? 'border-primary bg-primary/5 glow-primary'
          : 'border-border hover:border-muted-foreground bg-secondary/30 hover:bg-secondary/50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 rounded-full bg-primary/10">
          <ImageIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Drag & drop, paste (Ctrl+V), or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Max {formatFileSize(maxSize)}
          </p>
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive mt-2">{error}</p>
      )}
    </div>
  );
};

export default FileDropZone;
