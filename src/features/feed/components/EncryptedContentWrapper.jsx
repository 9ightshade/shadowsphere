import { useState } from "react";
import Button from "../../../components/ui/Button";

export default function EncryptedContentWrapper({ content, encrypted }) {
  const [revealed, setRevealed] = useState(false);
  console.log("encrypted content", content);

  if (!encrypted) {
    return <p className="text-sm leading-relaxed">{content}</p>;
  }

  return (
    <div className="bg-[var(--color-muted)]/40 p-4 rounded-[var(--radius-md)]">
      {!revealed ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[var(--color-text-secondary)]">
            🔒 This post is encrypted
          </p>
          <Button size="sm" onClick={() => setRevealed(true)}>
            Decrypt
          </Button>
        </div>
      ) : (
        <p className="text-sm leading-relaxed">{content}</p>
      )}
    </div>
  );
}
