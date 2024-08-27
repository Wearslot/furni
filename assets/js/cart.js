if (!customElements.get('cart-items')) {
    customElements.define('cart-items', class CartItems extends HTMLElement {
        constructor() {
            super();

            this.summary = document.querySelector('cart-summary');
            this.error = document.querySelector('.error');
            this.querySelectorAll(".cart-item__quantity").forEach(field => field.addEventListener("change", this.onChange.bind(this)))
        }

        onChange(event) {
            this.updateCartItem(
                parseInt(event.target.getAttribute('data-line')),
                parseInt(event.target.value)
            )
        }

        updateCartItem(line, quantity) {
            this.activateLoading(line)

            const components = [
                ...this.getAffectedComponents(line),
                ...(this.summary ? this.summary.getAffectedComponents() : [])];

            const data = {
                line,
                quantity,
                components: JSON.stringify(components.map(component => component.id))
            };

            const config = fetchConfig();
            config.body = JSON.stringify(data);

            fetch(`${routes.cart_update}`, config)
                .then(response => response.json())
                .then(response => {

                    if (response.status === 'error') {
                        return this.handleErrors(response.message);
                    }

                    if (quantity == 0) {
                        document.querySelector(`#cart-item-${line}`).remove();
                    }

                    this.updateAffectedCoponents(components, response);

                    if (response.items.length === 0) {
                        // show empty cart state
                        this.toggleState(true);
                    }

                }).catch((e) => {
                    console.log(e)
                }).finally(() => {
                    this.deactivateLoading(line);
                })
        }

        getAffectedComponents(line) {
            return [
                {
                    id: "cart-subtotal-amount",
                    selector: ".cart-subtotal-amount"
                },
                {
                    id: "cart-total-amount",
                    selector: ".cart-total-amount"
                },
                {
                    id: "cart-count",
                    selector: ".cart-count"
                },
                {
                    id: "cart-item-subtotal",
                    selector: `#cart-item__subtotal-${line}`
                }
            ];
        }

        updateAffectedCoponents(components, response) {
            components.forEach(component => {
                renderComponents(component.selector, response.components[component.id])
            })
        }

        activateLoading(line) {
            const cartItemLoaders = this.querySelectorAll(`#cart-item-${line} .loading__spinner`);
            cartItemLoaders.forEach(loader => loader.classList.remove('hidden'));
        }

        deactivateLoading(line) {
            const cartItemLoaders = this.querySelectorAll(`#cart-item-${line} .loading__spinner`);
            cartItemLoaders.forEach(loader => loader.classList.add('hidden'));
        }

        toggleState(empty) {
            if (!empty) {
                document.querySelector('.empty-cart').classList.add('d-none')
                document.querySelector('.main-cart-wrapper').classList.remove('d-none');
                return;
            }

            document.querySelector('.empty-cart').classList.remove('d-none');
            document.querySelector('.main-cart-wrapper').classList.add('d-none');
        }

        handleErrors(error) {
            if (!this.error) return;

            this.error.querySelector('.error-message').textContent = error || 'Something went wrong.';
            this.error.classList.remove('d-none');
        }
    });
}



class CartRemoveButton extends HTMLElement {
    constructor() {
        super();

        this.summary = document.querySelector("cart-summary");
        this.cartItems = this.closest('cart-items');
        this.querySelector('.cart-remove-btn').addEventListener("click", this.removeItem.bind(this));
    }


    removeItem(event) {
        event.preventDefault();
        if (this.cartItems) {
            this.cartItems.updateCartItem(
                parseInt(event.target.getAttribute('data-line')),
                0
            )
        }
    }
}

customElements.define('cart-remove-button', CartRemoveButton);


