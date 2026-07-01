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
      teaser: "The race everyone knows — still worth hearing on a quiet night.",
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

  const HINDI = {
    "birbal-khichdi": {
      title: "बिरबल की खिचड़ी",
      body: [
        "एक सर्दियों की शाम को सम्राट अकबर और बिरबल जमे हुए तालाब के पास से गुज़रे। अकबर ने अपनी उंगली पानी में डाली और ठंड से काँप उठे। उन्होंने कहा, 'इस तालाब में पूरी रात बैठकर कोई सोना नहीं कमा सकता।'",
        "एक गरीब आदमी ने चुनौती स्वीकार कर ली। सुबह वह शांत और सूखा सम्राट के सामने खड़ा था। अकबर हैरान रह गए — जब तक बिरबल ने न पूछा कि वह कैसे बचा। आदमी ने दूर की एक लौ की ओर इशारा किया। 'मैंने पूरी रात उस रोशनी पर नज़र रखी।'",
        "बिरबल मुस्कुराए। 'वह दीया रसोई के पास था। उसे घंटों खिचड़ी की महक आती रही। वह अकेले ठंड में नहीं बैठा — उम्मीद के साथ बैठा था।' अकबर अपने आप पर हँसे और उसकी सच्चाई को इनाम दिया।",
      ],
      moral: "धैर्य और उपस्थिति खोखले वादों से ज़्यादा मायने रखते हैं।",
    },
    "birbal-crows": {
      title: "कितने कौवे?",
      body: [
        "अकबर को दरबार में बिरबल की परीक्षा लेना अच्छा लगता था। एक दिन उन्होंने पूछा, 'हमारे राज्य में कितने कौवे हैं?'",
        "सभी चौंक गए। बिरबल ने आँखें बंद करके गिनती का नाटक किया, फिर बोले, 'बिल्कुल इक्कीस हज़ार पाँच सौ तेईस, जहाँपनाह।'",
        "'और अगर ज़्यादा हों?' अकबर ने पूछा। 'तो दूसरे राज्यों से रिश्तेदार आए हैं,' बिरबल ने जवाब दिया। 'और अगर कम हों?' 'तो कुछ विदेश चले गए हैं।' दरबार हँसी से गूँज उठा। अकबर मुस्कुराए। उन्हें बिरबल को घेरना था — मिली तो याद दिलाने वाली बात कि हर सवाल का डरा हुआ जवाब ज़रूरी नहीं।",
      ],
      moral: "आत्मविश्वास और हल्की हँसी फँसाने वाले सवालों को भी पिघला सकते हैं।",
    },
    "thirsty-crow": {
      title: "प्यासा कौवा",
      body: [
        "गर्म दोपहर में एक कौवे को एक घड़ा मिला, जिसके तले थोड़ा पानी था। उसकी चोंच वहाँ तक नहीं पहुँचती। वह प्यासा उड़ भी सकता था।",
        "पर उसने एक-एक करके कंकड़ उठाए और घड़े में डाले। पानी धीरे-धीरे ऊपर आया — कंकड़ दर कंकड़ — जब तक वह पी न सका।",
        "कोई जादू नहीं। कोई जल्दबाज़ी नहीं। बस धैर्य और अगला छोटा कदम। कहानी पुरानी है, पर जब कोई मुश्किल पहले बड़ी लगे तब यही एहसास आता है।",
      ],
      moral: "छोटे-छोटे लगातार प्रयास असंभव लगने वाली चीज़ को भी हिला सकते हैं।",
    },
    "tortoise-hare": {
      title: "कछुआ और खरगोश",
      body: [
        "एक खरगोश ने धीमे कछुए का मज़ाक उड़ाया। कछुए ने कहा, 'दौड़ लगाएँ?' खरगोश हँसकर मान गया।",
        "खरगोश तेज़ी से आगे निकल गया और जीत निश्चित समझकर पेड़ के नीचे सो गया। कछुआ चलता रहा — वही छोटे कदम, बिना रुके।",
        "जब खरगोश जागा, कछुआ फ़िनिश के पास था। भीड़ ने शांत विजेता की ताली बजाई। खरगोश ने सीखा कि प्रतिभा बिना ध्यान के लगातारी से हार सकती है।",
      ],
      moral: "धीमा और लगातार चलना लापरवाह तेज़ी से ज़्यादा देर टिक सकता है।",
    },
    "lion-mouse": {
      title: "शेर और चूहा",
      body: [
        "एक शेर अपनी झपकी से जागा तो देखा एक चूहा उसके पंजे पर दौड़ रहा है। उसने आसानी से पकड़ लिया। चूहा काँपा। 'मुझे छोड़ दो। शायद एक दिन मैं तुम्हारी मदद कर सकूँ।'",
        "शेर ने इस बात पर हँसी, पर चूहा छोड़ दिया। कुछ दिन बाद शिकारियों ने शेर को जाल में फँसा लिया। वह थककर दहाड़ता रहा।",
        "चूहा ने आवाज़ सुनी, दौड़कर आया और रस्सियाँ कुतर डालीं। 'तुम हँसे थे कि मैं मदद कर सकता हूँ,' चूहे ने कहा। 'और देखो आज।' शेर चुपचाप बैठा, आभारी और शांत।",
      ],
      moral: "दया, चाहे छोटे पर भी हो, कभी-कभी वापस लौटकर आती है।",
    },
    "monkey-crocodile": {
      title: "बंदर और मगरमच्छ",
      body: [
        "नदी किनारे एक बंदर फलों के पेड़ पर रहता था। एक मगरमच्छ उससे दोस्ती कर गया और रोज़ मीठे जामुन खाता। मगरमच्छ की पत्नी को जलन हुई और उसने बंदर का दिल माँगा।",
        "शर्मिंदा मगरमच्छ बंदर को नदी पार भोज के लिए अपनी पीठ पर बैठाकर ले गया। बीच नदी में उसने सच्चाई बता दी।",
        "चतुर बंदर हँसा। 'पहले क्यों नहीं कहा? मेरा दिल तो पेड़ पर रखा है — वापस जाना होगा।' मगरमच्छ मुड़ा। किनारे पर बंदर कूद गया। 'दिल शरीर में रहते हैं,' उसने कहा। 'किसी को पीठ पर बिठाने से पहले याद रखना।'",
      ],
      moral: "हर मुस्कुराता चेहरा आपकी भलाई चाहता हो, ऐसा ज़रूरी नहीं।",
    },
    "crane-crab": {
      title: "बगुला और केकड़ा",
      body: [
        "एक तालाब के किनारे बगुला खड़ा था जहाँ मछलियाँ डरी हुई थीं। उसने कहा, 'मैं बूढ़ा हूँ। सुना है लोग इस पानी को सुखाएँगे। मैं तुम्हें सुरक्षित झील ले जा सकता हूँ।'",
        "मछलियों ने विश्वास किया। एक-एक करके वे उसकी चोंच में चली गईं — और गायब हो गईं। एक केकड़े ने भी सवारी माँगी।",
        "हवा में केकड़े ने देखा कोई नई झील नहीं है। उसने बगुले की गर्दन पर अपनी पिंचर कस लीं। बगुला विनती करता रहा। कुछ कहानियाँ सख्त अंत से सीख देती हैं — घबराहट से कौन फायदा उठा रहा है, यह देखो।",
      ],
      moral: "धोखा एक बार चल सकता है — एक ही तालाब पर दोबारा शायद नहीं।",
    },
    "bundle-sticks": {
      title: "लकड़ियों का गट्ठर",
      body: [
        "एक बूढ़े किसान के बेटे छोटी-छोटी बातों पर झगड़ते थे। उसने उन्हें बुलाकर ज़मीन पर लकड़ियों का गट्ठर रखा।",
        "'तोड़ो,' उसने कहा। हर बेटे ने कोशिश की — धकेला, खींचा, कुचला — पर नहीं टूटा।",
        "फिर किसान ने गट्ठर खोला और हर बेटे को एक-एक लकड़ी दी। वे आसानी से तोड़ देते। 'अकेले तुम टूटते हो,' उसने कहा। 'साथ में टिकते हो।' कमरा शांत हो गया। इस बार सच्चाई हाथों में महसूस हुई।",
      ],
      moral: "साथ मिलकर टूटने से ज़्यादा मज़बूत रहते हैं।",
    },
    "golden-goose": {
      title: "सुनहरा अंडा देने वाली हंस",
      body: [
        "एक किसान को हंस मिली जो रोज़ एक सुनहरा अंडा देती। वह अमीर हो गया, फिर बेचैन। एक अंडे का इंतज़ार क्यों, जब सोना अंदर ही है?",
        "उसने हंस को काटकर अंदर देखा। कुछ नहीं मिला। न हंस, न अंडे।",
        "कहानी जानबूझकर सीधी है। थके हुए दिनों में एक कोमल सवाल पूछती है — ज़िंदगी की कौन-सी लगातार अच्छाई को हम जल्दबाज़ी में खोलने की कोशिश कर रहे हैं?",
      ],
      moral: "बहुत जल्दी बहुत ज़्यादा चाहने से जो है वह भी नष्ट हो सकता है।",
    },
    "cry-wolf": {
      title: "भेड़िए की आवाज़ निकालने वाला लड़का",
      body: [
        "एक ग्वाले के लड़के ने बोरियत में चिल्लाया, 'भेड़िया! भेड़िया!' गाँव वाले हाथ में औजार लेकर दौड़े। कोई भेड़िया नहीं था। वे गुस्से हुए। उसे मज़ा आया।",
        "उसने दोबारा यही किया। फिर वे आए। फिर वह हँसा। फिर सच में भेड़िया झुंड में घुस गया।",
        "वह जी-जान से चिल्लाता रहा। कोई नहीं आया। गाँव ने उसकी आवाज़ पहचान ली थी, खतरे को नहीं। कहानी पुरानी और कठोर है — भरोसे को नाज़ुक चीज़ की तरह संभालो।",
      ],
      moral: "ध्यान पाने के लिए झूठ बोलोगे तो सच में मुश्किल में मदद शायद न मिले।",
    },
    "tenali-blind": {
      title: "तेनाली रामन और घमंडी कवि",
      body: [
        "राजा कृष्णदेवराय के दरबार में एक कवि घंटों अपनी कविताओं की तारीफ़ करता रहा। तेनाली रामन धैर्य से सुनते रहे, फिर छोटी सी चुनौती दी।",
        "'अपनी सबसे अच्छी कविता आँखें बंद करके सुनाइए,' तेनाली ने कहा। कवि शान से शुरू हुआ — जब तक तेनाली ने चुपचाप उसके हाथ में कटा प्याज़ न रख दिया। आँसू आ गए, आवाज़ काँपने लगी।",
        "दरबार मुस्कुराया — बेरहमी से नहीं, पहचान के साथ। तेनाली ने झुककर कहा, 'जब हम सिर्फ़ महसूस करते हैं, प्रदर्शन बंद करते हैं, तो सबसे अच्छी कविता भी अलग लगती है।' कवि खुद पर हँसा और शाम नरम हो गई।",
      ],
      moral: "जो सबसे ज़ोर से डींग मारते हैं, अक्सर साफ़ देखे जाने से डरते हैं।",
    },
    "star-jar": {
      title: "सितारों का जार",
      body: [
        "एक बच्ची ने दादाजी से कहा कि उसने अपना दुख एक जार में रखा है — हर बुरे दिन के लिए एक कंकड़। 'जल्द ही भर जाएगा,' उसने कहा।",
        "दादाजी ने दूसरा जार दिया। 'हर आम अच्छी बात के लिए एक सितारा रखो। गर्म खाना। दोस्त की हँसी। बस में संगीत। गर्मी के बाद बारिश।'",
        "हफ्तों बाद उसने दोनों जार दिखाए। सितारों वाला जार उम्मीद से ज़्यादा भरा था। 'बुरे दिन सच हैं,' उन्होंने कहा। 'पर वही एक चीज़ नहीं जो तुम इकट्ठा कर रही हो।' उसने ढक्कन बंद किए और आराम से सो गई।",
      ],
      moral: "मुश्किल रातें भी एक बड़ी ज़िंदगी का हिस्सा हैं।",
    },
  };

  const SPEECH_RATE = { en: 0.78, hi: 0.76 };

  const SPEAKER_ICON = `<svg class="stories-listen-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

  let activeFilter = "all";
  let modalEl = null;
  let listenDrawerEl = null;
  let activeStoryId = null;
  let activeListenBtn = null;
  let activeLang = null;
  let pendingStoryId = null;
  let pendingListenBtn = null;
  let voicesCache = null;

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

  function storySpeechText(story, lang) {
    if (lang === "hi") {
      const hi = HINDI[story.id];
      if (!hi) return storySpeechText(story, "en");
      const parts = [hi.title, ...hi.body];
      if (hi.moral) parts.push(`कहानी की सीख: ${hi.moral}`);
      return parts.join(" ");
    }
    const parts = [story.title, ...story.body];
    if (story.moral) parts.push(`Moral of the story: ${story.moral}`);
    return parts.join(" ");
  }

  function canListen() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  function loadVoices() {
    if (!canListen()) return [];
    if (voicesCache?.length) return voicesCache;
    voicesCache = window.speechSynthesis.getVoices();
    return voicesCache;
  }

  function pickVoice(lang) {
    const voices = loadVoices();
    const prefix = lang === "hi" ? "hi" : "en";
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith(prefix) && v.localService) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
      null
    );
  }

  function markListenButton(btn, speaking) {
    if (!btn) return;
    if (speaking) {
      btn.classList.add("is-speaking");
      btn.setAttribute("aria-label", "Stop listening");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("is-speaking");
      btn.setAttribute("aria-label", "Listen to story");
      btn.setAttribute("aria-pressed", "false");
    }
  }

  function stopSpeaking() {
    if (canListen()) window.speechSynthesis.cancel();
    activeStoryId = null;
    activeLang = null;
    if (activeListenBtn) {
      markListenButton(activeListenBtn, false);
      activeListenBtn = null;
    }
    document.querySelectorAll(".stories-listen-btn.is-speaking").forEach((btn) => {
      markListenButton(btn, false);
    });
  }

  function closeListenDrawer() {
    if (!listenDrawerEl) return;
    listenDrawerEl.hidden = true;
    document.body.classList.remove("stories-listen-open");
    pendingStoryId = null;
    pendingListenBtn = null;
  }

  function ensureListenDrawer() {
    if (listenDrawerEl) return listenDrawerEl;

    listenDrawerEl = document.createElement("div");
    listenDrawerEl.id = "storiesListenDrawer";
    listenDrawerEl.className = "stories-listen-drawer";
    listenDrawerEl.hidden = true;
    listenDrawerEl.innerHTML = `
      <div class="stories-listen-backdrop" data-listen-close tabindex="-1" aria-hidden="true"></div>
      <div class="stories-listen-sheet" role="dialog" aria-modal="true" aria-labelledby="storiesListenTitle">
        <div class="stories-listen-handle" aria-hidden="true"></div>
        <p class="stories-listen-kicker">Listen to this tale</p>
        <h3 class="stories-listen-title" id="storiesListenTitle"></h3>
        <p class="stories-listen-hint">Choose a language. We'll read slowly so you can follow along.</p>
        <div class="stories-listen-langs">
          <button type="button" class="stories-listen-lang" data-lang="en">
            <span class="stories-listen-lang-flag" aria-hidden="true">🇬🇧</span>
            <span class="stories-listen-lang-text">
              <strong>English</strong>
              <small>Slow, clear narration</small>
            </span>
          </button>
          <button type="button" class="stories-listen-lang" data-lang="hi">
            <span class="stories-listen-lang-flag" aria-hidden="true">🇮🇳</span>
            <span class="stories-listen-lang-text">
              <strong>हिंदी</strong>
              <small>धीमी, आसान आवाज़</small>
            </span>
          </button>
        </div>
        <button type="button" class="btn btn-ghost btn-sm stories-listen-cancel" data-listen-close>Cancel</button>
      </div>`;

    document.body.appendChild(listenDrawerEl);

    listenDrawerEl.querySelectorAll("[data-listen-close]").forEach((el) => {
      el.addEventListener("click", closeListenDrawer);
    });

    listenDrawerEl.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        const storyId = pendingStoryId;
        const triggerBtn = pendingListenBtn;
        closeListenDrawer();
        if (storyId) startListening(storyId, lang, triggerBtn);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && listenDrawerEl && !listenDrawerEl.hidden) closeListenDrawer();
    });

    return listenDrawerEl;
  }

  function openListenDrawer(storyId, btn) {
    const story = STORIES.find((s) => s.id === storyId);
    if (!story) return;

    const drawer = ensureListenDrawer();
    pendingStoryId = storyId;
    pendingListenBtn = btn || null;
    drawer.querySelector("#storiesListenTitle").textContent = story.title;
    drawer.hidden = false;
    document.body.classList.add("stories-listen-open");
    drawer.querySelector('[data-lang="en"]').focus();
  }

  function startListening(storyId, lang, btn) {
    if (!canListen()) {
      alert("Listen is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    const story = STORIES.find((s) => s.id === storyId);
    if (!story) return;

    if (lang === "hi" && !HINDI[story.id]) {
      alert("Hindi narration is not available for this story yet.");
      return;
    }

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(storySpeechText(story, lang));
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = SPEECH_RATE[lang] || 0.78;
    utterance.pitch = 1;

    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onend = stopSpeaking;
    utterance.onerror = stopSpeaking;

    activeStoryId = storyId;
    activeLang = lang;
    activeListenBtn = btn || null;
    if (btn) markListenButton(btn, true);

    window.speechSynthesis.speak(utterance);
  }

  function onListenClick(storyId, btn) {
    if (!canListen()) {
      alert("Listen is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    if (activeStoryId === storyId && window.speechSynthesis.speaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    openListenDrawer(storyId, btn);
  }

  function listenButton(storyId, size = "sm") {
    return `<button type="button" class="btn btn-ghost btn-${size} stories-listen-btn" data-story-id="${storyId}" aria-label="Listen to story" aria-pressed="false">${SPEAKER_ICON}<span class="stories-listen-label">Listen</span></button>`;
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
        <div class="stories-card-actions">
          <button type="button" class="btn btn-primary btn-sm stories-read-btn" data-story-id="${story.id}">Read</button>
          ${listenButton(story.id, "sm")}
        </div>
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
          <span class="stories-card-meta">${story.readMin} min</span>
          <div class="stories-card-actions">
            <button type="button" class="btn btn-ghost btn-sm stories-read-btn" data-story-id="${story.id}">Read</button>
            ${listenButton(story.id, "sm")}
          </div>
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
          <button type="button" class="btn btn-ghost btn-sm stories-listen-btn" id="storyModalListen" aria-label="Listen to story" aria-pressed="false">${SPEAKER_ICON}<span class="stories-listen-label">Listen</span></button>
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

    const listenBtn = modal.querySelector("#storyModalListen");
    listenBtn.dataset.storyId = storyId;
    listenBtn.classList.remove("is-speaking");
    listenBtn.setAttribute("aria-pressed", "false");

    modal.hidden = false;
    document.body.classList.add("motivation-open");
    modal.querySelector(".motivation-close").focus();
  }

  function closeModal() {
    stopSpeaking();
    closeListenDrawer();
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove("motivation-open");
  }

  function bindEvents(root) {
    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopSpeaking();
        closeListenDrawer();
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

    root.querySelectorAll(".stories-listen-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        onListenClick(btn.dataset.storyId, btn);
      });
    });

    root.querySelectorAll(".stories-featured").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".stories-read-btn, .stories-listen-btn")) return;
        openModal(card.dataset.storyId);
      });
    });

    const modalListen = document.getElementById("storyModalListen");
    if (modalListen && !modalListen.dataset.bound) {
      modalListen.dataset.bound = "1";
      modalListen.addEventListener("click", () => {
        onListenClick(modalListen.dataset.storyId, modalListen);
      });
    }
  }

  function render(root) {
    const featured = featuredStory();
    const list = filteredStories().filter((s) => activeFilter !== "all" || s.id !== featured.id);

    root.innerHTML = `
      <header class="stories-hero panel">
        <div class="stories-hero-row">
          <div>
            <p class="stories-hero-kicker">Night Shift Stories</p>
            <h2 class="stories-hero-title">A calm corner · read or listen</h2>
          </div>
          <div class="stories-hero-meta" aria-label="Story collection info">
            <span class="stories-hero-pill">${STORIES.length} tales</span>
            <span class="stories-hero-pill">~2 min</span>
            <span class="stories-hero-pill">Listen 🎧</span>
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
        <p>Listen to one more, or head back when you're ready.</p>
        <a href="/" class="btn btn-ghost">Back to problems</a>
      </section>`;

    bindEvents(root);
  }

  function init() {
    const root = document.getElementById("storiesRoot");
    if (!root) return;

    window.addEventListener("pagehide", () => {
      stopSpeaking();
      closeListenDrawer();
    });

    if (canListen()) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        voicesCache = window.speechSynthesis.getVoices();
      };
    }

    render(root);
  }

  return { init };
})();
