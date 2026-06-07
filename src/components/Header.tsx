import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo.png"
            alt="FastText logo"
            className="h-8 w-8 rounded-md object-cover"
          />
          <span className="font-bold text-lg tracking-tight text-foreground">
            Fast<span className="text-primary">Text</span>
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
