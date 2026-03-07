export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-sidebar p-12 text-sidebar-foreground">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              CH
            </span>
          </div>
          <span className="font-semibold text-lg">CommitHub</span>
        </div>
        <div>
          <blockquote className="text-xl font-medium leading-relaxed text-sidebar-foreground/90">
            Great things are done by a series of small things brought together.
          </blockquote>
          <p className="mt-4 text-sidebar-foreground/60 text-sm">
            — Vincent van Gogh
          </p>
        </div>
        <p className="text-sidebar-foreground/40 text-xs">
          © {new Date().getFullYear()} CommitHub. Internal Management System.
        </p>
      </div>
      {/* Right form panel */}
      <div className="flex items-center justify-center p-8">{children}</div>
    </div>
  );
}
