class NewsletterForm {
    constructor(formElement) {
        this.formElement = formElement;
        this.close = this.formElement.querySelector('.news-modal-close');
        this.feedback = this.formElement.querySelector('#email_feedback');
        this.feedback.classList.add("hidden")
        this.email = this.formElement.querySelector('#email');

        if (this.close) {
            this.close.addEventListener("click", this.disablePopup.bind(this));
        }

        this.formElement.querySelectorAll('#signupButton').forEach(button => {
            button.addEventListener("click", this.onSubmit.bind(this));
        });

        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    disablePopup() {
        localStorage.setItem('disabledPopup', 'yes');
        const disableUntil = Date.now() + 1800000;
        localStorage.setItem('disabledPopupUntil', disableUntil.toString());
    }

    handleBeforeUnload(event) {
        // This will run when the user is leaving the site
        const disabledPopupUntil = localStorage.getItem('disabledPopupUntil');
        if (disabledPopupUntil && Date.now() < parseInt(disabledPopupUntil, 10)) {
            // The popup is still disabled, so do nothing
            return;
        } else {
            // Clear the disable state if the time has elapsed
            localStorage.removeItem('disabledPopupUntil');
            localStorage.removeItem('disabledPopup');
        }
    }

    onSubmit(event) {
        event.preventDefault();
        this.activateLoadingState();

        if (this.email && this.email.value !== "") {
            const config = fetchConfig();
            config.body = JSON.stringify({ email: this.email.value });

            fetch(`${routes.newsletter_signup}`, config)
            .then(response => response.json())
            .then(data => {
                this.deactivateLoadingState();
                this.feedback.innerText = "Thank you for subscribing! We're thrilled to have you as part of our community. Stay tuned!";
            })
            .catch(err => {
                this.deactivateLoadingState();
                this.feedback.innerText = err.message;
            });
        } 
        else {
            this.deactivateLoadingState();
            this.feedback.innerText = "Please enter your email";
        }
    }

    activateLoadingState() {
        const loadingSpinner = this.formElement.querySelector('.loading__spinner');
        const signUpButton = this.formElement.querySelector('#signupButton');
        loadingSpinner.classList.remove('hidden');
        signUpButton.disabled = true;
    }

    deactivateLoadingState() {
        const loadingSpinner = this.formElement.querySelector('.loading__spinner');
        const signUpButton = this.formElement.querySelector('#signupButton');
        this.feedback.classList.remove("hidden")
        loadingSpinner.classList.add('hidden');
        this.email.value = "";
        signUpButton.disabled = false;
    }
}

if (!customElements.get('newletter-modal')) {
    customElements.define('newletter-modal', class NewsletterModal extends HTMLElement {
        constructor() {
            super();
        }
        connectedCallback() {
            new NewsletterForm(this);
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const footerForm = document.querySelector('[form-id="newsletter_form"]')
    new NewsletterForm(footerForm);
});