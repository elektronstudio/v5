import { Event } from "./event";
import { MediaItem } from "./media";

export type Project = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: string;
  pinned: boolean;
  archived: boolean;
  description: string;
  intro: string;
  authors: string;
  details: string;
  localizations: Localization[];
  images: MediaItem[];
  thumbnail: MediaItem;
  events: Event[];
  projectLink: string;
  titles: string[];
  intros: string[];
  descriptions: string[];
  detailss: string[];
  contents: string[];
  online?: boolean | null;
  live?: string | null;
  start_at: string;
  end_at: string;
  fienta_id: any;
};

export interface Localization {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: any;
  pinned: boolean;
  archived: boolean;
  description: string;
  intro: string;
  authors: string;
  details: string;
}
