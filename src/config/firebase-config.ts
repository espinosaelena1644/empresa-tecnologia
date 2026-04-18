// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Agregado para Firestore
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvGldYhrFkWOhujFceIiZD-VzCQTpDDIg",
  authDomain: "gestion-de-empleados-e937b.firebaseapp.com",
  databaseURL: "https://gestion-de-empleados-e937b-default-rtdb.firebaseio.com",
  projectId: "gestion-de-empleados-e937b",
  storageBucket: "gestion-de-empleados-e937b.firebasestorage.app", // <-- verificar si debería ser "...appspot.com"
  messagingSenderId: "250189072295",
  appId: "1:250189072295:web:d111a7665cb3cc4e06d882",
  measurementId: "G-HT5RWTP7W6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar y exportar Firestore y la colección que usarás
const db = getFirestore(app);
const employeesCollection = collection(db, "employees");

// Exportar para usar en el proyecto
export { app, analytics, db, employeesCollection };
