export type PhraseStatus = 'new' | 'learning' | 'got-it'

export interface Phrase {
  id: string
  arabic: string
  romanized: string
  english: string
  mnemonic?: string
  bonus?: boolean // "surprise them" phrases sprinkled in
}

export interface Category {
  slug: string
  title: string
  icon: string
  tier: 'essential' | 'core' | 'good-to-have' | 'surprise'
  description: string
  phrases: Phrase[]
}

export const categories: Category[] = [
  {
    slug: 'greetings',
    title: 'Greetings & Social Glue',
    icon: '🤝',
    tier: 'essential',
    description: 'The phrases that open every door in Morocco',
    phrases: [
      { id: 'g1', arabic: 'السلام عليكم', romanized: 'As-salamu alaykum', english: 'Peace be upon you (hello)', mnemonic: 'The universal Muslim greeting — always welcomed' },
      { id: 'g2', arabic: 'وعليكم السلام', romanized: 'Wa alaykum as-salam', english: 'And upon you peace (reply)', mnemonic: 'The response to As-salamu alaykum' },
      { id: 'g3', arabic: 'لا باس', romanized: 'La bas', english: 'How are you? / No problem', mnemonic: '"La bas?" asked casually = "You good?"' },
      { id: 'g4', arabic: 'لا باس الحمد لله', romanized: 'La bas, hamdullah', english: 'Fine, praise God', mnemonic: 'The standard reply — always include hamdullah' },
      { id: 'g5', arabic: 'الحمد لله', romanized: 'Hamdullah', english: 'Praise God / Thank God', mnemonic: 'Drop this constantly — after a meal, after a walk, after anything good' },
      { id: 'g6', arabic: 'إن شاء الله', romanized: 'Inshallah', english: 'God willing', mnemonic: 'Used for anything in the future. You already know this one.' },
      { id: 'g7', arabic: 'شكرا', romanized: 'Shukran', english: 'Thank you', mnemonic: '"Sugar and" — sweet thanks' },
      { id: 'g8', arabic: 'شكرا بزاف', romanized: 'Shukran bzzaf', english: 'Thank you very much', mnemonic: 'Bzzaf = a lot/very much. Use it liberally.' },
      { id: 'g9', arabic: 'عفاك', romanized: 'Afak', english: 'Please / Excuse me', mnemonic: '"Afak" — like "a favor", asking politely' },
      { id: 'g10', arabic: 'سمح لي', romanized: 'Smeh liya', english: 'Sorry / Excuse me', mnemonic: 'For bumping into someone or getting attention' },
      { id: 'g11', arabic: 'مرحبا', romanized: 'Marhba', english: 'Welcome / Hello (warm)', mnemonic: 'Hosts say this to welcome you — respond with "Marhba bik"' },
      { id: 'g12', arabic: 'بسلامة', romanized: 'Bslama', english: 'Goodbye (go in peace)', mnemonic: '"Bslama" sounds like "be safe" — perfect memory hook' },
      { id: 'g13', arabic: 'تصبح على خير', romanized: 'Tsbah ala khir', english: 'Good night', mnemonic: 'Said when parting in the evening' },
    ]
  },
  {
    slug: 'numbers',
    title: 'Numbers & Money',
    icon: '💰',
    tier: 'essential',
    description: 'Haggling is an art. These are your tools.',
    phrases: [
      { id: 'n1', arabic: 'واحد', romanized: 'Wahd', english: 'One' },
      { id: 'n2', arabic: 'جوج', romanized: 'Jooj', english: 'Two', mnemonic: '"Jooj" — two things joined together' },
      { id: 'n3', arabic: 'تلاتة', romanized: 'Tlata', english: 'Three' },
      { id: 'n4', arabic: 'ربعة', romanized: 'Reb\'a', english: 'Four' },
      { id: 'n5', arabic: 'خمسة', romanized: 'Khamsa', english: 'Five', mnemonic: 'Khamsa = five. The Hand of Fatima (khamsa) has five fingers.' },
      { id: 'n6', arabic: 'ستة', romanized: 'Setta', english: 'Six' },
      { id: 'n7', arabic: 'سبعة', romanized: 'Seb\'a', english: 'Seven' },
      { id: 'n8', arabic: 'تمنية', romanized: 'Tmenya', english: 'Eight' },
      { id: 'n9', arabic: 'تسعود', romanized: 'Tes\'oud', english: 'Nine' },
      { id: 'n10', arabic: 'عشرة', romanized: 'Ashra', english: 'Ten' },
      { id: 'n11', arabic: 'عشرين', romanized: 'Ashrin', english: 'Twenty' },
      { id: 'n12', arabic: 'خمسين', romanized: 'Khamsin', english: 'Fifty' },
      { id: 'n13', arabic: 'مية', romanized: 'Miya', english: 'One hundred' },
      { id: 'n14', arabic: 'بشحال هادا؟', romanized: 'Bshhal hada?', english: 'How much is this?', mnemonic: 'Your most-used phrase in any souk' },
      { id: 'n15', arabic: 'غالي بزاف', romanized: 'Ghali bzzaf', english: 'Too expensive!', mnemonic: '"Ghali" = expensive. Say it with a smile.' },
      { id: 'n16', arabic: 'خفف شوية', romanized: 'Khfef shwiya', english: 'Lower it a little', mnemonic: 'The polite haggle move' },
      { id: 'n17', arabic: 'آخر ثمن', romanized: 'Akher taman?', english: 'Final price?', mnemonic: 'Signals you\'re serious about buying' },
      { id: 'n18', arabic: 'درهم', romanized: 'Dirham', english: 'Dirham (Moroccan currency)', mnemonic: 'About 10 cents USD. 10 dirhams ≈ $1.' },
    ]
  },
  {
    slug: 'food',
    title: 'Food & Restaurants',
    icon: '🍽️',
    tier: 'core',
    description: 'Order, compliment, and discover like a local',
    phrases: [
      { id: 'f1', arabic: 'أنا بغيت...', romanized: 'Ana bghit...', english: 'I want...', mnemonic: 'The magic frame — "Ana bghit" + anything you point at' },
      { id: 'f2', arabic: 'واحد...عافاك', romanized: 'Wahd... afak', english: 'One [thing], please', mnemonic: 'Wahd (one) + item + afak (please)' },
      { id: 'f3', arabic: 'بنين بزاف', romanized: 'Bnin bzzaf', english: 'Very delicious!', mnemonic: '"Bnin" sounds like "benign" but means delicious. Say it after every meal.' },
      { id: 'f4', arabic: 'شنو عندكم؟', romanized: 'Shnu andkum?', english: 'What do you have?', mnemonic: 'Better than a menu — gets you the real daily food' },
      { id: 'f5', arabic: 'بلا لحم', romanized: 'Bla lhem', english: 'Without meat', mnemonic: '"Bla" = without. Useful for vegetarians.' },
      { id: 'f6', arabic: 'طاجين', romanized: 'Tajine', english: 'Tagine (slow-cooked stew)', mnemonic: 'You know this one — order it everywhere' },
      { id: 'f7', arabic: 'كسكس', romanized: 'Kuskus', english: 'Couscous', mnemonic: 'Friday lunch dish — special if you find it on Friday' },
      { id: 'f8', arabic: 'أتاي', romanized: 'Atay', english: 'Mint tea', mnemonic: 'Never refuse mint tea — it\'s an invitation to connect' },
      { id: 'f9', arabic: 'الحساب عافاك', romanized: 'L-hsab afak', english: 'The bill, please', mnemonic: '"L-hsab" = the account/bill' },
      { id: 'f10', arabic: 'فين كيأكلو المحليين؟', romanized: 'Fayn kay-aklu l-mħallin?', english: 'Where do locals eat?', mnemonic: 'The most powerful phrase for finding real food', bonus: true },
      { id: 'f11', arabic: 'صافي', romanized: 'Safi', english: 'That\'s enough / Done / OK', mnemonic: '"Safi" — the all-purpose "we\'re good" word', bonus: true },
    ]
  },
  {
    slug: 'getting-around',
    title: 'Getting Around',
    icon: '🚕',
    tier: 'core',
    description: 'Taxis, medinas, and not getting lost',
    phrases: [
      { id: 'a1', arabic: 'فين كاين...؟', romanized: 'Fayn kayn...?', english: 'Where is...?', mnemonic: '"Fayn" = where. Your navigation frame.' },
      { id: 'a2', arabic: 'بغيت نمشي ل...', romanized: 'Bghit nemshi l...', english: 'I want to go to...', mnemonic: 'Tell the taxi driver this + destination' },
      { id: 'a3', arabic: 'بشحال تاكسي ل...؟', romanized: 'Bshhal taxi l...?', english: 'How much for a taxi to...?', mnemonic: 'Always agree on price before getting in' },
      { id: 'a4', arabic: 'على اليمين', romanized: 'Ala l-ymin', english: 'On the right', mnemonic: '"Ymin" sounds like "Yemen" — Yemen is to the right on old maps' },
      { id: 'a5', arabic: 'على اليسار', romanized: 'Ala l-ysar', english: 'On the left' },
      { id: 'a6', arabic: 'نيشان', romanized: 'Nishan', english: 'Straight ahead', mnemonic: '"Nishan" — like "on target", straight shot' },
      { id: 'a7', arabic: 'هنا', romanized: 'Hna', english: 'Here / Stop here', mnemonic: 'Short and punchy — "Hna!" to stop the taxi' },
      { id: 'a8', arabic: 'المدينة', romanized: 'L-mdina', english: 'The old city (medina)', mnemonic: 'The old walled city — every major Moroccan city has one' },
      { id: 'a9', arabic: 'باب', romanized: 'Bab', english: 'Gate / Door', mnemonic: 'Medina gates are called Bab — "Bab Boujloud", etc.' },
      { id: 'a10', arabic: 'ضعت', romanized: 'D\'at', english: 'I\'m lost', mnemonic: 'Say it with a smile — usually gets you immediate help' },
    ]
  },
  {
    slug: 'shopping',
    title: 'Shopping & Souk',
    icon: '🛍️',
    tier: 'core',
    description: 'Navigate the souk like you\'ve been here before',
    phrases: [
      { id: 's1', arabic: 'كانعجبني هادا', romanized: 'Kan\'ajbni hada', english: 'I like this', mnemonic: '"Kan\'ajbni" — "it pleases me"' },
      { id: 's2', arabic: 'ما كانعجبنيش', romanized: 'Ma kan\'ajbniish', english: 'I don\'t like this', mnemonic: 'Ma...sh = negation in Darija. Ma + verb + sh.' },
      { id: 's3', arabic: 'كاين شي حاجة أخرى؟', romanized: 'Kayn shi ħaja ukhra?', english: 'Do you have something else?', mnemonic: 'Shows you\'re serious without committing' },
      { id: 's4', arabic: 'غادي نجي غدا', romanized: 'Ghadi nji ghda', english: 'I\'ll come back tomorrow', mnemonic: 'The classic polite exit from a hard sell', bonus: true },
      { id: 's5', arabic: 'مزيان', romanized: 'Mzyan', english: 'Good / Nice / Beautiful', mnemonic: 'The most useful compliment word in Darija' },
      { id: 's6', arabic: 'مزيان بزاف', romanized: 'Mzyan bzzaf', english: 'Very good / Excellent', mnemonic: 'Stack mzyan + bzzaf for emphasis', bonus: true },
      { id: 's7', arabic: 'هادا للهدية', romanized: 'Hada l-l-hdiya', english: 'This is for a gift', mnemonic: 'Can help with wrapping and sometimes price' },
      { id: 's8', arabic: 'واخا', romanized: 'Wakha', english: 'OK / Alright / Deal', mnemonic: '"Wakha!" — ubiquitous Darija, sounds cool, use it constantly', bonus: true },
    ]
  },
  {
    slug: 'riad',
    title: 'Hotel & Riad',
    icon: '🏨',
    tier: 'good-to-have',
    description: 'Settle in and feel at home',
    phrases: [
      { id: 'r1', arabic: 'عندي حجز', romanized: 'Andi ħjz', english: 'I have a reservation', mnemonic: '"Andi" = I have' },
      { id: 'r2', arabic: 'فين الغرفة ديالي؟', romanized: 'Fayn l-ghorfa dyali?', english: 'Where is my room?', mnemonic: '"Dyali" = mine/my. Useful beyond just hotels.' },
      { id: 'r3', arabic: 'كاين فطور؟', romanized: 'Kayn ftur?', english: 'Is there breakfast?', mnemonic: '"Ftur" = breakfast — same root as "break fast"' },
      { id: 'r4', arabic: 'واش كاين واي فاي؟', romanized: 'Wash kayn wifi?', english: 'Is there wifi?', mnemonic: 'They borrowed "wifi" — you got this one' },
      { id: 'r5', arabic: 'البيت ديالكم زوين بزاف', romanized: 'L-bit dyalkum zwin bzzaf', english: 'Your place is very beautiful', mnemonic: 'Compliment the riad — hosts genuinely love this', bonus: true },
    ]
  },
  {
    slug: 'surprise',
    title: 'Surprise Them',
    icon: '✨',
    tier: 'surprise',
    description: 'Phrases that will get a laugh, a double-take, or a new friend',
    phrases: [
      { id: 'sur1', arabic: 'واخا', romanized: 'Wakha!', english: 'OK! / Alright! / You\'re on!', mnemonic: 'Drop this casually — locals will light up that you know it', bonus: true },
      { id: 'sur2', arabic: 'صافي', romanized: 'Safi!', english: 'That\'s it! / Done! / Enough!', mnemonic: 'All-purpose "we\'re good" — sounds very local', bonus: true },
      { id: 'sur3', arabic: 'لاباس عليك', romanized: 'La bas lik', english: 'You\'re awesome / Good on you', mnemonic: 'A warm compliment — will genuinely surprise people', bonus: true },
      { id: 'sur4', arabic: 'أنت مزيان بزاف', romanized: 'Nta mzyan bzzaf', english: 'You are very cool/good', mnemonic: 'Say this to a musician after a performance', bonus: true },
      { id: 'sur5', arabic: 'الكناوة', romanized: 'L-gnawa', english: 'Gnawa (spiritual music)', mnemonic: 'Just mentioning gnawa by name signals you\'re not a regular tourist', bonus: true },
      { id: 'sur6', arabic: 'فين كاينة الموسيقى الحية الليلة؟', romanized: 'Fayn kayna l-musiqa l-ħayya l-lila?', english: 'Where is there live music tonight?', mnemonic: 'Lila = tonight. This question alone gets you invited places.', bonus: true },
      { id: 'sur7', arabic: 'الشعبي', romanized: 'Ash-sha\'bi', english: 'Chaabi (popular folk music)', mnemonic: '"Sha\'bi" means "of the people" — local pop/folk. Ask about it.', bonus: true },
      { id: 'sur8', arabic: 'فين كيمشيو الناس ديال هنا في الليل؟', romanized: 'Fayn kay-mshiw n-nas dyal hna f l-lil?', english: 'Where do people from here go at night?', mnemonic: 'The question that gets you off the tourist map entirely', bonus: true },
      { id: 'sur9', arabic: 'أنا ما شي تورست', romanized: 'Ana mashi turiste', english: 'I\'m not a tourist (I\'m a traveler)', mnemonic: 'Say it with a wink — always gets a laugh and a real conversation', bonus: true },
      { id: 'sur10', arabic: 'دربة', romanized: 'Derb', english: 'Alley / Side street', mnemonic: 'The hidden derbs are where real life happens. Ask "Fayn l-derb l-khbi?"', bonus: true },
      { id: 'sur11', arabic: 'يعطيك الصحة', romanized: 'Ya\'tik s-sħa', english: 'God give you health (said to workers)', mnemonic: 'Say this to a craftsman, chef, or laborer. They will remember you.', bonus: true },
      { id: 'sur12', arabic: 'بارك الله فيك', romanized: 'Baraka llahu fik', english: 'God bless you (heartfelt thanks)', mnemonic: '"Baraka" = blessing (you\'ve heard of Marrakech — "place of God"). Use for genuine gratitude.', bonus: true },
    ]
  }
]

export const tierOrder = ['essential', 'core', 'good-to-have', 'surprise']

export const tierLabels: Record<string, string> = {
  essential: 'Essential',
  core: 'Core',
  'good-to-have': 'Good to Have',
  surprise: 'Surprise Them',
}
