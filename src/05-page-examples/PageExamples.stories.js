// Full sample pages assembled from existing UICL atoms and molecules, to show how the components
// fit together. They're generic pages, not models of any particular CMS content type.
import "../01-atoms/cta/Cta";
import "../01-atoms/divider/Divider";
import "../01-atoms/headings/Heading";
import "../01-atoms/icons/Icon";
import "../01-atoms/image/ResponsiveImage";
import "../01-atoms/text-link/Link";
import "../01-atoms/video-embed/VideoEmbed";
import "../02-molecules/accordions/Accordion";
import "../02-molecules/alert/Alert";
import "../02-molecules/banner/action/ActionBanner";
import "../02-molecules/banner/image/ImageBanner";
import "../02-molecules/callout/Callout";
import "../02-molecules/cards/custom-card/CustomCard";
import "../02-molecules/cards/directory-listing-card/DirectoryListingCard";
import "../02-molecules/cards/reference-card/ReferenceCard";
import "../02-molecules/content-spotlight-portrait/ContentSpotlightPortrait";
import "../02-molecules/data-table/DataTable";
import "../02-molecules/facts-and-figures/FactsAndFigures";
import "../02-molecules/image/ImageBlock";
import "../02-molecules/inline-message/InlineMessage";
import "../02-molecules/link-grid/LinkGrid";
import "../02-molecules/link-group/LinkGroup";
import "../02-molecules/link-skip/LinkSkip";
import "../02-molecules/page-title/PageTitle";
import "../02-molecules/pager/Pager";
import "../02-molecules/pull-quote/PullQuote";
import "../02-molecules/quick-links/QuickLinks";
import "../02-molecules/quote-callout/QuoteCallout";
import "../02-molecules/read-time/ReadTime";
import "../02-molecules/related-content/RelatedContent";
import "../02-molecules/search-result/SearchResult";
import "../02-molecules/social-links/SocialLinks";
import "../02-molecules/tabs/Tabs";
import "../02-molecules/taxonomy-display/TaxonomyDisplay";
import "../02-molecules/text/Text";
import "../02-molecules/text-with-image/TextWithImage";
import "../02-molecules/tile-item/TileItem";
import "../02-molecules/video/Video";
import "../02-molecules/wrapped-callout/WrappedCallout";
import "../02-molecules/wrapped-image/WrappedImage";
import quoteImage from "../assets/avif-test-image.avif";

// Self-contained placeholder so the pages don't depend on an image host.
const placeholder = (w, h) => `data:image/svg+xml,${encodeURIComponent(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(Math.min(w, h) / 8)}" fill="#4a4a4a">${w} x ${h}</text></svg>`
)}`;
const bannerImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#978d85"/></svg>')}`;

// Page-level layout only: centres free-standing content (headings, lists of cards) at site width.
const contained = (html) =>
	`<div style="max-width: var(--size-component-layout-width-site); margin-inline: auto; padding-inline: var(--size-spacing-6);">${html}</div>`;
