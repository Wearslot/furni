if (!customElements.get('currency-switch')) {
    customElements.define('currency-switch', class CurrencySwitch extends HTMLElement {
        constructor() {
            super();
            this.currencySelector = this.querySelector('#currency-selector')

            this.currencySelector.addEventListener("change", this.changeCurrency.bind(this));
        }

        changeCurrency() {
            const selectedCurrency = this.currencySelector.value;
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('currency', selectedCurrency);

            window.location.href = currentUrl.toString();
        }
    })
}