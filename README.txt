광나루 리버스 홈페이지 - 쉬운 편집 버전

[가장 중요한 파일]
config.js = 팀 정보/선수/경기/기록을 수정하는 곳

[수정 방법]
1. index.html을 더블클릭해서 홈페이지를 확인합니다.
2. 메모장 또는 VS Code로 config.js를 엽니다.
3. 따옴표 안의 내용을 실제 정보로 바꿉니다.
4. 저장하고 index.html을 새로고침합니다.

[사진 넣기]
1. images 폴더를 만듭니다.
2. 사진 파일을 넣습니다. 예: team.jpg
3. config.js의 gallery에서 image: "images/team.jpg"처럼 입력합니다.

[선수 추가]
players 배열에 아래 형식으로 추가:
{ number: "11", name: "홍길동", position: "내야수", batting: "우투우타" },

[경기 추가]
results 배열에 아래 형식으로 추가:
{ date: "10.11", home: "광나루 리버스", score: "8 : 2", away: "상대팀", result: "승" },

※ 현재 들어있는 선수/경기/기록은 예시 데이터입니다.
