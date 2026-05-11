function movedTo(path: string): string {
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

export default {
	async fetch(request, env, _ctx): Promise<Response> {
		const url = new URL(request.url);
		const destination = new URL(movedTo(url.pathname), env.REDIRECT_TO);

		return Response.redirect(destination.toString(), 301);
	},
} satisfies ExportedHandler<Env>;
