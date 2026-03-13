import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Eye, Clock, ArrowLeft, Lock, Download, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { getFile, markFileViewed, formatFileSize, formatTimeAgo } from '@/lib/storage';
import type { FileEntry } from '@/lib/storage';
import { toast } from 'sonner';

const ViewFile = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<FileEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [locked, setLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (!id) return;
    const data = getFile(id);
    if (!data) {
      setNotFound(true);
      return;
    }
    if (data.password) {
      setLocked(true);
      setEntry(data);
    } else {
      markFileViewed(id);
      setEntry(data);
    }
  }, [id]);

  const unlock = () => {
    if (entry && passwordInput === entry.password) {
      setLocked(false);
      markFileViewed(id!);
      toast.success('Unlocked!');
    } else {
      toast.error('Wrong password');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  };

  const downloadFile = () => {
    if (!entry) return;
    const a = document.createElement('a');
    a.href = entry.dataUrl;
    a.download = entry.fileName;
    a.click();
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-background bg-grid">
        <Header />
        <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-6xl mb-4">📁</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">File Not Found</h1>
            <p className="text-muted-foreground mb-6">This file has expired, was burned, or never existed.</p>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to FastText
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!entry) return null;

  if (locked) {
    return (
      <div className="min-h-screen bg-background bg-grid">
        <Header />
        <div className="container max-w-md mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Lock className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-xl font-bold text-foreground">Password Protected</h1>
            <div className="flex gap-2 max-w-xs mx-auto">
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && unlock()}
                placeholder="Password"
                className="bg-card border-border"
              />
              <Button onClick={unlock} className="bg-primary text-primary-foreground">Unlock</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const isImage = entry.mimeType.startsWith('image/');
  const isPdf = entry.mimeType === 'application/pdf';

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" /> New upload
            </Link>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTimeAgo(entry.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {entry.views} view{entry.views !== 1 ? 's' : ''}
            </span>
            {entry.burnAfterRead && (
              <span className="text-destructive flex items-center gap-1">🔥 Burns after view</span>
            )}
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {isImage ? (
              <img src={entry.dataUrl} alt={entry.fileName} className="w-full max-h-[70vh] object-contain bg-secondary/20" />
            ) : isPdf ? (
              <iframe src={entry.dataUrl} className="w-full h-[70vh]" title={entry.fileName} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <File className="h-16 w-16 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Preview not available</p>
              </div>
            )}
          </div>

          {/* Info + actions */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <File className="h-3 w-3" />
              <span>{entry.fileName}</span>
              <span>•</span>
              <span>{formatFileSize(entry.fileSize)}</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={copyLink} className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                <Copy className="h-3 w-3" /> Copy Link
              </Button>
              <Button size="sm" variant="ghost" onClick={downloadFile} className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ViewFile;
