import { useAuth } from "@/context/AuthContext";
import { logout } from "@/firebase/auth";
import { getUserProfile } from "@/firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface UserProfile {
  name: string;
  email: string;
}

export default function HomeScreen() {
  const { user, loading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const result = await getUserProfile(user.uid);

        if (result) {
          setProfile(result as UserProfile);
        }
      } catch (error) {
        console.log("Profile loading error:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{profile?.name || "User"}</Text>
        </View>

        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Profile</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile?.name || "Not available"}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile?.email || user?.email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 24,
    paddingTop: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fb",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  smallText: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,

    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  infoContainer: {
    paddingVertical: 8,
  },

  label: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 5,
  },

  value: {
    fontSize: 17,
    color: "#111827",
    fontWeight: "500",
  },

  uid: {
    fontSize: 12,
    color: "#6b7280",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  dashboardCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",

    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  dashboardIcon: {
    fontSize: 32,
    marginRight: 15,
  },

  dashboardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  dashboardText: {
    color: "#6b7280",
    marginTop: 4,
  },
});
