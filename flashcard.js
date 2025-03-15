let flashcards = [];
let currentIndex = 0;
let isFlipped = false;
let startX = 0;

// รับค่าหมวดหมู่จาก URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");
document.getElementById("category-title").textContent = category;

// ดึงข้อมูลจาก Google Sheets ตามเซตที่เลือก
async function fetchFlashcards() {
    const apiUrl = `https://script.google.com/macros/s/AKfycbxli4blycvu9hp3obHsq7Geu8Z71I2XjwR5Td61QnSpsMboifhif0IIn5HtZu4CeUIB/exec?category=${encodeURIComponent(category)}`;

    try {
        const response = await fetch(apiUrl);
        flashcards = await response.json();
        currentIndex = 0;
        showCard(currentIndex);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// แสดงการ์ดปัจจุบัน
function showCard(index) {
    if (flashcards.length === 0) return;
    document.getElementById('question').textContent = flashcards[index].question;
    document.getElementById('answer1').textContent = flashcards[index].answer1;
    document.getElementById('answer2').textContent = flashcards[index].answer2;
    document.querySelector('.flashcard').style.transform = 'rotateY(0deg)';
    isFlipped = false;
}

// พลิกการ์ด
function flipCard() {
    const card = document.querySelector('.flashcard');
    card.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
    isFlipped = !isFlipped;
}

// ฟังก์ชันปุ่ม "ถัดไป"
function nextCard() {
    currentIndex = (currentIndex + 1) % flashcards.length;
    showCard(currentIndex);
}

// ฟังก์ชันปุ่ม "Home"
function goHome() {
    window.location.href = "index.html";
}

// ตรวจจับการปัดหน้าจอ
document.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
});

document.addEventListener("touchend", (event) => {
    let endX = event.changedTouches[0].clientX;
    let diffX = startX - endX;

    if (diffX > 50) {
        nextCard();
    }
});

// โหลดเซตเริ่มต้น
fetchFlashcards();