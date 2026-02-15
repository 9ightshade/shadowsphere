import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // Double check this path!

// 2. Import the Page Components
import LandingPage from "./features/landing/LandingPage";
import FeedPage from "./features/feed/FeedPage";
import WalletPage from "./features/wallet/WalletPage";
import MessagesPage from "./features/messages/MessagesPage";
import FriendsPage from "./features/friends/FriendsPage";
import GiftingPage from "./features/gifting/GiftingPage";
import ProfilePage from "./features/profile/ProfilePage";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/gifts" element={<GiftingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
