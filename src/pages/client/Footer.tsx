export const Footer = () => {
    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <footer className="bg-card border-t py-12 px-6">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                                <span className="text-lg font-bold text-white">HP</span>
                            </div>
                            <span className="text-xl font-bold">HotelPro</span>
                        </div>
                        <p className="text-muted-foreground">
                            Experience luxury and comfort in the heart of paradise
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <div className="space-y-2">
                            <button onClick={() => scrollToSection("rooms")} className="block text-muted-foreground hover:text-foreground transition-colors">
                                Rooms
                            </button>
                            <button onClick={() => scrollToSection("services")} className="block text-muted-foreground hover:text-foreground transition-colors">
                                Services
                            </button>
                            <button onClick={() => scrollToSection("about")} className="block text-muted-foreground hover:text-foreground transition-colors">
                                About
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <div className="space-y-2">
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Careers
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="space-y-2">
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Facebook
                            </a>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Instagram
                            </a>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-muted-foreground">
                    <p>© 2025 HotelPro — All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};