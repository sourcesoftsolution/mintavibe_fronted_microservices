import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allApi, API } from "../apiwrapper";
import Nfts from "../components/All-Nfts/all-nfts";
import FilterNft from "../components/All-Nfts/FilterNft";
import Nftlisting from "../components/All-Nfts/nftlist";
import { Pagination } from "../components/Pagination/Pagination";
import { apiURl } from "../store/actions";
import { SetSliderData } from "../store/reducer";

export default function Nftlist() {
  const [listing, setlisting] = useState([]);
  const { Slider } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialState = {
    search: Slider?.serachNft ? Slider?.serachNft : "",
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
    category: "",
  };
  const [filter, setFilter] = useState(initialState);
  const [data, setData] = useState({});
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
      search = "",
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
    searchStr = addToUrl(searchStr, "search", search);
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

    let url = searchString
      ? `${apiURl.GetCollections}?${searchString}`
      : `${apiURl.Products}`;

    navigate({
      pathname: "/nftlist",
      search: `?${searchString}`,
    });

    return url;
  };
  const fetchNFTList = async () => {
    const URL = getUrl();
    try {

      allApi({
        url: `${process.env.REACT_APP_BACKENDURL}${URL}`, method: "GET", headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_BACKEND_AUTHRIZATION_TOKEN}`
        }
      }).then((data) => data?.response?.data || {}).then((data) => {
        setlisting(data?.message || []);
        setData(data);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNFTList();
    return () => {
      dispatch(SetSliderData("", "serachNft"));
      console.log("", "serachNft");
    };
  }, [filter]);
  return (
    <>
      <section className="search-section-new">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              {/* <select id="Categories" name="Categories">
                <option value="all_nfts">All NFTs</option>
                <option value="By_BIPOC_Creators">
                  <a href="/bipoc">By BIPOC Creators</a>
                </option>
                <option value="By_Female_Creators">
                  <a href="/femalecreator">By Female Creators</a>
                </option>
                <option value="By_LGBTQIA_creators">
                  <a href="/lgbtq">By LGBTQIA+ creators</a>
                </option>
                <option valuse="Artist">
                  <a href="/artist">Artist</a>
                </option>
                <option value="Curated from All">
                  <a href="/CuratedNft">Curated from All</a>
                </option>
              </select>*/}
            </div>
            <div className="col-md-9">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control input-text"
                  placeholder="Search for Categories , Artist"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  name="search"
                  value={filter?.search}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                />
                <div className="input-group-append">
                  <button
                    className="btn-lg"
                    type="button"
                    onClick={filter.search && fetchNFTList}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-lg">
        <div className="row">
          <div className="col-md-4 col-xl-3">
            <div className="left-side">
              {/* <Nfts /> */}
              <FilterNft
                filter={filter}
                setFilter={setFilter}
                ClearAll={handleClearAll}
              />
            </div>
          </div>
          <Nftlisting nft={listing} />
          {listing?.length > 0 && (
            <div className="d-flex justify-content-end w-100 my-lg-5">
              <div className="col-12 col-md-9 d-flex justify-content-center">
                <Pagination
                  totalPages={Math.ceil(data?.totalCount / data?.limit)}
                  setData={(e) => {
                    setFilter({ ...filter, page: e.selected + 1 });
                  }}
                  pageNo={filter.page}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
