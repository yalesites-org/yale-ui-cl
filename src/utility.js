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

export function createIconSvg(icon, label) {
	const createdIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	const createdIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	createdIcon.setAttribute("viewBox", "0 0 512 512");
	createdIcon.setAttribute("style", "padding-left: .2rem")
	createdIcon.role = "img";
	createdIcon.ariaLabel = label;

	switch(icon) {
	case "circle-arrow-down":		
		createdIconPath.setAttribute("d", "M344 240h-56L287.1 152c0-13.25-10.75-24-24-24h-16C234.7 128 223.1 138.8 223.1 152L224 240h-56c-9.531 0-18.16 5.656-22 14.38C142.2 263.1 143.9 273.3 150.4 280.3l88.75 96C243.7 381.2 250.1 384 256.8 384c7.781-.3125 13.25-2.875 17.75-7.844l87.25-96c6.406-7.031 8.031-17.19 4.188-25.88S353.5 240 344 240zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464z");
		createdIcon.appendChild(createdIconPath);
		return createdIcon;

	case "arrow-up-right":
		createdIconPath.setAttribute("d", "M384 96c0-17.7-14.3-32-32-32L128 64c-17.7 0-32 14.3-32 32s14.3 32 32 32L274.7 128 9.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L320 173.3 320 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224z");
		createdIcon.appendChild(createdIconPath);
		return createdIcon;

	case "fa-arrow-up-right-from-square":
		createdIconPath.setAttribute("d", "M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z");
		createdIcon.appendChild(createdIconPath);
		return createdIcon;
	}
}

export function updateLinkIcon(icon, link, currentURL) {
	let extension = link.href.split(".").pop().toLowerCase();
		
		if (extension.includes("?")) {
			extension = extension.split("?");
			extension = extension[0];
		}
		
		const downloadExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'csv', 'xml', 'rtf'];
		const downloadIcon = createIconSvg("circle-arrow-down", "(link is a download)");
		const externalIcon = createIconSvg("arrow-up-right", "(link is external)");
		const newWindowIcon = createIconSvg("fa-arrow-up-right-from-square", "(opens in new window)");

		if (icon) icon.remove();
		
		if (downloadExts.includes(extension)) { // Download link
			link.insertAdjacentElement("beforeend", downloadIcon);
		} else if (link.origin != currentURL) { // External link
			link.insertAdjacentElement("beforeend", externalIcon);
		} else if (link.target === "_blank") { // New window link
			link.insertAdjacentElement("beforeend", newWindowIcon);
		} else return;
}