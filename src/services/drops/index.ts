import { mockDrops } from "../../utils/mockDrops";
import type { Drop } from "../../types/drop";

export function getDrops(): Drop[] {
  return mockDrops;
}

export function getDropById(id: string): Drop | undefined {
  return mockDrops.find((drop) => drop.id === id);
}
