export const trips = [
  {
    name: 'Laponie', slug: 'laponie', note: 'Sous les aurores boréales ✨', coords: '66.50° N · 25.73° E', category: 'nature', price: 'À partir de 899 €', image: '/images/dest-laponie.jpg', secondaryImage: '/images/dest-alpes.jpg', duration: 'Séjour hivernal', subtitle: 'L’aventure au cœur du Grand Nord',
    copy: 'Aurores boréales, forêts enneigées et expériences arctiques dans un voyage pensé pour vous faire vivre le Grand Nord sans rien laisser au hasard.',
    includes: ['Vol aller-retour', 'Hébergement sélectionné', 'Transferts', 'Activités au choix'],
    itinerary: [['Arrivée en Laponie', 'Accueil et installation dans votre hébergement.'], ['Aventure arctique', 'Safari en traîneau et exploration de la nature.'], ['Aurores boréales', 'Soirée guidée et observation sous les étoiles.'], ['Liberté & découverte', 'Activités au choix et temps pour vous.'], ['Au revoir, Grand Nord', 'Retour avec des souvenirs plein la tête.']]
  },
  {
    name: 'Copenhague', slug: 'copenhague', note: 'Douceur scandinave ♡', coords: '55.68° N · 12.57° E', category: 'culture', price: 'À partir de 299 €', image: '/images/dest-copenhague.jpg', secondaryImage: '/images/supporting-copenhague.png', duration: 'City break', subtitle: 'La douceur de vivre scandinave',
    copy: 'Canaux, design, gastronomie et quartiers vivants : une escapade équilibrée pour découvrir Copenhague à votre rythme.',
    includes: ['Vol aller-retour', 'Hôtel central', 'Carnet d’adresses', 'Assistance'],
    itinerary: [['Premiers pas', 'Installation et découverte du centre historique.'], ['Copenhague créative', 'Design, architecture et adresses confidentielles.'], ['Au fil des canaux', 'Balade sur l’eau et quartiers emblématiques.'], ['Hygge & gastronomie', 'Marchés, cafés et temps libre.'], ['Dernière promenade', 'Un dernier regard sur la ville avant le retour.']]
  },
  {
    name: 'Cracovie', slug: 'cracovie', note: 'Mémoire & histoire', coords: '50.06° N · 19.94° E', category: 'culture', price: 'À partir de 313 €', image: '/images/dest-cracovie.jpg', secondaryImage: '/images/supporting-cracovie.png', duration: 'Mémoire & histoire', subtitle: 'Un voyage de mémoire et d’histoire',
    copy: 'Un séjour guidé et profondément humain pour comprendre l’histoire, parcourir la ville et transmettre la mémoire avec justesse.',
    includes: ['Vol aller-retour', 'Hébergement', 'Visite guidée', 'Transferts'],
    itinerary: [['Arrivée à Cracovie', 'Accueil et première découverte de la vieille ville.'], ['Cœur historique', 'Places, ruelles et patrimoine de Cracovie.'], ['Mémoire', 'Journée guidée consacrée à l’histoire.'], ['Culture polonaise', 'Quartiers, traditions et gastronomie locale.'], ['Retour', 'Temps libre puis transfert vers l’aéroport.']]
  },
  {
    name: 'Tenerife', slug: 'tenerife', note: 'L’été toute l’année ☀', coords: '28.29° N · 16.63° O', category: 'soleil', price: 'À partir de 599 €', image: '/images/dest-canaries.jpg', secondaryImage: '/images/supporting-tenerife.png', duration: 'Îles Canaries', subtitle: 'Le grand air au rythme de l’Atlantique',
    copy: 'Plages, paysages volcaniques et villages insulaires réunis dans une échappée lumineuse, personnalisable selon vos envies.',
    includes: ['Vol aller-retour', 'Hébergement', 'Transferts', 'Activités sur mesure'],
    itinerary: [['Cap sur Tenerife', 'Arrivée, transfert et installation.'], ['Terres volcaniques', 'Exploration du Teide et de ses paysages.'], ['Océan Atlantique', 'Journée en mer ou détente sur la côte.'], ['L’île autrement', 'Villages, gastronomie et expériences au choix.'], ['Derniers rayons', 'Matinée libre avant le retour.']]
  },
  {
    name: 'Corse', slug: 'corse', note: 'Entre mer & montagne ♡', coords: '42.70° N · 9.45° E', category: 'nature', price: 'À partir de 1 200 € / pers.', image: '/images/dest-corse.jpg', secondaryImage: '/images/supporting-corse.png', duration: '10 jours / 9 nuits', subtitle: 'Entre mer et montagne',
    copy: 'Un road trip de Bastia à Bonifacio, construit pour alterner routes panoramiques, villages de caractère, criques secrètes et tables corses.',
    includes: ['Vol aller-retour', 'Hébergements', 'Location de voiture', 'Carnet de route'],
    itinerary: [['Bastia', 'Arrivée et premiers pas dans le Cap Corse.'], ['Calvi', 'Routes côtières et citadelle face à la mer.'], ['Corte', 'Montagnes, rivières et cœur historique.'], ['Ajaccio', 'Rivages, marché et art de vivre corse.'], ['Bonifacio', 'Falaises blanches et conclusion du voyage.']]
  },
  {
    name: 'Bali', slug: 'bali', note: 'Le paradis à prix doux ♡', coords: '8.41° S · 115.19° E', category: 'soleil', price: 'À partir de 999 €', image: '/images/dest-bali.jpg', secondaryImage: '/images/supporting-bali.png', duration: 'Voyage complet', subtitle: 'Le paradis à votre rythme',
    copy: 'Rizières, temples, plages et gestes du quotidien balinais composent un voyage généreux, entre découverte et respiration.',
    includes: ['Vol aller-retour', 'Hébergements', 'Transferts', 'Excursions'],
    itinerary: [['Bienvenue à Bali', 'Accueil et installation dans le sud de l’île.'], ['Ubud', 'Temples, artisanat et rizières en terrasses.'], ['Bali intérieur', 'Cascades, villages et rencontres.'], ['Parenthèse balnéaire', 'Plage, détente et activités au choix.'], ['Derniers instants', 'Temps libre et transfert vers l’aéroport.']]
  },
  {
    name: 'Sénégal', slug: 'senegal', note: 'La Teranga ♡', coords: '14.72° N · 17.47° O', category: 'culture', price: 'À partir de 990 €', image: '/images/dest-senegal.jpg', secondaryImage: '/images/supporting-senegal.png', duration: 'Teranga & partage', subtitle: 'Une terre de culture et de rencontres',
    copy: 'Dakar, l’île de Gorée, le lac Rose et la Petite Côte dans un voyage chaleureux tourné vers les rencontres et le partage.',
    includes: ['Vol aller-retour', 'Hébergements', 'Transferts privés', 'Expériences'],
    itinerary: [['Dakar', 'Accueil et immersion dans la capitale.'], ['Île de Gorée', 'Mémoire, patrimoine et traversée maritime.'], ['Lac Rose', 'Paysages singuliers et savoir-faire locaux.'], ['Petite Côte', 'Villages, marchés et moments de partage.'], ['Au revoir Sénégal', 'Dernière matinée et transfert retour.']]
  },
  {
    name: 'Algarve', slug: 'algarve', note: 'Falaises dorées ♡', coords: '37.02° N · 7.94° O', category: 'soleil', price: 'À partir de 399 €', image: '/images/dest-algarve.png', secondaryImage: '/images/supporting-algarve.png', duration: 'Soleil & évasion', subtitle: 'Le Portugal côté grand large',
    copy: 'Falaises dorées, criques atlantiques et villages blancs : une semaine douce et lumineuse dans le sud du Portugal.',
    includes: ['Vol aller-retour', 'Hébergement', 'Transferts', 'Carnet de voyage'],
    itinerary: [['Arrivée en Algarve', 'Transfert et installation près de l’océan.'], ['Côte spectaculaire', 'Falaises, plages et sentiers panoramiques.'], ['Villages du sud', 'Marchés, ruelles blanches et gastronomie.'], ['Journée libre', 'Détente ou excursion selon vos envies.'], ['Retour', 'Dernier bain de lumière avant le départ.']]
  },
  {
    name: 'Grèce', slug: 'grece', note: 'Eaux turquoise ♡', coords: '37.79° N · 20.90° E', category: 'soleil', price: 'À partir de 499 €', image: '/images/dest-santorini.jpg', secondaryImage: '/images/supporting-grece.png', duration: 'Zakynthos', subtitle: 'Une semaine au bleu',
    copy: 'Criques turquoise, villages insulaires et douceur méditerranéenne dans une échappée pensée pour ralentir et respirer.',
    includes: ['Vol aller-retour', 'Hôtel', 'Transferts', 'Assistance'],
    itinerary: [['Cap sur Zakynthos', 'Arrivée, accueil et installation.'], ['Baies turquoise', 'Découverte des criques emblématiques.'], ['L’île intérieure', 'Villages, oliveraies et traditions.'], ['Mer & liberté', 'Journée au choix entre bateau et détente.'], ['Dernier horizon', 'Temps libre avant le vol retour.']]
  }
]

