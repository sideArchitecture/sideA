import { ProjectCategory } from './project-category.enum';

export interface Project {
  id: string;
  title: string;
  imageUrl: string;
  slug?: string;
  description?: string;
  category?: ProjectCategory[];
  notes?: string; // 👈 Add this
  imageUrls?: string[];
  coverImage?: string;
  brochureLink?: string;
  projectPath?: string;
  year?: string;
  client?: string;
  designStyle?: string;
  builtStatus?: string;
  location?: string;

  // imageCount?: number;
}
