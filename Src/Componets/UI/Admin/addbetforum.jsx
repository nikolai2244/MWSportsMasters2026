import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { DEMO_PLAYER_NAMES } from "@/lib/demoData";

const BET_TYPES = ["Group Match-Up", "Top 30", "Top 20", "Top 10", "Top 5", "Round Strokes", "Round Birdies", "Round Bogeys", "Parlay"];
const ROUNDS = ["Tournament", "R1", "R2", "R3", "R4"];
const BOOKS = ["DraftKings", "FanDuel", "Hard Rock Bet", "BetMGM", "Other"];

const EMPTY_FORM = {
    bet_type: "",
    player_name: "",
    round: "",
    line_detail: "",
    pick: "",
    odds: "",
    stake: "",
    sportsbook: "",
    notes: "",
};

export default function AddBetForm({ onSaved }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (field === "player_name") {
