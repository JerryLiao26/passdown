/** @jsx h */
import { h } from "preact";

interface PostListProps {
  posts: { id: number; title: string; content: string; shared: boolean }[];
}

export default function PostList(props: PostListProps) {
  const onEdit = (id: number) => {
    location.href = `post/${id}`;
  };

  return (
    <div className="pd-post-list">
      {props.posts.map((post) => (
        <div className="pd-post" key={post.id}>
          <span className="pd-post-title">{post.title || "Untitled"}</span>
          <span className="pd-post-digest">{post.content || "No content"}</span>
          <button
            onClick={() => {
              onEdit(post.id);
            }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}
