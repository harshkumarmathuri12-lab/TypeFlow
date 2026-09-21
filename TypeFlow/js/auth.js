const loginBtn = document.getElementById("loginBtn");

auth.onAuthStateChanged((user) => {

  if (user) {

    loginBtn.textContent = user.displayName;

  } else {

    loginBtn.textContent = "Login";

  }

});

loginBtn.addEventListener("click", async () => {

  if (auth.currentUser) {

    await auth.signOut();

    return;

  }

  const provider = new firebase.auth.GoogleAuthProvider();

  await auth.signInWithPopup(provider);

});