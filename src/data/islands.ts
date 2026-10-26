// Island content, summarized from the FHNet official site knowledge base
// (the same source the official site's AI assistant 小Paul answers from).

export const SITE = 'https://www.fhnet.com.tw'

export type Goal = {
  id: string
  title: string
  summary: string
  points: string[]
  url: string
}

export type IslandKind = 'hub' | 'main' | 'ext'

export type Island = {
  id: string
  kind: IslandKind
  no: string
  name: string
  tagline: string
  intro: string
  color: string
  // Polar placement around the hub: degrees clockwise from north, distance from origin.
  angle: number
  distance: number
  r: number
  link?: string
  url: string
  guide: string[]
  goals: Goal[]
}

export const ISLANDS: Island[] = [
  {
    id: 'hq',
    kind: 'hub',
    no: 'HQ',
    name: '富鴻網總部',
    tagline: '數位轉型服務的提供者',
    intro:
      '富鴻網主要股東為遠傳電信、鴻海集團與中鋼集團，全台 16 處服務據點、數百位工程師與研發人員，以 ICT 為基礎建構 IoT 智能應用，提供一條龍數位化解決方案與端到端技術服務。',
    color: '#5b8fd6',
    angle: 0,
    distance: 0,
    r: 11,
    url: `${SITE}/about/profile`,
    guide: [
      '歡迎來到富鴻網解決方案島！我是小Paul，富鴻網的 AI 小幫手。',
      '中間這座是總部島，六座主島是我們的六大解決方案，外圍四座是延伸島：最新消息、實績案例、企業永續與服務據點。',
      '富鴻網的願景是「開創數位未來，共享數位生活」。走過橋去逛逛吧！',
      '對了，總部旁邊就是內湖彩虹河濱公園，在那裡可以看到對岸松山機場的飛機起降喔！',
    ],
    goals: [
      {
        id: 'hq-profile',
        title: '關於富鴻網',
        summary: '遠傳電信、鴻海集團、中鋼集團為主要股東，專注資通訊與產業數位轉型的系統整合商。',
        points: ['全台 16 處服務據點', '雲端、存儲、網通、資安、終端、7x24 維運', '服務電信、政府、醫療、製造、交通、物流、零售等產業'],
        url: `${SITE}/about/profile`,
      },
      {
        id: 'hq-milestone',
        title: '里程碑',
        summary: '從 5G 企業專網到海上風場基地台，近年持續擴大服務版圖與海外場域。',
        points: ['2025 完成全台首座海上風場基地台建置', '2024 獲 Vertiv 原廠經銷授權', '2023 5G 專頻專網最多場域主認可'],
        url: `${SITE}/about/milestone`,
      },
      {
        id: 'hq-team',
        title: '經營團隊',
        summary: '結合集團資源與多年產業經驗，以客戶需求為導向提供全方位解決方案。',
        points: ['以技術創新為發展引擎', '快速整合為燃料', '加速釋放數位價值'],
        url: `${SITE}/about/management-team`,
      },
    ],
  },
  {
    id: 'city',
    kind: 'main',
    no: '01',
    name: '智慧城市',
    tagline: '感測、通訊與雲平台，讓城市自己回報狀態',
    intro:
      '運用 IoT 感測器、多元通訊與雲平台，搭配機器視覺、AI 與邊緣運算，讓公部門完成自動化事件回報、狀態分析、災害預防與趨勢預測。',
    color: '#4fa3c7',
    angle: 0,
    distance: 32,
    r: 10,
    link: 'hq',
    url: `${SITE}/solution/cloud-service/overview`,
    guide: [
      '這裡是智慧城市島。路燈不只是路燈：台北市 5G 智慧杆把環境感測、5G 微基站、充電樁都裝進同一根桿子。',
      '旁邊的智慧站牌會顯示公車到站、空氣品質，還提供 WiFi 熱點。',
    ],
    goals: [
      {
        id: 'city-pole',
        title: '5G 智慧杆',
        summary: '台北市 5G 智慧杆 POC，富鴻網負責環境數據感測，一根桿子集 7 大應用於一身。',
        points: ['溫濕度、淹水、空品感測', '三家電信 5G 微基站', '充電樁、交通監視、數位看板'],
        url: `${SITE}/cases/IoT/cloud-service/06`,
      },
      {
        id: 'city-busstop',
        title: '智慧站牌',
        summary: '台北市、高雄市智慧候車亭，即時公車資訊與城市資訊推播。',
        points: ['即時公車到站與路線圖', '空品、天氣、跑馬燈推播', '熱點 WiFi 與即時影像'],
        url: `${SITE}/cases/IoT/environment-safety/02`,
      },
      {
        id: 'city-ami',
        title: 'AMI 智慧電表',
        summary: '台電低壓 AMI 通訊系統建置，數量全台最多、涵蓋花蓮到台南 17 縣市。',
        points: ['FAN 通訊模組與頭端系統', '用電度數無線回傳', '支援需量反應與用電分析'],
        url: `${SITE}/cases/IoT/environment-safety/01`,
      },
      {
        id: 'city-rescue',
        title: '5G 數位 AI 救援平台',
        summary: '為消防署整合無人機、行動指揮車、AR 眼鏡與 5G O-RAN 專網，依 INSARAG 標準開發 10 大模組。',
        points: ['無人機空拍建構災區地形', 'AR 眼鏡遠端指導', '協助 918 花蓮玉里震災救援'],
        url: `${SITE}/cases/IoT/cloud-service/01`,
      },
    ],
  },
  {
    id: 'mfg',
    kind: 'main',
    no: '02',
    name: '智慧製造',
    tagline: 'AGV、AI 影像與機聯網，打造人機協同工廠',
    intro: '從物流倉儲到製造產線，整合無人搬運、自動倉儲、AI 檢測與設備聯網，向上串接 WMS、MES、ERP，協助工廠邁向工業 4.0。',
    color: '#e0a03a',
    angle: 60,
    distance: 32,
    r: 10,
    link: 'hq',
    url: `${SITE}/solution/IM/AGV`,
    guide: ['智慧製造島上那台跑來跑去的就是 AGV 無人搬運車，採二維碼與 SLAM 導引，佈署比磁軌更彈性。', 'AI 影像辨識可以做瑕疵檢測、混料偵測，樣本少也能訓練模型。'],
    goals: [
      {
        id: 'mfg-agv',
        title: 'AGV 應用',
        summary: '二維碼與 SLAM 導引的無人搬運車，整合機器手臂與輸送設備，實現貨到人作業。',
        points: ['降低人力成本、提升職場安全', '5G／無線通訊靈活佈署路徑', '開放 API 串接 WMS、MES、ERP'],
        url: `${SITE}/solution/IM/AGV`,
      },
      {
        id: 'mfg-ai',
        title: 'AI 影像辨識',
        summary: '瑕疵檢測、物件分類、計數與 AOI 優化，降低誤判並減少人工複檢。',
        points: ['動態影像識別，無需站定', '模型訓練樣本較少', '多物件同時辨識'],
        url: `${SITE}/solution/IM/AI`,
      },
      {
        id: 'mfg-asrs',
        title: '智慧倉儲',
        summary: '儲位、收發貨、揀貨數位化管控，一站式自動搬運與倉儲系統整合，場域已延伸至北美。',
        points: ['無紙化倉儲作業', '即時看板與自動揀貨', '串接 ERP/WMS、AGV、ASRS'],
        url: `${SITE}/solution/IM/ASRS`,
      },
      {
        id: 'mfg-iiot',
        title: '機聯網方案',
        summary: '以邊緣運算擷取設備資料，打造即時戰情中心，做到生產可視化與預知保養。',
        points: ['設備稼動與完工計量管理', '戰情看板跨現場與行動裝置', '第三方資安檢測與改善規劃'],
        url: `${SITE}/solution/IM/IIoT`,
      },
    ],
  },
  {
    id: 'cloud',
    kind: 'main',
    no: '03',
    name: '服務雲應用',
    tagline: '自研物聯網平台，把資料變成決策',
    intro: '以多年 IoT 技術累積的物聯網應用平台，針對公部門與產業客戶的流程痛點，客製系統架構與 IoT Cloud 方案。',
    color: '#8c7bd6',
    angle: 120,
    distance: 32,
    r: 10,
    link: 'hq',
    url: `${SITE}/solution/cloud-service/overview`,
    guide: ['服務雲應用島是我們自研平台的家。E-Thing 物聯數據匯流引擎能接收異質網路的感測資料，還支援 Line 告警。', 'Smart Air 空品平台可以回播 PM2.5 與 VOCs 的時空資料，找出污染熱區。'],
    goals: [
      {
        id: 'cloud-air',
        title: 'Smart Air 空品感測平台',
        summary: '微型戶外空品感測器搭配告警與污染分析工具，已佈建於各縣市。',
        points: ['PM2.5、溫濕度，可擴充 O3、CO、NO2、VOCs', '持續高值與區域標準差告警', '污染玫瑰圖與熱區篩選'],
        url: `${SITE}/solution/cloud-service/air`,
      },
      {
        id: 'cloud-ething',
        title: 'E-Thing 物聯數據匯流引擎',
        summary: '模組化、微服務化的 IoT 平台，延伸出生產設備智慧監診與智慧水情防災。',
        points: ['支援異質網路感測設備', 'SMS、Email、Line 多元告警', '自訂 Dashboard，多種雲端部署'],
        url: `${SITE}/solution/cloud-service/e-thing`,
      },
      {
        id: 'cloud-face',
        title: '人臉辨識',
        summary: '1:1、1:N、N:N 三種辨識模式，涵蓋門禁、差勤、VIP 迎賓與公共安全。',
        points: ['無感門禁，多人同時通行', '陌生人示警與人流分析', '客製通關機整合 MES/HR'],
        url: `${SITE}/solution/cloud-service/facial-recognition`,
      },
      {
        id: 'cloud-property',
        title: '物業管理與物流影資',
        summary: 'Properkeep 以 AI 預知設備故障；物流影資系統串接條碼與監視影像，快速舉證客訴。',
        points: ['設備健康監控與保養追蹤', '全台物流節點影像調閱', '已用於電商物流與超商業者'],
        url: `${SITE}/solution/cloud-service/properkeep`,
      },
    ],
  },
  {
    id: 'energy',
    kind: 'main',
    no: '04',
    name: '再生能源',
    tagline: '光、儲、充一站式綠能服務',
    intro: '以能源服務為理念，提供太陽光電、儲能系統、新能源電池與充電樁，並提供光儲系統免費試算。',
    color: '#5fb36b',
    angle: 180,
    distance: 32,
    r: 10,
    link: 'hq',
    url: `${SITE}/solution/renewable-energy/solar-energy`,
    guide: ['再生能源島上有太陽能板、儲能貨櫃和充電樁。光儲結合可以離峰充電、尖峰放電，省電費又能申請綠電憑證。', '想知道你的廠房裝多少最划算？富鴻網提供光儲系統免費試算。'],
    goals: [
      {
        id: 'energy-solar',
        title: '太陽光電發電系統',
        summary: '規劃設計、模擬鋪排、統包施工到專業維護的一站式顧問服務。',
        points: ['屋頂型、屋頂鋼棚型、地面型', '桃園塑膠廠 380kWp 實績', '臺大雲林分部停車場光電'],
        url: `${SITE}/solution/renewable-energy/solar-energy`,
      },
      {
        id: 'energy-storage',
        title: '企業型／家用型儲能',
        summary: '削峰填谷避免超約，斷電時自動切換供電，並可結合太陽能回饋電網。',
        points: ['企業型 250kW 以上', '家用型 5kW', '台中三井 Outlet 光儲合一'],
        url: `${SITE}/solution/renewable-energy/energy-storage`,
      },
      {
        id: 'energy-battery',
        title: '新能源電池',
        summary: '儲能型與動力型鋰鐵電池，循環壽命約為一般鋰電池 4–5 倍。',
        points: ['通過 IEC 62619 與 UN38.3', '可客製 2–5kW', '適用儲能、電動車與船舶'],
        url: `${SITE}/solution/renewable-energy/new-energy`,
      },
      {
        id: 'energy-ev',
        title: '電動車充電樁',
        summary: '30–300kW 直流快充，相容 CCS1、CCS2、CHAdeMO 等規範。',
        points: ['單槍、雙槍機型', 'IP54 防護', '絕緣、過電流、短路多重保護'],
        url: `${SITE}/solution/renewable-energy/charging-pile`,
      },
    ],
  },
  {
    id: 'eng',
    kind: 'main',
    no: '05',
    name: '工程服務',
    tagline: '5G 專網、機房與通信工程，全年無休',
    intro: '電信、傳輸、網路、工程、應用與服務全方位系統整合，從 5G 企業專網、機房建置到 7x24 維運。',
    color: '#d96b5a',
    angle: 240,
    distance: 32,
    r: 10,
    link: 'hq',
    url: `${SITE}/solution/engineering/enterprise-network`,
    guide: ['工程服務島的基地台代表我們的 5G 企業專網：開放式 O-RAN 架構，國內第一套端到端全國產化設備。', '從阿里山林業鐵路光纖到高捷紅線通信涵蓋，都是工程團隊的作品。'],
    goals: [
      {
        id: 'eng-5g',
        title: '5G 企業專網',
        summary: '端到端 5G SA 系統整合，O-RAN 開放架構，依企業需求客製高規格連網。',
        points: ['國產化設備、開放架構', 'IP3X／IP65 多場域 RU', '義大 5G 智慧樂園、天文館 5G 開放架構'],
        url: `${SITE}/solution/engineering/enterprise-network`,
      },
      {
        id: 'eng-room',
        title: '機房建置',
        summary: '電力、空調、光纖、模組化機櫃與環控系統，符合國際電信機房標準。',
        points: ['N+1、2N+1 電力架構', '冷熱通道氣流管理', '環控即時告警'],
        url: `${SITE}/solution/engineering/computer-facilities`,
      },
      {
        id: 'eng-telecom',
        title: '電信／電纜規劃建置',
        summary: '基地台布建、室內涵蓋、微波通訊與 RF 量測優化，一路做到電信共構工程。',
        points: ['中央隧道通信涵蓋共構', '高捷紅線行動通信涵蓋', '阿里山林鐵、台鐵光纜佈放'],
        url: `${SITE}/solution/engineering/telecom`,
      },
      {
        id: 'eng-7x24',
        title: '7x24 維運與 CCTV',
        summary: '全台不限地點、全年無休的維護檢修，並提供 CCTV 監控系統建置。',
        points: ['5x8／5x12／7x24 服務等級', '定期保養與完善後勤保固', 'CCTV 雙重備援與 AI 事件告警'],
        url: `${SITE}/solution/engineering/7X24`,
      },
    ],
  },
  {
    id: 'agents',
    kind: 'main',
    no: '06',
    name: '代理銷售',
    tagline: '5G 設備、電源與散熱，原廠授權',
    intro: '代理 5G O-RAN 設備、Vertiv 電源與液冷系統、Speedlink 天線與 Yuasa 電池，支援資料中心與通信網路。',
    color: '#c7799f',
    angle: 300,
    distance: 32,
    r: 10,
    link: 'hq',
    url: `${SITE}/solution/agents/5g-equipment`,
    guide: ['代理銷售島是產品展示館。我們是 Vertiv 原廠授權經銷，AI 資料中心需要的液冷與 UPS 都找得到。', '5G 的 Indoor／Outdoor RU 與 Small Cell 也在這裡。'],
    goals: [
      {
        id: 'agents-5g',
        title: '5G 設備',
        summary: 'O-RAN Indoor／Outdoor RU 與 All-in-one Small Cell，支援 n78、n79 頻段。',
        points: ['4T4R／8T8R 機型', 'O-RAN option 7.2', 'IP20 到戶外型'],
        url: `${SITE}/solution/agents/5g-equipment`,
      },
      {
        id: 'agents-cool',
        title: '液冷／氣冷系統',
        summary: 'Vertiv Liebert XDU 液冷與機房空調，協助 AI 高密度運算降低能耗與碳足跡。',
        points: ['液冷制冷 450–1250kW', '氣冷制冷 150–350kW', '縮減機房空間需求'],
        url: `${SITE}/solution/agents/liquid-cool`,
      },
      {
        id: 'agents-power',
        title: 'SMR、UPS 與 Smart Cabinet',
        summary: 'Vertiv NetSure 整流、Liebert UPS 與預製式 Smart Cabinet 一體化機櫃。',
        points: ['UPS 整機效率 >96%', 'Smart Cabinet PUE<1.27', '遠程監測、集中控管'],
        url: `${SITE}/solution/agents/power-supply`,
      },
      {
        id: 'agents-antenna',
        title: '天線與電池',
        summary: 'Speedlink 客製化基站天線與 Yuasa 基地台、UPS 用電池。',
        points: ['多頻段 Massive MIMO 天線', '電調傾角 RCU 整合', 'Yuasa NPA／UXH 系列'],
        url: `${SITE}/solution/agents/speedlink`,
      },
    ],
  },
  {
    id: 'news',
    kind: 'ext',
    no: '延伸',
    name: '最新消息',
    tagline: '5G 智慧樂園、衛星金獎與永續校園',
    intro: '富鴻網近期的專案發表與獲獎消息。',
    color: '#e8b04b',
    angle: 0,
    distance: 58,
    r: 8,
    link: 'city',
    url: `${SITE}/press-center/news`,
    guide: ['看到摩天輪了嗎？那是全台首座 5G 智慧樂園，我們在高雄義大遊樂世界擔任系統整合核心。'],
    goals: [
      {
        id: 'news-park',
        title: '全台首座 5G 智慧樂園',
        summary: '攜手義大遊樂世界與資策會，以 5G 專網與 Open RAN 結合生成式 AI 打造沉浸式娛樂。',
        points: ['2026-06-17 發表', '亞灣 5G AIoT 計畫里程碑', '富鴻網為系統整合核心'],
        url: `${SITE}/press-center/news/105`,
      },
      {
        id: 'news-satellite',
        title: '衛星數位應用創新大賽金獎',
        summary: '遠洋漁船智慧遠距醫療衛星平台，首次把 5G 專網延伸到遠洋。',
        points: ['數位部數位產業署主辦', '衛星 + 5G 專網即時影像', 'AI 輔助診斷'],
        url: `${SITE}/press-center/news/101`,
      },
      {
        id: 'news-museum',
        title: '5G 智慧博物館',
        summary: '協助天文館以單一網管平台整合多廠牌 5G 開放架構設備，結合 AI 與 MR 導覽。',
        points: ['全國首創多廠牌整合', '5G 彈性組網', '沉浸式導覽與智慧客服'],
        url: `${SITE}/press-center/news/97`,
      },
    ],
  },
  {
    id: 'cases',
    kind: 'ext',
    no: '延伸',
    name: '實績案例',
    tagline: '橫跨 IoT、ICT、工程與再生能源的落地實績',
    intro: '從半導體封裝 AGV 到醫院 5G 消毒機器人，看看各產業怎麼和富鴻網一起數位轉型。',
    color: '#6fa8dc',
    angle: 120,
    distance: 58,
    r: 8,
    link: 'cloud',
    url: `${SITE}/cases`,
    guide: ['實績案例島收藏了各產業的導入故事，點進去可以看到完整的專案介紹。'],
    goals: [
      {
        id: 'cases-agv',
        title: '半導體與電子業 AGV',
        summary: 'IC 封裝、被動元件、家電與電子製造業的 AGV 規劃。',
        points: ['IC 封裝半導體產業', '全球被動元件領導廠商', '家用電器製造業'],
        url: `${SITE}/cases/IoT/AGV/01`,
      },
      {
        id: 'cases-robot',
        title: '聯合醫院 5G 消毒機器人',
        summary: 'UV 消毒機器人搭配物資運送，減少醫護進出隔離病房的感染風險。',
        points: ['5G 專網與院方網路獨立', '自動回充與自我消毒', '送藥、送餐任務'],
        url: `${SITE}/cases/IoT/environment-safety/03`,
      },
      {
        id: 'cases-hospital',
        title: '醫療權威機構機房',
        summary: '醫療機構機房建置與大型醫院通信涵蓋共構工程。',
        points: ['機房電力與空調規劃', '環控監控', '通信涵蓋共構'],
        url: `${SITE}/cases/ICT/server-room/01`,
      },
    ],
  },
  {
    id: 'esg',
    kind: 'ext',
    no: '延伸',
    name: '企業永續',
    tagline: '2050 淨零、友善職場與生物多樣性',
    intro: '承諾 2050 年營運據點淨零碳排，推動溫室氣體盤查與綠色供應鏈，並打造友善工作環境。',
    color: '#7cc08a',
    angle: 180,
    distance: 58,
    r: 8,
    link: 'energy',
    url: `${SITE}/about/esg`,
    guide: ['企業永續島種滿了樹。富鴻網承諾 2050 年淨零排放，也連續獲得台北市綠運輸 ESG 肯定。'],
    goals: [
      {
        id: 'esg-netzero',
        title: '2050 淨零排放',
        summary: '導入溫室氣體盤查，持續監控耗能設備，推動 LED 照明與綠色採購。',
        points: ['範疇 1+2 淨零目標', '年度溫室氣體盤查報告', '2023 綠色採購績優企業'],
        url: `${SITE}/about/esg`,
      },
      {
        id: 'esg-workplace',
        title: '友善職場',
        summary: '彈性工時與工作地點、專職職護、員工托育與完整進修補助。',
        points: ['富鴻網人權政策', '家庭照顧與育嬰支持', '技職教育訓練補助'],
        url: `${SITE}/about/esg`,
      },
      {
        id: 'esg-bio',
        title: '生物多樣性',
        summary: '揭露保護生物多樣性宣言，並以再生能源工程推動永續校園。',
        points: ['生物多樣性宣導', '臺大永續校園示範場域', '資源回收再利用'],
        url: `${SITE}/about/esg`,
      },
    ],
  },
  {
    id: 'offices',
    kind: 'ext',
    no: '延伸',
    name: '服務據點',
    tagline: '北中南工程服務隊，就在你附近',
    intro: '台北總公司、台中與高雄辦公室，北中南三區工程服務隊駐點涵蓋全台。',
    color: '#9aa5b1',
    angle: 240,
    distance: 58,
    r: 8,
    link: 'eng',
    url: `${SITE}/contact`,
    guide: ['需要專人服務嗎？業務信箱是 welcome@fhnet.com.tw，電話 (02) 5582-8501。'],
    goals: [
      {
        id: 'offices-taipei',
        title: '台北總公司',
        summary: '台北市內湖區堤頂大道二段 239 號 7 樓，電話 (02) 5582-8501。',
        points: ['北區駐點：台北、基隆、桃園', '新竹、宜蘭、花蓮', '業務信箱 welcome@fhnet.com.tw'],
        url: `${SITE}/contact`,
      },
      {
        id: 'offices-taichung',
        title: '台中辦公室',
        summary: '臺中市東區南京路 117-7 號 2 樓，電話 (04) 3509-1377。',
        points: ['中區駐點：台中、苗栗、彰化', '雲林、南投'],
        url: `${SITE}/contact`,
      },
      {
        id: 'offices-kaohsiung',
        title: '高雄辦公室',
        summary: '高雄市前金區中華四路 293 號 6 樓，電話 (07) 958-0900。',
        points: ['南區駐點：嘉義、台南、高雄', '屏東、台東'],
        url: `${SITE}/contact`,
      },
    ],
  },
]

export const ALL_GOALS = ISLANDS.flatMap((island) => island.goals.map((goal) => ({ ...goal, islandId: island.id })))

export function islandById(id: string): Island | undefined {
  return ISLANDS.find((i) => i.id === id)
}

export function islandPosition(island: Pick<Island, 'angle' | 'distance'>): { x: number; z: number } {
  const a = (island.angle * Math.PI) / 180
  return { x: Math.sin(a) * island.distance, z: -Math.cos(a) * island.distance }
}

// Case-insensitive search over island and goal text; returns matching island ids in display order.
export function searchIslands(query: string): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return ISLANDS.map((i) => i.id)
  return ISLANDS.filter((island) => {
    const text = [island.name, island.tagline, island.intro, ...island.goals.flatMap((g) => [g.title, g.summary, ...g.points])]
    return text.some((t) => t.toLowerCase().includes(q))
  }).map((i) => i.id)
}
