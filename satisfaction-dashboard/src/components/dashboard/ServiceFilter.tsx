"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Grid3x3 } from "lucide-react";

interface ServiceFilterProps {
  selected: string;
  onChange: (serviceId: string) => void;
}

export function ServiceFilter({ selected, onChange }: ServiceFilterProps) {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant={selected === "all" ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-8 gap-2 rounded-lg text-xs font-medium",
            selected === "all" && "shadow-sm"
          )}
          onClick={() => onChange("all")}
        >
          <Grid3x3 className="h-3.5 w-3.5" />
          All Services
        </Button>
      </motion.div>
      {SERVICES.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={selected === service.id ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 rounded-lg text-xs font-medium",
              selected === service.id && "shadow-sm"
            )}
            onClick={() => onChange(service.id)}
          >
            {service.name}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
