import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { allChainsIDS } from "../../store/actions/extra-function";

const Card = ({
  name = "",
  image,
  launch_details: { price } = {},
  likes_count,
  Category,
  Description,
  _id,
  wallet_type = "ETH",
  cover_image,
  cretor_wallet_address,
  mediaType,
  total: { minted } = {},
  collection_type,
  Owner_id,
  launch_details: { sale_type } = {},
  chain_id
}) => {
  const [NNetwokType, setNNetwokType] = useState(false);
  const { loginUserData = {} } = useSelector((state) => state.authUser);

  useEffect(() => {
    const NetworkName = Object.entries(allChainsIDS).find(
      (item) => chain_id == item[1]
    );
    setNNetwokType(NetworkName || false);
  }, [chain_id]);

  return (
    <div className="nft-box">
      <div className="nft-box-img-box">
        {/* <img
            src={`${process.env.REACT_APP_BACKENDURL}/${coverImage || image}`}
            alt="crosstower"
            loading="lazy"
            style={{ maxHeight: "180px", minHeight: "180px" }}
          /> */}
        <img
          src={cover_image}
          alt=""
        />
        <div className="nft-box-div">
          <div className="like-icon">
            {collection_type ? null : <> {minted}x</>}
            <img
              src={`/images/${mediaType == "video"
                ? "video"
                : mediaType == "audio"
                  ? "music"
                  : "image"
                }-icon.svg`}
              alt=""
            />
          </div>
          <p>
            {name.length < 20 ? name : name.substr(0, 14) + "...."}
          </p>
          <span>
            {cretor_wallet_address &&
              cretor_wallet_address?.substr(0, 4) +
              "...." +
              cretor_wallet_address?.substr(-4)}
          </span>
          <div className="boder-bottom"></div>
        </div>
      </div>
      <div className="price-div">
        <div className="price-sub">
          <div className="eth-icon-div">
            <img
              src={`/images/${NNetwokType[0] == "XUMM" ? "xrp" : "cart-eth"}-icon.svg`}
              alt=""
            />
          </div>
          {sale_type === "AUCTION" ? (
            <>
              <p>Highest Bid</p>
              <span></span>
            </>
          ) : (
            <>
              <p>Price</p>
              <span>
                {price || 0}{" "}
                {NNetwokType[0] == "XUMM" ? "XRP" : "ETH"}
              </span>
            </>
          )}
        </div>
        <div className="price-sub  price-sub-space">
          <Link to={`/collections/${_id}`}>
            {Owner_id && Owner_id?._id == loginUserData?.id
              ? "View"
              : sale_type === "AUCTION"
                ? "Bid"
                : "Buy"}
          </Link>
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
    </div>
  );
};

export default Card;
