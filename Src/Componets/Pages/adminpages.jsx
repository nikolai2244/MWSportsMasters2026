import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
// import { base44 } from "@/api/base44Client";
import VIPGate from "../components/VIPGate";
import AddBetForm from "../components/admin/AddBetForm";
import BetManagement from "../components/admin/BetManagement";
import UserManagement from "../components/admin/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Loader2 } from "lucide-react";

export default function AdminPanel() {
    const { currentUser } = useOutletContext();
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBets = useCallback(async () => {
        // const data = await base44.entities.Bet.list("-created_date", 200);
        setBets(data);
        setLoading(false);
    }, []);

    useEffect(() => { loadBets(); }, [loadBets]);

    const isAdmin = currentUser?.role === "admin";

    return (
        <VIPGate>
            {!isAdmin ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-surface-offset flex items-center justify-center mb-6">
                        <Shield className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="font-display text-3xl font-bold mb-2">Admin Only</h2>
                    <p className="text-muted-foreground">This section is restricted to admin accounts.</p>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="font-display text-3xl font-bold mb-6">🎲 Admin Panel</h1>

                    <Tabs defaultValue="bets" className="w-full">
                        <TabsList className="bg-surface2 mb-6">
                            <TabsTrigger value="bets" className="text-xs font-mono">Add / Edit Bets</TabsTrigger>
                            <TabsTrigger value="users" className="text-xs font-mono">User Management</TabsTrigger>
                        </TabsList>

                        <TabsContent value="bets" className="space-y-8">
                            <section className="rounded-xl border border-border/50 bg-card p-6">
                                <h2 className="font-display text-xl font-bold mb-4">Add New Bet</h2>
                                <AddBetForm onSaved={loadBets} />
                            </section>

                            <section className="rounded-xl border border-border/50 bg-card p-6">
                                <h2 className="font-display text-xl font-bold mb-4">All Bets ({bets.length})</h2>
                                {loading ? (
                                    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                                ) : (
                                    <BetManagement bets={bets} onRefresh={loadBets} />
                                )}
                            </section>
                        </TabsContent>

                        <TabsContent value="users">
                            <section className="rounded-xl border border-border/50 bg-card p-6">
                                <h2 className="font-display text-xl font-bold mb-4">Signup Requests</h2>
                                <UserManagement />
                            </section>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </VIPGate>
    );
}
