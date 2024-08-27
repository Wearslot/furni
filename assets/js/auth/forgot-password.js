if (!customElements.get('forgot-password')) {
  customElements.define('forgot-password', class ForgotForm extends HTMLElement {
    constructor() {
      super();
      
      this.forgotForm = this.querySelector('#password-form')

      this.feedback = this.querySelector('#feedback')
      this.feedback.classList.add('hidden')
      
      this.loadingSpinner = this.querySelector('.loading__spinner');

      this.submitButton = this.querySelector('#forgotSubmit');
      this.submitButton.addEventListener("click", this.forgotPassword.bind(this));
    }

    forgotPassword(event) {
      event.preventDefault();
      this.activateLoadingState();

      const data = new FormData(this.forgotForm)

      if (data.get('user_login')) {
        const config = fetchConfig();
        config.body = JSON.stringify({
          email: data.get('user_login'),
        })

        fetch(`${routes.auth_forgot_password}`, config)
        .then(response => response.json())
        .then(data => {
          this.deactivateLoadingState()
          this.feedback.innerText = data.message
        })
        .catch(err => {
          this.deactivateLoadingState()
          this.feedback.innerText = err.message
        });

      }
    }

    activateLoadingState() {
      this.submitButton.disabled = true
      this.loadingSpinner.classList.remove('hidden');
    }

    deactivateLoadingState() {
      this.submitButton.disabled = false
      this.feedback.classList.remove('hidden')
      this.loadingSpinner.classList.add('hidden');
      this.forgotForm.reset()
    }

      
  })
}