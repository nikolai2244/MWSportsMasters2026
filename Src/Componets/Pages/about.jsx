import { motion } from "framer-motion";

export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">About MayorWard Sports</h1>

                {/* OWNER: Add your full About content here */}
                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-base">
                        MayorWard Sports is your premier destination for data-driven sports betting insights
                        and analytics. Founded with a passion for sports and a commitment to rigorous analysis,
                        we deliver picks and insights that give our VIP members a real edge. Welcome to our exclusive Masters 2026 Picks!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <div className="rounded-xl border border-border/50 bg-card p-6">
                            <h3 className="font-display text-xl font-bold mb-3 text-gold">Our Mission</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                To provide the most accurate, data-backed sports betting analysis
                                available. We combine statistical modeling with deep tournament knowledge. Made by everyday players for all players.
                            </p>
                        </div>
                        <div className="rounded-xl border border-border/50 bg-card p-6">
                            <h3 className="font-display text-xl font-bold mb-3 text-gold">Our Approach</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Every pick is backed by analysis,our 3+ year simulator, expert analysis, and more!
                                 With over 27k won this year on golf using low-mid wagers we have decided to open this exlusive Masters Weekend Picks to the public not just our select private VIP members.
                            </p>
                        </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-base">
                        Whether it's The Masters, MLB props, or NHL action
                        covers the biggest events with the sharpest analysis as well as finding you the best 'sleeper' picks to keep you ahead of the books.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}