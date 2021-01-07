"use strict";

const moveTo = require("./index.js");
const assert = require("assert");

describe("pages", () => {
	const slugs = ["1", "64", "hoge"];

	slugs.forEach(slug => {
		it(`should redirect to /posts/${slug}/ when path is /archives/${slug}/`, () => {
			assert.strictEqual(moveTo(`/archives/${slug}/`), `/posts/${slug}/`);
		});
		it(`should redirect to /posts/${slug}/ when path is /archives/${slug}/index.html`, () => {
			assert.strictEqual(moveTo(`/archives/${slug}/index.html`), `/posts/${slug}/`);
		});
	});
});

describe("taxonomies", () => {
	const taxonomies = ["tags", "categories"];
	const suffixes = ["/hoge/", "/hoge", "/hoge/index.html", "/hoge/page/2/"];

	taxonomies.forEach(taxonomy => {
		suffixes.forEach(suffix => {
			it(`should redirect to /tags/hoge/ when path is /${taxonomy}${suffix}`, () => {
				assert.strictEqual(moveTo(`/${taxonomy}${suffix}`), `/tags/hoge/`);
			});
		});
		it(`should redirect to /tags/fuga/ when path is /${taxonomy}/fuga/`, () => {
			assert.strictEqual(moveTo(`/${taxonomy}/fuga/`), `/tags/fuga/`);
		});
	});
});

describe("fallbacks", () => {
	const paths = ["/", "/index.html", "/page/2/", "/tags/", "/about/"];
	paths.forEach(path => {
		it(`should redirect to / when path is ${path}`, () => {
			assert.strictEqual(moveTo(path), `/`);
		});
	});
});
