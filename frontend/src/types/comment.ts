export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  authorId: string;
  postId: number;
}

export interface CreateCommentDTO {
  postId: number;
  content: string;
}
