// Assignment 5: Parks page
// DOM selection, attributes, events, arrays, loops, animation, and rating.
document.addEventListener("DOMContentLoaded", function () {
    const moreButton = document.getElementById("park-read-more");
    const extra = document.getElementById("park-extra");
    moreButton.addEventListener("click", function () {
        extra.hidden = !extra.hidden;
        moreButton.textContent = extra.hidden ? "Read More" : "Read Less";
        moreButton.setAttribute("aria-expanded", String(!extra.hidden));
    });

    const preview = document.getElementById("park-preview");
    const selectedText = document.getElementById("park-selected");
    const thumbnails = document.querySelectorAll("#park-thumbnails button");
    thumbnails.forEach(function (button) {
        button.addEventListener("click", function () {
            preview.src = button.dataset.image;
            preview.alt = button.dataset.title;
            selectedText.textContent = "Selected: " + button.dataset.title;
            thumbnails.forEach(function (item) {
                item.setAttribute("aria-pressed", String(item === button));
            });
            preview.classList.remove("park-animate");
            void preview.offsetWidth;
            preview.classList.add("park-animate");
        });
    });

    const stars = document.querySelectorAll("#park-rating button");
    const ratingMessage = document.getElementById("rating-message");
    const ratingData = { value: 0, setRating: function (value) { this.value = value; } };
    stars.forEach(function (star) {
        star.addEventListener("click", function () {
            ratingData.setRating(Number(star.dataset.rating));
            stars.forEach(function (item) {
                const selected = Number(item.dataset.rating) <= ratingData.value;
                item.textContent = selected ? "★" : "☆";
                item.classList.toggle("selected", selected);
            });
            ratingMessage.textContent = "Your rating: " + ratingData.value + " out of 5 stars.";
        });
    });
});