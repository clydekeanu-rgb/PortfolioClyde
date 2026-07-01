export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  name: string;
  email: string;
  body: string;
  approved: boolean;
  created_at: string;
};

export type CommentWithPost = Comment & {
  posts: { title: string; slug: string } | null;
};
