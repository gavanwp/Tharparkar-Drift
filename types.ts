export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export enum GameSection {
  HOME = 'home',
  GDD = 'gdd',
  TECH = 'tech',
  GALLERY = 'gallery',
  PLAYABLE = 'playable'
}

export interface GeneratedContent {
  title: string;
  content: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}
