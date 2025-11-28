import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Star, Wifi, Coffee, Dumbbell, Car, Waves, Utensils, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/BookingModal";
import { AuthModal } from "@/components/booking/AuthModal";
import { RoomCard } from "@/components/booking/RoomCard";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { TestimonialCarousel } from "@/components/booking/TestimonialCarousel";
import { ContactForm } from "@/components/booking/ContactForm";
import { Footer } from "@/pages/client/Footer";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    description: "Spacious room with king bed, city view, and modern amenities",
    price: 150,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    amenities: ["Wifi", "TV", "Mini Bar", "Air Conditioning"],
  },
  {
    id: 2,
    name: "Executive Suite",
    description: "Luxury suite with separate living area and premium furnishings",
    price: 280,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    amenities: ["Wifi", "TV", "Mini Bar", "Jacuzzi"],
  },
  {
    id: 3,
    name: "Ocean View Room",
    description: "Breathtaking ocean views with private balcony",
    price: 200,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    amenities: ["Wifi", "TV", "Ocean View", "Balcony"],
  },
];

const services = [
  { icon: Utensils, title: "Restaurant", description: "Fine dining with international cuisine" },
  { icon: Waves, title: "Spa & Wellness", description: "Relaxation and rejuvenation services" },
  { icon: Dumbbell, title: "Fitness Center", description: "24/7 state-of-the-art gym" },
  { icon: Coffee, title: "Cafe & Bar", description: "Premium beverages and snacks" },
  { icon: Waves, title: "Swimming Pool", description: "Indoor and outdoor pools" },
  { icon: Car, title: "Airport Pickup", description: "Complimentary shuttle service" },
];

export default function BookingLanding() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle scroll for scroll-to-top button
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setShowScrollTop(window.scrollY > 400);
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-card/80 border-b"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-white">HP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              HotelPro
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("hero")} className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("rooms")} className="text-foreground/80 hover:text-foreground transition-colors">
              Rooms
            </button>
            <button onClick={() => scrollToSection("services")} className="text-foreground/80 hover:text-foreground transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection("about")} className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              variant="outline"
              className="hidden sm:flex"
            >
              Đăng nhập
            </Button>
            <Button onClick={() => setIsBookingModalOpen(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Book Now
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience luxury and comfort in the heart of paradise
          </p>
          <Button
            size="lg"
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6"
          >
            Check Availability
          </Button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => scrollToSection("rooms")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="h-8 w-8 text-foreground/60 animate-bounce" />
        </motion.button>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Rooms</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our selection of beautifully designed rooms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} onBook={() => setIsBookingModalOpen(true)} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for a perfect stay
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Guest Reviews</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              What our guests say about us
            </p>
          </motion.div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About HotelPro</h2>
              <p className="text-muted-foreground text-lg mb-6">
                For over 20 years, HotelPro has been a beacon of hospitality and luxury.
                Nestled in the heart of the city, we offer an unparalleled experience
                combining modern amenities with timeless elegance.
              </p>
              <p className="text-muted-foreground text-lg mb-6">
                Our dedicated team is committed to making every stay memorable, whether
                you're here for business or pleasure. From our world-class dining to our
                state-of-the-art facilities, every detail is crafted with care.
              </p>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-2xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
                alt="About HotelPro"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions? We'd love to hear from you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <ContactForm />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground">123 Luxury Lane, Paradise City, PC 12345</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground">contact@hotelpro.com</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden h-64 mt-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0965543439705!2d105.78394731540303!3d21.02877939312744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0c66f05%3A0xea31563511af2e54!2zSMOgIE7hu5lp!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        >
          <ChevronDown className="h-6 w-6 rotate-180" />
        </motion.button>
      )}

      {/* Modals */}
      <BookingModal open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} />
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </div>
  );
}
