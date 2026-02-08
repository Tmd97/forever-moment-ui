interface LoginCoverProps {
    coverImage?: string;
}

export const LoginCover = ({ coverImage = '/src/assets/login-cover.png' }: LoginCoverProps) => {
    return (
        <div className="hidden lg:block relative h-full w-full bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10" />
            <img
                src={coverImage}
                alt="Event Management ERP"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white">
                <div className="backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-white/10">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                        Event Management ERP
                    </h1>
                    <p className="text-lg text-gray-200 max-w-md leading-relaxed">
                        Streamline your vendors, resources, and planning with our comprehensive management dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
};
