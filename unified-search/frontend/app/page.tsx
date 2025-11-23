export default function Home() {
    return (
      <div className="relative min-h-screen w-full bg-background overflow-hidden">
        {/* decorative orbs */}
        <div className="orb orb--tl" />
        <div className="orb orb--br" />
  
        {/* all visible content above orbs */}
        <main className="relative z-20 page-content">
          <div className="p-8 text-left text-foreground">
            <h1 className="text-6xl font-instrument">komo</h1>
            <p className="mt-2 text-lg font-hanken">get into it.</p>
          </div>
          <div className="container">
            <div></div>
          </div>

        </main>
      </div>
    );
  }