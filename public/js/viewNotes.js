let googleUserId;

window.onload = event => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("Signed in as " + user.displayName);
            googleUserId = user.uid;
            getNotes(googleUserId);
        } else {
            window.location = "index.html";
        }
    });
}

const getNotes = (userId) => {
    const notesRef = firebase.database().ref(`users/${userId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderDataAsHtml(data);
    });
}

const renderDataAsHtml = (data) => {
    let cards = ``;
    for (let noteItem in data) {
        const note = data[noteItem];
        console.log(note, noteItem);
        cards += createCard(note, noteItem);
    }
    document.querySelector("#app").innerHTML = cards;
}

const createCard = (note, noteId) => {
    var colors = ['has-background-primary-light',
        'has-background-link-light',
        'has-background-info-light',
        'has-background-success-light',
        'has-background-warning-light',
        'has-background-danger-light'];
    return `
    <div class="column is-one-quarter">
        <div class="card ${colors[Math.floor(Math.random() * colors.length)]}">
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

document.querySelector("#logoutButton").addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        window.location = "index.html";
    }).catch((error) => {
        alert(error);
    });
})

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
