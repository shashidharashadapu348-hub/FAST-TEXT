import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Fast<span className="text-primary">Text</span>
            <span className="text-muted-foreground text-sm font-normal">.io</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Anonymous • No tracking • Auto-delete</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
