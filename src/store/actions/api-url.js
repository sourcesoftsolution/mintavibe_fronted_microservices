const apiURl = {
  CuratedNft: "/curatednft",
  TrendingNft: "/trendingnft",
  AllFavNft: "/favnft",
  CreatorList: "/femalecreator",
  GetCollections: "/collections",
  UserDetails: "/users",
  userData: '/userData',
  EditUser: "/users",
  GetUsers: "/users",
  ProfileListing: "/listing",
  Products: "/nft",
  allNftList: "/allNftList",
  CollectedNft: "/collectednft",
  AlchemyFetch: "/alchemyfetch",
  GetCategory: "/category",
  GetCreatorCategory: "/creatortype",
  ContractNonce: "/contractnonce",
  Nft: "/nft",
  NftMulti: "/multinft",
  newCollwction: "/new-collection",
  editMultinft: "/editMultinft",
  XummBalance: "/xumm-balance",
  XummNftPrice: "/xumm-nft-price",
  SellBroker: `/sell-broker`,
  BuyBroker: `/buy-broker`,
  Buy: `/buy`,
  acceptBid: '/accept-bid',
  paymentGate: "/payment-price",
  createPayment: "/create-payment",
  verifyPayment: "/verify-payment",
  singup: "/signup",
  otpverify: "/otpverify",
  login: "/login",
  forgetpassword: "/forgetpassword",
  resetpass: "/resetpass",
  activityDetails: "/notification",
  contactus: "/contactus",
  profileFollowers: "/totalfollower",
  profileFollowing: "/totalfollowing",
  Bid: "/bid",
  customerdata: "/customerdata",
  categorydata: '/categorydata',
  // TrendingNft: '/trendingnft',
  // TrendingNft: '/trendingnft',
  filterData: "/allNftList",
  artist: "/artist",
  userprofilefilter: "/userprofilefilter",
  activity: "/activity",
  subscribe: "/subscribe",
  blogs: "/blog",
  allowners: "/allowners",
  ErrorData: "/errordata",
  helpmail: '/helpmail',
  celebdata: "/celebdata",
  celebritylist:"/celebritylist"
  ,testxummbuy:"/testxummbuy"
  ,xummTransfer:"/xummTransfer"

};

export const NotificationMsg = {
  NotConnect: "Please connect your wallet to proceed.",
  wallet: "Please connect your wallet to proceed.",
  NotFound: `NO PAGE FOUND`,
  error: `Something went wrong`,
  mint: `Minted Successfully`,
  ipfs: `Data Converted into CID hash (content identifier)`,
  socket: `Connection not established`,
  connect: `Wallet Connected`,
  approved: `Collection hasbeen approved`,
  sell: `Sell broker created`,
  buyoffer: `Buy offer created`,
  buy: `Buy collection`,
  errorType: "File type is not valid",
  SelectNftType: "Please select contract type",
  reConnect: `Please disconnect other wallet`,
  fileUpload15MB: `Invalid file size!. Must be less than 15MB`,
  requRejected: `Request has been rejected.`,

  copyText: `Address copied successfully!`,
  changeWallet: `Please connect your %s wallet to proceed`,
  Balance: `You Don't have enough balance %s`,
  BuySuccess: `Bought successfully`,
  putOnSaleMsg: `Successfully Published`,
  putOnSaleBackMsg: `Successfully un-published`,
  offerCreate: `Offer created successfully`,
  offerCancel: `Offer canceled successfully`,
  Qty: `Please Enter The Qty`,

};

export const validationMessages = {
  image: `File is required`,
  name: `Name is required`,
  nameMax: `Name is too long ( Maximum 100 characters )`,
  NoFcopies: `Copies are Required`,
  categories: `Categories are required`,
  price: `Price is required`,
  royalty: `Royalty is required`,
  coverimage: `Cover image is required`,
  descriptionMax: "Description is too long ( Maximum 1000 characters )",
  descriptionLow: "Description is required",
  fName: `First name is required. `,
  lName: `Last name is required. `,
  allowAlphabets: `This field allow alphabets only.`,
  emailReq: `Email is required.`,
  validEmail: `Enter valid Email`,
  passwReq: `Password is required`,
  validPass: `Password must included atleast`,
  cpasswReq: `Confirm passwords is required`,
  notMatchPassw: `Password and confirm should be same`,
  phoneReq: `Contact number is required`,
  validMobile: `Please enter a valid mobile number.`,
  reqEnquiryType: "Enquiry type is required.",
  reqQueryMessage: "Query message is required.",
  allowMax8: "Allow max 8 characters.",
  Time_from: "From time is required",
  royality: `Royality should be less Than %s or min 0`,
  otpEnter: "Please enter OTP.",
  validOtp: `Please enter a valid OTP.`,
  invalTime: "Please enter a valid time.",
  sameTime: "To time should be greater than Form time.",
  longBio: `Bio is too long ( Maximum 500 characters )`,
  longUserName: `Username is too long ( Maximum 25 characters )`,
};

export default apiURl;
