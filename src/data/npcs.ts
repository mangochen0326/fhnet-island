// Residents of each business zone. Lines are paraphrased from the FHNet official
// site knowledge base; `goalId` links the talk to the matching service card.

export type NpcLook = 'suit' | 'worker' | 'engineer' | 'coat' | 'casual'

export type Npc = {
  id: string
  islandId: string
  role: string
  look: NpcLook
  color: string
  lines: string[]
  goalId?: string
}

export const NPCS: Npc[] = [
  // 總部
  {
    id: 'hq-hr',
    islandId: 'hq',
    role: '人資夥伴',
    look: 'casual',
    color: '#e07a5f',
    lines: ['歡迎參觀總部！富鴻網提供彈性工時、彈性工作地點，還有專職職護與特約醫師。', '想加入我們？人才招募信箱是 hr@fhnet.com.tw。'],
    goalId: 'hq-profile',
  },
  {
    id: 'hq-pr',
    islandId: 'hq',
    role: '總經理室發言人',
    look: 'suit',
    color: '#3d6fb6',
    lines: ['我們的股東是遠傳電信、鴻海集團和中鋼集團。', '2025 年我們完成了全台首座海上風場基地台，AMI 智慧電表建置數量也是全台最多。'],
    goalId: 'hq-milestone',
  },

  // 01 智慧城市
  {
    id: 'city-planner',
    islandId: 'city',
    role: '智慧城市規劃師',
    look: 'suit',
    color: '#4fa3c7',
    lines: ['這根 5G 智慧杆裡有溫濕度、淹水、空品感測器，還有三家電信的微基站。', '台北市政府大樓旁的松智路，就有我們參與的智慧杆 POC。'],
    goalId: 'city-pole',
  },
  {
    id: 'city-commuter',
    islandId: 'city',
    role: '通勤上班族',
    look: 'casual',
    color: '#f2a65a',
    lines: ['我每天看智慧站牌等公車，到站時間、空氣品質一目了然。', '聽說台北和高雄的智慧候車亭都是富鴻網建置管理的。'],
    goalId: 'city-busstop',
  },
  {
    id: 'city-rescuer',
    islandId: 'city',
    role: '特搜隊員',
    look: 'worker',
    color: '#e2483d',
    lines: ['5G 數位 AI 救援平台讓我們能用無人機空拍災區，指揮中心即時看到現場。', '918 花蓮玉里震災，智慧搜救平台也派上用場。'],
    goalId: 'city-rescue',
  },

  // 02 智慧製造
  {
    id: 'mfg-agv',
    islandId: 'mfg',
    role: 'AGV 工程師',
    look: 'engineer',
    color: '#f5a623',
    lines: ['我們的 AGV 用二維碼和 SLAM 導引，不用在地上鋪磁軌，換產線也很快。', '它能和 WMS、MES、ERP 串接，做到貨到人的揀料作業。'],
    goalId: 'mfg-agv',
  },
  {
    id: 'mfg-qc',
    islandId: 'mfg',
    role: '品管主任',
    look: 'coat',
    color: '#ffffff',
    lines: ['以前布料瑕疵要靠人眼檢查，現在 AI 影像辨識一邊跑一邊判斷。', '訓練模型需要的樣本比較少，還能同時辨識多個物件。'],
    goalId: 'mfg-ai',
  },
  {
    id: 'mfg-manager',
    islandId: 'mfg',
    role: '工廠廠長',
    look: 'suit',
    color: '#c98f3a',
    lines: ['導入機聯網後，每台機器的稼動率都在戰情看板上，連手機都看得到。', '分析累積的機台數據，可以在故障前就安排保養。'],
    goalId: 'mfg-iiot',
  },

  // 03 服務雲應用
  {
    id: 'cloud-dev',
    islandId: 'cloud',
    role: '平台工程師',
    look: 'casual',
    color: '#8c7bd6',
    lines: ['E-Thing 是我們自研的物聯數據匯流引擎，採微服務架構，能接各種異質感測設備。', '告警可以走 SMS、Email 或 Line，儀表板也能自己拖拉配置。'],
    goalId: 'cloud-ething',
  },
  {
    id: 'cloud-env',
    islandId: 'cloud',
    role: '環保局承辦',
    look: 'suit',
    color: '#5fb36b',
    lines: ['Smart Air 空品平台能回播 PM2.5 與 VOCs 的時空資料，找出污染熱區。', '感測器還會和環保署測站做平行比對，確保資料品質。'],
    goalId: 'cloud-air',
  },
  {
    id: 'cloud-guard',
    islandId: 'cloud',
    role: '大樓保全',
    look: 'worker',
    color: '#2b3a55',
    lines: ['人臉辨識門禁可以多人同時無感通行，陌生人進來也會示警。', '我們的通關機還能和 HR 系統串接，差勤紀錄自動完成。'],
    goalId: 'cloud-face',
  },

  // 04 再生能源
  {
    id: 'energy-advisor',
    islandId: 'energy',
    role: '綠能顧問',
    look: 'suit',
    color: '#5fb36b',
    lines: ['太陽能加表後儲能，離峰充電、尖峰放電，電費省下來還能申請綠電憑證。', '我們提供光儲系統免費試算，來信 welcome@fhnet.com.tw 就有專人服務。'],
    goalId: 'energy-storage',
  },
  {
    id: 'energy-installer',
    islandId: 'energy',
    role: '光電施工隊長',
    look: 'worker',
    color: '#f2c14e',
    lines: ['屋頂型、鋼棚型、地面型的太陽能我們都做過，從規劃到維護一條龍。', '桃園塑膠廠 380kWp 和臺大雲林分部停車場都是我們的工地。'],
    goalId: 'energy-solar',
  },
  {
    id: 'energy-driver',
    islandId: 'energy',
    role: '電動車車主',
    look: 'casual',
    color: '#4a90d9',
    lines: ['這支直流快充樁最高 300kW，CCS 和 CHAdeMO 接頭都能用。', 'IP54 防護，下雨天充電也安心。'],
    goalId: 'energy-ev',
  },

  // 05 工程服務
  {
    id: 'eng-rf',
    islandId: 'eng',
    role: 'RF 工程師',
    look: 'engineer',
    color: '#d96b5a',
    lines: ['5G 企業專網用開放式 O-RAN 架構，是國內第一套端到端全國產化設備。', '義大遊樂世界的 5G 智慧樂園，就是我們做的系統整合。'],
    goalId: 'eng-5g',
  },
  {
    id: 'eng-ops',
    islandId: 'eng',
    role: '7x24 維運值班員',
    look: 'worker',
    color: '#9aa5b1',
    lines: ['全台不限地點，5x8、5x12 到 7x24 的服務等級都有。', '零件短缺時，我們用同品質的零件、在最短時間送到現場換修。'],
    goalId: 'eng-7x24',
  },
  {
    id: 'eng-room',
    islandId: 'eng',
    role: '機房架構師',
    look: 'coat',
    color: '#e8eef2',
    lines: ['機房電力我們規劃 N+1 或 2N+1，冷熱通道分離避免熱點。', '環控系統會把溫濕度、UPS、消防狀態即時傳到監控中心。'],
    goalId: 'eng-room',
  },

  // 06 代理銷售
  {
    id: 'agents-sales',
    islandId: 'agents',
    role: '產品業務',
    look: 'suit',
    color: '#c7799f',
    lines: ['我們是 Vertiv 原廠授權經銷，AI 資料中心需要的液冷、UPS 都能提供。', 'Liebert XDU 液冷系統制冷量最高到 1250kW。'],
    goalId: 'agents-cool',
  },
  {
    id: 'agents-fae',
    islandId: 'agents',
    role: '技術支援工程師',
    look: 'engineer',
    color: '#4fa3c7',
    lines: ['5G Indoor RU 支援 n78、n79 頻段，符合 O-RAN option 7.2。', 'Speedlink 天線可以依現場環境客製，因應 5G 基站倍增的需求。'],
    goalId: 'agents-5g',
  },

  // 延伸島
  {
    id: 'news-reporter',
    islandId: 'news',
    role: '科技記者',
    look: 'casual',
    color: '#e8b04b',
    lines: ['2026 年 6 月，全台首座 5G 智慧樂園在義大遊樂世界發表。', '富鴻網的遠洋漁船遠距醫療衛星平台，也拿下衛星數位應用創新大賽金獎。'],
    goalId: 'news-park',
  },
  {
    id: 'cases-nurse',
    islandId: 'cases',
    role: '醫院護理長',
    look: 'coat',
    color: '#ffffff',
    lines: ['5G 消毒機器人會幫隔離病房送藥送餐，任務結束還會自我消毒。', '院內的 5G 專網和醫院網路是分開的，資安更安心。'],
    goalId: 'cases-robot',
  },
  {
    id: 'esg-officer',
    islandId: 'esg',
    role: '永續專員',
    look: 'casual',
    color: '#7cc08a',
    lines: ['富鴻網承諾 2050 年營運據點淨零碳排，每年都做溫室氣體盤查。', '我們也揭露了保護生物多樣性宣言。'],
    goalId: 'esg-netzero',
  },
  {
    id: 'offices-desk',
    islandId: 'offices',
    role: '服務櫃台',
    look: 'suit',
    color: '#9aa5b1',
    lines: ['台北總公司電話 (02) 5582-8501，台中 (04) 3509-1377，高雄 (07) 958-0900。', '北中南三區都有工程服務隊駐點，全台共 16 處服務據點。'],
    goalId: 'offices-taipei',
  },
]

export function npcsOf(islandId: string): Npc[] {
  return NPCS.filter((n) => n.islandId === islandId)
}
