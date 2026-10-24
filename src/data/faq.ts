import { SITE } from './islands'

// Canned answers for 小Paul's quick questions, taken from the official site content.
export type Faq = { id: string; q: string; a: string; url?: string }

export const FAQ: Faq[] = [
  {
    id: 'who',
    q: '富鴻網是誰？',
    a: '富鴻網股份有限公司（Field Delivery Service）主要股東為遠傳電信、鴻海集團與中鋼集團，專注資通訊與產業數位轉型，是提供一條龍數位化解決方案的系統整合商。',
    url: `${SITE}/about/profile`,
  },
  {
    id: 'what',
    q: '你們做哪些服務？',
    a: '六大解決方案：智慧城市、智慧製造、服務雲應用、再生能源、工程服務與代理銷售。從 5G 企業專網、AGV、AI 影像辨識，到太陽能與儲能都有。',
    url: `${SITE}/`,
  },
  {
    id: 'contact',
    q: '怎麼聯絡業務？',
    a: '業務聯絡電話 (02) 5582-8501，信箱 welcome@fhnet.com.tw。台北總公司在內湖區堤頂大道二段 239 號 7 樓。',
    url: `${SITE}/contact`,
  },
  {
    id: 'where',
    q: '服務據點在哪？',
    a: '台北總公司、台中與高雄辦公室，加上北中南三區工程服務隊駐點，全台共 16 處服務據點。',
    url: `${SITE}/contact`,
  },
  {
    id: 'solar',
    q: '光儲系統可以試算嗎？',
    a: '可以！富鴻網提供「太陽能＋表後儲能 EMS」免費試算，評估建置成本、電費節省、綠電憑證收益與 IRR。來信 welcome@fhnet.com.tw 會有專人服務。',
    url: `${SITE}/press-center/news/102`,
  },
]
