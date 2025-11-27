import { motion } from "framer-motion";
import { Wifi, Tv, Coffee, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  amenities: string[];
}

interface RoomCardProps {
  room: Room;
  index: number;
  onBook: () => void;
}

const amenityIcons: Record<string, any> = {
  Wifi: Wifi,
  TV: Tv,
  "Mini Bar": Coffee,
  "Air Conditioning": Wind,
  Jacuzzi: Coffee,
  "Ocean View": Wifi,
  Balcony: Wifi,
};

export const RoomCard = ({ room, index, onBook }: RoomCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -8 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
            ${room.price}/night
          </div>
        </div>

        <CardContent className="flex-1 p-6">
          <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
          <p className="text-muted-foreground mb-4">{room.description}</p>

          <div className="flex flex-wrap gap-3">
            {room.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Wifi;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 text-sm text-muted-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span>{amenity}</span>
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={onBook}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
