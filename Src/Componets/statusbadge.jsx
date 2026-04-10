export default function StatusBadge({ status }) {
    const config = {
        Win: "bg-win/15 text-win border-win/30",
        Loss: "bg-loss/15 text-loss border-loss/30",
        Active: "bg-active/15 text-active border-active/30",
        Push: "bg-push/15 text-push border-push/30",
        Pending: "bg-active/15 text-active border-active/30",
        Approved: "bg-win/15 text-win border-win/30",
        Denied: "bg-loss/15 text-loss border-loss/30",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${config[status] || "bg-muted text-muted-foreground border-border"}`}>
            {status?.toUpperCase()}
        </span>
    );
}
