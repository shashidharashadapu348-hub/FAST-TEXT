import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, File, Send, Zap, Search, Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShareOptions from '@/components/ShareOptions';
import FileDropZone from '@/components/FileDropZone';
import Header from '@/components/Header';
import { generateId } from '@/lib/idgen';
import { saveText, saveImage, saveFile, getExpirationMs, lookupCode, registerCode, type TextEntry, type ImageEntry, type FileEntry } from '@/lib/storage';
import { toast } from 'sonner';

const ShareCodeDisplay = ({ code, type }: { code: string; type: string }) => {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5 text-center space-y-2"
    >
      <p className="text-xs text-muted-foreground">Your {type} has been shared! Give this code:</p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl sm:text-3xl font-mono font-bold tracking-[0.3em] text-primary select-all">
          {code}
        </span>
        <Button size="sm" variant="ghost" onClick={copyCode} className="text-muted-foreground hover:text-primary">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        The other person enters this code on FastText.io to retrieve it.
      </p>
    </motion.div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  // Retrieve state
  const [retrieveCode, setRetrieveCode] = useState('');

  // Shared code display
  const [sharedCode, setSharedCode] = useState<{ code: string; type: string } | null>(null);

  // Text state
  const [text, setText] = useState('');
  const [textExpiration, setTextExpiration] = useState('1d');
  const [textBurn, setTextBurn] = useState(false);
  const [textPassword, setTextPassword] = useState('');

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageExpiration, setImageExpiration] = useState('1d');
  const [imageBurn, setImageBurn] = useState(false);
  const [imagePassword, setImagePassword] = useState('');

  // File state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileExpiration, setFileExpiration] = useState('1d');
  const [fileBurn, setFileBurn] = useState(false);
  const [filePassword, setFilePassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRetrieve = () => {
    const code = retrieveCode.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a code');
      return;
    }
    const mapping = lookupCode(code);
    if (!mapping) {
      toast.error('Code not found or expired');
      return;
    }
    navigate(mapping.path);
  };

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setUploadFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview('file');
    }
  }, []);

  const shareText = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }
    setLoading(true);
    const id = generateId();
    const expMs = getExpirationMs(textExpiration);
    const entry: TextEntry = {
      id,
      content: text,
      createdAt: Date.now(),
      expiresAt: expMs ? Date.now() + expMs : null,
      burnAfterRead: textBurn,
      password: textPassword || undefined,
      views: 0,
    };
    saveText(entry);
    const code = registerCode(id, 'text', `/t/${id}`);
    setSharedCode({ code, type: 'text' });
    setLoading(false);
    toast.success('Text shared!');
  };

  const shareImage = async () => {
    if (!imageFile || !imagePreview) {
      toast.error('Please select an image');
      return;
    }
    setLoading(true);
    const id = generateId();
    const expMs = getExpirationMs(imageExpiration);

    const img = new window.Image();
    img.src = imagePreview;
    await new Promise((resolve) => { img.onload = resolve; });

    const entry: ImageEntry = {
      id,
      fileName: imageFile.name,
      fileSize: imageFile.size,
      mimeType: imageFile.type,
      dataUrl: imagePreview,
      width: img.naturalWidth,
      height: img.naturalHeight,
      createdAt: Date.now(),
      expiresAt: expMs ? Date.now() + expMs : null,
      burnAfterRead: imageBurn,
      password: imagePassword || undefined,
      views: 0,
    };
    saveImage(entry);
    const code = registerCode(id, 'image', `/i/${id}`);
    setSharedCode({ code, type: 'image' });
    setLoading(false);
    toast.success('Image shared!');
  };

  const shareFile = async () => {
    if (!uploadFile) {
      toast.error('Please select a file');
      return;
    }
    setLoading(true);
    const id = generateId();
    const expMs = getExpirationMs(fileExpiration);

    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(uploadFile);
    });

    const entry: FileEntry = {
      id,
      fileName: uploadFile.name,
      fileSize: uploadFile.size,
      mimeType: uploadFile.type,
      dataUrl,
      createdAt: Date.now(),
      expiresAt: expMs ? Date.now() + expMs : null,
      burnAfterRead: fileBurn,
      password: filePassword || undefined,
      views: 0,
    };
    saveFile(entry);
    const code = registerCode(id, 'file', `/f/${id}`);
    setSharedCode({ code, type: 'file' });
    setLoading(false);
    toast.success('File shared!');
  };

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header />

      <main className="container max-w-3xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Zap className="h-3 w-3" />
            Instant anonymous sharing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Share Text, Images & Files
            <br />
            <span className="text-gradient-primary">Instantly.</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm sm:text-base">
            No sign-up. No tracking. Everything auto-deletes. Just paste, drop, and share.
          </p>
        </motion.div>

        {/* Retrieve by code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/60">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={retrieveCode}
              onChange={(e) => setRetrieveCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleRetrieve()}
              placeholder="Enter share code to retrieve..."
              className="border-0 bg-transparent h-8 font-mono tracking-widest text-sm uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans focus-visible:ring-0"
            />
            <Button
              onClick={handleRetrieve}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0"
            >
              Retrieve
            </Button>
          </div>
        </motion.div>

        {/* Shared code display */}
        {sharedCode && <ShareCodeDisplay code={sharedCode.code} type={sharedCode.type} />}

        {/* Main Share Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6"
        >
          <Tabs defaultValue="text" className="w-full" onValueChange={() => setSharedCode(null)}>
            <TabsList className="w-full bg-secondary border border-border h-11">
              <TabsTrigger value="text" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <FileText className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <ImageIcon className="h-4 w-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="file" className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <File className="h-4 w-4" />
                File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-4 space-y-4">
              <Textarea
                placeholder="Paste your text, code, or markdown here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[240px] bg-card border-border font-mono text-sm resize-y focus:ring-primary/30 placeholder:text-muted-foreground/50"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <ShareOptions
                  expiration={textExpiration}
                  setExpiration={setTextExpiration}
                  burnAfterRead={textBurn}
                  setBurnAfterRead={setTextBurn}
                  password={textPassword}
                  setPassword={setTextPassword}
                />
                <Button
                  onClick={shareText}
                  disabled={loading || !text.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary gap-2"
                >
                  <Send className="h-4 w-4" />
                  Share Text
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-4 space-y-4">
              <FileDropZone
                onFileSelect={handleImageSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                maxSize={15 * 1024 * 1024}
                label="Drop an image, GIF, or sticker"
                selectedFile={imageFile}
                preview={imagePreview}
                onClear={() => { setImageFile(null); setImagePreview(null); }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <ShareOptions
                  expiration={imageExpiration}
                  setExpiration={setImageExpiration}
                  burnAfterRead={imageBurn}
                  setBurnAfterRead={setImageBurn}
                  password={imagePassword}
                  setPassword={setImagePassword}
                />
                <Button
                  onClick={shareImage}
                  disabled={loading || !imageFile}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary gap-2"
                >
                  <Send className="h-4 w-4" />
                  Share Image
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="file" className="mt-4 space-y-4">
              <FileDropZone
                onFileSelect={handleFileSelect}
                accept="*/*"
                maxSize={10 * 1024 * 1024}
                label="Drop any file (up to 10MB)"
                selectedFile={uploadFile}
                preview={filePreview}
                onClear={() => { setUploadFile(null); setFilePreview(null); }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <ShareOptions
                  expiration={fileExpiration}
                  setExpiration={setFileExpiration}
                  burnAfterRead={fileBurn}
                  setBurnAfterRead={setFileBurn}
                  password={filePassword}
                  setPassword={setFilePassword}
                />
                <Button
                  onClick={shareFile}
                  disabled={loading || !uploadFile}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary gap-2"
                >
                  <Send className="h-4 w-4" />
                  Share File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12"
        >
          {[
            { icon: FileText, title: 'Text & Code', desc: 'Paste text or code → get a share code instantly' },
            { icon: ImageIcon, title: 'Images & GIFs', desc: 'Drop images, GIFs, stickers → share with a code' },
            { icon: File, title: 'Any File', desc: 'Upload files up to 10MB → retrieve anywhere' },
          ].map((card, i) => (
            <div
              key={i}
              className="p-5 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all group"
            >
              <div className="p-2 rounded-md bg-primary/10 w-fit mb-3 group-hover:bg-primary/20 transition-colors">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </div>
          ))}
        </motion.div>

        <footer className="text-center mt-16 pb-8 text-xs text-muted-foreground">
          <p>© FastText.io • Everything auto-deletes after expiration • No tracking</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
