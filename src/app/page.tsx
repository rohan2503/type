import TypingInterface from '@/components/TypingInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-900 relative overflow-hidden">
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-zinc-900/10 to-black/0" />
      
      {/* Minimal glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-medium text-white/90 tracking-tight">
              type<span className="text-red-500">.</span>
            </h1>
          </div>
          <TypingInterface />
        </div>
        
        {/* Footer */}
        <footer className="w-full py-4 px-4 mt-auto">
          <div className="container mx-auto text-center">
            <p className="text-sm text-white/30 tracking-wide">
              &copy; {new Date().getFullYear()} rohan &middot; all rights reserved
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
