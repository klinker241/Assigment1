// Assignment 5: animal filters, data objects, higher-order functions and a callback-based multi-step form.
document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    if (!main) return;
    // Assignment 5 styles are loaded from css/assignment5.css.


    const animalData = [
      { name:'Snow Leopard', habitat:'mountains', image:'images/snow-leopard.jpg', description:'A rare predator that lives in the mountains of Kazakhstan.' },
      { name:'Saiga Antelope', habitat:'steppe', image:'images/saiga.jpg', description:'A distinctive antelope adapted to open steppe landscapes.' },
      { name:'Gray Wolf', habitat:'forest', image:'images/wolf.jpg', description:'An important predator in natural ecosystems.' },
      { name:'Golden Eagle', habitat:'mountains', image:'images/eagle.jpg', description:'A powerful bird of prey found in Kazakhstan.' }
    ];
    const featuredHeading = Array.from(main.querySelectorAll('h2')).find(h => h.textContent.trim() === 'Featured Animals');
    const featuredSection = featuredHeading ? featuredHeading.closest('section') : null;
    const cards = featuredSection ? Array.from(featuredSection.querySelectorAll('article.card')) : [];
    if (featuredSection && cards.length) {
      const toolbar = document.createElement('div');
      toolbar.className = 'animal-tools';
      toolbar.setAttribute('aria-label','Filter animals by habitat');
      toolbar.innerHTML = '<button type="button" data-habitat="all" aria-pressed="true">All animals</button><button type="button" data-habitat="mountains" aria-pressed="false">Mountains</button><button type="button" data-habitat="steppe" aria-pressed="false">Steppe</button><button type="button" data-habitat="forest" aria-pressed="false">Forests</button>';
      featuredHeading.after(toolbar);
      const habitatByName = new Map(animalData.map(animal => [animal.name, animal.habitat]));
      function filterAnimals(category) {
        let selectedHabitat;
        switch (category) {
          case 'mountains': selectedHabitat = 'mountains'; break;
          case 'steppe': selectedHabitat = 'steppe'; break;
          case 'forest': selectedHabitat = 'forest'; break;
          default: selectedHabitat = 'all';
        }
        cards.forEach(function (card) {
          const title = card.querySelector('.card-title');
          const name = title ? title.textContent.trim() : '';
          const habitat = habitatByName.get(name) || 'other';
          const visible = selectedHabitat === 'all' || habitat === selectedHabitat;
          const wrapper = card.closest('[class*="col-"]') || card;
          wrapper.hidden = !visible;
          if (visible) { card.classList.remove('animal-card-filtered'); void card.offsetWidth; card.classList.add('animal-card-filtered'); }
        });
        toolbar.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.habitat === category)));
      }
      toolbar.querySelectorAll('button').forEach(button => button.addEventListener('click', () => filterAnimals(button.dataset.habitat)));
      // forEach and map above demonstrate iteration and a higher-order function over animal objects.
    }

    // Multi-step callback form. Inputs are preserved when moving between steps.
    const quiz = document.createElement('section');
    quiz.className = 'animal-quiz';
    quiz.innerHTML = `
      <h2>Wildlife Explorer Form</h2><p>Choose your interests in two quick steps.</p>
      <form id="wildlife-explorer-form">
        <div data-step="0"><label for="explorer-name">Your name</label><input class="form-control" id="explorer-name" name="name" required minlength="2" placeholder="Enter your name"><p class="mt-2">First, tell us who is exploring.</p></div>
        <div data-step="1" hidden><label for="explorer-habitat">Which habitat interests you most?</label><select class="form-select" id="explorer-habitat" name="habitat"><option value="mountains">Mountains</option><option value="steppe">Steppe</option><option value="forest">Forests</option><option value="desert">Deserts</option></select><p class="mt-2">Choose a habitat to explore.</p></div>
        <div class="animal-tools"><button type="button" id="explorer-back" hidden>Back</button><button type="button" id="explorer-next">Next</button><button type="submit" id="explorer-submit" hidden>Finish</button></div>
        <p id="animal-quiz-status" role="status" aria-live="polite"></p>
      </form>`;
    main.appendChild(quiz);
    const form = quiz.querySelector('#wildlife-explorer-form');
    const steps = Array.from(form.querySelectorAll('[data-step]'));
    const back = form.querySelector('#explorer-back');
    const next = form.querySelector('#explorer-next');
    const submit = form.querySelector('#explorer-submit');
    const status = form.querySelector('#animal-quiz-status');
    let currentStep = 0;
    // Callback controls which step is visible and preserves values in the form fields.
    function showStep(step, callback) {
      currentStep = step;
      steps.forEach((panel, index) => panel.hidden = index !== currentStep);
      back.hidden = currentStep === 0;
      next.hidden = currentStep === steps.length - 1;
      submit.hidden = currentStep !== steps.length - 1;
      if (typeof callback === 'function') callback(currentStep);
    }
    next.addEventListener('click', function () {
      const nameInput = form.querySelector('#explorer-name');
      if (!nameInput.checkValidity()) { nameInput.reportValidity(); return; }
      showStep(Math.min(currentStep + 1, steps.length - 1), function (step) { status.textContent = 'Step ' + (step + 1) + ' of ' + steps.length; });
    });
    back.addEventListener('click', function () {
      showStep(Math.max(currentStep - 1, 0), function (step) { status.textContent = 'Step ' + (step + 1) + ' of ' + steps.length; });
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = form.querySelector('#explorer-name').value.trim();
      const habitat = form.querySelector('#explorer-habitat').value;
      const habitatLabel = { mountains:'mountains', steppe:'the steppe', forest:'forests', desert:'deserts' }[habitat] || 'nature';
      status.textContent = 'Thanks, ' + name + '! Your wildlife exploration of ' + habitatLabel + ' is ready.';
      status.classList.remove('animal-card-filtered'); void status.offsetWidth; status.classList.add('animal-card-filtered');
    });
    showStep(0);
});