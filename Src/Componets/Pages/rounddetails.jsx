import { useState, useEffect } from "react";
// import { base44 } from "@/api/base44Client";
import VIPGate from "../components/VIPGate";
import BetTable from "../components/BetTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { TOURNAMENT_INFO } from "@/lib/demoData";

const ROUNDS = ["R1", "R2", "R3", "R4"];

const GROUP_COLS = [
    { key: "player_name", label: "MY PICK" },
    { key: "group_players", label: "GROUP", render: (b) => <span className="text-xs text-muted-foreground">{b.group_players?.join(", ") || "—"}</span> },
    { key: "odds", label: "ODDS" },
    { key: "stake", label: "STAKE" },
    { key: "status", label: "STATUS" },
];

const STROKES_COLS = [
    { key: "player_name", label: "PLAYER" },
    { key: "line_detail", label: "LINE" },
    { key: "pick", label: "PICK" },
    { key: "odds", label: "ODDS" },
    { key: "stake", label: "STAKE" },
    { key: "actual_score", label: "ACTUAL", render: (b) => <span className="font-mono text-xs">{b.actual_score ?? "—"}</span> },
    { key: "status", label: "STATUS" },
];

const BIRDIE_COLS = [
    { key: "player_name", label: "PLAYER" },
    { key: "line_detail", label: "LINE" },
    { key: "pick", label: "PICK" },
    { key: "odds", label: "ODDS" },
    { key: "stake", label: "STAKE" },
    { key: "status", label: "STATUS" },
];

const BOGEY_COLS = [...BIRDIE_COLS];

export default function RoundDetails() {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // base44.entities.Bet.list("-created_date", 200).then((data) => {
            setBets(data);
            setLoading(false);
        });
    }, []);

    const getRoundBets = (round, type) => bets.filter(b => b.round === round && b.bet_type === type);

    const getRoundBadge = (round) => {
        const roundNum = parseInt(round.replace("R", ""));
        if (roundNum < TOURNAMENT_INFO.currentRound) return <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">FINAL</span>;
        if (roundNum === TOURNAMENT_INFO.currentRound) return <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-loss/10 text-loss"><span className="live-dot inline-block w-1.5 h-1.5 rounded-full bg-loss mr-1" />LIVE</span>;
        return null;
    };

    return (
        <VIPGate>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="font-display text-3xl font-bold mb-6">⛳ Round Details</h1>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Tabs defaultValue="R1" className="w-full">
                        <TabsList className="bg-surface2 mb-6">
                            {ROUNDS.map(r => (
                                <TabsTrigger key={r} value={r} className="text-xs font-mono">
                                    {r} {getRoundBadge(r)}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {ROUNDS.map(round => (
                            <TabsContent key={round} value={round}>
                                <Accordion type="multiple" defaultValue={["group", "strokes", "birdies", "bogeys"]} className="space-y-3">
                                    <AccordionItem value="group" className="border border-border/50 rounded-lg overflow-hidden bg-card">
                                        <AccordionTrigger className="px-4 py-3 hover:bg-surface-offset/50 font-display text-lg font-bold">
                                            Group Winner (Pairing Bets)
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <BetTable bets={getRoundBets(round, "Group Match-Up")} columns={GROUP_COLS} emptyMessage="No group bets for this round." />
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="strokes" className="border border-border/50 rounded-lg overflow-hidden bg-card">
                                        <AccordionTrigger className="px-4 py-3 hover:bg-surface-offset/50 font-display text-lg font-bold">
                                            Round Strokes (Total Score)
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <BetTable bets={getRoundBets(round, "Round Strokes")} columns={STROKES_COLS} emptyMessage="No strokes bets for this round." />
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="birdies" className="border border-border/50 rounded-lg overflow-hidden bg-card">
                                        <AccordionTrigger className="px-4 py-3 hover:bg-surface-offset/50 font-display text-lg font-bold">
                                            Round Birdies
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <BetTable bets={getRoundBets(round, "Round Birdies")} columns={BIRDIE_COLS} emptyMessage="No birdie bets for this round." />
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="bogeys" className="border border-border/50 rounded-lg overflow-hidden bg-card">
                                        <AccordionTrigger className="px-4 py-3 hover:bg-surface-offset/50 font-display text-lg font-bold">
                                            Round Bogeys
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4">
                                            <BetTable bets={getRoundBets(round, "Round Bogeys")} columns={BOGEY_COLS} emptyMessage="No bogey bets for this round." />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </VIPGate>
    );
}
