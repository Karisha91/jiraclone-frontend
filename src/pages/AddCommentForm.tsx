import { useState } from "react";

function AddCommentForm({
  addComment
}: {
  addComment:(comment: string) => Promise<boolean>;
}) {

    const [comment, setComment] = useState("");
    
    return (
        <div className="add-comment">
            <input
              type="text"
              value={comment}
              placeholder="Add a comment..."
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={async () => {
              const success = await addComment(comment);
              if (success) {
                setComment("")
              }

            }}>Post</button>
          </div>
    )
}

export default AddCommentForm;