const grid = (items, min = "18rem") =>
	`<ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(${min}, 1fr)); gap: var(--size-spacing-8);">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
const section = (heading, body) =>
	contained(`<ycl-heading level="2" style="margin-block-end: var(--size-spacing-6);">${heading}</ycl-heading>
		${body}`);
const page = (id, body) =>
	`<ycl-link-skip href="#${id}">Skip to main content</ycl-link-skip>
	${body.header ?? ""}
	<main id="${id}" tabindex="-1" style="display: flex; flex-direction: column; gap: var(--size-spacing-10); padding-block-end: var(--size-spacing-10);">
		${body.main}
	</main>
	<footer style="padding-block: var(--size-spacing-8);">
		${contained(`<ycl-divider thickness="hairline"></ycl-divider>
		<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--size-spacing-6); padding-block-start: var(--size-spacing-6);">
			<p style="margin: 0;">Yale University, New Haven, Connecticut</p>
			<ycl-social-links facebook="https://www.facebook.com/YaleUniversity" instagram="https://www.instagram.com/yale" youtube="https://www.youtube.com/yale" linkedin="https://www.linkedin.com/school/yale-university"></ycl-social-links>
		</div>`)}
	</footer>`;

const departmentFacts = [
	["people-group-solid", "48", "Faculty members"],
	["flask-solid", "60+", "Research groups"],
	["graduation-cap-solid", "6:1", "Student to faculty ratio"],
];

const departmentCards = [
	["Undergraduate research", "Work with faculty on original research from your first year."],
	["Shared instrumentation", "Book time on spectrometers, microscopes, and other core facilities."],
	["Seminars and colloquia", "Weekly talks from visiting scholars and our own researchers."],
];

const waysToGetInvolved = [
	["one", "Join a research group"],
	["two", "Become a peer tutor"],
	["three", "Join the chemistry society"],
];

const departmentHomepage = () => page("homepage-main", {
	header: `<ycl-alert type="announcement">
		<ycl-heading level="2" slot="heading">Spring open house registration is open</ycl-heading>
		<p>Prospective students and families can sign up for a tour of the labs and teaching spaces.</p>
		<text-link slot="link" href="#">Register for a visit</text-link>
	</ycl-alert>`,
	main: `
		<ycl-page-title display="visually-hidden">Department of Chemistry</ycl-page-title>

		<ycl-action-banner theme="one" layout="left" button-alignment="left" width="full">
			<ycl-image slot="image"><img src="${bannerImage}" alt="Students working at a lab bench"></ycl-image>
			<ycl-heading level="2" slot="heading">Discovery starts at the molecular level</ycl-heading>
			<p>Our students and faculty work across chemistry, biology, physics, and materials science.</p>
			<cta-link slot="actions" class="filled" href="#">Explore programs</cta-link>
			<cta-link slot="actions" class="outline" href="#">Visit the department</cta-link>
		</ycl-action-banner>

		<ycl-quick-links theme="one" variation="promotional">
			<ycl-heading level="2" slot="heading">Get started</ycl-heading>
			<p slot="description">The pages people visit most often.</p>
			<ycl-image slot="image"><img src="${placeholder(1600, 900)}" alt=""></ycl-image>
			<cta-link class="outline" href="#">Undergraduate study</cta-link>
			<cta-link class="outline" href="#">Graduate admissions</cta-link>
			<cta-link class="outline" href="#">Faculty and research groups</cta-link>
			<cta-link class="outline" href="#">Contact the department</cta-link>
		</ycl-quick-links>

		${section("The department by the numbers", grid(departmentFacts.map(([icon, stat, label]) =>
			`<ycl-facts-and-figures theme="one" padded><ycl-icon slot="icon" name="${icon}"></ycl-icon><span slot="stat">${stat}</span>${label}</ycl-facts-and-figures>`), "14rem"))}

		<ycl-text-with-image theme="default" width="site" position="image-left" vertical-align="middle" image-style="inline" focus="equal">
			<ycl-image slot="image"><img src="${placeholder(900, 600)}" alt="Researchers reviewing results on a laptop in the lab"></ycl-image>
			<p slot="overline">Research spotlight</p>
			<ycl-heading level="2" slot="heading">Building tools to see proteins inside living cells</ycl-heading>
			<text-link slot="ctas" href="#">Meet the research groups</text-link>
			<p>Researchers in the department are developing new imaging techniques that show how proteins fold and move in real time.</p>
		</ycl-text-with-image>

		${section("Explore the department", grid(departmentCards.map(([heading, text]) =>
			`<ycl-custom-card href="#"><ycl-image slot="image" ratio="3x2"><img src="${placeholder(600, 400)}" alt=""></ycl-image><ycl-heading level="3" slot="heading">${heading}</ycl-heading><p>${text}</p></ycl-custom-card>`)))}

		${section("Ways to get involved", grid(waysToGetInvolved.map(([theme, label], i) =>
			`<ycl-tile-item theme="${theme}" href="#" style="min-height: 14rem;"><span slot="heading">${String(i + 1).padStart(2, "0")}</span>${label}</ycl-tile-item>`), "14rem"))}

		<ycl-callout theme="four" alignment="center">
			<ycl-callout-item>
				<ycl-heading level="2" slot="heading">Support the department</ycl-heading>
				<p>Gifts fund student research, fellowships, and new teaching labs.</p>
				<cta-link slot="link" class="outline" href="#">Make a gift</cta-link>
			</ycl-callout-item>
			<ycl-callout-item>
				<ycl-heading level="2" slot="heading">Stay in touch</ycl-heading>
				<p>Alumni can update their details and hear about reunions and talks.</p>
				<cta-link slot="link" class="outline" href="#">Update your details</cta-link>
			</ycl-callout-item>
		</ycl-callout>`,
});

const programOverview = () => page("program-main", {
	header: `<ycl-image-banner theme="one" size="short" width="full">
		<ycl-image><img src="${bannerImage}" alt="The courtyard outside the department building"></ycl-image>
	</ycl-image-banner>`,
	main: `
		<ycl-page-title prefix="Program">Environmental Studies</ycl-page-title>

		${contained(`<ycl-read-time target="#program-main"></ycl-read-time>`)}

		<ycl-text variation="emphasized">
			<p>Environmental Studies brings together the natural sciences, social sciences, and humanities to understand and address environmental challenges.</p>
		</ycl-text>

		<ycl-wrapped-image alignment="right" image-style="floated">
			<ycl-image slot="image"><img src="${placeholder(900, 600)}" alt="Students taking water samples from a stream"></ycl-image>
			<p slot="caption">Fieldwork is part of every year of the program.</p>
			<p>The program is interdisciplinary by design. Students take a shared core of courses in ecology, policy, and environmental history, then build a concentration around a question that matters to them.</p>
			<p>Fieldwork, internships, and a senior project connect classroom learning to real places and communities. Many students work with partners in New Haven and across Connecticut, and some travel further afield for summer research. Read more on the <text-link href="#">program requirements</text-link> page.</p>
		</ycl-wrapped-image>

		<ycl-pull-quote variant="bar-left" theme="one">
			<p>The program taught me to look at a problem from every side, from the chemistry of the soil to the history of the town.</p>
			<span slot="attribution">A recent graduate</span>
		</ycl-pull-quote>

		${section("How the program works", `<ycl-tabs theme="one" label="Program stages">
			<ycl-tab label="First year">
				<p>Take the introductory sequence and a first-year seminar. Meet with an <text-link href="#">adviser</text-link> to plan your path.</p>
			</ycl-tab>
			<ycl-tab label="Concentration">
				<p>Choose a concentration such as climate, conservation, or environmental justice and take its core courses.</p>
			</ycl-tab>
			<ycl-tab label="Senior project">
				<p>Complete an independent senior project with a faculty adviser and present it at the spring symposium.</p>
			</ycl-tab>
		</ycl-tabs>`)}

		<ycl-video alignment="left" width="site">
			<ycl-video-embed src="https://www.youtube-nocookie.com/embed/GL5XhmKCXo0" video-title="Introduction to the program"></ycl-video-embed>
			<ycl-heading level="2" slot="heading">Hear from students in the program</ycl-heading>
			<p slot="text">Students describe their fieldwork, senior projects, and life after graduation.</p>
		</ycl-video>

		<ycl-content-spotlight-portrait theme="one" position="image-left" vertical-align="middle" image-style="inline">
			<ycl-image slot="image"><img src="${placeholder(400, 600)}" alt="The director of undergraduate studies standing in a greenhouse"></ycl-image>
			<p slot="overline">Faculty spotlight</p>
			<ycl-heading level="2" slot="heading">Teaching ecology outdoors</ycl-heading>
			<text-link slot="ctas" href="#">Meet the faculty</text-link>
			<p>The program's introductory ecology course meets in the field for half of its sessions, from salt marshes to city parks.</p>
		</ycl-content-spotlight-portrait>

		<ycl-wrapped-callout alignment="left" theme="one">
			<ycl-heading level="2" slot="callout">Declaring the major</ycl-heading>
			<p slot="callout">Declare by the end of your sophomore year. <text-link href="#">See the steps</text-link>.</p>
			<p>Most students declare after completing two introductory courses. Talk with the director of undergraduate studies about how courses you have already taken may count toward the major.</p>
			<p>Students who study abroad can often count approved courses toward their concentration. Plan ahead so that your senior project timeline still works.</p>
		</ycl-wrapped-callout>

		<ycl-image-block width="content" alignment="center">
			<ycl-image><img src="${placeholder(1600, 900)}" alt="Students presenting posters at the spring symposium" width="1600" height="900"></ycl-image>
			<span slot="caption">Seniors present their projects at the spring symposium.</span>
		</ycl-image-block>

		<ycl-quote-callout variant="image" quote-alignment="left" theme="two">
			<ycl-image slot="image" ratio="1x1"><img src="${quoteImage}" alt=""></ycl-image>
			<p>Every course asked us to connect what we learned to a real place. That's what made it stick.</p>
			<span slot="attribution">Current student</span>
		</ycl-quote-callout>

		${contained(`<ycl-accordion>
			<ycl-heading level="2" slot="heading">Frequently asked questions</ycl-heading>
			<ycl-accordion-item>
				<ycl-heading level="3" slot="heading">Can I double major?</ycl-heading>
				<p>Yes. Many students pair Environmental Studies with economics, biology, or history.</p>
			</ycl-accordion-item>
			<ycl-accordion-item>
				<ycl-heading level="3" slot="heading">Is there funding for summer research?</ycl-heading>
				<p>The program offers summer fellowships; applications are due in February.</p>
			</ycl-accordion-item>
			<ycl-accordion-item>
				<ycl-heading level="3" slot="heading">Who should I contact with questions?</ycl-heading>
				<p>Email the program coordinator or stop by during weekly drop-in hours.</p>
			</ycl-accordion-item>
		</ycl-accordion>`)}

		<ycl-inline-message type="marketing" theme="one">
			<ycl-heading level="2" slot="heading">Applications for summer fellowships are open</ycl-heading>
			<p>Submit a short proposal and a faculty recommendation by February 15.</p>
			<text-link slot="link" href="#">Apply for a fellowship</text-link>
		</ycl-inline-message>

		<ycl-link-group>
			<ycl-heading level="2" slot="heading-one">For current students</ycl-heading>
			<ycl-heading level="2" slot="heading-two">For prospective students</ycl-heading>
			<text-link slot="links-one" href="#">Course requirements</text-link>
			<text-link slot="links-one" href="#">Senior project guidelines</text-link>
			<text-link slot="links-one" href="#">Internship opportunities</text-link>
			<text-link slot="links-two" href="#">Why study the environment?</text-link>
			<text-link slot="links-two" href="#">Talk to a student</text-link>
			<text-link slot="links-two" href="#">Visit a class</text-link>
		</ycl-link-group>

		<ycl-related-content width="site">
			<ycl-heading level="2" slot="heading">Related programs</ycl-heading>
			<ycl-related-content-item href="#" type="Page" category="Program"><ycl-heading level="3" slot="heading">Ecology and Evolutionary Biology</ycl-heading></ycl-related-content-item>
			<ycl-related-content-item href="#" type="Page" category="Program"><ycl-heading level="3" slot="heading">Global Affairs</ycl-heading></ycl-related-content-item>
			<ycl-related-content-item href="#" type="Page" category="Certificate"><ycl-heading level="3" slot="heading">Energy Studies</ycl-heading></ycl-related-content-item>
		</ycl-related-content>

		${contained(`<ycl-taxonomy-display>
			<ycl-taxonomy-display-item label="Audience"><text-link href="#">Undergraduates</text-link><text-link href="#">Prospective students</text-link></ycl-taxonomy-display-item>
			<ycl-taxonomy-display-item label="Topic"><text-link href="#">Environment</text-link><text-link href="#">Policy</text-link></ycl-taxonomy-display-item>
		</ycl-taxonomy-display>`)}`,
});

const courses = [
	["ENVS 100", "Environmental Science and Society", "Rosa Lin", "Fall"],
	["ENVS 210", "Ecology of Urban Landscapes", "Daniel Okafor", "Spring"],
	["ENVS 245", "Climate Policy", "Grace Liu", "Fall"],
	["ENVS 310", "Environmental History of New England", "Hannah Weiss", "Spring"],
	["ENVS 330", "Water and Society", "Samuel Ortiz", "Fall"],
	["ENVS 490", "Senior Project Seminar", "Priya Natarajan", "Spring"],
];

const advisers = [
	["Ecology", "Marcus Chen", "Director of Undergraduate Studies", "marcus.chen@example.edu"],
	["Policy", "Grace Liu", "Senior Lecturer", "grace.liu@example.edu"],
	["History", "Hannah Weiss", "Associate Professor", "hannah.weiss@example.edu"],
];

const guides = [
	["Planning your four years", "A term-by-term guide to the major, with sample schedules for each concentration."],
	["Finding a summer internship", "Where past students have worked and how to approach host organizations."],
];

const handbookPages = [
	["Course requirements", "Undergraduate handbook", "The courses you need to complete the major, by concentration."],
	["Senior project guidelines", "Undergraduate handbook", "Timelines, formatting, and how projects are assessed."],
	["Transfer credit", "Policies", "How courses taken elsewhere count toward the major."],
];

const directoryListing = () => page("directory-main", {
	main: `
		<ycl-page-title>Courses and Advising</ycl-page-title>

		<ycl-text alignment="left">
			<p>Find this year's courses, look up an adviser, and search the program handbook. Contact the <text-link href="#">program office</text-link> if you can't find what you need.</p>
		</ycl-text>

		${section("Courses this year", `<ycl-data-table label="Search courses" placeholder="Course, title or instructor">
			<table>
				<caption>Environmental Studies courses</caption>
				<thead>
					<tr><th scope="col">Course</th><th scope="col">Title</th><th scope="col">Instructor</th><th scope="col">Term</th></tr>
				</thead>
				<tbody>
					${courses.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
				</tbody>
			</table>
		</ycl-data-table>`)}

		${section("Advisers", grid(advisers.map(([area, name, title, email]) => `<ycl-directory-listing-card href="#" layout="directory-listing">
			<ycl-image slot="image"><img src="${placeholder(400, 400)}" alt=""></ycl-image>
			<span slot="overline">${area}</span>
			<ycl-heading level="3" slot="heading">${name}</ycl-heading>
			<span slot="subheading">${title}</span>
			<text-link slot="email" href="mailto:${email}">Email ${name}</text-link>
		</ycl-directory-listing-card>`), "16rem"))}

		${section("Guides", grid(guides.map(([heading, text]) =>
			`<ycl-reference-card href="#" layout="list"><ycl-image slot="image"><img src="${placeholder(600, 400)}" alt=""></ycl-image><ycl-heading level="3" slot="heading">${heading}</ycl-heading><p>${text}</p></ycl-reference-card>`), "100%"))}

		${section("Handbook pages", `${handbookPages.map(([heading, source, teaser]) => `<ycl-search-result href="#" content-type="page">
			<ycl-heading level="3" slot="heading">${heading}</ycl-heading>
			<p slot="highlighted">${source}</p>
			<p slot="teaser">${teaser}</p>
		</ycl-search-result>`).join("")}
		<ycl-pager current="1" total-pages="4" base-url="#" label="Handbook pages"></ycl-pager>`)}

		<ycl-link-grid theme="one" line-treatment="default">
			<ycl-heading level="2" slot="heading">Program office</ycl-heading>
			<ycl-heading level="3" slot="heading-one">Forms</ycl-heading>
			<text-link slot="links-one" href="#">Declare the major</text-link>
			<text-link slot="links-one" href="#">Course substitution request</text-link>
			<ycl-heading level="3" slot="heading-two">Policies</ycl-heading>
			<text-link slot="links-two" href="#">Academic integrity</text-link>
			<text-link slot="links-two" href="#">Grading and credit</text-link>
			<text-link slot="links-three" href="#">Office hours</text-link>
			<text-link slot="links-three" href="#">Contact us</text-link>
		</ycl-link-grid>`,
});

// The pager pages in place, rather than navigating the preview away.
const withInPagePaging = (html) => {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = html;
	// ycl-page-change bubbles from the pager host, so one listener covers every pager.
	wrapper.addEventListener("ycl-page-change", (event) => {
		if (event.target.localName !== "ycl-pager") return;
		event.preventDefault();
		event.target.current = event.detail.page;
	});
	return wrapper;
};

export default {
	title: "Page examples/Sample pages",
	parameters: {
		layout: "fullscreen",
	},
};

export const DepartmentHomepage = {
	name: "Department homepage",
	render: departmentHomepage,
};

export const ProgramOverview = {
	name: "Program overview",
	render: programOverview,
};

export const DirectoryListing = {
	name: "Courses and advising directory",
	render: () => withInPagePaging(directoryListing()),
};
