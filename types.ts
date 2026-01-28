export interface TastingRecord {
  id: string;
  date: string;
  score: number;
  memo: string;
  tastingNotes: string[];
}

export interface Bean {
  id: string;
  name: string;
  roastery: string;
  country: string;
  region?: string;
  farm?: string;
  producer?: string;
  variety?: string;
  altitude?: string;
  process: string;
  roastLevel: string;
  roastDate: string;
  price: number;
  imageUrl: string;
  tastingRecords: TastingRecord[];
  tastingNotes: string[];
  // Legacy fields below - kept for migration compatibility
  myNotes: string[];
  score: number;
  memo: string;
  purchaseUrl?: string;
}

export interface PourStep {
  label: string;
  startTime: number;
  endTime: number;
  waterAmount: number;
  addedAmount: number;
}

export interface Recipe {
  id: string;
  title: string;
  type: 'Hot' | 'Iced' | 'Hot/Iced';
  roastLevel: string[];
  dripper: string;
  filter: string;
  grinder: string;
  grindSetting: string;
  waterTemp: number;
  beanAmount: number;
  waterAmount: number;
  youtubeId: string;
  youtubeStart?: number;
  // Advanced fields
  pouringMethod?: string;
  flowRate?: string;
  waterInfo?: string;
  micron?: string;
  steps: PourStep[];
}
