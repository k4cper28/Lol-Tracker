import { useState, useEffect } from "react";

export interface SimpleItem {
    id: string,
    name: string,
    description: string;
    img: string;
    gold: number;
    stats?: Record<string, number>;
}

const itemsCache: Record<string, Record<string, SimpleItem>> = {};

export const useItems = (patch: string) => {
  const [items, setItems] = useState<Record<string, SimpleItem>>(itemsCache[patch] || {});

  useEffect(() => {
    if (!patch) return;

    if (itemsCache[patch]) {
      setItems(itemsCache[patch]);
      return;
    }

    fetch(`http://localhost:8080/api/items/${patch}`)
      .then((res) => {
        if (!res.ok) throw new Error('Błąd sieci');
        return res.json();
      })
      .then((data: Record<string, SimpleItem>) => {
        itemsCache[patch] = data;
        setItems(data);
      })
      .catch((err) => console.error('Błąd pobierania itemów:', err));
  }, [patch]);

  return items;
};