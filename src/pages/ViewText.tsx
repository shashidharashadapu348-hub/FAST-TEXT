import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, ExternalLink, Eye, Clock, ArrowLeft, Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { getText, markTextViewed, formatTimeAgo } from '@/lib/storage';
import type { TextEntry } from '@/lib/storage';
import { toast } from 'sonner';

const ViewText = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<TextEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [locked, setLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (!id) return;
    const data = getText(id);
    if (!data) {
      setNotFound(true);
      return;
    }
    if (data.password) {
      setLocked(true);
      setEntry(data);
    } else {
      markTextViewed(id);
      setEntry(data);
    }
  }, [id]);

  const unlock = () => {
    if (entry && passwordInput === entry.password) {
      setLocked(false);
      markTextViewed(id!);
      toast.success('Unlocked!');
    } else {
      toast.error('Wrong password');
    }
  };

  const copyText = () => {
    if (entry) {
      navigator.clipboard.writeText(entry.content);
      toast.success('Copied to clipboard');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-background bg-grid">
        <Header />
        <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-6xl mb-4">🔥</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Gone!</h1>
            <p className="text-muted-foreground mb-6">
              This paste has expired, was burned after reading, or never existed.
            </p>
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
            <p className="text-sm text-muted-foreground">Enter the password to view this paste.</p>
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

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <ArrowLeft className="h-3 w-3" /> New paste
            </Link>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTimeAgo(entry.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {entry.views} view{entry.views !== 1 ? 's' : ''}
            </span>
            {entry.burnAfterRead && (
              <span className="text-destructive flex items-center gap-1">🔥 Burns after read</span>
            )}
          </div>

          {/* Content */}
          <div className="relative rounded-lg border border-border bg-card overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <Button size="sm" variant="ghost" onClick={copyText} className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                <Copy className="h-3 w-3" /> Copy
              </Button>
              <Button size="sm" variant="ghost" onClick={copyLink} className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3" /> Link
              </Button>
              <Link to={`/t/${id}/raw`}>
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                  <FileText className="h-3 w-3" /> Raw
                </Button>
              </Link>
            </div>
            <pre className="p-4 pt-12 overflow-x-auto text-sm font-mono text-foreground whitespace-pre-wrap break-words min-h-[200px]">
              {entry.content}
            </pre>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ViewText;
