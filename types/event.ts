import { MediaItem } from "./media";

export type Event = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: string;
  start_at: string;
  end_at: string;
  description: string;
  streamkey?: string;
  fienta_id: any;
  intro: string;
  details: string;
  controls?: string;
  authors: string;
  thumbnail: MediaItem;
  projectLink: string;
  projects: Project[] | null;
  eventLink: string;
  eventLiveLink: string;
  eventExperimentLink: string;
  titles: string[];
  intros: string[];
  descriptions: string[];
  detailss: string[];
  contents: string[];
  status: string;
  ticketLinks: any[];
  videostreams?: Videostream[];
  live_content: string;
  images: MediaItem[];
};

type Videostream = {
  ingest: string;
  streamkey: string;
  url: string;
};

interface Project {
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
  thumbnail: MediaItem;
  projectLink: string;
  titles: string[];
  intros: string[];
  descriptions: string[];
  detailss: string[];
  contents: string[];
}
