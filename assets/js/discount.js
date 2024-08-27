class Discount extends HTMLElement {

    activateLoadingState() {
        if (!this.submitButton) return;
        this.submitButton.classList.add('loading', 'disabled');
        this.submitButton.setAttribute("disabled", "disabled");
        this.submitButton.querySelector(".button_text").classList.add('hidden');
        this.submitButton.querySelector('.loading__spinner').classList.remove('hidden');
    }

    deactivateLoadingState() {
        if (!this.submitButton) return;
        this.submitButton.classList.remove('loading', 'disabled');
        this.submitButton.removeAttribute("disabled");
        this.submitButton.querySelector(".button_text").classList.remove('hidden');
        this.submitButton.querySelector('.loading__spinner').classList.add('hidden');
    }

    handleError(error) {
        if (!this.error) return;

        this.error.querySelector('.error-message').textContent = error || 'Something went wrong.';
        this.error.classList.remove('d-none');
    }

    hide() {
        if (this.classList.contains('d-none')) return;
        this.classList.add('d-none');
    }

    show() {
        if (!this.classList.contains('d-none')) return;
        this.classList.remove('d-none');
    }
}

if (!customElements.get('discount-apply')) {
    customElements.define('discount-apply', class DiscountApply extends Discount {
        constructor() {
            super();

            this.form = this.querySelector('[form-id="coupon_apply_form"]');
            this.form.addEventListener('submit', this.onSubmit.bind(this));

            this.error = this.querySelector('.error');
            this.submitButton = this.querySelector('[type="submit"]');

            this.removeForm = document.querySelector('discount-remove');
        }

        onSubmit(event) {
            event.preventDefault();

            this.activateLoadingState();

            const formData = new FormData(this.form);
            formData.append('components', JSON.stringify(this.getAffectedComponents().map(component => component.id)));

            const config = fetchConfig();
            config.body = parseFormToJson(formData);

            fetch(`${routes.discount_apply}`, config)
                .then(response => response.json())
                .then(response => {

                    if (response.status) {
                        this.handleError(response.message);
                    }

                    this.getAffectedComponents().forEach(component => {
                        renderComponents(component.selector, response.components[component.id])
                    });

                    this.hide();
                    if (this.removeForm) this.removeForm.show();

                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.deactivateLoadingState();
                })
        }

        getAffectedComponents() {
            return [
                {
                    id: 'applied-coupon',
                    selector: '.applied-coupon-wrapper'
                },
                {
                    id: 'cart-discount-amount',
                    selector: '.cart-discount-amount'
                }
            ];
        }
    })
}

if (!customElements.get('discount-remove')) {
    customElements.define('discount-remove', class DiscountRemove extends Discount {
        constructor() {
            super();

            this.form = this.querySelector('[form-id="coupon_remove_form"]');
            this.form.addEventListener('submit', this.onSubmit.bind(this));

            this.error = this.querySelector('.error');
            this.submitButton = this.querySelector('[type="submit"]');

            this.applyForm = document.querySelector('discount-apply');
        }

        onSubmit(event) {
            event.preventDefault();

            this.activateLoadingState();

            const formData = new FormData(this.form);
            formData.append('components', JSON.stringify(this.getAffectedComponents().map(component => component.id)));

            const config = fetchConfig();
            config.body = parseFormToJson(formData);

            fetch(`${routes.discount_remove}`, config)
                .then(response => response.json())
                .then(response => {

                    if (response.status) {
                        this.handleError(response.message);
                    }

                    this.getAffectedComponents().forEach(component => {
                        renderComponents(component.selector, response.components[component.id])
                    });

                    this.hide();
                    if (this.applyForm) this.applyForm.show();

                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.deactivateLoadingState();
                })
        }

        getAffectedComponents() {
            return [
                {
                    id: 'cart-discount-amount',
                    selector: '.cart-discount-amount'
                }
            ];
        }
    })
}