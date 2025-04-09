import { IconType } from "react-icons";

export type StatsCardProps = {
  title: string;
  stat: string;
  subStat: string;
  Icon: IconType;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "destructive" | "success";
};