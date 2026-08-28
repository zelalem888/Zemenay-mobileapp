import { useAuth } from "@/context/AuthContext";
import { getUserReceipts } from "@/firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface Receipt {
  id: string;
  userId: string;
  storeName: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  imageUrl?: string | null;
  createdAt?: any;
}

export default function ReceiptsScreen() {
  const { user } = useAuth();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReceipts = async () => {
    if (!user) {
      setReceipts([]);
      setLoading(false);
      return;
    }

    try {
      setError("");

      const data = await getUserReceipts(user.uid);

      setReceipts(data as Receipt[]);
    } catch (error: any) {
      console.error("Error loading receipts:", error);

      setError(error.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, [user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadReceipts();

    setRefreshing(false);
  }, [user]);

  const renderReceipt = ({ item }: { item: Receipt }) => {
    return (
      <View style={styles.receiptCard}>
        <View style={styles.receiptTop}>
          <View style={styles.storeContainer}>
            <Text style={styles.receiptIcon}>🧾</Text>

            <View style={styles.storeInfo}>
              <Text style={styles.storeName} numberOfLines={1}>
                {item.storeName}
              </Text>

              <Text style={styles.receiptDate}>{item.date}</Text>
            </View>
          </View>

          <Text style={styles.amount}>ETB {item.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.receiptBottom}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>

          {item.notes ? (
            <Text style={styles.notes} numberOfLines={1}>
              {item.notes}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}>My Receipts</Text>

          <Text style={styles.subtitle}>Keep track of your expenses</Text>
        </View>

        {receipts.length > 0 && (
          <Text style={styles.sectionTitle}>Previous Receipts</Text>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1D3D47" />

        <Text style={styles.loadingText}>Loading receipts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorTitle}>Something went wrong</Text>

        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={renderReceipt}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🧾</Text>

            <Text style={styles.emptyTitle}>No receipts yet</Text>

            <Text style={styles.emptyText}>
              Add your first receipt to start tracking your expenses.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1D3D47"
          />
        }
        contentContainerStyle={[
          styles.listContent,
          receipts.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Main screen background
  screen: {
    flex: 1,
    backgroundColor: "#F5F7F8",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 30,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  // Header
  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1D3D47",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7C82",
    marginTop: 5,
  },

  // Section
  sectionTitle: {
    color: "#1D3D47",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  // Receipt card
  receiptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,

    elevation: 2,
  },

  receiptTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  storeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  receiptIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  storeInfo: {
    flex: 1,
  },

  storeName: {
    color: "#1D3D47",
    fontSize: 17,
    fontWeight: "700",
  },

  receiptDate: {
    color: "#7B898E",
    fontSize: 13,
    marginTop: 4,
  },

  amount: {
    color: "#1D3D47",
    fontSize: 16,
    fontWeight: "700",
  },

  receiptBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  categoryBadge: {
    backgroundColor: "#EEF3F4",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  categoryText: {
    color: "#1D3D47",
    fontSize: 12,
    fontWeight: "600",
  },

  notes: {
    color: "#7B898E",
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
  },

  // Empty state
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    flex: 1,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1D3D47",
  },

  emptyText: {
    textAlign: "center",
    color: "#718087",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  // Loading/error
  centerContainer: {
    flex: 1,
    backgroundColor: "#F5F7F8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    color: "#6B7C82",
    fontSize: 15,
    marginTop: 12,
  },

  errorIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  errorTitle: {
    color: "#1D3D47",
    fontSize: 21,
    fontWeight: "700",
  },

  errorText: {
    color: "#718087",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
  },
});
