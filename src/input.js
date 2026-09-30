export function errorHandler(type) {
	const errorSpan = this.errorSlot.assignedElements();

			// Error slot is empty
			if (!errorSpan.length || !errorSpan[0].innerHTML) {
				this.input.ariaInvalid = false;
				this.valid = true;
				this.input.classList.remove(`form-item__${type}--error`);
				return;
			} else if (errorSpan[0].innerHTML) {			
			// There's content in the slot
			this.input.ariaInvalid = true;
			this.valid = false;
			this.input.classList.add(`form-item__${type}--error`);
			return;
			
}
};

export function inputHandler() {
	this.value = this.input.value;
};

export function attributeHandler(name, newValue) {
	if (name === "placeholder") this.input.placeholder = newValue;
		if (name === "class") {
			const required = (newValue ?? "").split(/\s+/).includes("required");
			this.input.required = required;
			this.label.classList.toggle("form-item__label--required", required);
		};
		if (name === "name") this.name = newValue;
		if (name === "autocomplete") this.input.autocomplete = newValue;
		if (name === "disabled") this.input.disabled = newValue !== null;
		if (name === "value") {
			this.input.value = newValue;
			this.internals_.setFormValue(newValue);
		}
		// Value, required, disabled, and type all affect validity, so recompute it on every change
		validityHandler.call(this);
};

export function validityHandler() {
		this.internals_.setValidity(this.input.validity, this.input.validationMessage, this.input);
};