import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "../App";
import Signin from "./Signin/Signin";
import Forgotpassword from "./Forgotpassword/Forgotpassword";
import Reset from "./Reset/Reset";
import Register from "./Register/Register";
import ChooseRole from "./ChooseRole/ChooseRole";
import RoleFan from "./RoleFan/RoleFan";
import RoleFighter from "./RoleFighter/RoleFighter";
import Main from "./Main/Main";
import Tournament from "./Tournament/Tournament";
import AllTournaments from "./AllTournaments/AllTournaments";
import Voting from "./Voting/Voting";
import ProfileUser from "./ProfileUser/ProfileUser";
import ProfileFighterAcc from "./ProfileFighterAcc/ProfileFighterAcc";
import ProfileFighter from "./ProfileFighter/ProfileFighter";
import ProfileUserAcc from "./ProfileUserAcc/ProfileUserAcc";
import StatsFighter from "./StatsFighter/StatsFighter";
import PostPage from "./PostPage/PostPage";
import Notifications from "./Notifications/Notifications";
import StatsFighterFan from "./StatsFighterFan/StatsFighterFan";
import Saerch from "./Saerch/Saerch";
import AdminPanel from "./AdminPanel/AdminPanel";
import Balance from "./Balance/Balance";
import Referal from "./Referal/Referal";
import Subscriptions from "./Subscriptions/Subscriptions";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import SubscriptionEdit from "./SubscriptionEdit/SubscriptionEdit";
import TopFighters from "./TopFighters/TopFighters";
import TopFan from "./TopFan/TopFan";
import SupportFighters from "./SupportFighters/SupportFighters";
import TopMatches from "./TopMatches/TopMatches";
import NotReg from "./NotReg/NotReg";
import TopCountries from "./TopCountries/TopCountries";
import Achievements from "./Achievements/Achievements";
import AllAchievements from "./AllAchievements/AllAchievements";
import FAQ from "./FAQ/FAQ";

const Router = () => {
  // const ProtectedSignin = () => {
  const ProtectedRoute = ({ children }) => {
    const userId = localStorage.getItem("userId");
    return userId ? children : <NotReg />;
  };
  // const userId = localStorage.getItem("userId");

  //   const userType = localStorage.getItem("userType");

  //   if (userId && userType) {
  //     return <Navigate to="/main" replace />;
  //   }

  //   return <Signin />;
  // };
  // <Route element={<ProtectedSignin />} path="" />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PostPage />} path="/post/:id" />
        <Route element={<Forgotpassword />} path="/forgotpassword" />
        <Route element={<Reset />} path="/Reset" />
        <Route element={<Register />} path="/register" />
        <Route element={<ChooseRole />} path="/chooserole" />
        <Route element={<RoleFan />} path="/rolefan" />
        <Route element={<RoleFighter />} path="/rolefighter" />
        <Route element={<Main />} path="/" />
        <Route element={<Tournament />} path="/tournament" />
        <Route element={<AllTournaments />} path="/alltournaments" />
        <Route element={<Voting />} path="/Voting" />
        {/* <Route element={<ProfileUser />} path="/profileuser" /> */}
        <Route element={<ProfileUserAcc />} path="/profileuseracc" />
        <Route element={<ProfileFighterAcc />} path="/profilefighterAcc" />
        {/* <Route
          element={userId ? <ProfileFighter /> : <NotReg />}
          path="/profilefighter"
        /> */}
        <Route
          element={
            <ProtectedRoute>
              <ProfileFighter />
            </ProtectedRoute>
          }
          path="/profilefighter"
        />
        <Route
          element={
            <ProtectedRoute>
              <ProfileUser />
            </ProtectedRoute>
          }
          path="/profileuser"
        />
        <Route element={<StatsFighter />} path="/StatsFighter" />
        <Route element={<Notifications />} path="/Notifications" />
        <Route element={<StatsFighterFan />} path="/StatsFighterFan" />
        <Route element={<Saerch />} path="/Saerch" />
        <Route element={<AdminPanel />} path="/AdminPanel" />
        <Route element={<Balance />} path="/Balance" />
        {/* <Route element={<Referal />} path="/Referal" /> */}
        {/* <Route element={userId ? <Referal /> : <NotReg />} path="/Referal" /> */}
        <Route
          element={
            <ProtectedRoute>
              <Referal />
            </ProtectedRoute>
          }
          path="/Referal"
        />
        <Route element={<Subscriptions />} path="/Subscriptions" />
        <Route element={<SubscriptionDetails />} path="/SubscriptionDetails" />
        <Route element={<SubscriptionEdit />} path="/SubscriptionEdit" />
        <Route element={<TopFighters />} path="/TopFighters" />
        <Route element={<TopFan />} path="/TopFan" />
        <Route element={<SupportFighters />} path="/SupportFighters" />
        <Route element={<TopMatches />} path="/TopMatches" />
        <Route element={<NotReg />} path="/NotReg" />
        <Route element={<TopCountries />} path="/TopCountries" />
        <Route element={<Signin />} path="/Signin" />
        <Route element={<Achievements />} path="/Achievements" />
        <Route element={<AllAchievements />} path="/AllAchievements" />
        <Route element={<FAQ />} path="/FAQ" />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
