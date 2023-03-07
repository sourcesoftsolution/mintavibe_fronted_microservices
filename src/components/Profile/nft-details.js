import { useWeb3 } from "@3rdweb/hooks";
import React, { useDebugValue, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../apiwrapper";
import { apiURl } from "../../store/actions";
import { NotificationMsg } from "../../store/actions/api-url";
import {
  SetBurnData,
  SetBuyData,
  SetFollowrData,
  SetloaderData,
  SetpopupReducerData,
} from "../../store/reducer";
import XummBuy from "../PopUp/xumm-buy";
import ReactReadMoreReadLess from "react-read-more-read-less";
import Bids from "./Bids";
import Details from "./Details";
import History from "./History";
import Properties from "./Properties";
import Dropdown from "react-bootstrap/Dropdown";
import { useCountdown } from "../../Hooks/useCountdown";

import Follow from "../PopUp/Follow";
import Checkout from "../PopUp/checkout";
import {
  allChainsIDS,
  converToWeth,
  CopyText,
  fetchContract,
  FiatbuyAsset,
  gasPrice,
  getContractSignNonce,
  gup,
  HistoryApi,
  MultiBuyXRP,
  offerSign,
  placeBid,
  splitSign,
  submitTranscation,
} from "../../store/actions/extra-function";
import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";
import Listing from "./Listing";
import { BASECONFIG } from "../../config";
import {
  mulBy,
  multipliedBy,
  percentageOf,
  plusNum,
  roundNumber,
  stringify,
  toNum,
} from "../../store/actions/common-functions";
import CountdownTimer from "../../pages/CountdownTimer";
import OwnerList from "../PopUp/OwnerList";
import ImageZoom from "../PopUp/ImageZoom";
import BurnTokenPopup from "../PopUp/BurnTokenPopup";
import OpenModal from "../Navbar/OpenModal";

function NftDetails() {
  const { id } = useParams();

  const [CollectionDetails, setCollectionDetails] = useState({});
  const [startIn, setStartIn] = useState(1);
  const [endIn, setEndIn] = useState(1);
  const [loaderOffer, setloaderOffer] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { address, activeProvider, chainId, balance, provider } = useWeb3();
  const { stripe } = useSelector((state) => state.Buy.data);
  const [ownerData, setOwnerData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [HistoryData, setHistoryData] = useState([]);

  const { _id = "", type, signer } = useSelector((state) => state?.User?.data);

  const { loginUserData = {} } = useSelector((state) => state.authUser);
  const { id: User_id = false } = loginUserData;

  const { walletAddress = false, userToken = false } = useSelector(
    (state) => state.User.xumm
  );

  const [expandUrl, setExpandUrl] = useState("");
  const [expandImage, setExpandImage] = useState(false);

  const [NetworkName, setNetworkName] = useState(false);

  const [showOwner, setShowOwner] = useState(false);
  const [show, setShow] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [qty, setqty] = useState(1);

  const [Offershow, setOffershow] = useState(false);

  const [burnPopUP, setburnPopUP] = useState(false);

  const [offerValue, setofferValue] = useState("");

  const [offerQtyValue, setOfferQtyValue] = useState(1);

  const [BurnValue, setBurnValue] = useState(1);

  const [offerPopSign, setofferPopSign] = useState(false);

  const [selectCopies, setSelectCopies] = useState(1);

  const [BlanceXumm, setBlanceXumm] = useState(0);

  // const { socket } = useSelector((state) => state.Socket);

  const handleClose = () => setShow(false);

  const handleOfferClose = () => setOffershow(false);

  const handleOfferPopSignClose = () => setofferPopSign(false);

  const handleOfferShow = () => {
    setOffershow(true);
  };
  const handleShow = () => {
    setShow(true);
  };

  const FetchHistoryData = async () => {
    await API({ url: `${apiURl.History}/${id}`, method: "GET" }).then(
      (data) => {
        setHistoryData(data.response);
      }
    );
  };

  const fetchOwners = async () => {
    try {
      await API({
        url: `${apiURl.allowners}/${id}`,
        method: "GET",
      }).then((data) => {
        if (data?.status || data?.status === "true") {
          setOwnerData(data?.response?.data || []);
        } else {
          setOwnerData([]);
        }
        console.log("fetchOwners data", data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const token = gup("token");
  const session = gup("session");
  const Type = gup("type");

  const FetchData = async () => {
    const result = await API({ url: `${apiURl.Nft}/${id}`, method: "GET" }).then((data) => {
      return data.response.data.message;
    }).catch((err) => {
      console.log(err);
      return {};
    });
    setCollectionDetails(result);
  };

  useEffect(() => {
    FetchData();
    // FetchHistoryData();
    // fetchOwners();
  }, [id]);

  useEffect(() => {
    const NetworkName = Object.entries(allChainsIDS).find(
      (item) => CollectionDetails?.chain_id === item[1]
    );
    setNetworkName(NetworkName || false);
  }, [CollectionDetails]);

  // useEffect(() => {
  //   if (socket) {
  //     if (NetworkName[0] == "XUMM") {
  //       socket.emit("xumm-wallet", walletAddress, setBlanceXumm);
  //       return () => {
  //         socket.removeAllListeners("xumm-wallet");
  //       };
  //     }
  //   }
  // });

  console.log('newNFT', CollectionDetails, id);

  const buyHnadleChange = (e) => {
    e.preventDefault();

    if (!User_id) {
      // toast(NotificationMsg.NotConnect, { type: "error", toastId: "--85214" });
      handleShowLogin();
      return;
    }
    if (!address && !User_id) {
      toast(NotificationMsg.NotConnect, { type: "error" });
      return;
    }
    if (!address && NetworkName[0] !== "XUMM") {
      toast(NotificationMsg.NotConnect, { type: "error" });
      return;
    }
    if (Array.isArray(NetworkName)) {
      if (NetworkName[0] == "XUMM") {
      } else {
        if (chainId != NetworkName[1]) {
          activeProvider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + NetworkName[1].toString(16) }],
          });
          return;
        }
      }
    }

    if (NetworkName[0] == "XUMM") {
      if (address) {
        toast(NotificationMsg.changeWallet.replace("%s", "XUMM"), {
          type: "info",
        });
        return;
      }
    } else {
      if (walletAddress) {
        toast(NotificationMsg.changeWallet.replace("%s", "METAMASK"), {
          type: "info",
        });
        return;
      }
    }

    dispatch(
      SetBuyData({
        modal: true,
        checkout: false,
        buyModal: !CollectionDetails.is_fiat,
      })
    );
    // if (type == "METAMASK") {
    // } else {
    //   dispatch(
    //     SetBuyData({
    //       modal: true,
    //       checkout: false,
    //       buyModal: !CollectionDetails.is_fiat,
    //     })
    //   );
    // }
  };

  const redirectSocialTab = (e, type) => {
    e.preventDefault();
    switch (type) {
      case "FB":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${window.location.href
          }&caption=${CollectionDetails?.name || ""}`,
          "_blank"
        );
        return;
      case "TW":
        window.open(
          `https://twitter.com/share?url=${window.location.href}&text=${CollectionDetails?.name || ""
          }`,
          "_blank"
        );
        return;
      case "TEL":
        window.open(
          `https://telegram.me/share/url?url=${window.location.href}&text=${CollectionDetails?.name || ""
          }`,
          "_blank"
        );
        return;
      case "WA":
        window.open(
          `https://api.whatsapp.com/send?text=${window.location.href}`,
          "_blank"
        );
        return;
      default:
        return;
    }
  };

  const BurnNftCall = async (e) => {
    e.preventDefault();

    if (!User_id) {
      toast(NotificationMsg.NotConnect, { type: "error", toastId: "0--85214" });
      return;
    }

    if (!address && !type) {
      toast(NotificationMsg.NotConnect, {
        type: "error",
        toastId: "0-5-85214",
      });
      return;
    }

    if (NetworkName[0] == "XUMM") {
      if (address) {
        toast(NotificationMsg.changeWallet.replace("%s", "XUMM"), {
          type: "info",
          toastId: "0-5-85214",
        });
        return;
      }
    } else {
      if (walletAddress) {
        toast(NotificationMsg.changeWallet.replace("%s", "METAMASK"), {
          type: "info",
          toastId: "0-6-85214",
        });
        return;
      }
    }

    setburnPopUP(false);

    dispatch(
      SetBurnData({
        modal: true,
        Burnfunc: async () => {
          dispatch(
            SetBurnData({
              modal: false,
              Burnfunc: () => { },
            })
          );
          dispatch(
            SetFollowrData({
              upload: 0,
              mint: false,
              fixed: false,
              approve: false,
              ModalType: "BURN",
              modal: true,
            })
          );
          try {
            let result = false;
            if (NetworkName[0] == "XUMM") {
            } else {
              result = await burnNFT(
                CollectionDetails.collection_type,
                CollectionDetails.collection_type
                  ? process.env.REACT_APP_CONTRACT_ADDRESS_ERC721
                  : process.env.REACT_APP_CONTRACT_ADDRESS_ERC1155,
                CollectionDetails.token,
                BurnValue,
                CollectionDetails._id,
                true
              );
            }

            if (result) {
              dispatch(
                submitTranscation(id, {
                  Status:
                    (parseInt(CollectionDetails.no_of_copies) -
                      parseInt(BurnValue) <
                      1)
                      ? false
                      : CollectionDetails.Status,
                  no_of_copies:
                    parseInt(CollectionDetails.no_of_copies) -
                    parseInt(BurnValue),
                })
              );
              dispatch(
                SetFollowrData({
                  upload: 1,
                  mint: false,
                  fixed: false,
                  approve: false,
                  ModalType: "BURN",
                  modal: true,
                })
              );
              // toast(NotificationMsg.putOnSaleBackMsg, { type: "success" });
            }
          } catch (error) {
            dispatch(
              SetFollowrData({
                upload: 2,
                mint: false,
                fixed: false,
                approve: false,
                ModalType: "BURN",
                modal: true,
              })
            );
            toast(error, { type: "error" });
          }
          await FetchData();
        },
      })
    );
  };

  async function burnNFT(
    contractType,
    contractAddress,
    tokenId,
    supply = 1,
    collectionId,
    sharedCollection
  ) {
    console.log("hello", {
      contractType,
      contractAddress,
      tokenId,
      supply,
      collectionId,
      sharedCollection,
      signer: provider.getSigner(),
    });
    try {
      const burnnft = await fetchContract(
        contractAddress,
        contractType ? "nft721" : "nft1155",
        provider,
        await provider.getSigner(),
        sharedCollection
      );

      let receipt;
      if (contractType) {
        receipt = await burnnft.burn(tokenId, { from: address });
      } else {
        receipt = await burnnft.burn(address, tokenId, supply, {
          from: address,
        });
      }

      return await receipt.wait();
    } catch (err) {
      console.log(err);
      let error = { ...err };
      toast(error.reason, { type: "error" });
      return false;
      // burnNFT(contractType,
      //   contractAddress,
      //   tokenId,
      //   supply = 1,
      //   collectionId,
      //   sharedCollection)
    }
  }

  const putOnSale = async (e) => {
    e.preventDefault();
    // if (CollectionDetails.no_of_copies < 2) {
    //   await editApi(CollectionDetails.no_of_copies);
    //   return
    // }

    handleShow();
  };

  const removeFromSale = async (e) => {
    e.preventDefault();

    await dispatch(
      submitTranscation(id, {
        put_on_sale: false,
        instant_sale_enabled: false,
        Listing: CollectionDetails.Listing.map((item) => {
          item.Status = false;
          return item;
        }),
        available_copies: 0,
      })
    );
    toast(NotificationMsg.putOnSaleBackMsg, { type: "success" });
    await FetchData();
    return;
  };

  const CustomEditions = async (e) => {
    e.preventDefault();
    // if (selectCopies == CollectionDetails.no_of_copies) {

    //   await editApi(CollectionDetails.no_of_copies)

    //   await FetchData()

    // } else {
    if (selectCopies == 0 || selectCopies == "") {
      toast(`Enter No of Copies`, { type: "info" });
      return;
    }

    // if ((parseInt(CollectionDetails.available_copies) + parseInt(selectCopies)) > CollectionDetails.no_of_copies) {
    //   toast(`Limit Over`, { type: "info" });
    //   return
    // }

    // return;

    let data = {
      UnitPrice: 0,
      Expire_time: 0,
      Quantity: selectCopies,
      AvailableQuantity: selectCopies,
      Status: true,
      From_owner_id: User_id,
      createrAccount: address || walletAddress,
    };

    const Data = [...CollectionDetails.Listing, data];

    // const available = Data.reduce((value, item) => {
    //   return value + (item.Status ? parseInt(item.AvailableQuantity) : 0);
    // }, 0);

    await dispatch(
      submitTranscation(id, {
        put_on_sale: true,
        instant_sale_enabled: true,
        Listing: Data,
        // available_copies: available,
      })
    );
    HistoryApi({
      userid: User_id,
      collectionid: id,
      Message: `Listed By`,
    });
    await FetchData();
    // }
    // toast(NotificationMsg.putOnSaleMsg, { type: "success" });
    handleClose();
  };

  const editApi = async (no_of_copies = 1) => {
    let data = {
      UnitPrice: 0,
      Expire_time: 0,
      Quantity: selectCopies,
      From_owner_id: User_id,
    };

    const Data = [...CollectionDetails.Listing, data];
    await dispatch(
      submitTranscation(id, {
        put_on_sale: true,
        instant_sale_enabled: true,
        no_of_copies,
        Listing: Data,
      })
    );
  };

  const MakeOffer = (e) => {
    e.preventDefault();

    if (!User_id) {
      toast(NotificationMsg.NotConnect, { type: "error", toastId: "---85214" });
      return;
    }

    if (!address && !type) {
      toast(NotificationMsg.NotConnect, { type: "error" });
      return;
    }

    if (NetworkName[0] == "XUMM") {
      if (address) {
        toast(NotificationMsg.changeWallet.replace("%s", "XUMM"), {
          type: "info",
        });
        return;
      }
    } else {
      if (walletAddress) {
        toast(NotificationMsg.changeWallet.replace("%s", "METAMASK"), {
          type: "info",
        });
        return;
      }
    }

    handleOfferShow();
  };

  const submitOffer = async (e) => {
    e.preventDefault();

    let OfferTotalammount =
      (parseFloat(offerValue || 0) +
        (parseFloat(offerValue || 0) * 2.5) / 100) *
      parseInt(offerQtyValue || 1);

    if (!offerQtyValue) {
      toast(NotificationMsg.Qty, { type: "info" });
      return;
    }

    if (
      parseFloat(offerValue || 0) <= 0 ||
      (chainId ? balance.formatted : BlanceXumm) < OfferTotalammount
    ) {
      toast(NotificationMsg.Balance.replace("%s", ""), { type: "info" });
      return;
    }
    dispatch(
      SetFollowrData({
        upload: 0,
        mint: 2,
        fixed: 2,
        approve: false,
        ModalType: "OFFER",
        modal: true,
      })
    );
    handleOfferClose();

    let result = false;
    try {
      if (NetworkName[0] == "XUMM") {
        dispatch(
          SetFollowrData({
            upload: 0,
            mint: 2,
            fixed: 2,
            approve: false,
            ModalType: "OFFER",
            modal: true,
          })
        );
        const data = {
          wallet_id: walletAddress,
          Price: parseFloat(offerValue || 0),
          UserId: User_id,
          id: id,
          xumm_user_token: userToken,
        };

        result = await API({
          url: apiURl.BuyBroker,
          method: "POST",
          body: data,
        });
        dispatch(
          SetFollowrData({
            upload: 1,
            mint: 0,
            fixed: 2,
            approve: false,
            ModalType: "OFFER",
            modal: true,
          })
        );
        result = await placeBid({
          user_id: User_id,
          sign: result.buy_offer_index,
          collection_id: id,
          asset_address: "",
          token_id: result.transaction_id,
          quantity: 1,
          amount: offerValue,
          buyer_address: walletAddress,
          amount_with_fee: OfferTotalammount,
          payment_token_address: "",
          payment_token_decimals: "",
        });

        dispatch(
          SetFollowrData({
            upload: 1,
            mint: 1,
            fixed: 0,
            approve: false,
            ModalType: "OFFER",
            modal: true,
          })
        );
        dispatch(
          SetFollowrData({
            upload: 1,
            mint: 1,
            fixed: 1,
            approve: false,
            ModalType: "OFFER",
            modal: true,
          })
        );
        dispatch(
          SetFollowrData({
            upload: 1,
            mint: 1,
            fixed: 1,
            approve: false,
            ModalType: "OFFER",
            modal: false,
          })
        );
      } else {
        result = await dispatch(
          converToWeth(
            OfferTotalammount,
            offerValue,
            address,
            provider,
            await provider.getSigner(),
            CollectionDetails.collection_type
              ? process.env.REACT_APP_CONTRACT_ADDRESS_ERC721
              : process.env.REACT_APP_CONTRACT_ADDRESS_ERC1155,
            CollectionDetails.token,
            CollectionDetails._id,
            User_id,
            parseInt(offerQtyValue || 1)
          )
        );
      }

      console.log(result);
      FetchData();
    } catch (error) {
      setloaderOffer(false);
      console.log("error", error);
    }
  };
  //

  const AcceptOffer = async (data) => {
    const {
      User_Id: UserDetails = false,
      Amount,
      Amount_with_fee,
      Sign,
      Collection_Id,
      Quantity,
      buyer_address,
    } = data;

    try {
      if (NetworkName[0] == "XUMM") {
        const data = {
          buy_offer_index: Sign,
          wallet_id: walletAddress,
          Price: parseFloat(Amount || 0),
          UserId: UserDetails._id,
          id: Collection_Id,
          xumm_user_token: userToken,
        };

        let result = await API({
          url: apiURl.acceptBid,
          method: "POST",
          body: data,
        });
        await dispatch(
          submitTranscation(Collection_Id, {
            transaction_hash: result.transaction_id,
            owner_id: UserDetails._id,
          })
        );
        await FetchData();
      } else {
        if (address === buyer_address) {
          toast(NotificationMsg.wallet.replace("connect", "Change"), {
            type: "error",
          });
          return;
        }
        let decimals = 18;
        let unitPrice = 1;
        let account = address;

        let paymentAmt = roundNumber(mulBy(Amount_with_fee, 10 ** decimals), 0);

        const contract = await fetchContract(
          process.env.REACT_APP_TRADECONTRACTADDRESS,
          "trade",
          provider,
          provider.getSigner(),
          true
        );

        let contract1155 = await fetchContract(
          process.env.REACT_APP_CONTRACT_ADDRESS_ERC1155,
          "nft1155",
          provider,
          provider.getSigner(),
          true
        );

        let nonce_value = await API({
          url: `${apiURl.ContractNonce}/${Collection_Id}`,
          method: "GET",
        }).then((data) => data.data);

        let gasPrices = await gasPrice();
        // supply, tokenURI, royalty needs to be passed but WILL NOT be used by the Contract

        let orderStruct = [
          account,
          buyer_address, // bidder address
          process.env.REACT_APP_WETHADDRESS,
          CollectionDetails.collection_type
            ? process.env.REACT_APP_CONTRACT_ADDRESS_ERC721
            : process.env.REACT_APP_CONTRACT_ADDRESS_ERC1155,
          toNum(CollectionDetails.collection_type ? 1 : 0),
          unitPrice,
          toNum(paymentAmt),
          toNum(CollectionDetails.token),
          toNum(CollectionDetails.no_of_copies || 1),
          String(CollectionDetails.metadataCID),
          parseInt(CollectionDetails.Royality),
          toNum(Quantity),
          true,
          false,
          false,
        ];

        // return;

        let receipt = await contract.executeBid(
          orderStruct,
          splitSign(Sign, nonce_value.allnonce.Contract_sign_nonce),
          { from: account, gasLimit: 516883, gasPrice: String(gasPrices) }
        );

        receipt = await receipt.wait();

        let recentListing = [...(CollectionDetails?.Listing || [])];
        let i = 0;
        let quantity = Quantity;
        let loop = recentListing.length;

        await API({
          url: `${apiURl.NftMulti}`,
          method: "POST",
          body: {
            no_of_copies: parseInt(
              await contract1155.balanceOf(
                buyer_address,
                CollectionDetails.token
              )
            ),
            owner_id: UserDetails._id,
            owner_address: buyer_address,
            transaction_hash: receipt?.transactionHash || "",
            buy_offer_index: 0,
          },
          headers: { "content-type": "application/json;charset-UTF-8" },
        }).then((data) => data);

        let count = recentListing.reduce(
          (value, item) =>
            value + (item.Status ? parseInt(item.AvailableQuantity) : 0),
          0
        );

        let nftObject = {
          transaction_hash: receipt.transactionHash,
          buy_offer_index: 0,
          Listing: recentListing,
          available_copies: count,
        };

        if (!count) {
          nftObject["put_on_sale"] = false;
          nftObject["instant_sale_enabled"] = false;
        }

        if (CollectionDetails.collection_type) {
          nftObject["owner_id"] = _id;
          nftObject["owner_wallet_address"] = account;
          nftObject["Listing"] = recentListing.map((data) => ({
            ...data,
            Status: false,
          }));
          nftObject["available_copies"] = 0;
        } else {
          await API({
            url: `${apiURl.newCollwction}/${Collection_Id}`,
            method: "POST",
            body: {
              no_of_copies: parseInt(
                await contract1155.balanceOf(
                  buyer_address,
                  CollectionDetails.token
                )
              ),
              owner_id: UserDetails._id,
              owner_address: buyer_address,
              own_copies: parseInt(
                await contract1155.balanceOf(
                  buyer_address,
                  CollectionDetails.token
                )
              ),
              transaction_hash: receipt?.transactionHash || "",
              buy_offer_index: 0,
            },
            headers: { "content-type": "application/json;charset-UTF-8" },
          }).then((data) => data);

          nftObject["own_copies"] = parseInt(
            await contract1155.balanceOf(account, CollectionDetails.token)
          );
        }

        if (CollectionDetails.collection_type) {
          nftObject["owner_wallet_address"] = buyer_address;
          nftObject["owner_id"] = UserDetails;
          nftObject["put_on_sale"] = false;
          nftObject["instant_sale_enabled"] = false;
        }

        while (loop) {
          if (i >= loop) {
            break;
          }

          let existingQty = parseInt(recentListing[i].AvailableQuantity);

          if (quantity > existingQty) {
            quantity = existingQty - quantity;
            if (Math.sign(quantity) == -1) {
              recentListing[i].AvailableQuantity = 0;
              recentListing[i].Status = false;
              quantity = Math.abs(quantity);
            } else {
              recentListing[i].AvailableQuantity = Math.abs(quantity);
            }
          } else if (quantity <= existingQty) {
            quantity = existingQty - quantity;
            if (Math.sign(quantity) == -1) {
              recentListing[i].AvailableQuantity = 0;
              recentListing[i].Status = false;
              quantity = Math.abs(quantity);
            } else {
              recentListing[i].AvailableQuantity = Math.abs(quantity);
              quantity = 0;
              break;
            }
          } else {
            quantity = quantity - existingQty;
          }
          i++;
        }

        nftObject["Listing"] = recentListing;
        await dispatch(submitTranscation(Collection_Id, nftObject));

        await API({
          url: `${apiURl.Bid}/${data._id}`,
          method: "PUT",
          body: { Is_active: false },
        });

        HistoryApi({
          userid: User_id,
          collectionid: Collection_Id,
          Message: `Accepted Offer By`,
        });

        setTimeout(() => {
          navigate(`/collections/${Collection_Id}`);
        }, 200);

        navigate("/");
      }
    } catch (err) {
      console.log(err);
      await API({
        url: apiURl.ErrorData,
        method: "POST",
        body: {
          errordata: {
            ...data,
            message: err.message,
            stack: err.stack,
            type: NetworkName[0],
            currentAddress: address || walletAddress,
            userTokken: userToken,
          },
        },
      });
    }
  };

  const [apiCall, setapiCall] = useState(null);

  useEffect(() => {
    dispatch(
      SetBuyData({
        modal: false,
        checkout: false,
        buyModal: false,
        stripe: false,
      })
    );
    // dispatch(
    //   SetFollowrData({
    //     upload: false,
    //     mint: false,
    //     fixed: false,
    //     approve: false,
    //     ModalType: "stripe",
    //     modal: false,
    //     func: () => {},
    //   })
    // );

    if (token && session && Type && atob(Type) !== "error") {
      dispatch(
        SetFollowrData({
          upload: false,
          mint: 0,
          fixed: 2,
          approve: false,
          ModalType: "stripe",
          modal: true,
          func: () => { },
        })
      );
      clearInterval(apiCall);
      setapiCall(
        setTimeout(() => {
          if (token || session || Type) {
            // dispatch(SetloaderData(true));
            try {
              API({
                url: apiURl.verifyPayment,
                method: "POST",
                body: { token, session, type: Type },
              }).then((data) => {
                if (!data.success) {
                  dispatch(
                    SetFollowrData({
                      upload: false,
                      mint: 5,
                      fixed: 3,
                      approve: false,
                      ModalType: "stripe",
                      modal: true,
                      func: () => {
                        dispatch(
                          SetFollowrData({
                            upload: false,
                            mint: false,
                            fixed: false,
                            approve: false,
                            ModalType: "stripe",
                            modal: false,
                            func: () => { },
                          })
                        );

                        dispatch(
                          SetBuyData({
                            modal: false,
                            checkout: true,
                            buyModal: false,
                            stripe: false,
                          })
                        );
                      },
                    })
                  );
                } else {
                  API({ url: `${apiURl.Nft}/${id}`, method: "GET" }).then(
                    (nftdata) => {
                      let nftData = nftdata?.data;
                      const totalAmt = multipliedBy(
                        nftData?.sign_instant_sale_price,
                        data?.result?.Quantity || 1
                      );
                      const serviceFee = percentageOf(2.5, totalAmt);
                      const total = plusNum(totalAmt, serviceFee);

                      if (type == "METAMASK") {
                        dispatch(
                          SetFollowrData({
                            upload: false,
                            mint: 1,
                            fixed: 0,
                            approve: false,
                            ModalType: "stripe",
                            modal: true,
                            func: () => { },
                          })
                        );

                        dispatch(
                          FiatbuyAsset(
                            nftData?.cretor_wallet_address,
                            nftData?.collection_type ? 1 : 0,
                            nftData?.collection_type
                              ? process.env.REACT_APP_CONTRACT_ADDRESS_ERC721
                              : process.env.REACT_APP_CONTRACT_ADDRESS_ERC1155,
                            nftData?.token,
                            nftData?.sign_instant_sale_price,
                            data?.result?.Quantity || 1,
                            parseFloat(parseFloat(total)),
                            process.env.REACT_APP_WETHADDRESS,
                            18,
                            nftData?._id,
                            address,
                            nftData?.Royality,
                            provider,
                            signer,
                            "abcde",
                            _id,
                            nftData?.is_eth_payment,
                            nftData,
                            navigate
                          )
                        );
                      } else {
                        if (nftData?.collection_type) {
                          dispatch(
                            SetFollowrData({
                              upload: false,
                              mint: 1,
                              fixed: 0,
                              approve: false,
                              ModalType: "stripe",
                              modal: true,
                              func: () => { },
                            })
                          );

                          try {
                            API({
                              url: apiURl.BuyBroker,
                              method: "POST",
                              body: {
                                id,
                                xumm_user_token: userToken,
                                wallet_id: walletAddress,
                              },
                            }).then((BuyBroData) => {
                              API({
                                url: apiURl.Buy,
                                method: "POST",
                                body: {
                                  wallet_id: walletAddress,
                                  price: 1,
                                  UserId: _id,
                                  id,
                                  xumm_user_token: userToken,
                                },
                              }).then((Buydata) => {
                                if (Buydata?.is_offer_accepted) {
                                  dispatch(
                                    SetFollowrData({
                                      upload: false,
                                      mint: 1,
                                      fixed: 2,
                                      approve: false,
                                      ModalType: "stripe",
                                      modal: false,
                                      func: () => { },
                                    })
                                  );
                                  setTimeout(() => {
                                    navigate(`/collections/${nftData?._id}`);
                                  }, 200);
                                  dispatch(
                                    SetFollowrData({
                                      upload: false,
                                      mint: false,
                                      fixed: false,
                                      approve: false,
                                      ModalType: "stripe",
                                      modal: false,
                                      func: () => { },
                                    })
                                  );

                                  navigate(`/`);
                                }
                              });
                            });
                          } catch (error) {
                            let errorObject = {
                              message: error.message,
                              stack: error.stack,
                              type: "XUMM",
                              typeFunc: "Buy-Function",
                              params: {
                                id,
                                xumm_user_token: userToken,
                              },
                            };
                            API({
                              url: apiURl.ErrorData,
                              method: "POST",
                              body: { errordata: JSON.stringify(errorObject) },
                            });
                          }
                        } else {
                          let qty = data?.result?.Quantity;

                          const forLoop = async () => {
                            for (let index = 1; index <= qty; index++) {
                              try {
                                dispatch(
                                  SetBuyData({
                                    modal: false,
                                    checkout: false,
                                    buyModal: false,
                                    stripe: false,
                                  })
                                );
                                dispatch(
                                  SetFollowrData({
                                    upload: 0,
                                    mint: 2,
                                    fixed: 2,
                                    approve: 2,
                                    ModalType: "MulBuy",
                                    modal: true,
                                    MulBuyXRP: { qty: qty, remainig: index },
                                  })
                                );

                                // const balanceCheck = await new Promise((resolve, reject) => {
                                //   try {
                                //     setTimeout(() => {
                                //       if (
                                //         parseFloat(Balance) >
                                //         parseFloat(parseFloat(CollectionDetails.sign_instant_sale_price) + 1)
                                //       ) {
                                //         resolve(true);
                                //       } else {
                                //         reject(false);
                                //       }
                                //     }, 1500);
                                //   } catch (error) {
                                //     reject(false);
                                //   }
                                // })
                                //   .then((data) => {
                                //     return data;
                                //   })
                                //   .catch((err) => {
                                //     dispatch(
                                //       SetFollowrData({
                                //         upload: 5,
                                //         mint: 2,
                                //         fixed: 2,
                                //         approve: 2,
                                //         ModalType: "MulBuy",
                                //         func: async () => {
                                //           await XummMulBuyXrp(qty, index);
                                //         },
                                //         modal: true,
                                //         MulBuyXRP: { qty: qty, remainig: index },
                                //       })
                                //     );
                                //     return err;
                                //   });

                                // if (!balanceCheck) {
                                //   break;
                                // }
                                const data = {
                                  wallet_id: walletAddress,
                                  // Price: CollectionDetails.sign_instant_sale_price,
                                  UserId: _id,
                                  id,
                                  xumm_user_token: userToken,
                                };
                                dispatch(
                                  SetFollowrData({
                                    upload: 1,
                                    mint: 0,
                                    fixed: 2,
                                    approve: 2,
                                    ModalType: "MulBuy",
                                    modal: true,
                                    MulBuyXRP: { qty: qty, remainig: index },
                                  })
                                );

                                try {
                                  const brokerRes = await API({
                                    url: apiURl.testxummbuy,
                                    method: "POST",
                                    body: data,
                                  });
                                  dispatch(
                                    SetFollowrData({
                                      upload: 1,
                                      mint: 1,
                                      fixed: 0,
                                      approve: 2,
                                      ModalType: "MulBuy",
                                      modal: true,
                                      MulBuyXRP: { qty: qty, remainig: index },
                                    })
                                  );

                                  try {
                                    const res = await API({
                                      url: apiURl.xummTransfer,
                                      method: "POST",
                                      body: {
                                        id,
                                        wallet_id: walletAddress,
                                        price: nftData.sign_instant_sale_price,
                                        UserId: _id,
                                        active_trade_id:
                                          brokerRes?.active_trade_id,
                                      },
                                    });

                                    dispatch(
                                      SetFollowrData({
                                        upload: 1,
                                        mint: 1,
                                        fixed: 1,
                                        approve: 2,
                                        ModalType: "MulBuy",
                                        modal: true,
                                        MulBuyXRP: {
                                          qty: qty,
                                          remainig: index,
                                        },
                                      })
                                    );

                                    await new Promise((resolve, reject) => {
                                      try {
                                        setTimeout(() => {
                                          resolve(true);
                                        }, 1000);
                                      } catch (error) {
                                        reject(false);
                                      }
                                    })
                                      .then((data) => {
                                        dispatch(
                                          SetFollowrData({
                                            upload: 1,
                                            mint: 1,
                                            fixed: 1,
                                            approve: 2,
                                            ModalType: null,
                                            modal: false,
                                            MulBuyXRP: {
                                              qty: qty,
                                              remainig: index,
                                            },
                                          })
                                        );
                                        if (index === +qty) {
                                          setTimeout(() => {
                                            navigate(
                                              `/collections/${nftData?._id}`
                                            );
                                          }, 200);
                                          navigate("/");
                                        }
                                        return data;
                                      })
                                      .catch((err) => {
                                        dispatch(
                                          SetFollowrData({
                                            upload: 2,
                                            mint: 2,
                                            fixed: 2,
                                            approve: 2,
                                            ModalType: null,
                                            modal: false,
                                            MulBuyXRP: {},
                                          })
                                        );
                                      });
                                  } catch (error) {
                                    dispatch(
                                      SetFollowrData({
                                        upload: 1,
                                        mint: 1,
                                        fixed: 5,
                                        approve: 2,
                                        ModalType: "MulBuy",
                                        func: async () => {
                                          await buyMultiXRP(id);
                                        },
                                        modal: true,
                                        MulBuyXRP: {
                                          qty: qty,
                                          remainig: index,
                                        },
                                      })
                                    );
                                    break;
                                  }
                                } catch (error) {
                                  dispatch(
                                    SetFollowrData({
                                      upload: 1,
                                      mint: 5,
                                      fixed: 2,
                                      approve: 2,
                                      ModalType: "MulBuy",
                                      func: async () => {
                                        await BuyMulXrp(data, qty, index);
                                      },
                                      modal: true,
                                      MulBuyXRP: { qty: qty, remainig: index },
                                    })
                                  );
                                  break;
                                }
                              } catch (error) {
                                break;
                              }
                            }
                          };
                          forLoop();
                        }
                      }
                    }
                  );
                }
              });
            } catch (error) {
              console.log("lakshay", error);
            }
            return;
          }
        }, 1000)
      );
    }
  }, [token, session, Type, type]);

  const XummMulBuyXrp = async (qty, i) => {
    // const balanceCheck = await new Promise((resolve, reject) => {
    //   try {
    //     setTimeout(() => {
    //       if (
    //         parseFloat(Balance) >
    //         parseFloat(parseFloat(Data.sign_instant_sale_price) + 1)
    //       ) {
    //         resolve(true);
    //       } else {
    //         reject(false);
    //       }
    //     }, 1500);
    //   } catch (error) {
    //     reject(false);
    //   }
    // })
    //   .then((data) => {
    //     return data;
    //   })
    //   .catch((err) => {
    //     dispatch(
    //       SetFollowrData({
    //         upload: 5,
    //         mint: 2,
    //         fixed: 2,
    //         approve: 2,
    //         ModalType: "MulBuy",
    //         func: async () => {
    //           await XummMulBuyXrp(qty, i);
    //         },
    //         modal: true,
    //         MulBuyXRP: { qty: qty, remainig: i },
    //       })
    //     );
    //     return err;
    //   });

    // if (!balanceCheck) {
    //   return;
    // }
    const data = {
      wallet_id: walletAddress,
      Price: CollectionDetails.sign_instant_sale_price,
      UserId: _id,
      id,
      xumm_user_token: userToken,
    };
    await BuyMulXrp(data, qty, i);
  };

  const BuyMulXrp = async (value, qty, i) => {
    dispatch(
      SetFollowrData({
        upload: 1,
        mint: 0,
        fixed: 2,
        approve: 2,
        ModalType: "MulBuy",
        modal: true,
        MulBuyXRP: { qty: qty, remainig: i },
      })
    );
    try {
      const resp = await API({
        url: apiURl.testxummbuy,
        method: "POST",
        body: value,
      });

      await buyMultiXRP(id, value, resp, qty, i);
    } catch (error) {
      dispatch(
        SetFollowrData({
          upload: 1,
          mint: 5,
          fixed: 2,
          approve: 2,
          ModalType: "MulBuy",
          func: async () => {
            await BuyMulXrp(value, qty, i);
          },
          modal: true,
          MulBuyXRP: { qty: qty, remainig: i },
        })
      );
      return false;
    }
  };

  const buyMultiXRP = async (id, value, resp, qty, i) => {
    dispatch(
      SetFollowrData({
        upload: 1,
        mint: 1,
        fixed: 0,
        approve: 2,
        ModalType: "MulBuy",
        modal: true,
        MulBuyXRP: { qty: qty, remainig: i },
      })
    );

    try {
      await API({
        url: apiURl.xummTransfer,
        method: "POST",
        body: {
          id,
          wallet_id: value.walletAddress,
          Price: value.sign_instant_sale_price,
          UserId: _id,
          active_trade_id: resp?.active_trade_id,
        },
      });

      dispatch(
        SetFollowrData({
          upload: 1,
          mint: 1,
          fixed: 1,
          approve: 2,
          ModalType: "MulBuy",
          modal: true,
          MulBuyXRP: { qty: qty, remainig: i },
        })
      );

      await new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        } catch (error) {
          reject(false);
        }
      })
        .then((data) => {
          dispatch(
            SetFollowrData({
              upload: 1,
              mint: 1,
              fixed: 1,
              approve: 2,
              ModalType: null,
              modal: false,
              MulBuyXRP: { qty: qty, remainig: i },
            })
          );

          setTimeout(() => {
            window.location.reload();
          }, 1000);

          return data;
        })
        .catch((err) => {
          dispatch(
            SetFollowrData({
              upload: 2,
              mint: 2,
              fixed: 2,
              approve: 2,
              ModalType: null,
              modal: false,
              MulBuyXRP: {},
            })
          );
        });
    } catch (error) {
      dispatch(
        SetFollowrData({
          upload: 1,
          mint: 1,
          fixed: 5,
          approve: 2,
          ModalType: "MulBuy",
          func: async () => {
            await buyMultiXRP(id);
          },
          modal: true,
          MulBuyXRP: { qty: qty, remainig: i },
        })
      );
      return false;
    }
  };

  let likeIndex = CollectionDetails?.likes_count?.findIndex(
    (ele) => ele === User_id
  );
  const handleShowLogin = () => {
    dispatch(SetpopupReducerData({ modalType: "LOGIN", showModal: true }));
    setShowPopup(true);
  };
  const handleLike = async (nft) => {
    if (!User_id) {
      handleShowLogin();
    } else {
      let payload = { UserId: User_id, NftId: nft?._id, IsLiked: false };
      payload.IsLiked = likeIndex >= 0 ? false : true;
      try {
        await API({
          url: `${apiURl.likesdata}`,
          method: "POST",
          body: payload,
          formData: false,
        }).then((data) => {
          if (data?.status || data?.status === "true") {
            FetchData();
          } else {
            console.log("like data", data);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleExpandImage = (url) => {
    setExpandUrl(url);
    setExpandImage(true);
  };
  const handleCloseExpandImage = () => {
    setExpandUrl("");
    setExpandImage(false);
  };
  console.log('CollectionDetails', CollectionDetails);
  return (
    <section className="profile-section mt-3 mt-sm-4">
      <div className="container-lg">
        <div className="row align-items-center justify-content-between py-3 py-md-4 position-relative">
          <div className="col-12 col-sm-9">
            <p title={`Available For sale/No of Copies`}>
              {CollectionDetails?.name || ""}
              <span>
                Total Qty: <b>{`${CollectionDetails?.no_of_copies || 1}`}</b>{" "}
                Listed Qty:{" "}
                <b>{`${(CollectionDetails?.Listing || []).reduce((value, ele) => {
                  return value + (ele.Status ? value + ele.Quantity : 0);
                }, 0) || 0
                  }`}</b>{" "}
                Sold Qty:{" "}
                <b>{`${(CollectionDetails?.no_of_copies || 0) -
                  (CollectionDetails?.available_copies || 0)
                  }`}</b>{" "}
                Available Qty:{" "}
                <b>{`${CollectionDetails?.available_copies || 0}`}</b>
              </span>
              {/* {NetworkName[0] ==
              "XUMM" ? null : CollectionDetails.collection_type ? null : (
                <span>
                  Editions:{" "}
                  <b>{`${CollectionDetails?.available_copies || 0}/${
                    CollectionDetails?.no_of_copies || 1
                  }`}</b>
                </span>
              )} */}
            </p>
          </div>
          <div className="col-auto">
            <div className="modal-more-options">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  <img src="/images/share.png" alt="crosstower" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <li>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => redirectSocialTab(e, "FB")}
                    >
                      <i className="fab fa-facebook-f"></i>Facebook
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => redirectSocialTab(e, "TW")}
                    >
                      <i className="fab fa-twitter"></i>Twitter
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => redirectSocialTab(e, "TEL")}
                    >
                      <i className="fab fa-telegram-plane"></i>Telegram
                    </Dropdown.Item>
                  </li>
                  <li>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => redirectSocialTab(e, "WA")}
                    >
                      <i className="fab fa-whatsapp"></i>Whats App
                    </Dropdown.Item>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
              <div className="heart">
                <button className={` card__likes heart `}>
                  <i
                    className={`${likeIndex >= 0 ? "text-danger" : ""
                      } fa fa-light fa-heart `}
                    onClick={() => handleLike(CollectionDetails)}
                  ></i>
                  {/* <img
                    className={`${likeIndex >= 0 ? "text-danger" : ""}  `}
                    src="/images/wishlist.png"
                    alt="crosstower"
                    onClick={() => handleLike(CollectionDetails)}
                  /> */}
                </button>
              </div>
              {/*  */}
              {CollectionDetails?.Status &&
                CollectionDetails?.Owner_id?._id == User_id && (
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      <div className="option-btn">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="activeNone">
                      {parseInt(CollectionDetails?.no_of_copies) ==
                        parseInt(CollectionDetails?.available_copies) ? null : (
                        <li>
                          <Dropdown.Item href="#" onClick={putOnSale}>
                            {"Put On Sale"}
                          </Dropdown.Item>
                        </li>
                      )}
                      {parseInt(CollectionDetails?.available_copies) > 0 && (
                        <li>
                          <Dropdown.Item href="#" onClick={removeFromSale}>
                            {"Remove From Sale"}
                          </Dropdown.Item>
                        </li>
                      )}

                      {CollectionDetails?.Is_burnable && (
                        <li>
                          <Dropdown.Item
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setburnPopUP(true);
                            }}
                          >
                            Burn
                          </Dropdown.Item>
                        </li>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-lg">
        <div className="row">
          <div className="col-md-6">
            <div className="profile-box h-100">
              {CollectionDetails?.mint_details ? CollectionDetails?.mint_details.map((data) => {
                return <>
                  {data.media_type == "video" ? (
                    <video
                      width="100%"
                      height="100%"
                      controls
                      controlsList="nodownload"
                    >
                      <source
                        src={
                          process.env.REACT_APP_BACKENDURL +
                          "/" +
                          data.image +
                          "#toolbar=0"
                        }
                      />
                    </video>
                  ) : data.media_type == "audio" ? (
                    <div
                      className="collection-card-img audio_tag mp-format-cover"
                      style={{
                        backgroundImage: `url("${CollectionDetails.cover_image}")`,
                      }}
                    >
                      <audio
                        size="550x400"
                        controls="controls"
                        controlsList="nodownload"
                        className="audio-responsive"
                        src={`${data.image}`}
                      ></audio>
                    </div>
                  ) : (
                    <>
                      <img
                        src={`${CollectionDetails.cover_image || CollectionDetails.image}`}
                        alt="crosstower"
                      />
                      <div
                        class="expand-btn"
                        onClick={() =>
                          handleExpandImage(
                            `${CollectionDetails.cover_image ||
                            CollectionDetails.image
                            }`
                          )
                        }
                      >
                        <img src="/images/maximize.svg" alt="" />
                      </div>
                    </>
                  )}
                </>
              }) : null}
            </div>
          </div>

          <div className="col-md-6 ps-lg-5">
            <div className="des-box p-0">
              <div className="des-box-2">
                <p>Description</p>
                <article className="text-break" style={{ fontSize: "14px" }}>
                  <ReactReadMoreReadLess
                    charLimit={200}
                    readMoreText={"Read more"}
                    readLessText={"Read less"}
                    readMoreClassName="read-more-less--more"
                    readLessClassName="read-more-less--less"
                  >
                    {CollectionDetails?.description || ""}
                  </ReactReadMoreReadLess>
                </article>
              </div>

              <div className="creater-div">
                <div className="left-div">
                  <div className="pro-div-2">
                    <span>Creator</span>
                  </div>
                  <div className="pro-div">
                    <Link
                      to={`/Users/${CollectionDetails?.creator_id?._id ||
                        CollectionDetails?.creator_id
                        }`}
                    >
                      <img
                        src={
                          CollectionDetails?.creator_id?.image
                            ? process.env.REACT_APP_BACKENDURL +
                            "/" +
                            CollectionDetails?.creator_id?.image
                            : "/images/prfile-pic.jpg"
                        }
                        alt="crosstower"
                      />
                    </Link>
                  </div>

                  <div className="user-detail">
                    <Link
                      to={`/Users/${CollectionDetails?.creator_id?._id ||
                        CollectionDetails?.creator_id
                        }`}
                    >

                      <p title={Array.isArray(CollectionDetails?.royalty) ? CollectionDetails?.royalty[0]?.creator_wallet_add : ""}>
                        {CollectionDetails?.creator_id?.Name
                          ? CollectionDetails?.creator_id?.Name
                          : ""}
                      </p>
                      <p>
                        {(
                          Array.isArray(CollectionDetails?.royalty) ? CollectionDetails?.royalty[0]?.creator_wallet_add : ""
                        )?.slice(0, 4) +
                          "..." +
                          (
                            Array.isArray(CollectionDetails?.royalty) ? CollectionDetails?.royalty[0]?.creator_wallet_add : ""
                          ).slice(-4)}
                        <img
                          src="/images/copy-svgrepo-com.svg"
                          className="copy_address"
                          alt=""
                          onClick={(e) => {
                            e.preventDefault();
                            CopyText(
                              CollectionDetails?.cretor_wallet_address || ""
                            );
                          }}
                          style={{ width: "20px", cursor: "pointer" }}
                        />
                      </p>
                    </Link>
                  </div>
                </div>
                {NetworkName[0] == "XUMM" ? null : (
                  <div className="left-div">
                    {/* <div className="pro-div-2">
                      {" "}
                      <span>Collection</span>
                    </div>
                    <div className="pro-div">
                      <img src="/images/prfile-pic.jpg" alt="crosstower" />
                    </div>
                    <div className="user-detail">
                      <p>
                        {CollectionDetails.collection_type
                          ? "NFT721"
                          : "NFT1155"}
                      </p>
                    </div> */}
                  </div>
                )}
                {CollectionDetails?.status !== "PUBLISHED" ? (
                  <div className="left-div">
                    <div className="pro-div-2">
                      {" "}
                      <span>Nft Status</span>
                    </div>

                    <div className="user-detail">
                      <p>{CollectionDetails?.status}</p>
                    </div>
                  </div>
                ) : null}
                <div className="roy-box">
                  {Array.isArray(CollectionDetails?.royalty) ? CollectionDetails?.royalty[0]?.percentage : 30}% of resale royalty
                </div>
                <div className="clear"></div>
              </div>

              {CollectionDetails?.status === "PUBLISHED" ? (
                <div className="bolck-div">
                  <div className="row">
                    {/* <div className="col-sm-4 col-xs-6">
                      <p>
                        <span>Highest Bid</span>
                      </p>
                      <p>

                        {parseFloat(CollectionDetails.Highest_bid || 0.0) <
                          0.00001
                          ? "No Bid"
                          : parseFloat(
                            CollectionDetails.Highest_bid || 0.0
                          )?.toFixed(5) +
                          (NetworkName && NetworkName[0] == "XUMM"
                            ? " XRP"
                            : " ETH")}
                      </p>
                      {CollectionDetails?.Owner_id?._id == User_id ? null : (
                        <div className="spce-div">
                          <a
                            href="!#"
                            className="bolck-div-button"
                            onClick={MakeOffer}
                          >
                            Make a offer
                          </a>
                        </div>
                      )}
                    </div> */}

                    <div className="col-sm-4 col-xs-6">
                      {CollectionDetails?.launch_details?.sale_type !== "OPENBID" && (
                        <>
                          <p>
                            <span>Sale Price</span>
                          </p>
                          <p>
                            {CollectionDetails?.launch_details.price}{" "}
                            {NetworkName && NetworkName[0] == "XUMM"
                              ? "XRP"
                              : "ETH"}
                          </p>
                        </>
                      )}
                      {(
                        <div className="spce-div">
                          {CollectionDetails?.status === "PUBLISHED" && (
                            <a
                              href="!#"
                              className="bolck-div-button-2 text-white"
                              onClick={buyHnadleChange}
                            >
                              Buy
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {startIn > 0 ? (
                      <div className="col-sm-4 col-xs-6">
                        {CollectionDetails?.Time_from &&
                          CollectionDetails?.Time_from !== "null" && (
                            <>
                              <p>
                                <span>Sale Start in</span>
                              </p>
                              <CountdownTimer
                                targetDate={CollectionDetails?.Time_from}
                                remainigTime={(val) => setStartIn(val)}
                              />
                            </>
                          )}
                      </div>
                    ) : (
                      <>
                        {endIn > 0 ? (
                          <div className="col-sm-4 col-xs-6">
                            {CollectionDetails?.Time_to &&
                              CollectionDetails?.Time_to !== "null" && (
                                <>
                                  <p>
                                    <span>Sale End in</span>
                                  </p>
                                  <CountdownTimer
                                    targetDate={CollectionDetails?.Time_to}
                                    remainigTime={(val) => setEndIn(val)}
                                  />
                                </>
                              )}
                          </div>
                        ) : (
                          <div className="col-sm-4 col-xs-6">
                            {CollectionDetails?.Time_to &&
                              CollectionDetails?.Time_to !== "null" && (
                                <>
                                  <p>
                                    <span> Auction Status</span>
                                  </p>
                                  <p>Expired</p>
                                </>
                              )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              className="my-3 cstTab"
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <Tabs
                defaultActiveKey="history"
                // transition={false}
                id="noanim-tab-example"
                className="mb-3"
                fill
              >
                <Tab eventKey="listing" title="Listing's" className="">
                  <Listing
                    data={CollectionDetails.Listing || []}
                    owner={CollectionDetails.Owner_id}
                    FetchData={FetchData}
                  />
                </Tab>
                {/* <Tab
                  eventKey="bids"
                  title={"Bids"}
                  // title={`Bids (${
                  //   CollectionDetails?.Bids?.filter((item) => item.Is_active)
                  //     .length || 0
                  // })`}
                  className=""
                >
                  <Bids
                    data={CollectionDetails?.Bids || []}
                    FetchData={FetchData}
                    Owner={CollectionDetails?.Owner_id}
                    AcceptOffer={AcceptOffer}
                  />
                </Tab> */}
                <Tab eventKey="history" title="Activity">
                  <History HistoryData={HistoryData} />
                </Tab>
                {/* {NetworkName && NetworkName[0] == "XUMM" ? null : ( */}
                <Tab eventKey="properties" title="Properties">
                  <Properties data={CollectionDetails.Properties} />
                </Tab>
                {/* )} */}
                <Tab eventKey="details" title="Details">
                  <Details
                    {...CollectionDetails}
                    NetworkName={NetworkName}
                    setShowOwner={setShowOwner}
                    ownerData={ownerData}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        size={"md offerPoup"}
        contentClassName="modal-custom"
      >
        <div className="pop-bg">
          <div className="pop_content">
            <div className="close-button" onClick={() => setShow(false)}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                }}
                href="!#"
              >
                <img alt="" src="/images/cross-button.svg" />
              </a>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <h4 className="text-center putTitle">Put On Sale</h4>
                </div>
                <div className="col-sm-12 grey-bg">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12 mb-2">
                        <label className="mt-0 mb-0">
                          Enter Number Of copies
                        </label>
                        {/* <h6 className="small">Enter the price for which the item will be instantly sold</h6> */}
                      </div>
                      <div className="col-sm-12">
                        <InputGroup size="sm" className="mb-3">
                          <InputGroup.Text id="inputGroup-sizing-sm">
                            Copies
                          </InputGroup.Text>
                          <Form.Control
                            className="putInput"
                            aria-label="Small"
                            value={selectCopies}
                            disabled={CollectionDetails.collection_type}
                            aria-describedby="inputGroup-sizing-sm"
                            onChange={(e) => {
                              const re = /^[0-9]*$/;

                              if (
                                (e.target.value === "" ||
                                  re.test(e.target.value)) &&
                                parseInt(e.target.value || 0) <=
                                parseInt(CollectionDetails.own_copies) -
                                parseInt(
                                  CollectionDetails.available_copies || 0
                                )
                              ) {
                                setSelectCopies(
                                  e.target.value == ""
                                    ? e.target.value
                                    : parseInt(e.target.value)
                                );
                              }
                            }}
                          />
                        </InputGroup>
                      </div>
                      <div className="col-sm-12 mb-2">
                        <Button
                          className="formbold-browse mt-0"
                          variant=""
                          onClick={CustomEditions}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        show={Offershow}
        onHide={handleOfferClose}
        size={"lg offerPoup"}
        contentClassName="modal-custom"
      >
        <div className="pop-bg">
          <div className="pop_content">
            <div className="close-button" onClick={handleOfferClose}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                }}
                href="!#"
              >
                <img alt="" src="/images/cross-button.svg" />
              </a>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <h2 className="text-center bold">Make a Offer</h2>
                </div>
                <div className="col-sm-12 bid-pop-div">
                  <p style={{ color: "#98999D" }}>
                    <b>You are about to place a bid for</b>
                  </p>
                  <p>
                    <b>{CollectionDetails.name}</b> By{" "}
                    <b>
                      {CollectionDetails?.cretor_wallet_address
                        ? CollectionDetails?.cretor_wallet_address.slice(0, 4) +
                        "...." +
                        CollectionDetails?.cretor_wallet_address.slice(
                          CollectionDetails?.cretor_wallet_address.length - 4
                        )
                        : CollectionDetails?.cretor_wallet_address || ""}
                    </b>
                  </p>
                </div>

                <div className="col-sm-12 grey-bg">
                  <div className="container-fluid px-4">
                    <div className="row">
                      <div className="col-sm-8 mb-2">
                        <h6 className="small">Your Offer</h6>
                      </div>
                      <div className="col-sm-4 mb-2">
                        <h6 className="small">Qty.</h6>
                      </div>
                      <div className="col-sm-8">
                        <InputGroup size="sm" className="mb-3">
                          <Form.Control
                            aria-label="Small"
                            placeholder={"Enter price for one piece"}
                            aria-describedby="inputGroup-sizing-sm"
                            value={offerValue}
                            onChange={(e) => {
                              const re = /^[0-9]*\.?[0-9]{0,5}$/;
                              if (
                                e.target.value === "" ||
                                re.test(e.target.value)
                              ) {
                                setofferValue(e.target.value);
                              }
                            }}
                          />
                        </InputGroup>
                      </div>
                      <div className="col-sm-4">
                        <InputGroup size="sm" className="mb-3">
                          <Form.Control
                            aria-label="Small"
                            placeholder={"Enter Quantity"}
                            aria-describedby="inputGroup-sizing-sm"
                            value={offerQtyValue}
                            disabled={CollectionDetails.collection_type}
                            onChange={(e) => {
                              const re = /^[0-9]*$/;
                              if (
                                (e.target.value === "" ||
                                  re.test(e.target.value)) &&
                                parseInt(e.target.value || 0) <=
                                parseInt(CollectionDetails.no_of_copies)
                              ) {
                                setOfferQtyValue(e.target.value);
                              }
                            }}
                          />
                        </InputGroup>
                      </div>
                      <div className="col-sm-6 mb-2">
                        <h6 className="small">Your Balance</h6>
                      </div>
                      <div className="col-sm-6 mb-2">
                        <h6 className="small text-end">
                          {address
                            ? balance?.formatted + " ETH" || 0
                            : BlanceXumm + " XRP"}
                        </h6>
                      </div>
                      <div className="col-sm-6 mb-2">
                        <h6 className="small">Service Fee (2.5%)</h6>
                      </div>
                      <div className="col-sm-6 mb-2">
                        <h6 className="small text-end">
                          {(parseFloat(offerValue || 0) * 2.5) / 100}
                        </h6>
                      </div>
                      <div className="col-sm-6 mb-2">
                        <h6 className="small">Total Bid Amount</h6>
                      </div>
                      <div className="col-sm-6 mb-2">
                        <h6 className="small text-end">
                          {(parseFloat(offerValue || 0) +
                            (parseFloat(offerValue || 0) * 2.5) / 100) *
                            parseInt(offerQtyValue || 1)}

                          {NetworkName && NetworkName[0] == "XUMM"
                            ? ""
                            : " WETH"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-between darkTwoBoth px-4">
                <div className="col-auto">
                  <Button
                    onClick={handleOfferClose}
                    className="cancel-button px-5"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="col-auto">
                  <Button
                    disabled={!loaderOffer || offerValue ? false : true}
                    onClick={submitOffer}
                    className="creat-button px-5"
                  >
                    {loaderOffer ? <Spinner /> : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        show={offerPopSign}
        onHide={handleOfferPopSignClose}
        size={"lg"}
        contentClassName="modal-custom"
      >
        <div className="pop-bg">
          <div className="pop_content">
            <div className="close-button" onClick={handleOfferPopSignClose}>
              <a
                onClick={(e) => {
                  e.preventDefault();
                }}
                href="!#"
              >
                <img alt="" src="/images/cross-button.svg" />
              </a>
            </div>
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <h4 className="text-center">Create a Offer</h4>
                </div>
                <div className="col-sm-12 grey-bg">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-sm-12">
                        <ul>
                          <li>
                            {/* {
                              upload ?
                                <i className="chec-iocn">
                                  <img alt="" style={{ visibility: upload == 1 ? 'visible' : 'hidden' }} src={`/images/${'check-active.svg'}`} />
                                </i>
                                :
                                <span className="m-2 me-3">
                                  <Spinner animation="border" size="sm" />
                                </span>

                            } */}
                            <b>Accept Sign</b>
                            <br />
                            <span>Create A signature place a offer</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        size="md offerPoup "
        show={burnPopUP}
        hide={() => setburnPopUP(false)}
        contentClassName="modal-custom"
      >
        <div className="pop-bg">
          <form>
            <div className="pop_content">
              <div
                className="close-button"
                onClick={(e) => {
                  e.preventDefault();
                  setburnPopUP(false);
                }}
              >
                <a onClick={(e) => e.preventDefault()} href="!#">
                  <img alt="" src="/images/cross-button.svg" />
                </a>
              </div>

              <>
                <h2>Burn Token(s)</h2>
                <p>
                  Great things take time! But this one will be
                  <br className="br" />
                  only a few minutes.
                </p>
                <div className="grey-bg px-3">
                  <InputGroup size="sm">
                    <Form.Control
                      aria-label="Small"
                      placeholder={"Enter Number Of Copies"}
                      aria-describedby="inputGroup-sizing-sm"
                      value={BurnValue}
                      disabled={
                        CollectionDetails.contractType ||
                        CollectionDetails.no_of_copies == 1
                      }
                      onChange={(e) => {
                        const re = /^[0-9]/;
                        if (e.target.value === "" || re.test(e.target.value)) {
                          if (
                            e.target.value === "" ||
                            e.target.value <= CollectionDetails.no_of_copies
                          ) {
                            setBurnValue(e.target.value);
                          }
                        }
                      }}
                    />
                  </InputGroup>
                </div>
                <div className="row create-button-div">
                  <div className="col-sm-6">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setburnPopUP(false);
                      }}
                      className="filter"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-sm-6">
                    <button onClick={BurnNftCall}>Submit</button>
                  </div>
                </div>
              </>
            </div>
          </form>
        </div>
      </Modal>
      <XummBuy nftData={CollectionDetails} />
      <Follow />
      <Checkout
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        qty={qty}
        setqty={setqty}
      />
      {showOwner && (
        <OwnerList showOwner={showOwner} setShowOwner={setShowOwner} />
      )}
      {expandImage && (
        <ImageZoom url={expandUrl} handleClose={handleCloseExpandImage} />
      )}
      <BurnTokenPopup />
      {showPopup && <OpenModal />}
    </section>
  );
}

export default NftDetails;