export const tripBySlug = slug => trips.find(trip => trip.slug === slug)

const tripDetails = {
  laponie: { idealPeriod: 'Décembre à mars', style: 'Nature & aventure', prepare: ['Vêtements grand froid', 'Chaussures adaptées', 'Assurance voyage'], alternatives: ['copenhague', 'corse'] },
  copenhague: { idealPeriod: 'Avril à octobre', style: 'Culture & art de vivre', prepare: ['Carte d’identité valide', 'Chaussures confortables', 'Réservations souhaitées'], alternatives: ['cracovie', 'algarve'] },
  cracovie: { idealPeriod: 'Avril à octobre', style: 'Culture & mémoire', prepare: ['Carte d’identité valide', 'Tenue adaptée aux visites', 'Temps de recueillement'], alternatives: ['copenhague', 'senegal'] },
  tenerife: { idealPeriod: 'Toute l’année', style: 'Soleil & grands espaces', prepare: ['Protection solaire', 'Chaussures de marche', 'Option bagage en soute'], alternatives: ['algarve', 'grece'] },
  corse: { idealPeriod: 'Mai à octobre', style: 'Road trip & nature', prepare: ['Permis de conduire', 'Chaussures de marche', 'Bagage souple'], alternatives: ['algarve', 'tenerife'] },
  bali: { idealPeriod: 'Mai à octobre', style: 'Culture & respiration', prepare: ['Passeport valide', 'Tenues légères', 'Adaptateur universel'], alternatives: ['senegal', 'grece'] },
  senegal: { idealPeriod: 'Novembre à mai', style: 'Rencontres & culture', prepare: ['Passeport valide', 'Conseils de santé voyage', 'Bagage souple'], alternatives: ['bali', 'cracovie'] },
  algarve: { idealPeriod: 'Avril à octobre', style: 'Soleil & douceur de vivre', prepare: ['Protection solaire', 'Chaussures de marche', 'Maillot de bain'], alternatives: ['tenerife', 'corse'] },
  grece: { idealPeriod: 'Mai à octobre', style: 'Île & détente', prepare: ['Protection solaire', 'Maillot de bain', 'Bagage cabine ou soute'], alternatives: ['algarve', 'bali'] }
}

export const tripDetail = trip => ({
  idealPeriod: 'Selon vos dates',
  style: 'Voyage sur mesure',
  prepare: ['Documents de voyage', 'Assurance adaptée', 'Envies à nous partager'],
  alternatives: [],
  ...tripDetails[trip.slug]
})
