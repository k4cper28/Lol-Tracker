// 1. Wspólna funkcja formatowania czasu relatywnego
export const formatRelativeTime = (timestamp?: number): string => {
  if (!timestamp) return 'No date';

  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;

  return new Date(timestamp).toLocaleDateString('pl-PL');
};

// 2. Wspólna funkcja czyszczenia tagów HTML z opisów
export const formatDescription = (rawText?: string): string => {
  if (!rawText) return 'No description.';
  return rawText
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
};

// 3. Słownik nazw kolejek
export const QUEUE_NAMES: Record<number, string> = {
  420: 'Ranked Solo',
  440: 'Ranked Flex',
  450: 'ARAM',
  400: 'Normal Draft',
  430: 'Normal Blind',
  480: 'Quickplay',
  490: 'Quickplay',
  1700: 'Arena',
  1710: 'Arena',
  1740: 'Arena',
  1750: 'Arena',
  1900: 'URF',
  900: 'ARURF',
  1020: 'One for All',
  1300: 'Nexus Blitz',
  700: 'Clash',
};

export const getQueueName = (queueId: number): string => {
  return QUEUE_NAMES[queueId] || 'Custom / Other';
};