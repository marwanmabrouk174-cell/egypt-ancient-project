// ======================  بيانات الأغاني ======================
const songs = [
  {
    title: "أنشودة إيزيس",
    file: "/songs /أميرة سليم أنشودة فرعونية ابتهالات للآلهة ايزيس  _thegoldenparade _موكب_المومياوات_الملكية(128K.mp3",
    
    img: "/img/isis.jpg",
    category: "ديني"
  },
  {
    title: "أنشودة آمون",
    file: "/songs /انشودة امون رع(128K).mp3",
    
    img: "/img/Amon.jpg",
    category: "ديني"
  }
];

// ======================  بيانات القصص ======================
const stories = [
  {
    title: "الفلاح الفصيح",
    img: "/img/feature-photo-Modified-1024x585-1.jpg",
    file: "/texts/eloquent_peasant.txt",
  },
  {
    title: "سنوحي",
    img: "/img/feature-photo-Modified-1024x585-1.jpg",
    file: "/texts/sinuhe.txt",
  },
  {
    title: "البحّار الغريق",
    img: "/img/feature-photo-Modified-1024x585-1.jpg",
    file: "/texts/The_Shipwrecked_Sailor.txt",
  }
];

// ======================  بيانات الكتب ======================
const books = [
  {
    title: "كتاب الموتى",
    img: "/img/dead_book.jpg",
    file: "/texts/book_of_the_dead.txt",
  },
  {
    title: "تعاليم امينموبي",
    img: "/img/amenmobiy.jpg",
    file:"/texts/taalim-amenemope.txt"
  },
  {
    title: "تعاليم بتاح حتب",
    img: "/img/ptahhotep-01.png",
    file: "/texts/pitahhotp.txt"
    
  }
];

// ======================  إعدادات كل نوع ======================

const typesConfig = {
  book: {
    page: "book.html",
    buttonText: "اقرأ الكتاب كاملاً",
    extra: item => item.description ? `<p>${item.description}</p>` : ""
  },

  story: {
    page: "story.html",
    buttonText: "اقرأ القصة كاملة",
    extra: item => item.description ? `<p>${item.description}</p>` : ""
  },

  song: {
    page: null,
    extra: item => `
      <p class="category">النوع: ${item.category}</p>
      <audio controls>
        <source src="${item.file}" type="audio/mpeg">
        متصفحك لا يدعم الصوت.
      </audio>
      
    `,
  }
};


// ======================  الدالة العامة ======================

function displayItems(list, containerId, type) {
  const config = typesConfig[type];
  const container = document.getElementById(containerId);
  if(!container || !config) return;

  container.innerHTML = "";

  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    // ===== زرار حسب النوع =====
    let buttonHTML = "";
    if (item.file) {
      if (config.page) {
        buttonHTML = `
          <div class="btn-container">
            <button class="read-btn"
              onclick="window.location.href='${config.page}?file=${encodeURIComponent(item.file)}&title=${encodeURIComponent(item.title)}'">
              ${config.buttonText}
            </button>
          </div>`;
      } 
    }
    div.innerHTML = `
  <img src="${item.img}" alt="${item.title}" loading="lazy">
  <div class="item-content">
    <p>الاسم: ${item.title}</p>
    ${config.extra(item)}
    ${buttonHTML}
  </div>
`;

    container.appendChild(div);
  });
}


// ======================  الاستدعاء ======================
displayItems(songs,"songsList","song");
displayItems(stories, "storiesList", "story");
displayItems(books, "booksList", "book");
// ======================  البحث ======================
function searchSongs() {
  const query = document.getElementById("songSearch").value.toLowerCase();
  const filtered = songs.filter(s => s.title.toLowerCase().includes(query));
  displayItems(filtered, "songsList", "song");
}

function searchStories() {
  const query = document.getElementById("storySearch").value.toLowerCase();
  const filtered = stories.filter(s => s.title.toLowerCase().includes(query));
  displayItems(filtered, "storiesList", "story");
}

function searchBooks() {
  const query = document.getElementById("bookSearch").value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(query));
  displayItems(filtered, "booksList", "book");
}