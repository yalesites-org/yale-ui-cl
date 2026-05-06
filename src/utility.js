export function addVariant(classNames, componentObject, componentName) { 
	let variants = classNames.split(" ");
	variants.forEach((c) => {componentObject.classList.add(componentName + "--" + c)});
};

export function createErrorIcon() {
		const errorIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const errorIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		errorIconPath.setAttribute("d", "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 304c13.25 0 24-10.75 24-24v-128C280 138.8 269.3 128 256 128S232 138.8 232 152v128C232 293.3 242.8 304 256 304zM256 337.1c-17.36 0-31.44 14.08-31.44 31.44C224.6 385.9 238.6 400 256 400s31.44-14.08 31.44-31.44C287.4 351.2 273.4 337.1 256 337.1z");
		errorIcon.appendChild(errorIconPath);
		errorIcon.setAttribute("viewBox", "0 0 512 512");
		errorIcon.classList.add("form-item__error_icon__icon");
		errorIcon.ariaHidden = true;
		return errorIcon;
};

export function createListDivider() {
	const listDivider = document.createElement("li");
        listDivider.classList.add("taxonomy-list__divider");
        listDivider.ariaHidden = true;
        listDivider.innerHTML = "|";
        return listDivider;
}

export function updateLinkIcon(icon, link, currentURL) {
	console.log(link);
	let extension = link.href.split(".").pop().toLowerCase();
		
		if (extension.includes("?")) {
			extension = extension.split("?");
			extension = extension[0];
		}
		
		const downloadExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'csv', 'xml', 'rtf'];

		console.log(icon)
		if (icon) icon.remove();
		
		if (downloadExts.includes(extension)) { // Download link
			link.insertAdjacentHTML("beforeend", `
	  		<span class="fa-icon fa-regular fa-circle-down"><span class="visually-hidden">(link is a download)</span></span>`);
		} else if (link.origin != currentURL) { // External link
			link.insertAdjacentHTML("beforeend", `
		<span class="fa-icon fa-solid fa-arrow-up-right"><span class="visually-hidden">(link is external)</span></span>`);
		} else if (link.target === "_blank") { // New window link
			link.insertAdjacentHTML("beforeend", `
		<span class="fa-icon fa-solid fa-arrow-up-right-from-square"><span class="visually-hidden">(link opens in new window)</span></span>`);
		} else return;
}