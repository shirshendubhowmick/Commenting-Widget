'use strict'


var timeFromNow = function(timeStamp) {
    var timeDifference = Date.now() - timeStamp;
    timeDifference /= 1000;
    var returnText;
    if(timeDifference < 60) {
        returnText = "Just now";
    }
    else if(timeDifference >= 60 && timeDifference < 1800) {
        returnText = "Few minutes ago";
    }
    else if(timeDifference >= 1800 && timeDifference < 3600) {
        returnText = "Half an hour ago";
    }
    else if(timeDifference >= 3600 && timeDifference < 86400) {
        var hourCount = Math.floor(timeDifference / 3600)
        returnText = hourCount > 1 ? hourCount + " hours ago" : hourCount + " hour ago";
    }
    else if(timeDifference >= 86400) {
        var dayCount = Math.floor(timeDifference / 86400);
        returnText = dayCount > 1 ? dayCount + " days ago" : dayCount + " day ago";
    }
    return returnText;
}


var ReplyWidget = function(commentsArray, rootParentObj) {

    this.newReplyDiv = document.createElement("DIV");
    this.newReplyDiv.className = "newReplyDiv";

    this.userAvatar = document.createElement("IMG");
    var userAvatar = localStorage.getItem(sessionStorage.getItem("currentUser") + "Avatar");

    this.userAvatar.setAttribute("src", "assets/avatar/" + (userAvatar ? userAvatar : "default.png"));

    this.newReplyDiv.appendChild(this.userAvatar);

    this.inputReplyDiv = document.createElement("DIV");
    this.inputReplyDiv.className = "inputCommentDiv inputReplyDiv";
    this.inputReplyDiv.setAttribute("contenteditable", "true");
    this.inputReplyDiv.setAttribute("placeholder", "Post your reply......");
    this.newReplyDiv.appendChild(this.inputReplyDiv);
    this.inputReplyDiv.addEventListener("keypress", function(e) {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if(e.target.innerText !== "") {
                var tempCommentsObj = {username: sessionStorage.getItem("currentUser"), 
                            commentText: e.target.innerText, timeStamp: Date.now(), noOfVotes: 0,
                            userAvatarSrc: localStorage.getItem(sessionStorage.getItem("currentUser") + "Avatar"),
                            voterList: [sessionStorage.getItem("currentUser")], replyComments: [], commentLevel: (commentsArray.commentLevel > 3 ? 3 : commentsArray.commentLevel + 1)};
                
                commentsArray.replyComments.push(tempCommentsObj);
                localStorageCommentsUpdate(commentsArray.username, commentsArray.timeStamp, commentsArray);
                e.target.innerText = "";
                var tempNode = document.getElementsByClassName("invidualComment");
                while(tempNode[0]) {
                    tempNode[0].parentNode.removeChild(tempNode[0]);
                }
                var tempNode2 = document.getElementsByClassName("newCommentDiv");
                var rootID = tempNode2[0].parentNode.id;
                tempNode2[0].parentNode.removeChild(tempNode2[0]);
                new CommentWidget(rootID);
            } 
            else {
                (this.newReplyDiv.parentNode).removeChild(this.newReplyDiv);
            }
        }
    }.bind(this));
};

