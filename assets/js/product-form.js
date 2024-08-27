if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement {
        constructor() {
            super();

            this.form = this.querySelector('[form-id="product_form"]');
            this.form.addEventListener("submit", this.onSubmit.bind(this))
            this.submitButton = this.querySelector('[type="submit"]');

            this.error = this.querySelector('.error');
            this.cart = document.querySelector("cart-summary") || document.querySelector('cart-notification');
        }

        onSubmit(event) {
            event.preventDefault();
            this.activateLoadingState();

            if (!this.error.classList.contains('d-none')) {
                this.error.classList.add('d-none')
            }

            const formData = new FormData(this.form);
            const url = this.form.getAttribute("action");

            const components = this.cart.getAffectedComponents();
            formData.append('components', JSON.stringify(components.map(component => component.id)));

            const config = fetchConfig();
            config.body = parseFormToJson(formData);

            fetch(url, config)
                .then(response => response.json())
                .then(response => {

                    if (response.status) {
                        return this.handleError(response.message);
                    }

                    this.cart.updateAffectedCoponents(components, response);
                    this.cart.show();

                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    this.deactivateLoadingState();
                })
        }

        updateAffectedCoponents(components, response) {
            components.forEach(component => {
                this.renderComponents(component.selector, response.components[component.id])
            });
        }


        renderComponents(selector, component) {
            const targets = document.querySelectorAll(selector);
            if (!targets.length) return;

            targets.forEach(element => {
                element.innerHTML = component;
            })
        }

        activateLoadingState() {
            this.submitButton.classList.add('loading', 'disabled');
            this.submitButton.setAttribute("disabled", "disabled");
            this.submitButton.querySelector(".button_text").classList.add('hidden');
            this.submitButton.querySelector('.loading__spinner').classList.remove('hidden');
        }

        deactivateLoadingState() {
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
    });
}


