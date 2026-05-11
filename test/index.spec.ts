import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

async function redirectLocation(path: string): Promise<string | null> {
	const request = new IncomingRequest(`https://narusejun.com${path}`);
	const ctx = createExecutionContext();
	const response = await worker.fetch(request, env, ctx);
	await waitOnExecutionContext(ctx);
	expect(response.status).toBe(301);
	return response.headers.get("location");
}

describe("pages", () => {
	const slugs = ["1", "64", "hoge"];

	slugs.forEach(slug => {
		it(`should redirect to /posts/${slug}/ when path is /archives/${slug}/`, async () => {
			expect(await redirectLocation(`/archives/${slug}/`)).toBe(`${env.REDIRECT_TO}/posts/${slug}/`);
		});
		it(`should redirect to /posts/${slug}/ when path is /archives/${slug}/index.html`, async () => {
			expect(await redirectLocation(`/archives/${slug}/index.html`)).toBe(`${env.REDIRECT_TO}/posts/${slug}/`);
		});
	});
});

describe("taxonomies", () => {
	const taxonomies = ["tags", "categories"];
	const suffixes = ["/hoge/", "/hoge", "/hoge/index.html", "/hoge/page/2/"];

	taxonomies.forEach(taxonomy => {
		suffixes.forEach(suffix => {
			it(`should redirect to /tags/hoge/ when path is /${taxonomy}${suffix}`, async () => {
				expect(await redirectLocation(`/${taxonomy}${suffix}`)).toBe(`${env.REDIRECT_TO}/tags/hoge/`);
			});
		});
		it(`should redirect to /tags/fuga/ when path is /${taxonomy}/fuga/`, async () => {
			expect(await redirectLocation(`/${taxonomy}/fuga/`)).toBe(`${env.REDIRECT_TO}/tags/fuga/`);
		});
	});
});

describe("fallbacks", () => {
	const paths = ["/", "/index.html", "/page/2/", "/tags/", "/about/"];
	paths.forEach(path => {
		it(`should redirect to / when path is ${path}`, async () => {
			expect(await redirectLocation(path)).toBe(`${env.REDIRECT_TO}/`);
		});
	});
});
