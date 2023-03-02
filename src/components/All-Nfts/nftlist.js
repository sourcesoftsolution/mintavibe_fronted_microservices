import React from "react";
import Card from "../NftCard/card";

export default function Nftlisting({ nft, ...props }) {
  return (
    <>
      <div className="col-md-8 col-xl-9" style={{ marginTop: "30px" }}>
        <div className="row g-1 g-md-2 g-xl-3">
          {nft.length > 0 &&
            nft.map((item, index) => (
              <div className="col-6 col-md-6 col-xl-4">
                {" "}
                <Card image={"/images/Art1.jpg"} {...item} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
