import { useWeb3 } from "@3rdweb/hooks";
import React, { Suspense, useEffect, useState } from "react";
import { Container, Modal, Tabs } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { apiURl } from "../../store/actions";
import Tab from "react-bootstrap/Tab";
import Follower from "../Followers/Follower";
import Following from "../Followers/Following";
import FilterNft from "../All-Nfts/FilterNft";
import Nftlisting from "../All-Nfts/nftlist";
import { API } from "../../apiwrapper";
import { Pagination } from "../Pagination/Pagination";
import Activity from "./Activity";
import { SetUserData } from "../../store/reducer";
import { toast } from "react-toastify";
import ReactReadMoreReadLess from "react-read-more-read-less";

const Collections = React.lazy(() => import("./Collections"));
const Listing = React.lazy(() => import("./Listing"));

function EditProfile() {
  const { address } = useWeb3();
  const { User, authUser } = useSelector((state) => state);
  const { collected } = useParams()
  const initialState = {
    profile: collected ? "collected" : "listing",
    status: "",
    sortBy: "",
    quantity: "",
    chains: "",
    wallet_type: "",
    price: "",
    range_from: "",
    range_to: "",
    creator: "",
    page: 1,
  };
  const [filter, setFilter] = useState(initialState);
  const [data, setData] = useState({});
  const [listing, setlisting] = useState([]);
  const handleClearAll = () => {
    setFilter(initialState);
  };
  const addToUrl = (str, paramKey, paramVal) => {
    let quryString = paramVal
      ? str
        ? `${str}&${paramKey}=${paramVal}`
        : `${paramKey}=${paramVal}`
      : str;
    return quryString;
  };
  const makeSerchSting = () => {
    let {
      profile = "",
      status = "",
      sortBy = "",
      quantity = "",
      chains = "",
      wallet_type = "",
      price = "",
      range_from = "",
      range_to = "",
      creator = "",
      page = "",
      category = "",
    } = filter;
    let searchStr = "";
    searchStr = addToUrl(searchStr, "profile", profile);
    searchStr = addToUrl(searchStr, "status", status);
    searchStr = addToUrl(searchStr, "sortBy", sortBy);
    searchStr = addToUrl(searchStr, "quantity", quantity);
    searchStr = addToUrl(searchStr, "chains", chains);
    searchStr = addToUrl(searchStr, "wallet_type", wallet_type);
    searchStr = addToUrl(searchStr, "price", price);
    searchStr = addToUrl(searchStr, "range_from", range_from);
    searchStr = addToUrl(searchStr, "range_to", range_to);
    searchStr = addToUrl(searchStr, "creator", creator);
    searchStr = addToUrl(searchStr, "page", page);
    searchStr = addToUrl(searchStr, "category", category);
    return searchStr;
  };
  const getUrl = () => {
    let searchString = makeSerchSting();
    console.log(filter?.profile, "activity");
    let url =
      filter?.profile === "activity"
        ? `${apiURl.activity}/${authUser?.loginUserData?._id}`
        : searchString
          ? `${apiURl.userprofilefilter}/${authUser?.loginUserData?._id}?${searchString}`
          : `${apiURl.userprofilefilter}/${authUser?.loginUserData?._id}`;
    navigate({
      pathname: "/profile",
      profile: `?${searchString}`,
    });
    return url;
  };
  console.log(authUser, "User");
  const fetchUserData = async () => {
    try {
      await API({
        url: `${apiURl.GetUsers}/${authUser?.loginUserData?._id}`,
        method: "GET",
      }).then((values) => {
        dispatch(SetUserData(values?.userData));
      });
    } catch (error) {
      toast(`Something Wrong`, { type: "error" });
      console.log(error);
    }
  };
  const fetchNFTList = async () => {
    const URL = getUrl();
    try {
      await API({ url: URL, method: "GET" }).then((data) => {
        setlisting(data?.data?.allNft || []);
        setData(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const {
    firstName = false,
    lastName = false,
    image = null,
    _id = false,
    address: walletList = [],
    coverimage = null,
    type = false,
    Personal_url = false,
    Telegram_link = false,
    Twitter_link = false,
    facebook_link = false,
    Youtube_link = false,
    Totalfollower = false,
    Totalfollowing = false,
    Followers = [],
    Followings = [],
    Bio = ""
  } = authUser?.loginUserData;
  console.log(authUser?.loginUserData);
  // const { Totalfollower = false, Totalfollowing = false } = useSelector(
  //   (state) => state.authUser?.loginUserData
  // );
  console.log(filter, User, "User");
  const { walletAddress = "" } = useSelector((state) => state.User?.xumm);
  const [showMore, setShowMore] = useState(false);
  const [show, setShow] = useState(false);
  const [key, setKey] = useState("followers");

  const handleClose = () => setShow(false);
  const handleShow = (key) => {
    setKey(key);
    setShow(true);
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleEditProfile = (e) => {
    e.preventDefault();
    navigate(`/profile/edit/${authUser?.loginUserData?._id}`);
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    fetchNFTList();
  }, [filter]);
  return (
    <div>
      <header
        style={{
          margin: "0 auto",
          backgroundColor: "#fff",
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginBottom: 50,
        }}
      />
      <section>
        <div className="container profile-set">
          <div className="row">
            <div className="col-sm-12">
              <div
                className="profile-header" >
                <img
                  src={
                    coverimage
                      ? process.env.REACT_APP_BACKENDURL + "/" + coverimage
                      : "images/profile-header-img.png"
                  }
                  alt=""
                />

                <div className="media-icon">
                  <ul>
                    {facebook_link ? (
                      <li>
                        <a href={facebook_link} target="blank">
                          <img src="/images/fb.svg" alt="" />{" "}
                        </a>
                      </li>
                    ) : null}
                    {Twitter_link ? (
                      <li>
                        <a href={Twitter_link} target="blank">
                          <img src="/images/tw.svg" alt="" />{" "}
                        </a>
                      </li>
                    ) : null}
                    {Personal_url ? (
                      <li>
                        <a href={Personal_url} target="blank">
                          <img src="/images/insta.svg" alt="" />{" "}
                        </a>
                      </li>
                    ) : null}
                    {Youtube_link ? (
                      <li>
                        <a href={Youtube_link} target="blank">
                          <img src="/images/yub.svg" alt="" />{" "}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-6">
              <div className="profile-pic">
                <img
                  src={
                    image
                      ? process.env.REACT_APP_BACKENDURL + "/" + image
                      : "/images/user-icon.svg"
                  }
                  alt=""
                />
              </div>
              <div className="profile-text">
                <p>
                  {" "}
                  {firstName
                    ? firstName
                    : ''}
                  {" "}
                  {lastName
                    ? lastName
                    : ''}
                </p>

                {walletList.map(
                  (ele) => <>
                    <p>
                      {" "}
                      {ele.walletAddress.slice(0, 4) +
                        "...." +
                        ele.walletAddress.slice(-4)
                      }
                    </p>
                    <img src="" alt="" />
                  </>
                )}
              </div>
            </div>
            <div className="col-sm-6 col-md-6 follow-div-web ">
              <p class="follow-text">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShow("followers")}
                >
                  Followers ({Followers?.length})
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShow("following")}
                >
                  Following ({Followings?.length})
                </span>
              </p>
              <button className="profile-button" onClick={handleEditProfile}>
                {" "}
                Edit Profile
              </button>
            </div>
            {Bio && (
              <div className="about-user-text">
                <ReactReadMoreReadLess
                  charLimit={200}
                  readMoreText={"Show more"}
                  readLessText={"Show less"}
                  readMoreClassName="read-more-less--more"
                  readLessClassName="read-more-less--less"

                >
                  {Bio || ""}
                </ReactReadMoreReadLess>
              </div>
            )}

          </div>

          <div className="row follow-div-mob">
            <div className="col-sm-6 col-md-6">
              <p className="follow-text">

                <Modal show={show} onHide={handleClose} className="notice">
                  <Modal.Header closeButton className="close-button"></Modal.Header>
                  <Modal.Body>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                      className="mb-2 tab-wrap"
                    >
                      <Tab eventKey="followers" className="tab" title="Followers">
                        <Follower />
                      </Tab>
                      <Tab eventKey="following" className="tab" title="Following">
                        <div className="tab__content">
                          <Following />
                        </div>
                      </Tab>
                    </Tabs>
                  </Modal.Body>
                </Modal>
              </p>
            </div>
            <div className="col-sm-6 col-md-6">
              <div className="save-button">
                {" "}
                <a href="#" onClick={handleEditProfile}>
                  Edit Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="my-4">
        <Container>
          <Row className="mt-5">
            <div class="tabs-ver">
              <input
                type="radio"
                name="profile"
                id="Listings"
                value={"listing"}
                checked={filter?.profile === "listing"}
                onChange={(e) =>
                  setFilter({ ...filter, profile: e.target.value })
                }
              />
              <label htmlFor="Listings">Listings</label>
              {/* <input
                type="radio"
                name="profile"
                id="Created"
                value={"created"}
                checked={filter?.profile === "created"}
                onChange={(e) =>
                  setFilter({ ...filter, profile: e.target.value })
                }
              />
              <label htmlFor="Created">Created</label> */}
              <input
                type="radio"
                name="profile"
                id="Collected"
                value={"collected"}
                onChange={(e) =>
                  setFilter({ ...filter, profile: e.target.value })
                }
                checked={filter?.profile === "collected"}
              />
              <label htmlFor="Collected">Collected</label>
              {/* <input
                type="radio"
                name="profile"
                id="Collections"
                checked={filter?.profile === "collection"}
                value={"collection"}
                onChange={(e) =>
                  setFilter({ ...filter, profile: e.target.value })
                }
              />
              <label htmlFor="Collections">Collections</label> */}
              <input
                type="radio"
                name="profile"
                id="Favorites"
                checked={filter?.profile === "favourite"}
                value={"favourite"}
                onChange={(e) =>
                  setFilter({ ...filter, profile: e.target.value })
                }
              />
              <label htmlFor="Favorites">Favorites</label>
              {/* <input type="radio" name="profile" id="Import NFTs" />
              <label htmlFor="Import NFTs">Import NFTs</label> */}
              <input
                type="radio"
                name="profile"
                id="Activity"
                checked={filter?.profile === "activity"}
                value={"activity"}
                onChange={(e) =>
                  setFilter({ ...filter, profile: e.target.value })
                }
              />
              <label htmlFor="Activity">Activity</label>
            </div>
            <div className="square">
              <Col sm={12}>
                <Suspense fallback={<div>Loading...</div>}>
                  <div className="row mt-3">
                    {filter?.profile === "activity" ? (
                      <Activity activityData={data?.data} />
                    ) : (
                      <>
                        <div className="col-md-3">
                          <div className="left-side">
                            <FilterNft
                              filter={filter}
                              setFilter={setFilter}
                              ClearAll={handleClearAll}
                            />
                          </div>
                        </div>
                        <Nftlisting nft={listing} />
                        {listing?.length > 0 && (
                          <Pagination
                            totalPages={Math.ceil(
                              data?.totalCount / data?.limit
                            )}
                            setData={(e) => {
                              setFilter({ ...filter, page: e.selected + 1 });
                            }}
                            pageNo={filter.page}
                          />
                        )}
                      </>
                    )}
                  </div>
                </Suspense>
              </Col>
            </div>
          </Row>
        </Container>

        <Modal show={show} onHide={handleClose} size="sm fllowPoup">
          <div className="pop_content">
            <div className="close-button">
              <a href="#" onClick={handleClose}>
                <img className="filterNone" src="/images/cross-button.svg" />
              </a>
            </div>
            {/* <Modal.Header closeButton></Modal.Header> */}

            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-2 followTab"
            >
              <Tab eventKey="followers" title="Followers">
                <Follower />
              </Tab>
              <Tab eventKey="following" title="Following">
                <Following />
              </Tab>
            </Tabs>
          </div>
        </Modal>

      </section>
    </div>
  );
}

export default EditProfile;