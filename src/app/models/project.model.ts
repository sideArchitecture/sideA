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
}
