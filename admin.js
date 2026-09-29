let client = null;
let currentMeetups = [];

const $ = (id) => document.getElementById(id);
const loginView = $("loginView");
const dashboardView = $("dashboardView");
const loginMessage = $("loginMessage");
const formMessage = $("formMessage");
const logoutBtn = $("logoutBtn");

function configured() {
  return typeof SUPABASE_URL === "string" && typeof SUPABASE_ANON_KEY === "string"
    && SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_")
    && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("YOUR_");
}

function showMessage(el, msg, kind = "") {
  el.textContent = msg;
  el.className = `form-message ${kind}`.trim();
}

function showDashboard(show) {
  loginView.classList.toggle("hidden", show);
  dashboardView.classList.toggle("hidden", !show);
  logoutBtn.classList.toggle("hidden", !show);
}

function formatKoreanDate(date) {
  if (!date) return "-";
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat("ko-KR", {year:"numeric", month:"2-digit", day:"2-digit", weekday:"short"}).format(d);
}

async function isAdmin(userId) {
  const { data, error } = await client.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return !!data;
}

async function loadMeetups() {
  const { data, error } = await client.from("meetups").select("id,date,time,place,type,title,note,status,created_at").order("date", {ascending:true}).order("time", {ascending:true});
  if (error) throw error;
  currentMeetups = data || [];
  $("meetupCount").textContent = `${currentMeetups.length}개`;
  renderAdminList();
}

function renderAdminList() {
  const list = $("adminList");
  list.innerHTML = "";
  if (!currentMeetups.length) {
    const empty = document.createElement("div"); empty.className = "admin-empty"; empty.textContent = "등록된 일정이 없습니다."; list.append(empty); return;
  }
  currentMeetups.forEach((m) => {
    const item = document.createElement("article"); item.className = "admin-item";
    const top = document.createElement("div"); top.className = "admin-item-top";
    const date = document.createElement("strong"); date.textContent = formatKoreanDate(m.date);
    const status = document.createElement("span"); status.className = `admin-status ${m.status === "취소" ? "cancel" : m.status === "완료" ? "done" : ""}`; status.textContent = m.status || "예정";
    top.append(date, status);
    const title = document.createElement("h3"); title.textContent = m.title;
    const info = document.createElement("p"); info.textContent = `${m.time || "-"} · ${m.place || "-"} · ${m.type || "모임"}`;
    const actions = document.createElement("div"); actions.className = "admin-item-actions";
    const edit = document.createElement("button"); edit.className = "small-button"; edit.textContent = "수정"; edit.addEventListener("click", () => startEdit(m));
    const del = document.createElement("button"); del.className = "small-button danger"; del.textContent = "삭제"; del.addEventListener("click", () => deleteMeetup(m));
    actions.append(edit, del); item.append(top, title, info, actions); list.append(item);
  });
}

function resetForm() {
  $("meetupForm").reset();
  $("editId").value = "";
  $("formTitle").textContent = "새 일정 등록";
  $("saveBtn").textContent = "일정 등록";
  $("cancelEdit").classList.add("hidden");
  showMessage(formMessage, "");
}

function startEdit(m) {
  $("editId").value = m.id;
  $("date").value = m.date || ""; $("time").value = m.time || ""; $("type").value = m.type || "정기 모임"; $("status").value = m.status || "예정"; $("place").value = m.place || ""; $("title").value = m.title || ""; $("note").value = m.note || "";
  $("formTitle").textContent = "일정 수정"; $("saveBtn").textContent = "수정 내용 저장"; $("cancelEdit").classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}

async function deleteMeetup(m) {
  if (!confirm(`'${m.title}' 일정을 삭제할까요?`)) return;
  showMessage(formMessage, "삭제 중…");
  const { error } = await client.from("meetups").delete().eq("id", m.id);
  if (error) { showMessage(formMessage, error.message, "error"); return; }
  await loadMeetups(); showMessage(formMessage, "삭제했습니다.", "success");
}

$("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!configured()) { showMessage(loginMessage, "먼저 supabase-config.js에 Supabase 주소와 anon key를 넣어주세요.", "error"); return; }
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  showMessage(loginMessage, "로그인 중…");
  const { data, error } = await client.auth.signInWithPassword({ email: $("loginEmail").value.trim(), password: $("loginPassword").value });
  if (error) { showMessage(loginMessage, "로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.", "error"); return; }
  try {
    if (!(await isAdmin(data.user.id))) { await client.auth.signOut(); showMessage(loginMessage, "관리자 권한이 없는 계정입니다.", "error"); return; }
    showDashboard(true); showMessage(loginMessage, ""); await loadMeetups();
  } catch (err) { await client.auth.signOut(); showMessage(loginMessage, "관리자 권한 확인에 실패했습니다. Supabase 설정을 확인하세요.", "error"); }
});

$("logoutBtn").addEventListener("click", async () => { if (client) await client.auth.signOut(); showDashboard(false); });
$("cancelEdit").addEventListener("click", resetForm);

$("meetupForm").addEventListener("submit", async (event) => {
  event.preventDefault(); if (!client) return;
  const payload = { date: $("date").value, time: $("time").value, type: $("type").value, status: $("status").value, place: $("place").value.trim(), title: $("title").value.trim(), note: $("note").value.trim() };
  showMessage(formMessage, "저장 중…");
  const id = $("editId").value;
  const result = id ? await client.from("meetups").update(payload).eq("id", id) : await client.from("meetups").insert(payload);
  if (result.error) { showMessage(formMessage, result.error.message, "error"); return; }
  resetForm(); await loadMeetups(); showMessage(formMessage, id ? "수정했습니다." : "일정을 등록했습니다.", "success");
});

(async () => {
  if (!configured()) return;
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;
  try {
    if (await isAdmin(session.user.id)) { showDashboard(true); await loadMeetups(); }
    else await client.auth.signOut();
  } catch (e) { console.warn(e); }
})();
