if (!customElements.get('review-form')) {
    customElements.define('review-form', class ProductReview extends HTMLElement {
        constructor() {
            super();
            
            this.rate = 0;

            this.reviewDetails = JSON.parse(localStorage.getItem("reviewDetails"));

            this.comment = this.querySelector('#comment');
            
            this.author = this.querySelector('#author');

            this.email = this.querySelector('#email');

            this.feedback = this.querySelector('#feedback');

            if (this.reviewDetails) {
                this.author.value = this.reviewDetails.author;
                this.email.value = this.reviewDetails.email;
            }

            this.saveDetails = this.querySelector('#wp-comment-cookies-consent');

            this.submitButton = this.querySelector('#submit');
            this.submitButton.addEventListener("click", this.submitReview.bind(this));

            this.stars = Array.from(this.querySelectorAll('.star')).forEach((star, index) => {
                star.addEventListener('click', () => this.submitRate(index));
            });
        }

        submitRate(index) {
            return this.rate = index + 1;
        }

        submitReview(event) {
            event.preventDefault();
            this.submitButton.disabled = true

            if (this.saveDetails.checked === true) {
                const reviewDetails = {
                    email: this.email.value,
                    author: this.author.value
                };
                localStorage.setItem("reviewDetails", JSON.stringify(reviewDetails));
            } 

            if (this.rate !== 0 && this.comment.value !== "" && this.author.value !== "" && this.email.value !== "") {
                const config = fetchConfig();
                config.body = JSON.stringify({
                    product_id: this.submitButton.getAttribute("data-id"),
                    rate: this.rate,
                    fullname: this.author.value,
                    message: this.comment.value,
                    email: this.email.value
                })

                fetch(`${routes.product_review}`, config)
                .then(response => response.json())
                .then(data => {
                    this.feedback.innerText = data.message
                })
                .catch(err => {
                    this.feedback.innerText = err.message
                });

            }
        }

        
    })
}