// Importar Firebase y los módulos necesarios
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFQh6hnK5mFnoJOAISFw_KbjSuhyDrVyg",
  authDomain: "chatgtp-app-9101a.firebaseapp.com",
  projectId: "chatgtp-app-9101a",
  storageBucket: "chatgtp-app-9101a.appspot.com", // Corregido
  messagingSenderId: "798737838369",
  appId: "1:798737838369:web:103b6d1771f23a69a50e60",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Agregado
const googleProvider = new GoogleAuthProvider(); // Agregado
const db = getFirestore(app);
const storage = getStorage(app);

// Exportar autenticación y proveedor de Google
export { auth, googleProvider, db, storage };
