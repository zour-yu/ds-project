import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getIdTokenResult
} from "firebase/auth";
import axios from "axios";
import { auth } from "../../config/firebase";

const AUTH_API = import.meta.env.VITE_AUTH_API + "/auth";

/**
 * Register a new user:
 * 1. Create in Firebase
 * 2. Send Firebase details to Backend to sync with MongoDB and set Custom Claims
 */
export const register = async (email, password, name, role = "patient", extraData = {}) => {
  try {
    // 1. Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    // 2. MongoDB Sync & Custom Claims
    const response = await axios.post(`${AUTH_API}/register`, {
      email,
      name,
      role,
      ...extraData
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 3. Force token refresh to include new custom claims
    await user.getIdToken(true);

    return { user, data: response.data };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check role from token claims
    const tokenResult = await getIdTokenResult(user);
    const role = tokenResult.claims.role;

    return { user, role };
  } catch (error) {
    throw error.message;
  }
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const tokenResult = await getIdTokenResult(user);
      callback({ user, role: tokenResult.claims.role });
    } else {
      callback(null);
    }
  });
};