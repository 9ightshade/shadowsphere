import Card from "../../../components/ui/Card";
// import { Post } from "../types";
import CategoryTag from "./CategoryTag";
import ReputationBadge from "./ReputationBadge";
import EncryptedContentWrapper from "./EncryptedContentWrapper";
import PostActions from "./PostActions";

export default function PostCard({ post }) {
  // console.log("post card post", post);

  return (
    <div className="relative z-0">
      <Card className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{post?.alias}</span>
            <ReputationBadge
              reputation={post?.reputation}
              verified={post?.verified}
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            <CategoryTag category={post?.category} />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {post?.timestamp}
            </span>
          </div>
        </div>

        {/* Content */}
        <EncryptedContentWrapper
          content={post?.content}
          encrypted={post?.encrypted}
        />

        {/* Actions */}
        <PostActions
          postId={post?.id}
          likes={post?.likes}
          comments={post?.comments}
          recipientAlias={post?.alias}
        />
      </Card>
    </div>
  );
}
