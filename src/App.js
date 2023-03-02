import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/layout";
import io from "socket.io-client";
import Home from "./pages/home";
import AboutUs from "./pages/about-us";
import Faq from "./pages/faq";
import Artist from "./pages/collect-artist";
import FormPage from "./components/CreateScreen/FormPage";
import Nftlist from "./pages/all-nft";
import { toast, ToastContainer } from "react-toastify";
import TermsOfService from "./components/TermsOfServices/TermsOfService";
import EditProfile from "./components/EditProfile/EditProfile";
import { useWeb3 } from "@3rdweb/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { API } from "./apiwrapper";
import { apiURl } from "./store/actions";
import { SetSliderData, SetSocketData, SetUserData } from "./store/reducer";
import ProfileSetting from "./components/ProfileSetting/ProfileSetting";
import PrivacyPolicy from "./pages/privacy-policy";
import NftDetails from "./components/Profile/nft-details";
import LoaderComponent from "./components/LoaderComponent";
import Nftforall from "./components/NftForAll/Nftforall.js";
import ContactUs from "./components/ContactUs/ContactUs";
import "./App.css";
import "./responsive.css";
import BlogPage from "./pages/BlogPage";
import BlogDetails from "./pages/BlogDetails";
import Celebrity from "./components/Celebrity/Celebrity";
import UserProfile from "./components/UserProfile";

const socket = false
// io.connect(process.env.REACT_APP_BACKENDURL);

function App() {
  const { address, provider } = useWeb3();

  const { loginUserData = null } = useSelector((state) => state.authUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      dispatch(SetSocketData(socket));
      socket.volatile.on("error", (error) => console.log(error));
    }
  }, [dispatch]);

  useEffect(() => {
    if (address && loginUserData?._id) {
      (async () => {
        try {
          await API({
            url: `${apiURl.userData}/${loginUserData?._id}`,
            method: "PUT",
            body: { address },
            formData: false,
          }).then((data) => {
            dispatch(
              SetUserData({
                ...data.result,
                signer: provider.getSigner(),
                type: "METAMASK",
              })
            );
            // toast(`Wallet Connected`, { type: "success" });
          });
        } catch (error) {
          console.log(error);
          toast(`Something Wrong.`, { type: "error" });
        }
      })();
    } else {
      if (!address) {
        // dispatch(SetUserData({}))
      }
    }
  }, [loginUserData, address, dispatch, provider]);

  const fetchNormalData = () => {
    Promise.all([
      API({ method: "GET", url: apiURl.CuratedNft }),
      API({ method: "GET", url: apiURl.TrendingNft }),
      loginUserData?.id &&
      API({
        method: "GET",
        url: `${apiURl.GetCategory}/${loginUserData?.id}`,
      }),
      API({ method: "GET", url: apiURl.CreatorList + "?sex=F" }),
      API({ method: "GET", url: apiURl.CreatorList + "?sex=other" }),
      API({ method: "GET", url: apiURl.GetCreatorCategory }),
      API({ method: "GET", url: apiURl.CreatorList + "?sex=other" }),
    ])
      .then((values) => {
        console.log(values, "vl");
        try {
          const [
            CuratedNft,
            TrendingNft,
            Category,
            femalecreator,
            lgbtq,
            GetCreatorCategory,
            bipoc,
          ] = values;
          dispatch(
            SetSliderData(TrendingNft?.data?.allfavNft || [], "TrendingNft")
          );
          dispatch(
            SetSliderData(
              Array.isArray(CuratedNft) ? CuratedNft : [],
              "CuratedNft"
            )
          );
          dispatch(
            SetSliderData(Category?.data?.allCategory || [], "Category")
          );
          dispatch(
            SetSliderData(
              femalecreator?.data?.nftCreator || [],
              "femalecreator"
            )
          );
          dispatch(SetSliderData(bipoc?.data?.nftCreator || [], "bipoc"));
          dispatch(SetSliderData(lgbtq?.data?.nftCreator || [], "lgbtq"));
          dispatch(
            SetSliderData(
              GetCreatorCategory?.data?.allCategory || [],
              "CreatorCategory"
            )
          );
        } catch (error) {
          throw Error(error);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchNormalData();
  }, []);

  return (
    <BrowserRouter>
      <LoaderComponent />
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/:Creatorname/:Slug" element={<Celebrity />} />
          <Route path="/about" element={<AboutUs />} />
          {/* <Route path="/blogs" element={<Blogs />} /> */}
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          <Route path="/faq" element={<Faq />} />
          <Route path="/artist" element={<Artist />} />
          <Route path="/nftlist" element={<Nftlist />} />
          <Route path="/nftforall" element={<Nftforall />} />
          <Route path="/terms-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/collections/:id" element={<NftDetails />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/create/:title" element={<FormPage />} />

          {loginUserData?._id ? (
            <>
              <Route path="/profile" element={<EditProfile />} />

              <Route path="/profile/:collected" element={<EditProfile />} />


              <Route
                path="/profile/edit/:userId"
                element={<ProfileSetting />}
              />
            </>
          ) : null}

          <Route path="/Users/:id" element={<UserProfile />} />
          <Route path="*" element={<Navigate to={`/`} replace={true} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
