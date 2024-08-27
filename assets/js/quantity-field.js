if (!customElements.get('quantity-field')) {
    customElements.define('quantity-field', class QuantityField extends HTMLElement {
        constructor() {
            super();

            this.field = this.querySelector('input');
            this.changeEvent = new Event('change', { bubbles: true });

            this.querySelector('.plus').addEventListener('click', this.onPlusClick.bind(this));
            this.querySelector('.minus').addEventListener('click', this.onMinusClick.bind(this));

        }

        onPlusClick() {
            var value = Number(this.field.value);
            var step = Number(this.field.getAttribute('data-step') || 0);

            if (this.field.hasAttribute('data-max') && this.field.getAttribute('data-max') != null) {
                var max = Number(this.field.getAttribute('data-max'));

                if ((value + step) > max) {
                    return this.field.value = max;
                }
            }

            this.field.value = value + step;
            this.field.dispatchEvent(this.changeEvent);
        }

        onMinusClick() {
            var value = Number(this.field.value);
            var step = Number(this.field.getAttribute('data-step') || 0);

            if (this.field.hasAttribute('data-min') && this.field.getAttribute('data-min') != null) {
                var min = Number(this.field.getAttribute('data-min'));

                if ((value - step) < min) {
                    return this.field.value = min;
                }
            }

            this.field.value = value - step;
            this.field.dispatchEvent(this.changeEvent);
        }
    })
}