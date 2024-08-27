if (!customElements.get('cart-notification')) {
    customElements.define('cart-notification', class CartNotification extends HTMLElement {
        constructor() {
            super();

            this.notification = this.querySelector(".cart-notification");
        }

        getAffectedComponents() {
            return [
            ];
        }

        updateAffectedCoponents(components, response) {
            components.forEach(component => {
                this.renderComponents(component.selector, response.components[component.id])
            })
        }

        show() {
            this.notification.classList.add("active");
        }

        hide() {
            this.notification.classList.remove("active");
        }
    })
}