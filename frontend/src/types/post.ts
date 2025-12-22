export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: string;
  categoryId?: number | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  categoryId?: number | null;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  categoryId?: number | null;
}