var IndividualCommentWidget = function(commentsArray, rootParentObj) {


    var upVoteButtonClickHandler = function() {
        if(!commentsArray.voterList.includes(sessionStorage.getItem("currentUser"))) {
            noOfVotesSpan.innerText = parseInt(noOfVotesSpan.innerText) + 1;
            commentsArray.noOfVotes += 1;
            commentsArray.voterList.push(sessionStorage.getItem("currentUser"));
            localStorageCommentsUpdate(commentsArray.username, commentsArray.timeStamp, commentsArray);
        }
    }.bind(this);

    var downVoteButtonClickHandler = function() {
        if(!commentsArray.voterList.includes(sessionStorage.getItem("currentUser"))) {
            noOfVotesSpan.innerText = parseInt(noOfVotesSpan.innerText) - 1;
            commentsArray.noOfVotes -= 1;
            commentsArray.voterList.push(sessionStorage.getItem("currentUser"));
            localStorageCommentsUpdate(commentsArray.username, commentsArray.timeStamp, commentsArray);
        }
    }.bind(this);

    var replyButtonClickHandler = function() {
        var replyWidget = new ReplyWidget(commentsArray, rootParentObj);
        replyWidget.newReplyDiv.style.marginLeft = commentsArray.commentLevel * 2 + "rem";
        rootParentObj.appendChild(replyWidget.newReplyDiv)
    };

    this.containerSpan = document.createElement("SPAN");

    var noOfVotesSpan = document.createElement("SPAN");
    noOfVotesSpan.className = "noOfVotesSpan"
    noOfVotesSpan.innerText = commentsArray.noOfVotes ? commentsArray.noOfVotes : 0;

    var upVoteButton = document.createElement("i");
    upVoteButton.className = "arrow upVoteButton";
    upVoteButton.addEventListener("click", upVoteButtonClickHandler);

    var downVoteButton = document.createElement("i");
    downVoteButton.className = "arrow downVoteButton";
    downVoteButton.addEventListener("click", downVoteButtonClickHandler);

    var seperator = document.createElement("SPAN");
    seperator.className = "seperator";

    if(commentsArray.commentLevel <= 2) {
        var replyButton = document.createElement("span");
        replyButton.className = "replyButton";
        replyButton.innerText = "reply";
        replyButton.addEventListener("click", replyButtonClickHandler);
    }

    this.containerSpan.appendChild(noOfVotesSpan);
    this.containerSpan.appendChild(upVoteButton);
    this.containerSpan.appendChild(seperator);
    this.containerSpan.appendChild(downVoteButton);
    if(commentsArray.commentLevel <= 2) {
        this.containerSpan.appendChild(replyButton);
    }
}

var Comment = function(commentsArray) {

    this.commentsDivArray = [];
    for(var i = 0; i < commentsArray.length; i++) {

        var commentDiv = document.createElement("DIV");
        commentDiv.className = "invidualComment";

        var userAvatarSrc = commentsArray[i].userAvatarSrc ? commentsArray[i].userAvatarSrc : "default.png";
        var userAvatar = document.createElement("IMG");
        userAvatar.setAttribute("src", "assets/avatar/" + userAvatarSrc);

        commentDiv.appendChild(userAvatar);

        var displayCommentDiv = document.createElement("DIV");
        displayCommentDiv.className = "displayCommentDiv";

        var usernameDiv = document.createElement("DIV");
        usernameDiv.innerText = commentsArray[i].username;

        var timestampSpan = document.createElement("SPAN");
        timestampSpan.innerText = timeFromNow(commentsArray[i].timeStamp);
        usernameDiv.appendChild(timestampSpan);

        var commentTextDiv = document.createElement("DIV");
        commentTextDiv.innerText = commentsArray[i].commentText;

        var commentWidgetDiv = document.createElement("DIV");

        commentWidgetDiv.appendChild((new IndividualCommentWidget(commentsArray[i], commentDiv)).containerSpan);

        displayCommentDiv.appendChild(usernameDiv);
        displayCommentDiv.appendChild(commentTextDiv);
        displayCommentDiv.appendChild(commentWidgetDiv);
        commentDiv.appendChild(displayCommentDiv);
        if(commentsArray[i].commentLevel > 1) {
            commentDiv.style.marginLeft = (commentsArray[i].commentLevel - 1) * 2 + "rem";
        }
        this.commentsDivArray.push(commentDiv);
        if(commentsArray[i].replyComments.length > 0) {
            var replyComments = new Comment(commentsArray[i].replyComments);
        }
        if(replyComments) {
            for (var j = 0; j < replyComments.commentsDivArray.length; j++) {
                this.commentsDivArray.push(replyComments.commentsDivArray[j]);
            }
            replyComments = undefined;
        }
    }
}

Comment.prototype.addToUI = function(rootID) {
    for(var i = 0; i < this.commentsDivArray.length; i++) {
        document.getElementById(rootID).appendChild(this.commentsDivArray[i]);
    }
}


