// ==================================================
// 광나루 리버스 홈페이지 설정 파일
// 이 파일만 수정하면 홈페이지 내용을 쉽게 바꿀 수 있습니다.
// ==================================================

const SITE = {
  "팀 이름": "광나루 리버스",
  "영문명": "GANGNARU RIVERS",
  "슬로건": "모임에서 시작해, 함께 뛰고 함께 성장하는 야구단.",
  "설립연도": "2026",
  // 팀 기본 정보
  info: {
    "지역": "광나루 및 광나루 야구장",
    "sport": "야구",
    "status": "ACTIVE"
  },
  // 다음 경기
  nextGame: {
    "날짜": "미정",
    "상대팀": "미정",
    "경기장": "광나루 야구장"
  },
  // 최근 경기
  results: [
    { date: "09.27", home: "광나루 리버스", score: "7 : 4", away: "BLUE WINGS", result: "승" },
  ],
  // 선수단
  // 새 선수를 추가하려면 { ... }, 한 줄을 추가하세요.
  players: [
    { number: "7", name: "김리버", position: "내야수", batting: "우투우타" },
    { number: "18", name: "박나루", position: "투수", batting: "우투우타" },
    { number: "23", name: "이강", position: "외야수", batting: "좌투좌타" },
    { number: "10", name: "최리버", position: "포수", batting: "우투우타" },
    { number: "32", name: "정한강", position: "내야수", batting: "우투좌타" },
    { number: "99", name: "홍나루", position: "외야수", batting: "우투우타" }
  ],
  // 시즌 기록
  stats: {
    games: 1,
    wins: 0,
    draws: 0,
    losses: 0,
    winRate: "0.000"
  },
  // 갤러리
  // 사진을 넣으려면 images 폴더에 파일을 넣고 경로를 적으세요.
  gallery: [
    { title: "MAIN", image: "https://drive.google.com/file/d/1yf2DpZx8R6iy_62T4bKF7c5v5yfBolFC/view?usp=drive_link" },
    { title: "TEAM", image: "images/team.jpg" },
    { title: "BASEBALL", image: "images/game2.jpg" },
    { title: "RIVERS", image: "images/game3.jpg" }
  ],
  
  // 가입 문의 사이트
  joinLink: "https://onlycomputeronly-source.github.io/gwangnaru-rivers-join/"
};