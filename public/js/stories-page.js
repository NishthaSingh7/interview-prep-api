const StoriesPage = (() => {
  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "wisdom", label: "Wisdom" },
    { id: "fables", label: "Fables" },
    { id: "tales", label: "Tales" },
    { id: "folk", label: "Folk" },
  ];

  const STORIES = [
    {
      id: "birbal-khichdi",
      category: "wisdom",
      icon: "👑",
      title: "Birbal's Khichdi",
      teaser: "A hungry emperor learns that some lessons only arrive when you wait.",
      origin: "Akbar & Birbal",
      readMin: 2,
      moral: "Patience and presence matter more than empty promises.",
      body: [
        "One winter evening, Emperor Akbar and Birbal walked by a frozen lake. Akbar dipped his finger in the water and pulled it back, shivering. 'No one could sit in that lake all night for gold,' he declared.",
        "A poor man accepted the challenge. At dawn he stood before the emperor, dry and calm. Akbar was stunned — until Birbal asked how he had survived. The man pointed to a distant lamp. 'I kept my eyes on that light through the night.'",
        "Birbal smiled. 'The lamp was beside a kitchen. He smelled khichdi cooking hour after hour. He did not sit in cold alone — he sat with hope.' Akbar laughed at himself and rewarded the man's clever honesty.",
      ],
    },
    {
      id: "birbal-crows",
      category: "wisdom",
      icon: "🐦",
      title: "How Many Crows?",
      teaser: "Birbal answers an impossible question with calm wit.",
      origin: "Akbar & Birbal",
      readMin: 2,
      moral: "Confidence and humor can dissolve a trap question.",
      body: [
        "Akbar loved to test Birbal in front of the court. One day he asked, 'How many crows live in our kingdom?'",
        "Courtiers gasped. Birbal closed his eyes as if counting, then said, 'Exactly twenty-one thousand five hundred and twenty-three, Your Majesty.'",
        "'And if there are more?' Akbar asked. 'Then relatives from other kingdoms are visiting,' Birbal replied. 'And if there are fewer?' 'Then some have flown abroad.' The court burst into laughter. Akbar shook his head, smiling. He had wanted to corner Birbal. Instead he got a reminder that not every question needs a frightened answer.",
      ],
    },
    {
      id: "thirsty-crow",
      category: "folk",
      icon: "🪣",
      title: "The Thirsty Crow",
      teaser: "A simple folk tale about solving problems one small step at a time.",
      origin: "Indian folk tale",
      readMin: 2,
      moral: "Small steady efforts can move what looks impossible.",
      body: [
        "On a hot afternoon, a crow found a pitcher with a little water at the bottom. His beak could not reach it. He could have flown away thirsty.",
        "Instead he picked up pebbles one by one and dropped them into the pitcher. The water rose slowly — pebble by pebble — until he could drink.",
        "No magic. No hurry. Just patience and trying the next small thing. The story is old, but the feeling is familiar whenever a problem looks too big at first glance.",
      ],
    },
    {
      id: "tortoise-hare",
      category: "fables",
      icon: "🐢",
      title: "The Tortoise and the Hare",
      teaser: "The race everyone knows — still worth reading on a quiet night.",
      origin: "Aesop's Fables",
      readMin: 2,
      moral: "Slow and steady can outlast careless speed.",
      body: [
        "A hare mocked a tortoise for moving slowly. The tortoise replied, 'Shall we race?' The hare laughed and agreed.",
        "The hare shot ahead and, sure of victory, lay down under a tree and slept. The tortoise kept walking — the same small steps, without stopping.",
        "When the hare woke, the tortoise was near the finish line. The crowd cheered the unglamorous winner. The hare learned that talent without attention can lose to quiet consistency.",
      ],
    },
    {
      id: "lion-mouse",
      category: "fables",
      icon: "🦁",
      title: "The Lion and the Mouse",
      teaser: "A tiny friend returns a very large favor.",
      origin: "Aesop's Fables",
      readMin: 2,
      moral: "Kindness, even to the small, can come back to you.",
      body: [
        "A lion woke from his nap to find a mouse running across his paw. He caught it easily. The mouse trembled. 'Please let me go. One day I may help you.'",
        "The lion laughed at the idea, but released the mouse anyway. Days later, hunters trapped the lion in a net. He roared until he was tired.",
        "The mouse heard him, came running, and gnawed through the ropes. 'You laughed that I could help you,' said the mouse. 'Yet here we are.' The lion sat in silence, grateful and humbled.",
      ],
    },
    {
      id: "monkey-crocodile",
      category: "tales",
      icon: "🐒",
      title: "The Monkey and the Crocodile",
      teaser: "A Panchatantra tale about trust, betrayal, and thinking on your feet.",
      origin: "Panchatantra",
      readMin: 3,
      moral: "Not everyone who smiles has your good at heart.",
      body: [
        "A monkey lived in a fruit tree by a river. A crocodile befriended him and shared sweet jamuns every day. The crocodile's wife grew jealous and demanded the monkey's heart.",
        "The crocodile, ashamed but obedient, invited the monkey to ride on his back to a feast across the river. Midstream, he confessed the truth.",
        "The clever monkey laughed. 'Why didn't you say so? I left my heart on the tree — we must go back for it.' The crocodile turned around. At the shore, the monkey leapt to safety. 'Hearts stay in bodies,' he called. 'Remember that before you invite someone onto your back.'",
      ],
    },
    {
      id: "crane-crab",
      category: "tales",
      icon: "🦀",
      title: "The Crane and the Crab",
      teaser: "A Panchatantra story where greed meets its match.",
      origin: "Panchatantra",
      readMin: 3,
      moral: "Deceit may work once — rarely twice on the same pond.",
      body: [
        "A crane stood stiffly at the edge of a pond where fish lived in fear. 'I am old,' he said. 'I have heard humans will drain this water. I can carry you to a safer lake.'",
        "The fish believed him. One by one they let him hold them in his beak. One by one they vanished down his throat. A crab asked for a ride too.",
        "Mid-flight, the crab saw there was no new lake. He clamped his claws around the crane's neck. The crane pleaded. The crab did not loosen his grip. Some stories end harshly to make the lesson stick: watch who profits from your panic.",
      ],
    },
    {
      id: "bundle-sticks",
      category: "folk",
      icon: "🪵",
      title: "The Bundle of Sticks",
      teaser: "A father teaches his sons with one quiet demonstration.",
      origin: "Folk tale",
      readMin: 2,
      moral: "Together we are harder to break.",
      body: [
        "An old farmer had sons who quarreled over small things. He gathered them and placed a bundle of sticks on the ground.",
        "'Break it,' he said. Each son tried — pushing, pulling, stamping — and failed.",
        "Then the father untied the bundle and handed each son a single stick. They snapped them easily. 'Alone, you break,' he said. 'Together, you hold.' The room went quiet. They had heard lectures before. This time they felt the truth in their hands.",
      ],
    },
    {
      id: "golden-goose",
      category: "fables",
      icon: "🪿",
      title: "The Goose That Laid Golden Eggs",
      teaser: "When greed moves faster than gratitude.",
      origin: "Aesop's Fables",
      readMin: 2,
      moral: "Wanting too much too soon can destroy what you already have.",
      body: [
        "A farmer found a goose that laid one golden egg each day. He grew wealthy, then restless. Why wait for one egg when the source was right there?",
        "He cut the goose open, searching for gold inside. He found nothing. No more goose. No more eggs.",
        "The story is blunt on purpose. It asks a gentle question for tired evenings: what steady good in your life are you tempted to force open before its time?",
      ],
    },
    {
      id: "cry-wolf",
      category: "fables",
      icon: "🐑",
      title: "The Boy Who Cried Wolf",
      teaser: "A shepherd learns the cost of false alarms.",
      origin: "Aesop's Fables",
      readMin: 2,
      moral: "If you lie for attention, help may not come when you truly need it.",
      body: [
        "A bored shepherd boy shouted, 'Wolf! Wolf!' Villagers ran uphill with tools and courage. There was no wolf. They were angry. He found it funny.",
        "He did it again another day. Again they came. Again he laughed. Then a real wolf entered the flock.",
        "He screamed until his throat hurt. No one came. The village had learned his voice, not his danger. The tale is old and severe — a reminder to protect trust like something fragile.",
      ],
    },
    {
      id: "tenali-blind",
      category: "wisdom",
      icon: "😄",
      title: "Tenali Raman and the Bragging Poet",
      teaser: "A court poet learns humility through a clever mirror.",
      origin: "Tenali Raman tales",
      readMin: 2,
      moral: "Those who boast the loudest often fear being seen clearly.",
      body: [
        "A visiting poet praised his own verses for hours at King Krishnadevaraya's court. Tenali Raman listened politely, then asked if the poet would accept a small challenge.",
        "'Recite your best poem with your eyes closed,' Tenali said. The poet agreed and began grandly — until Tenali quietly placed a peeled onion in his hands. The poet teared up, voice shaking.",
        "The court smiled. Not cruelly — but with recognition. Tenali bowed. 'Even the finest verse sounds different when we stop performing and simply feel.' The poet laughed at himself, and the evening softened.",
      ],
    },
    {
      id: "star-jar",
      category: "folk",
      icon: "✨",
      title: "The Jar of Stars",
      teaser: "A grandfather answers a child's question about hard days.",
      origin: "Modern folk parable",
      readMin: 2,
      moral: "Hard nights still belong to a larger life.",
      body: [
        "A child told her grandfather she had saved her sadness in a jar — one pebble for each bad day. 'Soon it will be full,' she said.",
        "He handed her a second jar. 'Put one star in here for every ordinary good thing. Warm food. A joke with a friend. Music in the bus. Rain after heat.'",
        "Weeks later she showed him both jars. The star jar was fuller than she expected. 'Bad days are real,' he said. 'But they are not the only thing you collect.' She closed the lids and slept easier.",
      ],
    },
  ];

  let activeFilter = "all";
  let modalEl = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function categoryLabel(id) {
    return CATEGORIES.find((c) => c.id === id)?.label || id;
  }

  function featuredStory() {
    const idx = hashString(todayKey()) % STORIES.length;
    return STORIES[idx];
  }

  function filteredStories() {
    if (activeFilter === "all") return STORIES;
    return STORIES.filter((s) => s.category === activeFilter);
  }

  function renderBody(story) {
    const paragraphs = story.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
    const moral = story.moral
      ? `<p class="stories-modal-moral"><strong>Moral:</strong> ${escapeHtml(story.moral)}</p>`
      : "";
    const origin = story.origin
      ? `<p class="stories-modal-attribution">${escapeHtml(story.origin)}</p>`
      : "";
    return `${paragraphs}${moral}${origin}`;
  }

  function renderFeatured(story) {
    return `
      <article class="stories-featured panel" data-story-id="${story.id}">
        <div class="stories-featured-top">
          <span class="stories-featured-badge">Tonight's tale</span>
          <span class="stories-card-meta">${escapeHtml(categoryLabel(story.category))} · ${story.readMin} min</span>
        </div>
        <div class="stories-featured-body">
          <span class="stories-card-icon" aria-hidden="true">${story.icon}</span>
          <div>
            <h3 class="stories-featured-title">${escapeHtml(story.title)}</h3>
            <p class="stories-featured-teaser">${escapeHtml(story.teaser)}</p>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-sm stories-read-btn" data-story-id="${story.id}">Read</button>
      </article>`;
  }

  function renderCard(story) {
    return `
      <article class="stories-card panel" data-story-id="${story.id}">
        <div class="stories-card-head">
          <span class="stories-card-icon" aria-hidden="true">${story.icon}</span>
          <span class="stories-card-tag">${escapeHtml(categoryLabel(story.category))}</span>
        </div>
        <h4 class="stories-card-title">${escapeHtml(story.title)}</h4>
        <p class="stories-card-teaser">${escapeHtml(story.teaser)}</p>
        <p class="stories-card-origin">${escapeHtml(story.origin || "")}</p>
        <div class="stories-card-foot">
          <span class="stories-card-meta">${story.readMin} min read</span>
          <button type="button" class="btn btn-ghost btn-sm stories-read-btn" data-story-id="${story.id}">Read</button>
        </div>
      </article>`;
  }

  function renderFilters() {
    return CATEGORIES.map(
      (cat) => `
        <button
          type="button"
          class="stories-filter${activeFilter === cat.id ? " active" : ""}"
          data-filter="${cat.id}"
        >${escapeHtml(cat.label)}</button>`,
    ).join("");
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "storyModal";
    modalEl.className = "motivation-modal stories-modal";
    modalEl.hidden = true;
    modalEl.innerHTML = `
      <div class="motivation-backdrop" data-story-close tabindex="-1" aria-hidden="true"></div>
      <div class="motivation-dialog stories-dialog" role="dialog" aria-modal="true" aria-labelledby="storyModalTitle">
        <button type="button" class="motivation-close" data-story-close aria-label="Close">&times;</button>
        <p class="motivation-kicker" id="storyModalKicker"></p>
        <h3 class="motivation-headline" id="storyModalTitle"></h3>
        <div class="stories-modal-body motivation-message" id="storyModalBody"></div>
        <div class="motivation-actions stories-modal-actions">
          <button type="button" class="btn btn-primary btn-sm" data-story-close>Close</button>
        </div>
      </div>`;

    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-story-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) closeModal();
    });

    return modalEl;
  }

  function openModal(storyId) {
    const story = STORIES.find((s) => s.id === storyId);
    if (!story) return;

    const modal = ensureModal();
    modal.dataset.storyId = storyId;
    modal.querySelector("#storyModalKicker").textContent = `${story.icon} ${categoryLabel(story.category)} · ${story.readMin} min`;
    modal.querySelector("#storyModalTitle").textContent = story.title;
    modal.querySelector("#storyModalBody").innerHTML = renderBody(story);

    modal.hidden = false;
    document.body.classList.add("motivation-open");
    modal.querySelector(".motivation-close").focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove("motivation-open");
  }

  function bindEvents(root) {
    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;
        render(root);
      });
    });

    root.querySelectorAll(".stories-read-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(btn.dataset.storyId);
      });
    });

    root.querySelectorAll(".stories-featured, .stories-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".stories-read-btn")) return;
        openModal(card.dataset.storyId);
      });
    });
  }

  function render(root) {
    const featured = featuredStory();
    const list = filteredStories().filter((s) => activeFilter !== "all" || s.id !== featured.id);

    root.innerHTML = `
      <header class="stories-hero panel">
        <div class="stories-hero-row">
          <div>
            <p class="stories-hero-kicker">Night Shift Stories</p>
            <h2 class="stories-hero-title">A calm corner · short reads</h2>
          </div>
          <div class="stories-hero-meta" aria-label="Story collection info">
            <span class="stories-hero-pill">${STORIES.length} tales</span>
            <span class="stories-hero-pill">~2 min each</span>
          </div>
        </div>
        <p class="stories-hero-lead">
          Short moral stories from folklore and fables — Birbal, Panchatantra, Aesop, and more. No interview talk. Just something gentle before bed.
        </p>
      </header>

      ${activeFilter === "all" ? renderFeatured(featured) : ""}

      <div class="stories-toolbar">
        <div class="stories-filters" role="tablist" aria-label="Story categories">${renderFilters()}</div>
      </div>

      <div class="stories-grid">
        ${list.map(renderCard).join("")}
      </div>

      <section class="stories-cta panel">
        <h3>Need a break from the grind?</h3>
        <p>Read one more, or head back when you're ready.</p>
        <a href="/" class="btn btn-ghost">Back to problems</a>
      </section>`;

    bindEvents(root);
  }

  function init() {
    const root = document.getElementById("storiesRoot");
    if (!root) return;
    render(root);
  }

  return { init };
})();
