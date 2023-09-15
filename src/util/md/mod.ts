import { load } from "js-yaml";
import { z } from "zod";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { markedSmartypants } from "marked-smartypants";
import hljs from "highlight.js/lib/common";

marked.use(gfmHeadingId());
marked.use(markedSmartypants());
marked.use(
	markedHighlight({
		langPrefix: "hljs language-",
		highlight: (code, lang) => {
			let language = "plaintext";
			if (hljs.getLanguage(lang)) {
				language = lang;
			} else if (lang === "svelte") {
				language = "html";
			}
			return hljs.highlight(code, { language }).value;
		},
	}),
);

interface Heading {
	id: string;
	level: number;
	name: string;
}

interface Data<T extends z.ZodTypeAny> {
	article: string;
	headings: Heading[];
	html: string;
	frontmatter?: z.infer<T>;
}

/**
 * - processes markdown strings, pass in a zod schema for frontmatter parsing
 * - uses `highlight.js` to syntax highlight
 *
 * ```ts
 * const frontmatterSchema = z
 *		.object({
 *			title: z.string(),
 *			description: z.string(),
 *			keywords: z
 *				.string()
 *				.transform((val) => val.split(",").map((s) => s.trim().toLowerCase())),
 *			date: z.string(),
 *		})
 *		.strict();
 *
 * const data = process(md, frontmatterSchema);
 * ```
 * @param md string
 * @param frontmatterSchema an optional zod schema
 * @returns headings, article, frontmatter, html
 */
export const process = <T extends z.ZodTypeAny>(
	md: string,
	frontmatterSchema?: T,
) => {
	const split = md.split("---");

	const yaml = split.at(1);

	const article = yaml ? split.slice(2).join("---") : md;

	const headings = getHeadings(article);

	const html = marked.parse(article);

	const data: Data<T> = { article, headings, html };

	if (frontmatterSchema) {
		if (!yaml) {
			throw new Error(
				"No yaml found.\n\nPlease ensure your frontmatter is at the beginning of your file and is surrounded by fences `---`",
			);
		}

		data.frontmatter = getFrontmatter(yaml, frontmatterSchema);
	}

	return data;
};

const getHeadings = (md: string) => {
	const lines = md.split("\n");
	const headingRegex = /^(#{1,6})\s*(.+)/;
	const codeFenceRegex = /^```/;

	let inCodeFence = false;
	const headings: Heading[] = [];
	for (let line of lines) {
		line = line.trim();

		// Check for code fence
		if (codeFenceRegex.test(line)) {
			inCodeFence = !inCodeFence;
			continue;
		}

		// Skip headings within code fences
		if (inCodeFence) continue;

		const match = headingRegex.exec(line);
		if (match) {
			const level = match.at(1)?.length;
			const name = match.at(2);

			if (level && name) {
				const id = name
					.trim()
					.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[^\w-]+/g, "");

				headings.push({ id, level, name });
			}
		}
	}

	return headings;
};

const getFrontmatter = (yaml: string, frontmatterSchema: z.ZodSchema) => {
	const loaded = load(yaml);

	const parsed = frontmatterSchema.safeParse(loaded);

	if (!parsed.success) {
		throw new Error(
			`Invalid frontmatter, please correct or update schema in src/schemas:\n\n${JSON.stringify(
				parsed.error.issues[0],
				null,
				4,
			)}`,
		);
	}

	return parsed.data;
};
