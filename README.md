# Commenting Widget

This project is built with Vanilla JavaScript and CSS. It lets user post comments, reply to a comment and vote up or down a comment. Quite similar to what we have in Facebook or any other similar platform.

The only NPM package used here is `http-server` for creating a development server.

ES6 is intentionally not used in this project as it would require Babel transpilation for maximum browser support.

This project doesn't use any API instead it uses the browser storage such as `sessionStorage` & `localStorage`.

### Plugging it to existing website

Just pass the id of the `div` where the widgets needs to be rendered while calling constructor `CommentWidget`

For example `var commentWidget = new CommentWidget("rootDiv");`

Where `rootDiv` is the id of the div where the widget will be rendered.

Also please make sure that styles inside `main.css` file is available to the widget.

### Log In

It will first ask the user for a username for logging in. This username will be used for posting comments / reply.

### User Avatar

There are 3 separate avatar image available for usernames mike, max & james. For all other usernames it will display a default image.

### Posting Comments

Users can type his / her comments and press `Enter` to post it. For entering a new line users can press `Shift + Enter`.

### Replying

Users can reply to comments. Reply and nesting is available up to level 3 where level 1 is the root comment.

### Voting

Each users can vote to other user's comment or reply only once. Users can either vote up or vote down.