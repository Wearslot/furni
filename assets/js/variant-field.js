if (!customElements.get('variant-field')) {
    customElements.define("variant-field", class VariantField extends HTMLElement {
        constructor() {
            super();

            this.field = this.querySelector('[variant]');
            this.field.addEventListener("change", this.onChange.bind(this));
        }

        onChange() {

            this.options = Array.from(document.querySelectorAll("[variant]"), (element) => {
                if (element.tagName === 'SELECT') {
                    return element.value;
                }
                if (element.tagName === 'FIELDSET') {
                    return Array.from(element.querySelectorAll('input')).find((radio) => radio.checked)?.value;
                }
            });

            this.updateTargetedVariant();
            this.updateVariantDetails();
            this.updateAvailablity();
            this.updateURL();
        }

        updateTargetedVariant() {
            this.targetedVariant = this.getVariations().find(variant => variant.name == this.options.join('/'));
            return this.targetedVariant;
        }

        getVariations() {
            this.variations = this.variations || JSON.parse(document.querySelector('[type="application/json"]').textContent.replaceAll("&quot;", "\""));
            return this.variations;
        }

        updateVariantDetails() {
            if (!this.targetedVariant) return;

            var sku = document.querySelector('[product-data="sku"]');
            var price = document.querySelector('[product-data="price"]');
            var quantity = document.querySelector('[product-data="quantity"]');
            var variant_id = document.querySelector('[product-data="variant_id"]');
            var image = document.querySelector('[product-data="image"]');

            if (variant_id) {
                variant_id.value = this.targetedVariant.id;
            }

            if (quantity) {
                quantity.setAttribute('max', this.targetedVariant.quantity);
                quantity.value = 1;
            }

            if (sku && this.targetedVariant.sku) {
                sku.innerHTML = this.targetedVariant.sku;
            }

            if (price) {

                price.innerHTML = new Intl.NumberFormat('ng-NG', {
                    style: 'currency',
                    currency: window.currency_code
                }).format(this.targetedVariant.price);
            }

            if (image && this.targetedVariant.images.length > 0) {
                image.setAttribute('src', this.targetedVariant.images[0]);
                image.setAttribute('data-src', this.targetedVariant.images[0]);
                image.setAttribute('srcset', `${this.targetedVariant.images[0]} 800w, ${this.targetedVariant.images[0]} 600w, ${this.targetedVariant.images[0]} 768w`);
            }
        }

        updateURL() {
            if (!this.targetedVariant) return;
            window.history.replaceState({}, '', `${window.location.href.split("?")[0]}?variant=${this.targetedVariant.id}`);
        }


        updateAvailablity() {
            const product_form = document.querySelector('product-form');

            if (!this.targetedVariant || !product_form) return;

            var submitButton = product_form.querySelector('[type="submit"]');

            if (this.targetedVariant.in_stock === false) {
                submitButton.setAttribute("disabled", "disabled");
                submitButton.classList.add("disabled");
                submitButton.querySelector(".button_text").textContent = "Out of Stock";
            }
            else {
                submitButton.removeAttribute("disabled");
                submitButton.classList.remove("disabled");
                submitButton.querySelector(".button_text").textContent = "Add to Cart";
            }
        }
    })
}