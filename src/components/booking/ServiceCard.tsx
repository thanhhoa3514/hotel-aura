import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <Card className="text-center p-8 h-full">
        <CardContent className="p-0">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4"
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold mb-2">{service.title}</h3>
          <p className="text-muted-foreground">{service.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
