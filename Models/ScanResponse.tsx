export interface ScanResponse {
  response: Response;
  status:   number;
}

export interface Response {
  success:         boolean;
  hasAReward:      boolean;
  id:              number;
  name:            string;
  balance:         number;
  lifeTimeBalance: number;
  rewardEarned:    number;
  rewardIssued:    number;
  rewardGoal:      number;
  brandId:         number;
  type:            number;
  discountCode:    null;
  stripeImage:     string;
  campaign:        Campaign;
  expiryDate:      Date;
  availableUsages: number;     
}

export interface Campaign {
  id:                       number;
  name:                     string;
  type:                     number;
  link:                     string;
  maxShares:                number;
  status:                   number;
  discountType:             number;
  discountAmount:           number;
  maxUsages:                number;
  barcodeUrl:               string;
  endDate:                  Date;
  createdDate:              Date;
  lastUpdate:               Date;
  cardId:                   number;
  card:                     Card;
  daysUntilExpiry:          number;
  timeBetwenUsageInMinutes: number;
  usagesPerDay:             number;
}

export interface Card {
  id:                        number;
  name:                      string;
  type:                      number;
  passTypeIdentifier:        null;
  createdDate:               null;
  slogo:                     null;
  welcomeMessage:            null;
  loyalityRewardGoal:        number;
  loyalityLogo:              string;
  loyalityBackgroundImage:   string;
  loyalityUsedStampImage:    null;
  loyalityUnusedStampImage:  null;
  loyalityBackgroundColor:   string;
  loyalityForegroundColor:   string;
  labelColor:                string;
  showCustomerName:          boolean;
  addMoreThanOneStamp:       boolean;
  rewardText:                null;
  rewardDescription:         null;
  logo:                      string;
  thumbnail:                 string;
  brandId:                   number;
  timeBetwenStampsInMinutes: number;
  lastUpdate:                Date;
  barcodeUrl:                string;
  stampNotification:         null;
  earnNotification:          null;
  usageLabel:                null;
}
export interface ScanResponse {
    response: Response;
    status:   number;
}

export interface Response {
    success:         boolean;
    hasAReward:      boolean;
    id:              number;
    name:            string;
    balance:         number;
    lifeTimeBalance: number;
    rewardEarned:    number;
    rewardIssued:    number;
    rewardGoal:      number;
    brandId:         number;
    type:            number;
    discountCode:    null;
    stripeImage:     string;
    campaign:        Campaign;
}

export interface Campaign {
    id:                       number;
    name:                     string;
    type:                     number;
    link:                     string;
    maxShares:                number;
    status:                   number;
    discountType:             number;
    discountAmount:           number;
    maxUsages:                number;
    barcodeUrl:               string;
    endDate:                  Date;
    createdDate:              Date;
    lastUpdate:               Date;
    cardId:                   number;
    card:                     Card;
    daysUntilExpiry:          number;
    timeBetwenUsageInMinutes: number;
    usagesPerDay:             number;
}

export interface Card {
    id:                        number;
    name:                      string;
    type:                      number;
    passTypeIdentifier:        null;
    createdDate:               null;
    slogo:                     null;
    welcomeMessage:            null;
    loyalityRewardGoal:        number;
    loyalityLogo:              string;
    loyalityBackgroundImage:   string;
    loyalityUsedStampImage:    null;
    loyalityUnusedStampImage:  null;
    loyalityBackgroundColor:   string;
    loyalityForegroundColor:   string;
    labelColor:                string;
    showCustomerName:          boolean;
    addMoreThanOneStamp:       boolean;
    rewardText:                null;
    rewardDescription:         null;
    logo:                      string;
    thumbnail:                 string;
    brandId:                   number;
    timeBetwenStampsInMinutes: number;
    lastUpdate:                Date;
    barcodeUrl:                string;
    stampNotification:         null;
    earnNotification:          null;
    usageLabel:                null;
}