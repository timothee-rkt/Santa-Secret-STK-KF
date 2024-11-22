// Liste des participants 
const participants = [
  "Miléna", "Axel", "Timothée", "Tati Fanja","Stéphane", "Rébecca", 
  "Laetitia", "Thibault", "Erwan", "Urielle", "Miary", "Mianta", "Daniel", 
  "Kevin", "Tolotra", "Nomena", "Ando", "Tonton José", "Tonton Naina", 
  "Tati Volatiana", "Tati Natacha", "MinoHasina", 
  "Asandatra", "Tiavina", "Luc", "Sarobidy"
];

// Trier les participants par ordre alphabétique
participants.sort();

// État de l'application
let assignments = JSON.parse(localStorage.getItem('assignments')) || {};
let remainingParticipants = JSON.parse(localStorage.getItem('remainingParticipants')) || [...participants];
let receivingPool = JSON.parse(localStorage.getItem('receivingPool')) || [...participants];
let completedParticipants = JSON.parse(localStorage.getItem('completedParticipants')) || [];

// Éléments DOM
const participantList = document.getElementById('participant-list');
const revealButton = document.getElementById('reveal-button');
const backButton = document.getElementById('back-button');
const resetButton = document.getElementById('reset-button');
const result = document.getElementById('result');

// Initialisation de la liste déroulante
function populateList() {
  participantList.innerHTML = '<option value="" disabled selected>Choisissez votre nom 🤔</option>';
  remainingParticipants.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    participantList.appendChild(option);
  });
}

// Tirage au sort avec vérification
function drawName(excludedName) {
  const pool = receivingPool.filter(name => name !== excludedName); // Exclure celui qui tire
  if (pool.length === 0) return null; // Si aucune personne n'est disponible
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

// Animation pour révéler le nom
function showResultWithAnimation(selectedName, assignedName) {
  result.textContent = `${selectedName}, vous offrirez un cadeau à 🤫`;
  result.classList.remove('hidden');

  let dots = "";
  const interval = setInterval(() => {
    dots = dots.length < 3 ? dots + "." : "";
    result.textContent = `${selectedName}, vous offrirez un cadeau à 🤫${dots}`;
  }, 500);

  setTimeout(() => {
    clearInterval(interval);
    result.textContent = `${selectedName}, vous offrirez un cadeau à 🎁 ${assignedName} !`;
  }, 2000);  
}

// Mettre à jour l'affichage
function updateDisplay() {
  populateList();

  if (remainingParticipants.length === 0) {
    revealButton.disabled = true;
    participantList.disabled = true;
    result.textContent = "🎉 Tous les participants ont offert et reçu un cadeau ! 🎉";
    result.classList.remove('hidden');
  }
}

// Gestion du bouton "Voir à qui offrir"
revealButton.addEventListener('click', () => {
  const selectedName = participantList.value;
  if (!selectedName) return alert("Veuillez sélectionner un nom.");

  const assignedName = drawName(selectedName);
  if (!assignedName) {
    result.textContent = "⚠️ Impossible de continuer. Réinitialisez la liste.";
    result.classList.remove('hidden');
    return;
  }

  showResultWithAnimation(selectedName, assignedName);

  // Mettre à jour les états
  assignments[selectedName] = assignedName;

  // Retirer visuellement celui qui a voté
  remainingParticipants = remainingParticipants.filter(name => name !== selectedName);

  // Retirer le destinataire de la liste des destinataires
  receivingPool = receivingPool.filter(name => name !== assignedName);

  // Sauvegarder les données
  localStorage.setItem('assignments', JSON.stringify(assignments));
  localStorage.setItem('remainingParticipants', JSON.stringify(remainingParticipants));
  localStorage.setItem('receivingPool', JSON.stringify(receivingPool));
  localStorage.setItem('completedParticipants', JSON.stringify(completedParticipants));

  // Masquer la liste après tirage
  participantList.style.display = 'none';
  revealButton.classList.add('hidden');
  backButton.classList.remove('hidden');

  updateDisplay();
});

// Gestion du bouton "Retour"
backButton.addEventListener('click', () => {
  result.textContent = "";
  result.classList.add('hidden');
  revealButton.classList.remove('hidden');
  backButton.classList.add('hidden');

  // Réafficher la liste des participants
  participantList.style.display = 'block';
});

// Gestion du bouton "Reset"
resetButton.addEventListener('click', () => {
  if (!confirm("Êtes-vous sûr de vouloir tout réinitialiser ?")) return;

  // Réinitialiser les données
  localStorage.removeItem('assignments');
  localStorage.removeItem('remainingParticipants');
  localStorage.removeItem('receivingPool');
  localStorage.removeItem('completedParticipants');
  assignments = {};
  remainingParticipants = [...participants];
  receivingPool = [...participants];
  completedParticipants = [];

  updateDisplay();
  result.textContent = "";
  result.classList.add('hidden');
  revealButton.classList.remove('hidden');
  backButton.classList.add('hidden');
  participantList.disabled = false;

  // Réafficher la liste des participants
  participantList.style.display = 'block';
});

// Initialisation
updateDisplay();
