import type { ComponentType } from "react";
import {
  FireIcon,
  WaterIcon,
  AirIcon,
  EarthIcon,
  SpiritIcon,
} from "@/app/components/icons";

interface IconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const ELEMENT_META: Record<string, {
  color: string;
  Icon: ComponentType<IconProps>;
  label: string;
  description: string;
}> = {
  FIRE: { color: '#E25822', Icon: FireIcon, label: 'Fire', description: 'Passion, courage, and transformative energy. You thrive in moments of intensity and action.' },
  WATER: { color: '#4A90D9', Icon: WaterIcon, label: 'Water', description: 'Intuition, empathy, and emotional depth. You navigate life through feeling and connection.' },
  AIR: { color: '#87CEEB', Icon: AirIcon, label: 'Air', description: 'Intellect, curiosity, and communication. You seek truth through thought and ideas.' },
  EARTH: { color: '#8B7355', Icon: EarthIcon, label: 'Earth', description: 'Stability, practicality, and grounded wisdom. You build enduring foundations.' },
  SPIRIT: { color: '#9B59B6', Icon: SpiritIcon, label: 'Spirit', description: 'Vision, connection, and higher purpose. You are guided by inner knowing.' },
};
