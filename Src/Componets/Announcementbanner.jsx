export default function AnnouncementBanner({ text }) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-gold/80 text-primary-foreground py-2">
            <div className="announcement-track whitespace-nowrap text-sm font-semibold">
                <span className="mx-6">{text}</span>
                <span className="mx-6" aria-hidden="true">{text}</span>
            </div>
        </div>
    );
}