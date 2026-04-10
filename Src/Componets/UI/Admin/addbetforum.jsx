import { useMemo, useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Textarea } from "../textarea";
import { Loader2, Plus } from "lucide-react";
import { DEMO_PLAYER_NAMES } from "../../Lib/demoData";

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

  const filteredPlayers = useMemo(() => {
    if (!form.player_name) return DEMO_PLAYER_NAMES.slice(0, 8);
    const q = form.player_name.toLowerCase();
    return DEMO_PLAYER_NAMES.filter((name) => name.toLowerCase().includes(q)).slice(0, 8);
  }, [form.player_name]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.resolve();
      setForm(EMPTY_FORM);
      if (typeof onSaved === "function") onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Bet Type</Label>
          <select
            className="mt-2 w-full rounded-md border border-border/50 bg-surface2 h-10 px-3 text-sm"
            value={form.bet_type}
            onChange={(e) => updateField("bet_type", e.target.value)}
            required
          >
            <option value="">Select type</option>
            {BET_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-xs">Round</Label>
          <select
            className="mt-2 w-full rounded-md border border-border/50 bg-surface2 h-10 px-3 text-sm"
            value={form.round}
            onChange={(e) => updateField("round", e.target.value)}
          >
            <option value="">Select round</option>
            {ROUNDS.map((round) => (
              <option key={round} value={round}>{round}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className="text-xs">Player Name</Label>
        <Input
          value={form.player_name}
          onChange={(e) => updateField("player_name", e.target.value)}
          placeholder="Type player name"
          className="mt-2 bg-surface2 border-border/50"
          list="player-suggestions"
          required
        />
        <datalist id="player-suggestions">
          {filteredPlayers.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Odds</Label>
          <Input value={form.odds} onChange={(e) => updateField("odds", e.target.value)} placeholder="+120" className="mt-2 bg-surface2 border-border/50" required />
        </div>
        <div>
          <Label className="text-xs">Stake</Label>
          <Input value={form.stake} onChange={(e) => updateField("stake", e.target.value)} placeholder="100" className="mt-2 bg-surface2 border-border/50" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Sportsbook</Label>
          <select
            className="mt-2 w-full rounded-md border border-border/50 bg-surface2 h-10 px-3 text-sm"
            value={form.sportsbook}
            onChange={(e) => updateField("sportsbook", e.target.value)}
            required
          >
            <option value="">Select book</option>
            {BOOKS.map((book) => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-xs">Pick</Label>
          <Input value={form.pick} onChange={(e) => updateField("pick", e.target.value)} placeholder="Over / Under / Winner" className="mt-2 bg-surface2 border-border/50" />
        </div>
      </div>

      <div>
        <Label className="text-xs">Line Detail</Label>
        <Input value={form.line_detail} onChange={(e) => updateField("line_detail", e.target.value)} placeholder="Detailed market description" className="mt-2 bg-surface2 border-border/50" />
      </div>

      <div>
        <Label className="text-xs">Notes</Label>
        <Textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} className="mt-2 bg-surface2 border-border/50 min-h-24" />
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add Bet
          </>
        )}
      </Button>
    </form>
  );
}
