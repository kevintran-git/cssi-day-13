let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html';
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  for (const noteItem in data) {
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note, noteItem)
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
};

const createCard = (note, noteId) => {
  return `
    <div class="column is-one-quarter">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">${note.title}</p>
        </header>
        <div class="card-content">
          <div class="content">${note.text}</div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item" onclick="deleteNote('${noteId}')">Delete</a>
          <a class="card-footer-item" onclick="editNote('${noteId}')">Edit</a>
        </footer>
      </div>
    </div>
  `;
}

const deleteNote = (noteId) => {
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
}

const editNote = (noteId) => {
  const editNoteModal = document.querySelector('#editNoteModal');
  const notesRef = firebase.database().ref(`users/${googleUserId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const noteDetails = data[noteId];
    document.querySelector('#editTitleInput').value = noteDetails.title;
    document.querySelector('#editTextInput').value = noteDetails.text;

  });
  editNoteModal.classList.toggle('is-active');
}
