import VIPSignupForm from "../UI/Admin/VIPsignupforum";

export default function VIPSignup() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="text-center mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Request <span className="gold-shimmer">VIP Access</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                    Donate first, then submit the form below to request access to MayorWard Sports VIP.
                </p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-surface2/30 p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-4 text-center">Choose your payment method:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                        href="https://paypal.me/njw2244"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        PayPal
                    </a>
                    <a
                        href="https://venmo.com/mayorward"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Venmo
                    </a>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                    After payment, include your username in the VIP request form.
                </p>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-card p-8">
                <VIPSignupForm />
            </div>
        </div>
    );
}