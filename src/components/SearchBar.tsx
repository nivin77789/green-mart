import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative max-w-md mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="glass-card rounded-2xl px-5 py-3 flex items-center gap-3 transition-all duration-300 hover:shadow-glass-lg focus-within:shadow-glass-lg focus-within:ring-2 focus-within:ring-primary/20">
        <Search className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Search apps..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium"
        />
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/80 text-xs text-muted-foreground font-medium">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};

export default SearchBar;
