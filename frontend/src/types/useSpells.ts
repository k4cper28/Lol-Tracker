import { useState, useEffect } from 'react';

export interface SimpleSpell {
  id: string;      
  name: string;       
  description: string; 
  cooldown: number;   
  image: string;      
}

const spellsCache: Record<string, Record<string, SimpleSpell>> = {};

export const useSpells = (patch: string) => {
  const [spellsDict, setSpellsDict] = useState<Record<string, SimpleSpell>>(
    spellsCache[patch] || {}
  );

  useEffect(() => {
    if (spellsCache[patch]) {
      setSpellsDict(spellsCache[patch]);
      return;
    }

    const version = `${patch}.1`;
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch summoner.json');
        return res.json();
      })
      .then((json) => {
        const rawData = json.data || {};
        const dict: Record<string, SimpleSpell> = {};

        Object.values(rawData).forEach((s: any) => {
          if (s.key) {
            dict[s.key] = {
              id: s.id,
              name: s.name,
              description: s.description,
              cooldown: s.cooldownBurn ? parseInt(s.cooldownBurn, 10) : (s.cooldown?.[0] ?? 0),
              image: s.image?.full || `${s.id}.png`,
            };
          }
        });


        dict['2201'] = {
          id: 'Summoner_CherryHoldP',
          name: 'Flee',
          description: 'Gain a burst of Move Speed and become ghosted and slow immune for a short duration.',
          cooldown: 45,
          image: 'flee.png',
        };
        dict['2202'] = {
          id: 'Summoner_CherryFlash',
          name: 'Flash',
          description: 'Teleports your champion a short distance toward your cursor.',
          cooldown: 300,
          image: 'SummonerFlash.png',
        };

        spellsCache[patch] = dict;
        setSpellsDict(dict);
      })
      .catch((err) => {
        console.error('Error loading summoner spells from Data Dragon:', err);
      });
  }, [patch]);

  return spellsDict;
};