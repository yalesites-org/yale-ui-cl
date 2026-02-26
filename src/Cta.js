const ctaTemplate = document.createElement('template');
ctaTemplate.innerHTML = `
	<style></style>
	<a class="cta" href="#"><slot>Default Link</slot></a>
`;

const ctaSheet = new CSSStyleSheet();
ctaSheet.replaceSync(url('./cta.css'));

export class Cta extends HTMLElement {
	static get observedAttributes() {
	return["href"];
}

	constructor() {
		super(); 
	};
	
	connectedCallback() {
		const shadow = this.attachShadow({mode: "open"});
		const childNodes = Array.from(shadow.childNodes);
		const link = childNodes['A'] 
		shadow.appendChild(document.importNode(ctaTemplate.content, true));
		shadow.adoptedStyleSheets = [ctaSheet]
		console.log("CTA connected");
		console.log(ctaTemplate);
	};

	attributeChangedCallback(name, oldValue, newValue) { 
		link.setAttribute('href', '${name}');
};
}

customElements.define("cta-link", Cta);
