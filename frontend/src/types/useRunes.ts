import { useState, useEffect } from 'react';

export interface SimpleRune {
  id: number;
  name: string;
  icon: string;
  shortDesc?: string;
  longDesc?: string;
}

export interface RuneTreeData {
  trees: Record<number, SimpleRune>; // Główne drzewka: Precision (8000), Domination (8100) itd.
  runes: Record<number, SimpleRune>; // Poszczególne runy: Conqueror (8010), Electrocute (8112) itd.
}

const runesCache: Record<string, RuneTreeData> = {};

export const useRunes = (patch: string): RuneTreeData => {
  const [runesData, setRunesData] = useState<RuneTreeData>(
    runesCache[patch] || { trees: {}, runes: {} }
  );

  useEffect(() => {
    if (runesCache[patch]) {
      setRunesData(runesCache[patch]);
      return;
    }

    const version = `${patch}.1`;
    // en_US pobiera opisy po angielsku
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/runesReforged.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Błąd pobierania runesReforged.json');
        return res.json();
      })
      .then((data: any[]) => {
        const treesDict: Record<number, SimpleRune> = {};
        const runesDict: Record<number, SimpleRune> = {};

        data.forEach((tree: any) => {
          // Główne drzewka run (8000, 8100, 8200, 8300, 8400)
          treesDict[tree.id] = {
            id: tree.id,
            name: tree.name,
            icon: tree.icon,
          };

          // Pojedyncze runy ze wszystkich rzędów (Keystony są w slots[0])
          tree.slots?.forEach((slot: any) => {
            slot.runes?.forEach((r: any) => {
              runesDict[r.id] = {
                id: r.id,
                name: r.name,
                icon: r.icon,
                shortDesc: r.shortDesc,
                longDesc: r.longDesc,
              };
            });
          });
        });

        const result: RuneTreeData = { trees: treesDict, runes: runesDict };
        runesCache[patch] = result;
        setRunesData(result);
      })
      .catch((err) => {
        console.error('Błąd pobierania run z Data Dragon:', err);
      });
  }, [patch]);

  return runesData;
};