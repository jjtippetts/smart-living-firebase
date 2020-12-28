// Signs-in Friendly Chat.
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  //   firebase.auth().onAuthStateChanged(authStateObserver);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      loadDiets();

      // Get the signed-in user's profile pic and name.
      var profilePicUrl = getProfilePicUrl();
      var userName = getUserName();

      // Set the user's profile pic and name.
      //userPicElement.style.backgroundImage = 'url(' + profilePicUrl + ')';
      userNameElement.textContent = userName;

      // Show user's profile and sign-out button.
      userNameElement.removeAttribute('hidden');
      userPicElement.removeAttribute('hidden');
      signOutButtonElement.removeAttribute('hidden');

      // Hide sign-in button.
      signInButtonElement.setAttribute('hidden', 'true');

    } else {
      // User is signed out
      console.log("User is signed out");
      app.foundDietList = []
      app.resetDietTotals();
      app.dietPlanList.foods = []
      app.dietPlanList.dietName = ""

      // Hide user's profile and sign-out button.
      userNameElement.setAttribute('hidden', 'true');
      userPicElement.setAttribute('hidden', 'true');
      signOutButtonElement.setAttribute('hidden', 'true');

      // Show sign-in button.
      signInButtonElement.removeAttribute('hidden');
    }
  });
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return (
    firebase.auth().currentUser.photoURL || "/images/profile_placeholder.png"
  );
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns the signed-in user's email.
function getUserEmail() {
  return firebase.auth().currentUser.email;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Saves a new message on the Firebase DB.
function saveDiet(dietPlan, dietPlanID) {
  // Add a new message entry to the database.

  loadDiets()

  return firebase
    .firestore()
    .collection("diet")
    .doc(dietPlanID)
    .set({
      email: getUserEmail(),
      diet: dietPlan,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(function (error) {
      console.error("Error writing new message to database", error);
    });
}

// Loads chat messages history and listens for upcoming ones.
function loadDiets() {
  // Create the query to load the last 12 messages and listen for new ones.
  var query = firebase
    .firestore()
    .collection("diet")
    .where("email", "==", getUserEmail())
    .orderBy("timestamp", "desc")
    .limit(12);

  // Start listening to the query.
  query.get().then(function (snapshot) {
    app.foundDietList = []
    snapshot.forEach(function (doc) {
      app.foundDietList.push(doc.data().diet);
    });
  });
}

// Triggered when the send new message form is submitted.
function onDietFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (isUserSignedIn()) {
    saveDiet(app.dietPlanList, app.dietPlanID);
  } else {
    console.log("User Not Signed In");
  }
}

var dietFormElement = document.getElementById("diet-form");
dietFormElement.addEventListener("click", onDietFormSubmit);

var signInButtonElement = document.getElementById("sign-in");
var signOutButtonElement = document.getElementById("sign-out");

signOutButtonElement.addEventListener("click", signOut);
signInButtonElement.addEventListener("click", signIn);

var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');

// initialize Firebase
initFirebaseAuth();
