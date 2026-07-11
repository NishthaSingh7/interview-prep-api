/**
 * Khulasa posts — edit this file to publish new articles.
 *
 * Body blocks:
 *   { type: "p", text: "..." }
 *   { type: "h2", text: "..." }
 *   { type: "h3", text: "..." }
 *   { type: "ul", items: ["...", "..."] }
 *   { type: "ol", items: ["...", "..."] }
 *   { type: "code", lang: "javascript", text: "..." }
 *   { type: "callout", text: "..." }
 */
const NewsletterContent = (() => {
  const POSTS = [
    {
      slug: "add-two-numbers-suitcase-kholo-jodo-carry-rakh-lo",
      title: "🎬 Khulasa: Suitcase Kholo, Jodo, Carry Rakh Lo!",
      excerpt:
        "Add Two Numbers — pehle sirf kahani: do businessmen, suitcase chain, Curr, Carry. Code alag section mein. Title yaad rakhna: kholo, jodo, carry rakh lo.",
      date: "2026-07-11",
      readMin: 5,
      tags: ["Linked List", "Math", "Add Two Numbers"],
      featured: true,
      body: [
        {
          type: "p",
          text: "Aaj ki problem: Add Two Numbers. Do lists hain. Har dabbe mein ek number (0 se 9). Numbers ulta likhe hain — pehle chhoti jagah (units), phir badi. Seedha padhoge toh dimaag ghoomega. Isliye pehle sirf kahani suno. Code baad mein, alag se. Title zor se bolo: Suitcase Kholo, Jodo, Carry Rakh Lo!",
        },
        {
          type: "callout",
          text: "Pehle kahani. Phir neeche alag box mein code. Dono mix mat karna — tabhi clear rahega.",
        },
        {
          type: "h2",
          text: "Kahani: do shehar, ek mission",
        },
        {
          type: "p",
          text: "Do bade businessmen hain — Mr. L1 aur Mr. L2. Dono ke paas bahut cash hai. Cash alag-alag suitcase mein band hai. Suitcase ek chain mein jude hue hain — ek ke peeche dusra, dusre ke peeche teesra. Aur dono apna hisab ulta rakhte hain: pehla suitcase chhoti value, aakhri suitcase badi value.",
        },
        {
          type: "p",
          text: "Mission simple hai: dono ka paisa jodo, aur ek nayi chain banao. Yeh naya hisab Mr. Curr sambhalega.",
        },
        {
          type: "h2",
          text: "Kaun kaun hai is film mein?",
        },
        {
          type: "ul",
          items: [
            "Dummy — nakli guard. Line ke bilkul shuru mein khada. Asli paisa uske peeche se shuru hota hai.",
            "Curr — collector. Nayi suitcase-chain banata hai, ek-ek karke.",
            "Carry — jeb ka extra paisa. Jab jod 10 ya usse zyada ho, jo bacha woh agli baar ke liye jeb mein.",
            "Mr. L1 aur Mr. L2 — do suitcase-wale. Jiska suitcase khatam, us round mein uska paisa zero.",
          ],
        },
        {
          type: "h2",
          text: "Golden rule (yaad rakhna)",
        },
        {
          type: "p",
          text: "Kaam tab tak chalta rahe jab tak: kisi ke paas suitcase bacha ho, YA Curr ki jeb mein Carry bacha ho. Dono khatam? Tab rukna.",
        },
        {
          type: "h2",
          text: "Har round mein teen kaam — title hi plan hai",
        },
        {
          type: "h3",
          text: "1. Suitcase Kholo",
        },
        {
          type: "p",
          text: "Curr pehle L1 ke paas jata hai. Suitcase hai? Usme jo number hai, woh le lo. Suitcase nahi? Zero maan lo. Phir L2 ke paas — same baat. Dono taraf se aaj ki rakam mil gayi.",
        },
        {
          type: "h3",
          text: "2. Jodo",
        },
        {
          type: "p",
          text: "Ab teen cheezein jodo: L1 ka number + L2 ka number + jeb mein jo Carry pehle se pada tha. Yeh total aaj ka poora hisab hai.",
        },
        {
          type: "h3",
          text: "3. Carry Rakh Lo",
        },
        {
          type: "p",
          text: "Maan lo total 14 aaya. Curr chalaki karta hai: 4 ko naye suitcase mein daal deta hai (yeh aaj ki chain mein jodta hai), aur 1 ko jeb mein rakh leta hai — agli baar ke liye. Kyunki 14 mein 10 wali jagah agli line mein jaati hai. Phir Curr khud ek kadam aage badh jata hai, nayi chain pe.",
        },
        {
          type: "p",
          text: "Uske baad L1 aur L2 bhi apne agle suitcase pe chale jaate hain. Jiska suitcase khatam, woh ruk jata hai. Phir wapas shuru: Kholo → Jodo → Carry Rakh Lo.",
        },
        {
          type: "h2",
          text: "Climax: Dummy ko hatao",
        },
        {
          type: "p",
          text: "Jab saara kaam khatam, nakli guard Dummy ki zaroorat nahi. Usse hata do. Uske theek peeche se jo asli suitcase-chain shuru hoti hai — wahi final jawab. Dummy sirf shuruat pakadne ke liye tha.",
        },
        {
          type: "h2",
          text: "Ek baar dimaag mein ghumao",
        },
        {
          type: "ol",
          items: [
            "Suitcase kholo — dono taraf se aaj ka number (nahi toh zero).",
            "Jodo — dono numbers + jeb ka Carry.",
            "Carry rakh lo — 10 se kam wala hissa naya suitcase, 10 wali jagah jeb mein.",
            "Aage badho — agla suitcase, phir loop.",
            "Aakhir mein — Dummy hatao, peeche wali chain return.",
          ],
        },
        {
          type: "callout",
          text: "Yahan tak sirf kahani thi. Neeche alag se code hai — ab mapping clear hogi.",
        },
        {
          type: "h2",
          text: "Ab code (alag padho)",
        },
        {
          type: "p",
          text: "Upar wali kahani ka seedha code. Pehle story yaad, phir yeh block.",
        },
        {
          type: "code",
          lang: "python",
          text: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)   # nakli guard
    curr = dummy          # collector
    carry = 0             # jeb ka extra

    while l1 or l2 or carry:
        # 1. Suitcase Kholo
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0

        # 2. Jodo
        total = val1 + val2 + carry

        # 3. Carry Rakh Lo
        carry = total // 10
        num = total % 10
        curr.next = ListNode(num)
        curr = curr.next

        # Aage badho
        if l1: l1 = l1.next
        if l2: l2 = l2.next

    return dummy.next     # Dummy hatao`,
        },
        {
          type: "h2",
          text: "Kahani → code (ek line each)",
        },
        {
          type: "ul",
          items: [
            "Suitcase Kholo → val1 / val2 (node nahi toh 0)",
            "Jodo → total = val1 + val2 + carry",
            "Carry Rakh Lo → carry = total // 10, suitcase mein total % 10",
            "Aage badho → l1 / l2 ko next pe le jao",
            "Dummy hatao → return dummy.next",
          ],
        },
        {
          type: "callout",
          text: "Ab Add Two Numbers kholo. Pehle title bolo, phir code likho. 💪",
        },
      ],
    },
    {
      slug: "pacific-atlantic-samundar-se-chadhai-beech-ka-raaz",
      title: "🎬 Khulasa: Samundar Se Chadhai, Beech Ka Raaz!",
      excerpt:
        "Pacific Atlantic Water Flow — Pirate Leader do crew bhejta hai kinare se pahad par. Jahan Blue aur Red dono pahunche, wahi beech ka raaz. Title hi cheat code.",
      date: "2026-07-11",
      readMin: 4,
      tags: ["Matrix", "DFS", "Pacific Atlantic"],
      featured: false,
      body: [
        {
          type: "p",
          text: "Aaj dopahar Pacific Atlantic Water Flow solve kiya. Ek pahadi ilaaka (grid) — Top aur Left pe Pacific, Bottom aur Right pe Atlantic. Mission: woh cells jahan se pani dono samundaron mein bahe sake. Har cell se neeche se pani test karna? Time waste. Pirate Leader ka plan: samundar se seedha pahad par chadho. Title zor se bolo: Samundar Se Chadhai, Beech Ka Raaz!",
        },
        {
          type: "callout",
          text: "Samundar se chadhai = kinare se andar DFS. Beech ka raaz = jahan Blue Crew aur Red Crew dono pahunche — wahi answer cell.",
        },
        {
          type: "h2",
          text: "Kahani ke kirdar",
        },
        {
          type: "ul",
          items: [
            "Pirate Leader — dono crew control karta hai. Border par bhejta hai, aakhir mein beech ka raaz khud dhoondhta hai.",
            "Blue Crew (pacific_reachable) — Pacific kinare ke jaasoos. Top row aur Left column se andar chadhenge.",
            "Red Crew (atlantic_reachable) — Atlantic kinare ke jaasoos. Bottom row aur Right column se andar chadhenge.",
            "dfs() — Pirate Leader ka order: har jaasoos ko chalne ke niyam walkie-talkie par.",
          ],
        },
        {
          type: "h2",
          text: "Pirate Leader ke 3 niyam",
        },
        {
          type: "ul",
          items: [
            "Niyam 1 — Seema: grid se bahar? wapas jao. (r < 0, c < 0, etc.)",
            "Niyam 2 — Pehle se aaye ho? dubara mat jao. (r,c) in reachable_set → return.",
            "Niyam 3 — Oonchai: samundar se upar chadh rahe ho — agla cell tabhi jab height ≥ current. Niche? ruk jao. (heights[r][c] < prev_height → return)",
          ],
        },
        {
          type: "p",
          text: "Teeno niyam pass? Jaasoos apna jhanda gaad deta hai (reachable_set.add) aur charo directions mein aage bhej deta hai.",
        },
        {
          type: "h2",
          text: "Act 1: Kinare se chadhai",
        },
        {
          type: "p",
          text: "Pirate Leader pehle Blue Crew bhejta hai — row 0 (Top) aur col 0 (Left) par khade ho, andar chadho! Blue jhande jahan-jahan pahunche, mark kar lo. Phir Red Crew — last row (Bottom) aur last col (Right) se shuru, andar chadho, Red jhande laga do.",
        },
        {
          type: "h2",
          text: "Act 2: Beech ka raaz",
        },
        {
          type: "p",
          text: "Dono crew thak kar ruk jaati hain. Ab Pirate Leader khud poore pahad ka round lagata hai — har cell par sawaal: \"Blue jhanda bhi hai AUR Red jhanda bhi?\" if (r,c) in pacific_reachable and (r,c) in atlantic_reachable. Jahan dono mile, wahi beech ka raaz — pani Pacific aur Atlantic dono mein jaa sakta hai. Result list mein likho, return. Raaz khul gaya!",
        },
        {
          type: "h2",
          text: "Cheat sheet",
        },
        {
          type: "ul",
          items: [
            "Top + Left → Blue Crew DFS → pacific_reachable.",
            "Bottom + Right → Red Crew DFS → atlantic_reachable.",
            "Oonchai rule → sirf height >= prev_height par aage badho.",
            "Beech ka raaz → dono sets mein (r,c) → result mein add.",
          ],
        },
        {
          type: "callout",
          text: "Story sun li — ab Pacific Atlantic Water Flow kholo aur code likho. 💪",
        },
      ],
    },
    {
      slug: "linked-list-cycle-ii-pehli-mulaqat-mandap",
      title: "🎬 Khulasa: Pehli Mulaqat Gol Mein, Doosri Mulaqat Mandap Pe!",
      excerpt:
        "Linked List Cycle II — Mandap (cycle start) dhoondhna hai. Dulha 2x, Dulhan 1x: pehli mulaqat gol mein, doosri mulaqat Mandap pe. Title hi cheat code.",
      date: "2026-07-08",
      readMin: 4,
      tags: ["Linked List", "Fast & Slow Pointers", "Cycle"],
      featured: false,
      body: [
        {
          type: "p",
          text: "Linked List I mein sirf yeh pata lagaya tha — list mein chakkar (cycle) chal raha hai ya nahi. Linked List II thoda advance hai: us chakkar ka main point dhoondhna hai — woh jagah jahan se ghol-maal shuru hua. Is complex problem ko samajhte hain ekdum desi shaadi ki kahani se. Title zor se bolo: Pehli Mulaqat Gol Mein, Doosri Mulaqat Mandap Pe!",
        },
        {
          type: "callout",
          text: "Pehli mulaqat = chakkar confirmed (slow == fast). Doosri mulaqat = Mandap mil gaya (return slow).",
        },
        {
          type: "h2",
          text: "Kahani ke kirdar",
        },
        {
          type: "ul",
          items: [
            "The Red Carpet (head) — shaadi ka lamba entrance carpet.",
            "Mandap (cycle start node) — story ka main point. Agar aage jaakar gol-ghumao (loop) hai, toh Mandap woh entry gate hai jahan se rasta gol ghumna shuru hota hai. Hume isi Mandap ka pata lagana hai!",
            "Dulha (Fast pointer) — thoda excited, ek baar mein 2 kadam bhaagta hai.",
            "Dulhan (Slow pointer) — graceful, aaram se ek baar mein 1 kadam chalti hai.",
          ],
        },
        {
          type: "h2",
          text: "Phase 1: Pehli mulaqat gol mein",
        },
        {
          type: "p",
          text: "Kahani entrance (head) se shuru. Dono Mandap ki taraf badhte hain. Agar rasta seedha nikal gaya aur Dulha end tak pahunch gaya (None) — samajho koi chakkar nahi, shaadi cancel, return null.",
        },
        {
          type: "p",
          text: "Lekin agar raste mein ghol-maal (cycle) hua, toh dono us gol raste mein ghumne lagenge. Kyunki Dulha 2x speed se bhaag raha hai, woh peeche se ghoom kar aayega aur ek point par Dulhan se takra jayega (slow == fast). Is takraane se yeh toh pakka ho gaya ki raste mein gol-ghumao hai. Par boss, abhi tak Mandap nahi mila! Yeh mulaqat toh raste mein kahin beech gol-ghumao mein hui hai.",
        },
        {
          type: "h2",
          text: "Phase 2: Doosri mulaqat Mandap pe",
        },
        {
          type: "p",
          text: "Ab asli twist. Dono ko sahi Mandap par pahunchana hai. Rule: (1) Dulhan ka teleportation — Slow magically wapas start point (head) par chali jaati hai. (2) Dulhe ka compromise — Fast usi beech wale point par ruka rehta hai jahan pehli mulaqat hui thi, lekin ab speed kam karke Dulhan jitni — dono 1-1 kadam.",
        },
        {
          type: "p",
          text: "Ab Dulhan start se aage badhti hai aur Dulha us beech raste se aage badhta hai. Maths ke ek kamaal ke rule ke mutabik dono ka distance Mandap se barabar hota hai. Jab dobara aamne-saamne aayenge, toh woh jagah koi aur nahi — humara asli Mandap! Wahi par shaadi sampann, aur code usi Mandap ka address return kar deta hai (return slow).",
        },
        {
          type: "h2",
          text: "Cheat sheet",
        },
        {
          type: "ul",
          items: [
            "fast.next.next — Dulhe ki 2-kadam waali speed.",
            "slow == fast — gol raste mein pehli mulaqat (chakkar confirmed).",
            "slow = head — Dulhan wapas entrance par.",
            "slow.next & fast.next — dono ka 1-1 kadam chalna.",
            "return slow — Mandap mil gaya!",
          ],
        },
        {
          type: "callout",
          text: "Story sun li — ab Linked List Cycle II kholo aur code likho. 💪",
        },
      ],
    },
    {
      slug: "palindrome-linked-list-slow-fast-shadi-pakka",
      title: "🎬 Khulasa: Slow-Fast Ka Dhoka, Ulta Pulta Dhakka, Aur Shadi Pakka!",
      excerpt:
        "Sarpanch ki gaon wali kahani — Slow-Fast middle dhoondhte hain, Prev second half ulta karta hai, phir Shadi Pakka. Title hi cheat code.",
      date: "2026-07-06",
      readMin: 4,
      tags: ["Linked List", "Fast & Slow Pointers", "Palindrome"],
      featured: false,
      body: [
        {
          type: "p",
          text: "🎙️ Palindrome Linked List — list aage se aur peeche se same padhni chahiye. Title zor se bolo, teen step yaad reh jayenge: Slow-Fast Ka Dhoka, Ulta Pulta Dhakka, Shadi Pakka!",
        },
        {
          type: "callout",
          text: "Slow-Fast = middle. Ulta Pulta = second half reverse. Shadi Pakka = dono taraf values match.",
        },
        {
          type: "h2",
          text: "1. Slow-Fast Ka Dhoka",
        },
        {
          type: "p",
          text: "Gaon ki Linked List mein do dost: Slow (ek step) aur Fast (do step, Red Bull wala). Sarpanch (Head) bola — \"Jab Fast boundary pe pahunche, ruk jao.\" Fast end pe pahuncha, peeche dekha — Slow bilkul middle mein haanp raha tha. \"Abbe Oye, tu MIDDLE pe hai!\" Step 1 khatam: slow = slow.next, fast = fast.next.next.",
        },
        {
          type: "h2",
          text: "2. Ulta Pulta Dhakka",
        },
        {
          type: "p",
          text: "Sarpanch bola — \"Palindrome check karna hai, second half Ulta Pulta karo.\" Slow ke aage Curr (curr = slow.next) khada tha. Jadugar Prev ne magic chalaaya: prev = None, phir har node peeche ghuma (curr.next = prev). Yaad rakhna — curr = temp mat bhoolna! Aakhir mein prev = reversed half ka naya head.",
        },
        {
          type: "h2",
          text: "3. Shadi Pakka",
        },
        {
          type: "p",
          text: "Ab shaadi! Dulha Curr1 head se (curr1 = head), dulha Curr2 reversed side se (curr2 = prev). Sarpanch: \"Ek-ek step aage badho, values match karo. Nahi mili? Shaadi cancel — return False. Sab match? Shaadi Pakka — return True!\"",
        },
        {
          type: "callout",
          text: "Story sun li — ab Palindrome Linked List kholo aur code likho. 💪",
        },
      ],
    },
    {
      slug: "three-sum-two-sum-discipline-bhai",
      title: "🚨 Khulasa: Three Sum Sirf Two Sum Hai — Discipline Bhai Ke Saath",
      excerpt:
        "Breaking from tonight's desk: Three Sum naya pattern nahi hai. Do chote bhai (left-right pointers) hain, aur ek discipline bhai anchor pakad ke unhe control kar raha hai. Bas.",
      date: "2026-07-05",
      readMin: 4,
      tags: ["Two Pointers", "Arrays", "Three Sum"],
      featured: false,
      body: [
        {
          type: "p",
          text: "🎙️ Reporting live from AfterHours. Aaj raat Three Sum solve kiya — teen numbers dhoondhne hain jo milke zero ban jayein. Pehle lagta hai alag beast hai. Spoiler: nahi hai. Khulasa yeh hai — Three Sum = Two Sum + ek discipline bhai jo sab sambhal raha hai.",
        },
        {
          type: "h2",
          text: "The cast 🎬",
        },
        {
          type: "ul",
          items: [
            "Discipline Bhai (the anchor) — outer loop mein ek index fix karke baith jaata hai. Hilta nahi jab tak andar ka kaam khatam na ho. Pehla number yahi decide karta hai.",
            "Left Bhai (chota bhai #1) — anchor ke right side se start. Sum kam hai? Aage badho, bada number chahiye.",
            "Right Bhai (chota bhai #2) — array ke end se start. Sum zyada hai? Peechhe jao, chota number chahiye.",
            "Teeno ka sum — anchor + left + right. Zero mila? Triplet pakka. Simple.",
          ],
        },
        {
          type: "callout",
          text: "Yaad rakhna: Three Sum = Two Sum + Discipline Bhai. Woh anchor pakad ke baithta hai, do chote bhai andar traverse karte hain. Yeh line yaad rahegi toh question khud solve ho jayega.",
        },
        {
          type: "h2",
          text: "Scene kya hai?",
        },
        {
          type: "p",
          text: "Pehle array sort karo — warna left-right move karna guesswork ban jaata hai. Phir discipline bhai ek index pakadta hai. Uske baad left aur right andar aate hain — classic Two Sum wala scene, bas target ab dynamic hai kyunki anchor ne pehla number already fix kar diya.",
        },
        {
          type: "p",
          text: "Sum zero? Record karo, aage badho. Sum chota? Left bhai aage. Sum bada? Right bhai peeche. Discipline bhai tab tak nahi hilta jab tak us position pe saari possibilities check na ho jayein. Phir next anchor. Same film, next show.",
        },
        {
          type: "h2",
          text: "Reporter ki final line 📰",
        },
        {
          type: "p",
          text: "Three Sum scary nahi hai bhai. Two Sum toh pehle se jaante ho — do pointers, andar se milte hain. Bas ek discipline bhai add ho gaya jo bahar se anchor pakad ke dono chote bhaiyon ko control kar raha hai. Itna hi khulasa tha.",
        },
        {
          type: "callout",
          text: "Ab tumhari baari — AfterHours pe jao, Three Sum kholo, aur khud code likho. Story sun li, ab solve karo. 💪",
        },
      ],
    },
    {
      slug: "stay-consistent-after-work",
      title: "How to Stay Consistent With DSA When You Have a Day Job",
      excerpt:
        "Motivation fades after standups and Slack. Consistency comes from systems — not guilt. Here's a practical playbook inspired by Atomic Habits, built for AfterHours.",
      date: "2026-07-03",
      readMin: 9,
      tags: ["Habits", "Consistency", "AfterHours"],
      featured: false,
      archived: true,
      body: [
        {
          type: "p",
          text: "Most interview prep advice assumes you have empty evenings and infinite willpower. Real life looks different: meetings run long, you're drained by 8 PM, and LeetCode's infinite problem list makes you feel behind before you start.",
        },
        {
          type: "p",
          text: "Consistency isn't a personality trait. It's a system. James Clear's Atomic Habits puts it simply: you don't rise to the level of your goals — you fall to the level of your systems. This essay is how to build that system for DSA on AfterHours, one tired night at a time.",
        },
        {
          type: "h2",
          text: "1. Shrink the habit until it's embarrassing not to do it",
        },
        {
          type: "p",
          text: "Clear calls this the Two-Minute Rule: scale any habit down until it takes two minutes or less. For DSA, that doesn't mean \"only solve Easy problems forever.\" It means the nightly commitment is tiny: open AfterHours, pick one problem, read the brief, attempt it for 20 minutes. Marking done can come after — showing up is the habit.",
        },
        {
          type: "callout",
          text: "Bad goal: \"I'll grind 3 hours on weekends.\" Good system: \"I open AfterHours after dinner on weekdays — even if I only solve one Medium.\"",
        },
        {
          type: "h2",
          text: "2. Stack it onto something you already do",
        },
        {
          type: "p",
          text: "Habit stacking links a new behavior to an existing anchor. You don't need a new time slot — you need a trigger you already hit every day.",
        },
        {
          type: "ul",
          items: [
            "After I close my work laptop → I open AfterHours.",
            "After I finish dinner → I solve one problem before Netflix.",
            "After I mark a problem done → I write one sentence in notes (Companion tab later).",
          ],
        },
        {
          type: "p",
          text: "Write your stack on a sticky note. Vague plans (\"I'll study sometime tonight\") die. Anchored plans survive bad days.",
        },
        {
          type: "h2",
          text: "3. Design your environment for one click",
        },
        {
          type: "p",
          text: "Clear's third law: make it easy. Friction kills after-hours prep. Bookmark AfterHours. Pin the tab. Turn on a recurring calendar block labeled \"one problem\" — 25 minutes, not \"DSA.\" Remove the decision of where to start: use patterns on the sidebar, or sort by Easy if you're rebuilding momentum.",
        },
        {
          type: "p",
          text: "On AfterHours specifically: the brief popup exists so you don't burn energy parsing a problem on LeetCode at midnight. Read the brief → open practice link → solve. Fewer tabs, fewer excuses.",
        },
        {
          type: "h2",
          text: "4. Identity beats intensity",
        },
        {
          type: "p",
          text: "Don't say \"I need to pass interviews.\" Say \"I'm someone who studies after work.\" Identity-based habits survive when outcomes feel far away. Every checkbox on AfterHours is a vote for that identity — not proof you're smart, proof you showed up.",
        },
        {
          type: "ul",
          items: [
            "Missed yesterday? Clear's rule: never miss twice. One skip is life. Two in a row is a new habit.",
            "Solved something Easy? It still counts. Streaks measure presence, not ego.",
            "Hard problem stuck? Note what blocked you, star it, move on. Coming back is consistency too.",
          ],
        },
        {
          type: "h2",
          text: "5. Make progress visible (and satisfying)",
        },
        {
          type: "p",
          text: "The fourth law: make it satisfying. LeetCode gives you a green check. AfterHours adds pattern progress, streaks, and notes you'll actually read before a retry. That feedback loop matters — your brain needs to feel tonight wasn't wasted.",
        },
        {
          type: "p",
          text: "Use Progress to see difficulty breakdowns. Use Companion after a session to close the loop: one reflection sentence, then close the laptop. Ritual beats willpower.",
        },
        {
          type: "h2",
          text: "6. Patterns over random grinding",
        },
        {
          type: "p",
          text: "Consistency without direction is just busywork. Pick a pattern for the week — two pointers, sliding window, binary search — and stay in that lane until recognition feels automatic. Random Hard problems feel like punishment; patterned practice feels like skill-building.",
        },
        {
          type: "callout",
          text: "Future essays here will go deep on individual patterns — how they work, when to use them, how they compare. This one is the foundation: none of that matters if you don't show up four nights a week.",
        },
        {
          type: "h2",
          text: "A minimal weekly system",
        },
        {
          type: "ol",
          items: [
            "Mon–Thu: one problem per night (15–30 min). Same time if possible.",
            "Fri: optional — review notes or redo one starred problem.",
            "Weekend: off or one light session. Rest is part of the system.",
            "When motivation is zero: open the site, read one brief, attempt 10 minutes. Still a win.",
          ],
        },
        {
          type: "h2",
          text: "Start tonight",
        },
        {
          type: "p",
          text: "Don't redesign your entire life. Pick one anchor (\"after dinner\"), one problem, one note. That's the whole playbook. Everything else on AfterHours — patterns, briefs, progress — exists to make repeating that night easier.",
        },
      ],
    },
  ];

  const visiblePosts = () => POSTS.filter((p) => !p.archived);

  const ALL_TAGS = [...new Set(visiblePosts().flatMap((p) => p.tags))].sort();

  function getPosts() {
    return [...visiblePosts()].sort((a, b) => b.date.localeCompare(a.date));
  }

  function getPost(slug) {
    const post = POSTS.find((p) => p.slug === slug);
    if (!post || post.archived) return null;
    return post;
  }

  function getFeatured() {
    return visiblePosts().find((p) => p.featured) || getPosts()[0] || null;
  }

  return { getPosts, getPost, getFeatured, ALL_TAGS };
})();
