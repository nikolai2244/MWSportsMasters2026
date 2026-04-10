import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBanner({ text }) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="relative bg-gradient-to-r from-primary/90 to-gold/80 text-primary-foreground text-center py-2 px-8 text-sm font-medium">
            <span>{text}</span>
            <button
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                onClick={() => setVisible(false)}
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}