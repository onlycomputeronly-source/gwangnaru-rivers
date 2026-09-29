// 광나루 리버스 공개 페이지 공통 데이터 로더

function isSupabaseConfigured() {
  return typeof SUPABASE_URL === "string"
    && typeof SUPABASE_ANON_KEY === "string"
    && SUPABASE_URL.startsWith("https://")
    && !SUPABASE_URL.includes("YOUR_")
    && SUPABASE_ANON_KEY
    && !SUPABASE_ANON_KEY.includes("YOUR_");
}

function getFallbackMeetups() {
  return Array.isArray(window.SITE?.meetups) ? [...window.SITE.meetups] : [];
}

function meetupDateValue(item) {
  const raw = item?.date || "";
  const d = new Date(`${raw}T00:00:00`);
  return Number.isNaN(d.getTime()) ? Number.MAX_SAFE_INTEGER : d.getTime();
}

function sortMeetups(items) {
  return [...items].sort((a, b) => meetupDateValue(a) - meetupDateValue(b));
}

function formatDate(dateText) {
  if (!dateText) return "일정 준비 중";
  const d = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateText;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "short"
  }).format(d);
}

function toDisplayMeetup(row) {
  const date = row.date || row.dateText || "";
  const d = date ? new Date(`${date}T00:00:00`) : null;
  return {
    ...row,
    date,
    dateText: formatDate(date),
    month: row.month || (d && !Number.isNaN(d.getTime()) ? String(d.getMonth() + 1).padStart(2, "0") : ""),
    day: row.day || (d && !Number.isNaN(d.getTime()) ? String(d.getDate()).padStart(2, "0") : ""),
    status: row.status || "예정",
    type: row.type || "모임",
    title: row.title || "광나루 리버스 모임",
    note: row.note || "",
    time: row.time || "-",
    place: row.place || "광나루 일대"
  };
}

async function getMeetups() {
  if (!isSupabaseConfigured()) {
    return sortMeetups(getFallbackMeetups().map(toDisplayMeetup));
  }

  try {
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await client
      .from("meetups")
      .select("id,date,time,place,type,title,note,status,created_at")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) throw error;
    return sortMeetups((data || []).map(toDisplayMeetup));
  } catch (error) {
    console.warn("Supabase 일정 불러오기 실패. config.js로 대체합니다.", error);
    return sortMeetups(getFallbackMeetups().map(toDisplayMeetup));
  }
}
