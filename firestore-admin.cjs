const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

async function resetUserPassword() {
  try {
    console.log("Starting user password reset process...");

    // First, find an existing business in your database
    const businessesSnapshot = await db.collection("businesses").limit(1).get();

    if (businessesSnapshot.empty) {
      throw new Error("No businesses found in the database.");
    }

    const business = businessesSnapshot.docs[0].data();
    const businessId = businessesSnapshot.docs[0].id;
    const ownerId = business.owner_id;

    console.log(`Found business with ID: ${businessId}, owner ID: ${ownerId}`);

    // Check if user document exists in Firestore
    const userDoc = await db.collection("users").doc(ownerId).get();

    if (!userDoc.exists) {
      console.log(
        `User document with ID ${ownerId} not found in Firestore. Creating it...`
      );

      // Create user document if it doesn't exist
      await db.collection("users").doc(ownerId).set({
        email: "testuser@example.com", // Default email
        name: "Test User",
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
        last_login: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Created user document with ID: ${ownerId}`);
    }

    const userData = userDoc.exists
      ? userDoc.data()
      : { email: "testuser@example.com" };
    const userEmail = userData.email || "testuser@example.com";
    const newPassword = "Test123456"; // Simple password for testing

    // Check if user exists in Authentication
    try {
      const userRecord = await auth.getUser(ownerId);
      console.log(`User found in Authentication with ID: ${ownerId}`);

      // Update user password
      await auth.updateUser(ownerId, {
        password: newPassword,
        emailVerified: true,
      });
      console.log(`Updated user password in Authentication`);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log(`User not found in Authentication. Creating new user...`);

        // Create new user with matching UID
        await auth.createUser({
          uid: ownerId,
          email: userEmail,
          password: newPassword,
          displayName: userData.name || "Test User",
          emailVerified: true,
        });
        console.log(`Created new user in Authentication with ID: ${ownerId}`);
      } else {
        throw error;
      }
    }

    // Also check if we can find the user by email
    try {
      const userByEmail = await auth.getUserByEmail(userEmail);
      if (userByEmail.uid !== ownerId) {
        console.log(
          `WARNING: Found another user (${userByEmail.uid}) with the same email (${userEmail}).`
        );
        console.log(
          `This may cause login issues. Consider deleting this user.`
        );
      }
    } catch (error) {
      if (error.code !== "auth/user-not-found") {
        console.warn(
          "Warning when checking for duplicate emails:",
          error.message
        );
      }
    }

    return {
      userId: ownerId,
      email: userEmail,
      password: newPassword,
    };
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
}

// Run the function
resetUserPassword()
  .then((userInfo) => {
    console.log("\n----------------------------------------");
    console.log("Successfully reset user password");
    console.log("You can now log in with:");
    console.log(`Email: ${userInfo.email}`);
    console.log(`Password: ${userInfo.password}`);
    console.log(`User ID: ${userInfo.userId}`);
    console.log("----------------------------------------\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to reset user password:", error);
    process.exit(1);
  });
