import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <div className="text-center mb-10 opacity-0 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
        <Sparkles className="w-4 h-4" />
        <span>Your Workspace</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight mb-3">
        App Menu
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
        Access all your favorite tools in one place
      </p>
    </div>
  );
};

export default Header;
