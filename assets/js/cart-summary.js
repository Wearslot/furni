if (!customElements.get('cart-summary')) {
    customElements.define('cart-summary', class CartSummary extends HTMLElement {
        constructor() {
            super();

            this.cart = document.querySelector('cart-items');
            this.addRemoveItemFormsEventListener();
        }

        addRemoveItemFormsEventListener() {
            this.removeForms = this.querySelectorAll('[form-id="remove_item_form"]').forEach(form => {
                form.addEventListener("submit", this.removeItemFromCart.bind(this));
            });
        }

        removeItemFromCart(event) {
            event.preventDefault();

            this.submitButton = event.target.querySelector('[type="submit"]');
            this.activateLoadingState();

            const formData = new FormData(event.target);
            const url = event.target.getAttribute("action");

            const components = [
                ...this.getAffectedComponents(),
                ...(this.cart ? this.cart.getAffectedComponents() : [])];

            formData.append('components', JSON.stringify(components.map(component => component.id)));

            const config = fetchConfig();
            config.body = parseFormToJson(formData);

            fetch(url, config)
                .then(response => response.json())
                .then(response => {
                    if (response.status === 'error') {
                        return this.handleError(response.message);
                    }

                    event.target.closest('[cart-item]').remove();

                    this.updateAffectedCoponents(components, response);
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.deactivateLoadingState();
                });
        }

        removeItem(id) {
            this.item = document.querySelector(`[cart-item="${id}"]`);
            if (!this.item) return;

            this.item.remove();
        }

        getAffectedComponents() {
            return [
                {
                    id: "cart-summary",
                    selector: ".cart-summary-wrapper"
                },
                {
                    id: "cart-count",
                    selector: ".cart-count"
                }
            ];
        }

        updateAffectedCoponents(components, response) {
            components.forEach(component => {
                renderComponents(component.selector, response.components[component.id])
            })
        }

        getComponentHtml(component) {
            return new DOMParser().parseFromString(component, 'text/html');
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

        show() {
            if (!document.querySelector('.cart-summary')) return;

            document.querySelector('.cart-summary').classList.add("active");
            document.querySelector('.cart-summary').addEventListener("mouseover", this.handleMouseOver.bind(this))
        }

        hide() {
            if (!document.querySelector('.cart-summary')) return;
            document.querySelector('.cart-summary').classList.remove("active");
        }

        handleMouseOver() {
            if (document.querySelector('.cart-summary').classList.contains("active")) {
                document.querySelector('.cart-summary').classList.remove("active")
            }
        }

        handleError(error) {

        }
    })

}