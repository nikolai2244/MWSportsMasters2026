import VIPSignupForm from "../components/VIPSignupForm";

export default function VIPSignup() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="text-center mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Request <span className="gold-shimmer">VIP Access</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                    Fill out the form below to request access to MayorWard Sports VIP.
                </p>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-card p-8">
                <VIPSignupForm />
            </div>
        </div>
    );
}