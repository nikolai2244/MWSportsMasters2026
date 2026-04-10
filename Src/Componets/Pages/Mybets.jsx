import { useState, useEffect } from "react";
// import { base44 } from "@/api/base44Client";
import VIPGate from "../components/VIPGate";
import KPICards from "../components/KPICards";
import BetTable from "../components/BetTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const GROUP_COLUMNS = [
    { key: "player_name", label: "MY PICK" },
    { key: "line_detail", label: "MATCH-UP" },
    { key: "odds", label: "ODDS" },
    { key: "stake", label: "STAKE" },
    { key: "sportsbook", label: "BOOK" },
    { key: "status", label: "STATUS" },
];

const FINISH_COLUMNS = [
    { key: "player_name", label: "PLAYER" },
    { key: "odds", label: "ODDS" },
    { key: "stake", label: "STAKE" },
    { key: "current_position", label: "CURRENT POS", render: (b) => <span className="font-mono text-xs">{b.current_position ? `#${b.current_position}` : "—"}</span> },
    { key: "status", label: "STATUS" },
];

const BIRDIE_COLUMNS = [
    { key: "player_name", label: "PLAYER" },
    { key: "round", label: "ROUND" },
    { key: "line_detail", label: "LINE" },
    { key: "pick", label: "PICK" },
    { key: "odds", label: "ODDS" },
    { key: "stake", label: "STAKE" },
    { key: "status", label: "STATUS" },
];

export default function MyBets() {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // base44.entities.Bet.list("-created_date", 200).then((data) => {
            setBets(data);
            setLoading(false);
        });
    }, []);

    const groupBets = bets.filter(b => b.bet_type === "Group Match-Up");
    const top30 = bets.filter(b => b.bet_type === "Top 30");
    const top20 = bets.filter(b => b.bet_type === "Top 20");
    const top10 = bets.filter(b => b.bet_type === "Top 10");
    const top5 = bets.filter(b => b.bet_type === "Top 5");
    const birdies = bets.filter(b => b.bet_type === "Round Birdies");

    return (
        <VIPGate>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="font-display text-3xl font-bold mb-6">🎯 My Masters Bets</h1>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <KPICards bets={bets} />

                        <div className="mt-8 space-y-8">
                            {/* Group Match-Ups */}
                            <section>
                                <h2 className="font-display text-xl font-bold mb-4">Group Match-Ups</h2>
                                <BetTable bets={groupBets} columns={GROUP_COLUMNS} />
                            </section>

                            {/* Tournament Finishing Place Bets */}
                            <section>
                                <h2 className="font-display text-xl font-bold mb-4">Finishing Place Bets</h2>
                                <Tabs defaultValue="top30" className="w-full">
                                    <TabsList className="bg-surface2 mb-4">
                                        <TabsTrigger value="top30" className="text-xs font-mono">Top 30</TabsTrigger>
                                        <TabsTrigger value="top20" className="text-xs font-mono">Top 20</TabsTrigger>
                                        <TabsTrigger value="top10" className="text-xs font-mono">Top 10</TabsTrigger>
                                        <TabsTrigger value="top5" className="text-xs font-mono">Top 5</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="top30"><BetTable bets={top30} columns={FINISH_COLUMNS} /></TabsContent>
                                    <TabsContent value="top20"><BetTable bets={top20} columns={FINISH_COLUMNS} /></TabsContent>
                                    <TabsContent value="top10"><BetTable bets={top10} columns={FINISH_COLUMNS} /></TabsContent>
                                    <TabsContent value="top5"><BetTable bets={top5} columns={FINISH_COLUMNS} /></TabsContent>
                                </Tabs>
                            </section>

                            {/* Birdies */}
                            <section>
                                <h2 className="font-display text-xl font-bold mb-4">Birdies for the Round</h2>
                                <BetTable bets={birdies} columns={BIRDIE_COLUMNS} />
                            </section>
                        </div>
                    </>
                )}
            </div>
        </VIPGate>
    );
}
