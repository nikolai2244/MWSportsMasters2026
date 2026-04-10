import { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Textarea } from "../textarea";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function VIPSignupForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const next = {};

    if (!form.first_name.trim()) next.first_name = "First name is required";
    if (!form.last_name.trim()) next.last_name = "Last name is required";

    if (!form.username.trim()) {
      next.username = "Username is required";
    } else if (form.username.length < 3) {
      next.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) {
      next.username = "Username can only contain letters, numbers, underscores, and hyphens";
    }

    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!EMAIL_RE.test(form.email)) {
      next.email = "Please enter a valid email address";
    }

    return { isValid: Object.keys(next).length === 0, errors: next };
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    const validation = validate();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await Promise.resolve();
      setSuccess(true);
      setForm(EMPTY_FORM);
      setErrors({});
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setErrors({ submit: err?.message || "Failed to submit request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="flex items-start gap-3 p-4 bg-win/10 border border-win/30 rounded-lg animate-in">
          <CheckCircle2 className="h-5 w-5 text-win flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-win">Request Submitted</p>
            <p className="text-sm text-win/80">Thanks for your interest. We will get back to you soon.</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="flex items-start gap-3 p-4 bg-loss/10 border border-loss/30 rounded-lg">
          <AlertCircle className="h-5 w-5 text-loss flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-loss">Error</p>
            <p className="text-sm text-loss/80">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first-name" className="text-xs font-semibold">First Name <span className="text-loss">*</span></Label>
          <Input id="first-name" value={form.first_name} onChange={(e) => updateField("first_name", e.target.value)} className="mt-2 bg-surface2 border-border/50 h-10" disabled={loading} />
          {errors.first_name && <p className="text-[10px] text-loss mt-1.5">{errors.first_name}</p>}
        </div>
        <div>
          <Label htmlFor="last-name" className="text-xs font-semibold">Last Name <span className="text-loss">*</span></Label>
          <Input id="last-name" value={form.last_name} onChange={(e) => updateField("last_name", e.target.value)} className="mt-2 bg-surface2 border-border/50 h-10" disabled={loading} />
          {errors.last_name && <p className="text-[10px] text-loss mt-1.5">{errors.last_name}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="username" className="text-xs font-semibold">Username <span className="text-loss">*</span></Label>
        <Input id="username" value={form.username} onChange={(e) => updateField("username", e.target.value)} className="mt-2 bg-surface2 border-border/50 h-10" disabled={loading} maxLength="30" />
        {errors.username && <p className="text-[10px] text-loss mt-1.5">{errors.username}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-xs font-semibold">Email Address <span className="text-loss">*</span></Label>
        <Input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="mt-2 bg-surface2 border-border/50 h-10" disabled={loading} />
        {errors.email && <p className="text-[10px] text-loss mt-1.5">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="message" className="text-xs font-semibold">Why do you want VIP access?</Label>
        <Textarea id="message" value={form.message} onChange={(e) => updateField("message", e.target.value)} className="mt-2 bg-surface2 border-border/50 min-h-20 resize-none" disabled={loading} maxLength="500" />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-background font-semibold text-base transition-all">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}
