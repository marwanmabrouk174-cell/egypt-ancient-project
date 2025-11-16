// ==========================
//  إعداد المتغيرات العامة
// ==========================
let bookParts = {};
let currentIndex = 0;
let startX = 0;

const partOrder = [
  "part1", "part2", "part3", "part4", "part5",
  "part6", "part7", "part8", "part9", "finale"
];

// ==========================
//  قراءة بيانات الكتاب من الرابط
// ==========================
const params = new URLSearchParams(window.location.search);
const fileName = params.get("file");
const bookTitle = params.get("title");

// تعديل عنوان الصفحة
if (bookTitle) {
  document.title = `${bookTitle} | الأدب المصري القديم`;
  const headerTitle = document.querySelector("header h1");
  if (headerTitle) headerTitle.innerHTML = `📜 ${bookTitle}`;
}

// ==========================
//  زر الرجوع
// ==========================
document.getElementById("backBtn").onclick = () => {
  window.location.href = "index.html#books";
};

// ==========================
//  تحميل الكتاب الديناميكي
// ==========================
if (fileName) {
  fetch(fileName)
    .then(res => res.text())
    .then(text => {
      // لو الكتاب مقسم لأجزاء
      const sections = text.match(/#part\d+[\s\S]*?(?=#part\d+|$)/g);
      
      if (sections) {
        sections.forEach(section => {
          const idMatch = section.match(/#(part\d+)/);
          if (idMatch) {
            const id = idMatch[1];
            const content = section.replace(/#part\d+/, "").trim();
            bookParts[id] = content;
          }
        });
        showPart("part1");
      } else {
        // لو الكتاب نص كامل مش متقسم
        bookParts["part1"] = text;
        showPart("part1");
        
        // إخفاء الأزرار لأنها غير لازمة
        document.getElementById("prevPart").style.display = "none";
        document.getElementById("nextPart").style.display = "none";
      }
      
      updateProgress();
    })
    .catch(() => {
      document.getElementById("book-content").innerHTML =
        `<p style="color:red;">⚠️ تعذر تحميل الكتاب المطلوب (${fileName}).</p>`;
    });
} else {
  document.getElementById("book-content").innerHTML =
    `<p style="color:red;">⚠️ لم يتم تحديد ملف الكتاب.</p>`;
}

// ==========================
//  عرض الجزء المطلوب
// ==========================
function showPart(id) {
  const container = document.getElementById("book-content");
  const text = bookParts[id];
  if (!text) return;
  
  container.innerHTML = `
    <div class="part">
      <h2>${getTitle(id)}</h2>
      <p>${text.replace(/\n/g, "<br>")}</p>
    </div>
  `;
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateButtons();
  updateProgress();
}

// ==========================
//  عناوين الأجزاء بالعربية
// ==========================
function getTitle(id) {
  const titles = {
    part1: "المقدمة",
    part2: "الفصل الأول",
    part3: "الفصل الثاني",
    part4: "الفصل الثالث",
    part5: "الفصل الرابع",
    part6: "الفصل الخامس",
    part7: "الفصل السادس",
    part8: "الفصل السابع",
    part9: "الفصل الثامن",
    finale: "الخاتمة"
  };
  return titles[id] || "";
}

// ==========================
//  تحديث أزرار التنقل
// ==========================
function updateButtons() {
  const prev = document.getElementById("prevPart");
  const next = document.getElementById("nextPart");
  
  prev.disabled = currentIndex === 0;
  next.disabled = currentIndex === partOrder.length - 1;
}

// ==========================
//  شريط التقدم الذهبي
// ==========================
function updateProgress() {
  const progress = document.getElementById("progress-bar");
  const scrollTop = window.scrollY;
  const scrollHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  const partPercent = (currentIndex / (partOrder.length - 1)) * 100;
  const totalProgress = Math.min(partPercent + scrollPercent / partOrder.length, 100);
  progress.style.width = totalProgress + "%";
}

// ==========================
//  التنقل بالأزرار
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prevPart");
  const nextBtn = document.getElementById("nextPart");
  
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showPart(partOrder[currentIndex]);
    }
  });
  
  nextBtn.addEventListener("click", () => {
    if (currentIndex < partOrder.length - 1) {
      currentIndex++;
      showPart(partOrder[currentIndex]);
    }
  });
});

// ==========================
//  التنقل بالسحب (Swipe)
// ==========================
document.addEventListener("touchstart", e => startX = e.touches[0].clientX);
document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if (Math.abs(diff) > 70) {
    if (diff > 0 && currentIndex > 0) {
      currentIndex--;
      showPart(partOrder[currentIndex]);
    } else if (diff < 0 && currentIndex < partOrder.length - 1) {
      currentIndex++;
      showPart(partOrder[currentIndex]);
    }
  }
});

// ==========================
//  تحديث الشريط مع التمرير
// ==========================
window.addEventListener("scroll", updateProgress);