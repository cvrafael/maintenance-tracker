import { Routes, Route } from "react-router-dom";
// import Ads from "./pages/Ads/Ads.jsx";
// import MyAds from "./pages/MyAds/MyAds.jsx";
// import Avatar from "./components/Avatar/Avatar.jsx";
// import Profile from "./pages/Profile/Profile.jsx";
// import NewAds from "./pages/NewAds/NewAds.jsx";
import Main from "./core/MainPage.jsx";
import NotExists from "./components/NotExists/NotExists.jsx";
// import ButtonNewAds from './components/ButtonNewAds/ButtonNewAds.jsx'
// // import useAuth from "./hooks/useAuth.jsx";
// import PremiumAds from './pages/PremiumAds/PremiumAds.jsx';
// import PixMercadoPago from './components/PixMercadoPago/PixMercadoPago.jsx';
// import Administrator from './pages/Administrator/Administrator.jsx';
import TEMaintenance from './pages/TEMaintenance/Runin/index.jsx';
const App = () => {

  return (
      <Routes>
        <Route
          path="/"
          element={
            <Main />
          }
        >
          {/* <Route index element={<Ads idUser={datas?.id_sub} />} /> */}
          
          <Route path="tracker" element={<TEMaintenance />} />
          {/* <Route path="ads" element={<Ads idUser={datas?.id_sub} />} />
          <Route path="myads" element={<MyAds idUser={datas?.id_sub} />} />
          <Route path="profile" element={<Profile idUser={datas?.id_sub} />} />
          <Route path="newads" element={<NewAds idUser={datas?.id_sub} userEmail={datas?.email} />} />
          <Route path="premium" element={<PremiumAds idUser={datas?.id_sub} />} />
          <Route path="admin" element={<Administrator idUser={datas?.id_sub} userEmail={datas?.email} userFirstName={datas?.name} />} />
          <Route path="mercadopg" element={<PixMercadoPago userEmail={datas?.email} />} /> */}
          <Route path="*" element={<NotExists />} />
        </Route>
      </Routes>
  );
};

export default App