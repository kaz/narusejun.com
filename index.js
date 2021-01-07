"use strict";

/**
 * @param {string} path
 */
function movedTo(path) {
	const [, slug] = path.match(/^\/archives\/(.+?)(?:\/|$)/) || [];
	if (slug) {
		return `/posts/${slug}/`;
	}

	const [, taxonomy] = path.match(/^\/(?:tags|categories)\/(.+?)(?:\/|$)/) || [];
	if (taxonomy) {
		return `/tags/${taxonomy}/`;
	}

	return "/";
}

/**
 * @param {Request} request
 */
async function handleRequest(request) {
	const url = new URL(request.url);
	const destination = new URL(movedTo(url.pathname), "https://6715.jp");

	return Response.redirect(destination.toString(), 301);
}

if (typeof addEventListener == "function") {
	addEventListener("fetch", event => {
		event.respondWith(handleRequest(event.request));
	});
}
if (typeof module == "object") {
	module.exports = movedTo;
}
