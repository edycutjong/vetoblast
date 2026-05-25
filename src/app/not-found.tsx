import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6 font-sans">
      <div className="glass-card p-8 max-w-md w-full text-center flex flex-col items-center gap-6 border-red-500/20 glow-red relative overflow-hidden">
        {/* Cyber scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent pointer-events-none animate-scan" />
        
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center animate-pulse-danger">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-red-400 font-mono">
            404
          </h2>
          <h3 className="text-lg font-semibold font-mono text-[var(--text-high)]">
            Command Intercepted / Not Found
          </h3>
          <p className="text-xs text-[var(--text-mid)] font-mono leading-relaxed">
            The requested resource, command, or execution environment could not be verified by VetoBlast. Access denied.
          </p>
        </div>
        
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg font-mono text-xs bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all duration-200"
        >
          RETURN TO SECURITY HUB
        </Link>
      </div>
    </div>
  );
}
