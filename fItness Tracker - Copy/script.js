const firebaseConfig = {
  apiKey: "AIzaSyDnInYP8MYcXrTyuNYy8tewEpN8FY3uZos",
  authDomain: "fitness-tracker-35084.firebaseapp.com",
  projectId: "fitness-tracker-35084",
  storageBucket: "fitness-tracker-35084.firebasestorage.app",
  messagingSenderId: "740416115800",
  appId: "1:740416115800:web:39cc0c6748b3102ec0a62d",
  measurementId: "G-S5T58N80QP"
};
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");s
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("tracker-section").style.display = "block";
        fetchWorkouts();
    } else {
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("tracker-section").style.display = "none";
    }
});

// Signup function
function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Signup Successful!"))
        .catch(error => alert(error.message));
}

// Login function
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error.message));
}

// Logout function
function logout() {
    auth.signOut();
}

// Log workout function
function logWorkout() {
    const user = auth.currentUser;
    if (!user) return alert("You need to log in first!");

    const exercise = document.getElementById("exercise").value;
    const duration = document.getElementById("duration").value;

    if (exercise.trim() === "" || duration.trim() === "") {
        return alert("Please enter valid workout details.");
    }

    db.collection("workouts").add({
        userId: user.uid,
        exercise,
        duration,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Workout logged!");
        document.getElementById("exercise").value = "";
        document.getElementById("duration").value = "";
        fetchWorkouts();
    }).catch(error => alert("Error logging workout: " + error.message));
}

// Fetch workout history
function fetchWorkouts() {
    const user = auth.currentUser;
    if (!user) return;

    db.collection("workouts")
        .where("userId", "==", user.uid)
        .orderBy("timestamp", "desc")
        .get()
        .then(snapshot => {
            const workoutList = document.getElementById("workout-list");
            workoutList.innerHTML = "";

            snapshot.forEach(doc => {
                const data = doc.data();
                const li = document.createElement("li");
                li.textContent = `${data.exercise} - ${data.duration} min`;
                workoutList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching workouts:", error));
}
