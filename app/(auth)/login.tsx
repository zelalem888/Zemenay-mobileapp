import { loginWithGoogle } from "@/firebase/auth";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { createUserProfile } from "@/firebase/firestore";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [googleError, setGoogleError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      console.log("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const result = await signInWithEmailAndPassword(auth, email, password);

      console.log("Login:", result.user);

      router.replace("/(tabs)");
    } catch (error: any) {
      setGoogleError(`${error.code}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await loginWithGoogle();

      await createUserProfile(
        result.user,
        result.user.displayName || "Google User",
      );

      console.log("Google login:", result.user);

      router.replace("/(tabs)");
    } catch (error: any) {
      const message = `${error.code}: ${error.message}`;

      console.log("Google login error:", message);
      setGoogleError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.title}>Welcome Back</Text>
      <Text style={style.subtitle}>Login to your account</Text>

      {/* Email */}
      <View style={style.field}>
        <Text style={style.labelText}>Email</Text>

        <TextInput
          style={style.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={style.field}>
        <Text style={style.labelText}>Password</Text>

        <TextInput
          style={style.input}
          keyboardType="default"
          secureTextEntry
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login button */}
      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={({ pressed }) => [
          style.loginButton,
          pressed && style.buttonPressed,
          loading && style.buttonDisabled,
        ]}
      >
        <Text style={style.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
      <Pressable
        onPress={handleGoogleLogin}
        disabled={loading}
        style={style.googleButton}
      >
        <Text style={style.googleButtonText}>Continue with Google</Text>
      </Pressable>
      <Text style={{ color: "red" }}>{googleError}</Text>
      {/* Register */}
      <View style={style.registerContainer}>
        <Text style={style.accountText}>Don't have an account?</Text>

        <Pressable onPress={() => router.push("/register")}>
          <Text style={style.registerText}> Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 25,
    paddingTop: 100,
  },

  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subtitle: {
    color: "#b8c5c9",
    fontSize: 17,
    marginBottom: 45,
  },

  field: {
    marginBottom: 22,
  },

  labelText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 15,
    fontSize: 17,
  },

  loginButton: {
    backgroundColor: "#ff8a00",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  accountText: {
    color: "#b8c5c9",
    fontSize: 16,
  },

  registerText: {
    color: "#ff8a00",
    fontSize: 16,
    fontWeight: "700",
  },
  googleButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  googleButtonText: {
    color: "#222",
    fontSize: 18,
    fontWeight: "600",
  },
});
