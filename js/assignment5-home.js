// Assignment 5: interactive home page features.
document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    const hero = document.querySelector('.hero');
    if (!main || !hero) return;
    // Assignment 5 styles are loaded from css/assignment5.css.


    const tools = document.createElement('div');
    tools.className = 'assignment-tools';
    tools.setAttribute('aria-label', 'Interactive wildlife tools');
    tools.innerHTML = `
      <button type="button" id="theme-toggle" aria-pressed="false">🌙 Night theme</button>
      <button type="button" id="read-more-toggle" aria-expanded="false">Read More</button>
      <button type="button" id="show-time">Show current time</button>
      <button type="button" id="wildlife-sound">Play nature chime 🔊</button>
      <span id="home-clock" role="status" aria-live="polite"></span>`;
    hero.appendChild(tools);

    const more = document.createElement('p');
    more.id = 'home-more-content';
    more.className = 'js-reveal';
    more.hidden = true;
    more.textContent = 'Protecting wildlife starts with respecting natural habitats, keeping parks clean and learning about endangered species. Every species plays a role in a healthy ecosystem.';
    hero.appendChild(more);

    const factsSection = document.createElement('section');
    factsSection.className = 'wildlife-extra';
    factsSection.innerHTML = '<h2>Wildlife Quick Facts</h2><p>Choose a fact to learn more about Kazakhstan’s wildlife.</p><div id="quick-fact" class="js-reveal" aria-live="polite">Select “Show a wildlife fact”.</div><button type="button" id="next-fact">Show a wildlife fact</button>';
    const featured = Array.from(main.querySelectorAll('h2')).find(h => h.textContent.trim() === 'Featured Animals');
    if (featured && featured.parentElement) featured.parentElement.after(factsSection); else main.appendChild(factsSection);

    document.getElementById('theme-toggle').addEventListener('click', function () {
      const isNight = document.body.classList.toggle('theme-night');
      this.setAttribute('aria-pressed', String(isNight));
      this.textContent = isNight ? '☀️ Day theme' : '🌙 Night theme';
    });

    document.getElementById('read-more-toggle').addEventListener('click', function () {
      const opening = more.hidden;
      more.hidden = !opening;
      more.classList.toggle('wildlife-pop', opening);
      this.setAttribute('aria-expanded', String(opening));
      this.textContent = opening ? 'Read Less' : 'Read More';
    });

    document.getElementById('show-time').addEventListener('click', function () {
      document.getElementById('home-clock').textContent = 'Current time: ' + new Date().toLocaleTimeString();
    });

    // A short synthesized chime avoids needing an additional audio file.
    document.getElementById('wildlife-sound').addEventListener('click', function () {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) { document.getElementById('home-clock').textContent = 'Audio is not supported in this browser.'; return; }
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = 660;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + 0.36);
      oscillator.onended = function () { context.close(); };
    });

    const facts = [
      { title: 'Snow leopard', text: 'Snow leopards are adapted to cold, rocky mountain habitats.' },
      { title: 'Saiga antelope', text: 'Saigas are well adapted to the open steppe landscapes.' },
      { title: 'Golden eagle', text: 'Golden eagles are powerful birds of prey.' },
      { title: 'Wild habitats', text: 'Mountains, deserts, wetlands and steppes support different communities of wildlife.' }
    ];
    let factIndex = 0;
    document.getElementById('next-fact').addEventListener('click', function () {
      const fact = facts[factIndex % facts.length];
      document.getElementById('quick-fact').textContent = fact.title + ': ' + fact.text;
      document.getElementById('quick-fact').classList.remove('wildlife-pop');
      void document.getElementById('quick-fact').offsetWidth;
      document.getElementById('quick-fact').classList.add('wildlife-pop');
      factIndex++;
    });

    // Keyboard navigation: focus the next/previous link with the arrow keys.
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
    navLinks.forEach(function (link, index) {
      link.addEventListener('keydown', function (event) {
        let nextIndex = index;
        switch (event.key) {
          case 'ArrowRight': case 'ArrowDown': nextIndex = (index + 1) % navLinks.length; break;
          case 'ArrowLeft': case 'ArrowUp': nextIndex = (index - 1 + navLinks.length) % navLinks.length; break;
          default: return;
        }
        event.preventDefault(); navLinks[nextIndex].focus();
      });
    });
});