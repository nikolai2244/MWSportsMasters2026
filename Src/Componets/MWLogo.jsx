export default function MWLogo({ className = "h-8" }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg viewBox="0 0 40 40" className="h-full w-auto" fill="none">
                <circle cx="20" cy="20" r="19" fill="hsl(100 48% 32%)" stroke="hsl(45 70% 47%)" strokeWidth="1.5" />
                <path
                    d="M10 26 L14 14 L18 22 L20 16 L22 22 L26 14 L30 26"
                    stroke="hsl(42 30% 90%)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <circle cx="20" cy="11" r="2" fill="hsl(45 70% 47%)" />
            </svg>
            <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-wide text-foreground">MayorWard</span>
                <span className="font-display text-[0.6rem] tracking-[0.35em] text-muted-foreground uppercase">Sports</span>
            </div>
        </div>
    );
}