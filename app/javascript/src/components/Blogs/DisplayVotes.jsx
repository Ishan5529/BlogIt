import React from "react";

import classNames from "classnames";
import { Up, Down } from "neetoicons";

const DisplayVotes = ({
  upvotes,
  downvotes,
  handleUpVote,
  handleDownVote,
  voteStatus = { upVoted: false, downVoted: false },
}) => (
  <div className="flex items-center space-x-2 space-y-2">
    <div
      onClick={() => {
        handleUpVote();
      }}
    >
      <Up
        size={32}
        className={classNames(
          "mt-2 cursor-pointer rounded-full text-gray-500 transition-colors duration-200",
          { "hover:text-green-500": !voteStatus.upVoted },
          { "bg-green-600 text-white": voteStatus.upVoted }
        )}
      />
    </div>
    <p className="w-24 text-center text-lg">{upvotes - downvotes}</p>
    <div
      onClick={() => {
        handleDownVote();
      }}
    >
      <Down
        size={32}
        className={classNames(
          "cursor-pointer rounded-full text-gray-500 transition-colors duration-200",
          { "hover:text-red-400": !voteStatus.downVoted },
          { "bg-red-500 text-white": voteStatus.downVoted }
        )}
      />
    </div>
  </div>
);

export default DisplayVotes;
