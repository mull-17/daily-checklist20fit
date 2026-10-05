import { supabase } from "./supabase.js";

const userName = document.getElementById("userName");
const dataText = document.getElementById("dataText");
const submitButton = document.getElementById("submitButton");
const photoInput = document.getElementById("photo");
const message = document.getElementById("message");
const SHIFT = "opening";

// CEK SESSION
const {
  data: { session }
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "index.html";
}

// Ambil PROFILE
const {
  data: profile,
  error: profileError
} = await supabase
  .from("profiles")
  .select("full_name, role")
  .eq("id", session.user.id)
  .single();

if (profileError || !profile) {
  message.textContent = "❌ Profile tidak ditemukan.";
  throw new Error("Profile tidak ditemukan");
}

userName.textContent = `Nama: ${profile.full_name}`;

// TANGGAL
const now = new Date();
const todayDisplay = now.toLocaleDateString("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});
dataText.textContent = `Tanggal: ${todayDisplay}`;
const todayISO = now.toISOString().split("T")[0];

// ========================================
// SUBMIT CHECKLIST
// ========================================
submitButton.addEventListener("click", async () => {
  const checkboxes = document.querySelectorAll(".check-item input");
  const uncheckedCount = document.querySelectorAll(
    ".check-item input:not(:checked)"
  ).length;

  // WAJIB SEMUA DICENTANG
  if (uncheckedCount > 0) {
    message.textContent =
      "❌ Checklist belum lengkap. Centang semua item terlebih dahulu.";
    return;
  }

  // CEK FOTO
  const photo = photoInput.files[0];
  if (!photo) {
    message.textContent = "❌ Silakan upload 1 foto.";
    return;
  }

  message.textContent = "Sedang mengirim...";
  submitButton.disabled = true;

  const areas = Array.from(checkboxes).map((checkbox) => ({
    area: checkbox.value,
    status: "sudah"
  }));

  try {
    // UPLOAD FOTO KE STORAGE
    const fileExt = photo.name.split(".").pop();
    const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("checklist-photos")
      .upload(filePath, photo);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("checklist-photos").getPublicUrl(filePath);

    // SIMPAN CHECKLIST UTAMA
    const {
      data: checklist,
      error: checklistError
    } = await supabase
      .from("daily_checklists")
      .insert({
        user_id: session.user.id,
        nama: profile.full_name,
        tanggal: todayISO,
        shift: SHIFT,
        foto_url: publicUrl,
        waktu_submit: now.toISOString()
      })
      .select()
      .single();

    if (checklistError) {
      throw checklistError;
    }

    // SIMPAN DETAIL AREA
    const items = areas.map((item) => ({
      daily_checklist_id: checklist.id,
      area: item.area,
      status: item.status
    }));

    const { error: itemsError } = await supabase
      .from("checklist_items")
      .insert(items);

    if (itemsError) {
      throw itemsError;
    }

    message.textContent = "✅ Checklist berhasil dikirim!";
  } catch (error) {
    console.error(error);
    message.textContent = "❌ Gagal mengirim checklist: " + error.message;
  } finally {
    submitButton.disabled = false;
  }
});