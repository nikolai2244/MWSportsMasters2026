import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import VIPGate from "../components/VIPGate";
import BetTable from "../components/BetTable";
import StatusBadge from "../components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { DEMO_LEADERBOARD } from "@/lib/demoData";

const COLUMNS = [
    { key: "player_name", label: "PLAYER" },
    { key: "odds", label: "ODDS" },
    { key: "stake", label: "STAKE" },
    { key: "sportsbook", label: "BOOK" },
    {
        key: "position_display",
        label: "CURRENT POS",
        render: (bet) => {
            const player = DEMO_LEADERBOARD.find(p => p.name === bet.player_name);
            const pos = player?.pos || bet.current_position;
            if (!pos) return <span className="text-xs text-muted-foreground">—</span>;
            return <span className="font-mono text-xs font-bold">#{pos}</span>;
        }
    },
    { key: "status", label: "STATUS" },
];

const TABS = ["Top 30", "Top 20", "Top 10", "Top 5"];

export default function TournamentFinishes() {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        base44.entities.Bet.list("-created_date", 200).then((data) => {
            setBets(data.filter(b => ["Top 30", "Top 20", "Top 10", "Top 5"].includes(b.bet_type)));
            setLoading(false);
        });
    }, []);

    return (
        <VIPGate>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="font-display text-3xl font-bold mb-6">🏆 Tournament Finishes</h1>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Tabs defaultValue="Top 30" className="w-full">
                        <TabsList className="bg-surface2 mb-6">
                            {TABS.map(tab => (
                                <TabsTrigger key={tab} value={tab} className="text-xs font-mono">{tab}</TabsTrigger>
                            ))}
                        </TabsList>
                        {TABS.map(tab => (
                            <TabsContent key={tab} value={tab}>
                                <BetTable
                                    bets={bets.filter(b => b.bet_type === tab)}
                                    columns={COLUMNS}
                                    emptyMessage={`No ${tab} bets entered yet.`}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </VIPGate>
    );
}