// Liste des participants
const participants = [
  "Miléna", "Axel", "Timothée", "Tatie Fanja","Stéphane", "Rébecca", 
    "Laetitia", "Thibault", "Erwan", "Urielle", "Miary", "Mianta", "Daniel", 
    "Kevin", "Tolotra", "Nomena","Ando", "Tonton José", "Tonton Naina", 
    "Tatie Vola", "Tatie Natacha", "MinoHasina", 
    "Asandatra", "Tiavina", "Luc", "Sarobidy"
];

// Trier la liste des participants par ordre alphabétique
participants.sort();

// Éléments DOM
const participantList = document.getElementById('participant-list');
const revealButton = document.getElementById('reveal-button');
const backButton = document.getElementById('back-button');
const resetButton = document.getElementById('reset-button');
const result = document.getElementById('result');

// Sauvegarde et tirage
let assignments = JSON.parse(localStorage.getItem('assignments')) || {};
let remainingParticipants = JSON.parse(localStorage.getItem('remaining')) || [...participants];
let completedParticipants = JSON.parse(localStorage.getItem('completed')) || [];

// Initialisation de la liste
function populateList() {
  participantList.innerHTML = '<option value="" disabled selected>Choisissez votre nom 🤔</option>';
  remainingParticipants.forEach(name => {
      if (!completedParticipants.includes(name)) {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          participantList.appendChild(option);
      }
  });
}

// Tirage au sort avec vérification
function drawName(excludedName) {
  const pool = remainingParticipants.filter(name => name !== excludedName);
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
      result.textContent = `${selectedName}, vous offrirez un cadeau à 🎁 ${assignedName}!`;
  }, 2000);
}

// Mettre à jour l'affichage
function updateDisplay() {
  populateList();

  if (remainingParticipants.length === 0) {
      revealButton.disabled = true;
      participantList.disabled = true;
      result.textContent = "🎉 Tous les participants ont été attribués ! 🎉";
      result.classList.remove('hidden');
  }
}

// Gestion du bouton "Voir à qui offrir"
revealButton.addEventListener('click', () => {
  const selectedName = participantList.value;
  if (!selectedName) return alert("Veuillez sélectionner un nom.");

  const assignedName = drawName(selectedName);
  if (!assignedName) {
      result.textContent = "⚠️ Impossible de terminer le tirage. Réinitialisez la liste.";
      result.classList.remove('hidden');
      return;
  }

  showResultWithAnimation(selectedName, assignedName);

  // Mettre à jour les états
  assignments[selectedName] = assignedName;
  completedParticipants.push(selectedName);
  remainingParticipants = remainingParticipants.filter(name => name !== assignedName);

  // Sauvegarder les données
  localStorage.setItem('assignments', JSON.stringify(assignments));
  localStorage.setItem('remaining', JSON.stringify(remainingParticipants));
  localStorage.setItem('completed', JSON.stringify(completedParticipants));

  updateDisplay();
  revealButton.classList.add('hidden');
  backButton.classList.remove('hidden');
});

// Gestion du bouton "Retour"
backButton.addEventListener('click', () => {
  result.textContent = "";
  result.classList.add('hidden');
  revealButton.classList.remove('hidden');
  backButton.classList.add('hidden');
});

// Gestion du bouton "Reset"
resetButton.addEventListener('click', () => {
  if (!confirm("Êtes-vous sûr de vouloir tout réinitialiser ?")) return;

  // Réinitialiser les données
  localStorage.removeItem('assignments');
  localStorage.removeItem('remaining');
  localStorage.removeItem('completed');
  assignments = {};
  remainingParticipants = [...participants];
  completedParticipants = [];

  updateDisplay();
  result.textContent = "";
  result.classList.add('hidden');
  revealButton.classList.remove('hidden');
  backButton.classList.add('hidden');
  participantList.disabled = false;
});

// Initialisation
updateDisplay();
