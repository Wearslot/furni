if (!customElements.get('login-form')) {
  customElements.define('login-form', class loginForm extends HTMLElement {
    constructor() {
      super();
      
      this.loginForm = this.querySelector('#login-form')

      if (this.loginDetail) {
          this.email.value = this.loginDetail.email;
      }
      this.feedback = this.querySelector('#feedback')
      this.feedback.classList.add('hidden')
      
      this.forgotPassword = this.querySelector('.lost_password')

      this.saveDetail = this.querySelector('#rememberme')

      this.loadingSpinner = this.querySelector('.loading__spinner');


      this.submitButton = this.querySelector('#submit');
      this.submitButton.addEventListener("click", this.login.bind(this));
    }

    login(event) {
      event.preventDefault();
      
      const data = new FormData(this.loginForm)
      this.activateLoadingState();
      
      if (this.saveDetail.checked === true) {
          const loginDetail = {
            email: data.get('userEmail'),
          };
          localStorage.setItem("loginDetail", JSON.stringify(loginDetail));
      } 

      if (data.get('userEmail') && data.get('password')) {
        const config = fetchConfig();
        config.body = JSON.stringify({
          email: data.get('userEmail'),
          password: data.get('password')
        })

        fetch(`${routes.auth_login}`, config)
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
      else {
        this.deactivateLoadingState()
        this.feedback.innerText = "All information are required!"
      }
    }

    activateLoadingState() {
      this.submitButton.disabled = true
      this.loadingSpinner.classList.remove('hidden');
    }

    deactivateLoadingState() {
      this.submitButton.disabled = false
      this.forgotPassword.classList.add('hidden')
      this.feedback.classList.remove('hidden')
      this.loadingSpinner.classList.add('hidden');
      this.loginForm.reset()
    }

      
  })
}