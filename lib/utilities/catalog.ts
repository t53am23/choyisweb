export type UtilityProvider = {
  serviceId: string
  name: string
  badge: string
  color?: string
  region?: string
}

// Stable VTpass service identities reused from Choyis TopUpCatalog.
// Product names and prices do not belong here; those are loaded live from VTpass.
export const airtimeProviders: UtilityProvider[] = [
  { serviceId: "mtn", name: "MTN", badge: "M", color: "#FFCC00" },
  { serviceId: "glo", name: "Glo", badge: "G", color: "#50B848" },
  { serviceId: "airtel", name: "Airtel", badge: "A", color: "#E30613" },
  { serviceId: "etisalat", name: "9mobile", badge: "9", color: "#006848" },
]

export const dataProviders: UtilityProvider[] = airtimeProviders.map((provider) => ({
  ...provider,
  serviceId: `${provider.serviceId}-data`,
}))

export const electricityProviders: UtilityProvider[] = [
  { serviceId: "ikeja-electric", name: "Ikeja Electric (IKEDC)", badge: "IK", region: "Lagos" },
  { serviceId: "eko-electric", name: "Eko Electric (EKEDC)", badge: "EK", region: "Lagos" },
  { serviceId: "abuja-electric", name: "Abuja Electric (AEDC)", badge: "AB", region: "Abuja" },
  { serviceId: "ibadan-electric", name: "Ibadan Electric (IBEDC)", badge: "IB", region: "Oyo" },
  { serviceId: "kano-electric", name: "Kano Electric (KEDCO)", badge: "KN", region: "Kano" },
  { serviceId: "jos-electric", name: "Jos Electric (JED)", badge: "JO", region: "Plateau" },
  { serviceId: "enugu-electric", name: "Enugu Electric (EEDC)", badge: "EN", region: "Enugu" },
  { serviceId: "portharcourt-electric", name: "Port Harcourt Electric (PHED)", badge: "PH", region: "Rivers" },
  { serviceId: "benin-electric", name: "Benin Electric (BEDC)", badge: "BE", region: "Edo" },
  { serviceId: "kaduna-electric", name: "Kaduna Electric (KAEDCO)", badge: "KD", region: "Kaduna" },
  { serviceId: "yola-electric", name: "Yola Electric (YEDC)", badge: "YO", region: "Adamawa" },
]

export const tvProviders: UtilityProvider[] = [
  { serviceId: "dstv", name: "DStv", badge: "DS" },
  { serviceId: "gotv", name: "GOtv", badge: "GO" },
  { serviceId: "startimes", name: "StarTimes", badge: "ST" },
]

export const internetProviders: UtilityProvider[] = [
  { serviceId: "smile-direct", name: "Smile", badge: "SM" },
  { serviceId: "spectranet", name: "Spectranet", badge: "SP" },
]
