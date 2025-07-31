import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.deletes) {
    handleDeleteBtn(e.target.dataset.deletes);
  } else if (e.target.dataset.replyBtn) {
    handleReplyBtnClick(e.target.dataset.replyBtn);
  }
});

function handleLikeClick(tweetId) {
  // Find the tweet object that matches the tweetId
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  // Find the tweet object that matches the tweetId
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  // Remove retweet if already retweeted
  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  }
  // Add retweet count if not retweeted
  else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function handleDeleteBtn(tweetId) {
  // Find the tweet position that matches the tweetId

  const targetTweetObj = tweetsData.findIndex(
    (tweet) => tweet.uuid === tweetId
  );

  // Check if found/exists (-1 means not found, its the array of 0)
  if (targetTweetObj !== -1) {
    // If found remove tweet. Always have to pass an index in a splice
    tweetsData.splice(targetTweetObj, 1);
    render();
  }
}

function handleReplyBtnClick(tweetId) {
  const replyInput = document.getElementById(`reply-input-${tweetId}`);
  const replyText = replyInput.value;

  if (replyText) {
    const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId);
    targetTweetObj.replies.push({
      handle: `@ScrimbaUser`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: replyText,
    });
    render();
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "like";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "retweet";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let deleteIconClass = "delete-btn";

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
`;
      });
    }

    feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash ${deleteIconClass}"
                    data-deletes="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class="reply-input-container">
            <input 
                type="text" 
                placeholder="Write a reply..." 
                class="reply-input" 
                id="reply-input-${tweet.uuid}"
            >
            <button class="reply-btn" data-reply-btn="${tweet.uuid}">Reply</button>
        </div>
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
