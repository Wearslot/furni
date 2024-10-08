class NewsletterForm {
  constructor(formElement) {
      this.formElement = formElement;
      this.close = this.formElement.querySelector('.news-modal-close');
      this.feedback = this.formElement.querySelector('#email_feedback');
      this.email = this.formElement.querySelector('#email');

      if (localStorage.getItem('disabledPopup') === 'yes') {
        this.formElement.classList.add('hidden'); // Hide modal immediately
        return;
      }

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
      const disableUntil = Date.now() + 1800000; // Popup disabled for 30 minutes
      localStorage.setItem('disabledPopupUntil', disableUntil.toString());
      this.formElement.classList.add('hidden'); // Hide the modal
  }

  handleBeforeUnload(event) {
      const disabledPopupUntil = localStorage.getItem('disabledPopupUntil');
      if (disabledPopupUntil && Date.now() < parseInt(disabledPopupUntil, 10)) {
        this.formElement.classList.add('hidden');
        return;
      } else {
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
    } else {
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
    this.feedback.classList.remove("hidden");
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
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Check localStorage before creating the modal
  if (localStorage.getItem('disabledPopup') === 'yes') {
    return; 
  }

  const footerForm = document.querySelector('[form-id="newsletter_form"]');
  
  if (footerForm) {
    new NewsletterForm(footerForm);
  } else {
    console.error("Newsletter form not found in DOM");
  }
});