var CommentWidget = function(rootID) { //pass ID of the div where comment widget needs to be rendered

    this.newCommentDiv = document.createElement("DIV");
    this.newCommentDiv.className = "newCommentDiv";

    var userAvatar = document.createElement("IMG");
    var userAvatarPath = localStorage.getItem(sessionStorage.getItem("currentUser") + "Avatar");

    userAvatar.setAttribute("src", "assets/avatar/" + (userAvatarPath ? userAvatarPath : "default.png"));

    this.newCommentDiv.appendChild(userAvatar);

    var inputCommentDiv = document.createElement("DIV");
    inputCommentDiv.className = "inputCommentDiv";
    inputCommentDiv.setAttribute("contenteditable", "true");
    inputCommentDiv.setAttribute("placeholder", "Join the discussion......");

    inputCommentDiv.addEventListener("keypress", function(e) {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if(e.target.innerText !== "") {
                var commentsObj = {comments: []}
                var tempCommentsObj = {username: sessionStorage.getItem("currentUser"), commentID: "123", 
                            commentText: e.target.innerText, timeStamp: Date.now(), noOfVotes: 0,
                            userAvatarSrc: localStorage.getItem(sessionStorage.getItem("currentUser") + "Avatar"),
                            voterList: [sessionStorage.getItem("currentUser")], replyComments: [], commentLevel: 1};
                if(!localStorage.getItem("commentsData")) {
                    commentsObj.comments.push(tempCommentsObj);
                    localStorage.setItem("commentsData", JSON.stringify(commentsObj));
                }
                else {
                    var commentsObj = JSON.parse(localStorage.getItem("commentsData"));
                    commentsObj.comments.push(tempCommentsObj);
                    localStorage.setItem("commentsData", JSON.stringify(commentsObj));
                }
                var comment = new Comment(commentsObj.comments.slice(commentsObj.comments.length - 1), rootID);
                comment.addToUI(rootID);
                e.target.innerText = "";
            }
        }
    });
    this.newCommentDiv.appendChild(inputCommentDiv);
    document.getElementById(rootID).appendChild(this.newCommentDiv);

    if(localStorage.getItem("commentsData")) {
        var commentsObj = JSON.parse(localStorage.getItem("commentsData"));
        var comment = new Comment(commentsObj.comments, rootID);
        comment.addToUI(rootID);
    }
};


var loginHandler = function(e) {
    if(e) { // testing purpose
        e.preventDefault();
        sessionStorage.setItem("currentUser", document.getElementsByName("username")[0].value);
    }
    var loginDiv = document.getElementById("loginDiv");
    var body = loginDiv.parentNode;
    body.removeChild(loginDiv);
    var rootDiv = document.createElement("DIV");
    rootDiv.id = "root";
    body.insertBefore(rootDiv, body.firstElementChild);
    new CommentWidget("root");
}



//setting up avatar for 3 users
localStorage.setItem("ShirshenduAvatar", "avatar1.png");
localStorage.setItem("jamesAvatar", "avatar2.png");
localStorage.setItem("maxAvatar", "avatar3.png");

// sessionStorage.setItem("currentUser", "Shirshendu");
// loginHandler();

//login user and remove login input
document.getElementsByName("loginForm")[0].addEventListener("submit", loginHandler);




//local storage update function
var localStorageCommentsUpdate = function(username, timeStamp, newValue) {
    if(localStorage.getItem("commentsData")) {
        var commentsObj = JSON.parse(localStorage.getItem("commentsData"));
        for(var i = 0; i < commentsObj.comments.length; i++) {
            if(commentsObj.comments[i].username === username && commentsObj.comments[i].timeStamp === timeStamp) {
                commentsObj.comments[i] = newValue;
                break;
            }
            for(var j = 0; j < commentsObj.comments[i].replyComments.length; j++) {
                if(commentsObj.comments[i].replyComments[j].username === username && commentsObj.comments[i].replyComments[j].timeStamp === timeStamp) {
                    commentsObj.comments[i].replyComments[j] = newValue;
                    break;
                }
            }
        }
        localStorage.setItem("commentsData", JSON.stringify(commentsObj));
    }
}
