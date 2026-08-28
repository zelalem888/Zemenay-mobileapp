import { auth } from "@/firebase/config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signOut,
    User,
} from "firebase/auth";
interface RegisterUserProps {
  email: string;
  password: string;
}

async function registerUser({ email, password }: RegisterUserProps) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

function listenToAuthState(callBack: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user: User | null) => {
    callBack(user);
  });
}

async function logout() {
  await signOut(auth);
}
GoogleSignin.configure({
  webClientId:
    "249467386673-7469l497l6v6p7fgbubhqd35daol4vgn.apps.googleusercontent.com",
});
async function loginWithGoogle() {
  await GoogleSignin.hasPlayServices();

  const response = await GoogleSignin.signIn();

  const idToken = response.data?.idToken;

  if (!idToken) {
    throw new Error("No Google ID token");
  }

  const credential = GoogleAuthProvider.credential(idToken);

  return await signInWithCredential(auth, credential);
}
export { listenToAuthState, loginWithGoogle, logout, registerUser };
