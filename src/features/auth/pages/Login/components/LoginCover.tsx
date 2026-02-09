interface LoginCoverProps {
    coverImage?: string;
}

export const LoginCover = ({ coverImage = '/src/assets/login-cover.svg' }: LoginCoverProps) => {
    return (
        <div className="hidden lg:block relative h-full w-full bg-slate-950 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/70 to-slate-800/20 z-10" />
            {/* Background blobs removed */}
            <img
                src={coverImage}
                alt="Event Management ERP"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 h-full flex flex-col justify-between p-12 text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">
                    Built for teams
                </div>
                <div className="backdrop-blur-sm bg-black/35 p-7 rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                    <h1 className="font-display text-4xl font-semibold mb-4 text-white">
                        Event Management ERP
                    </h1>
                    <p className="text-lg text-white/80 max-w-md leading-relaxed">
                        Plan, schedule, and coordinate vendors in one workflow. Keep every event on track with real-time visibility.
                    </p>
                    <div className="mt-6 flex items-center gap-6 text-sm text-white/70">
                        <div>
                            <div className="text-2xl font-semibold text-white">120+</div>
                            Active events
                        </div>
                        <div className="h-8 w-px bg-white/20" />
                        <div>
                            <div className="text-2xl font-semibold text-white">24/7</div>
                            Ops support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
