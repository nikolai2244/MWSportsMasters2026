import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "../statusbadge";
import { Trash2, Loader2 } from "lucide-react";

export default function BetManagement({ bets, onRefresh }) {
    const [updating, setUpdating] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const handleStatusChange = async (betId, newStatus) => {
        setUpdating(betId);
        await base44.entities.Bet.update(betId, { status: newStatus });
        setUpdating(null);
        onRefresh?.();
    };

    const handleDelete = async (betId) => {
        if (!window.confirm("Delete this bet?")) return;
        setDeleting(betId);
        await base44.entities.Bet.delete(betId);
        setDeleting(null);
        onRefresh?.();
    };

    if (bets.length === 0) {
        return <p className="text-sm text-muted-foreground py-8 text-center">No bets yet. Add one above.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-surface2 border-b border-border/50">
                        <th className="text-left px-3 py-2.5 font-mono text-[11px] text-muted-foreground">TYPE</th>
                        <th className="text-left px-3 py-2.5 font-mono text-[11px] text-muted-foreground">PLAYER</th>
                        <th className="text-left px-3 py-2.5 font-mono text-[11px] text-muted-foreground">PICK</th>
                        <th className="text-left px-3 py-2.5 font-mono text-[11px] text-muted-foreground">ODDS</th>
                        <th className="text-left px-3 py-2.5 font-mono text-[11px] text-muted-foreground">STAKE</th>
                        <th className="text-left px-3 py-2.5 font-mono text-[11px] text-muted-foreground">STATUS</th>
                        <th className="text-left px-3 py-2.5 font-mono text-[11px] text-muted-foreground">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {bets.map((bet) => (
                        <tr key={bet.id} className="border-b border-border/30 hover:bg-surface-offset/50">
                            <td className="px-3 py-2 text-xs">{bet.bet_type}</td>
                            <td className="px-3 py-2 text-xs font-medium">{bet.player_name}</td>
                            <td className="px-3 py-2 text-xs">{bet.pick}</td>
                            <td className="px-3 py-2 font-mono text-xs text-gold">{bet.odds > 0 ? `+${bet.odds}` : bet.odds}</td>
                            <td className="px-3 py-2 font-mono text-xs">${bet.stake}</td>
                            <td className="px-3 py-2">
                                <Select
                                    value={bet.status}
                                    onValueChange={(v) => handleStatusChange(bet.id, v)}
                                    disabled={updating === bet.id}
                                >
                                    <SelectTrigger className="h-7 w-24 text-[10px] bg-transparent border-border/30">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["Active", "Win", "Loss", "Push"].map(s => (
                                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </td>
                            <td className="px-3 py-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-loss/70 hover:text-loss"
                                    onClick={() => handleDelete(bet.id)}
                                    disabled={deleting === bet.id}
                                >
                                    {deleting === bet.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
