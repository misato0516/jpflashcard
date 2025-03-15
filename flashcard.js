let flashcards = [];
let currentIndex = 0;
let isFlipped = false;
let startX = 0;
let offsetX = 0;
const threshold = 100; // ระยะที่ต้องลากเพื่อเปลี่ยนการ์ด

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
    document.querySelector('.flashcard').style.transform = 'translateX(0px) rotateY(0deg)';
    isFlipped = false;
}

// พลิกการ์ด
function flipCard() {
    const card = document.querySelector('.flashcard');
    card.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
    isFlipped = !isFlipped;
}

// ฟังก์ชันเปลี่ยนไปการ์ดถัดไป
function nextCard() {
    currentIndex = (currentIndex + 1) % flashcards.length;
    showCard(currentIndex);
}

// ฟังก์ชันย้อนกลับไปการ์ดก่อนหน้า
function prevCard() {
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    showCard(currentIndex);
}

// ฟังก์ชันปุ่ม "Home"
function goHome() {
    window.location.href = "index.html";
}

// ตรวจจับการลาก (Drag)
const card = document.querySelector('.flashcard');

card.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
    offsetX = 0;
});

card.addEventListener("touchmove", (event) => {
    offsetX = event.touches[0].clientX - startX;
    card.style.transform = `translateX(${offsetX}px) rotate(${offsetX / 10}deg)`;
});

card.addEventListener("touchend", () => {
    if (offsetX > threshold) {
        prevCard(); // ปัดขวา -> ย้อนกลับการ์ด
    } else if (offsetX < -threshold) {
        nextCard(); // ปัดซ้าย -> การ์ดถัดไป
    }
    card.style.transition = "transform 0.3s ease";
    card.style.transform = "translateX(0px)";
    setTimeout(() => {
        card.style.transition = "";
    }, 300);
});

// ฟังก์ชันเปลี่ยนไปการ์ดถัดไป พร้อมแอนิเมชันเลื่อนออก
function nextCard() {
    const card = document.querySelector('.flashcard');
    card.style.transition = "transform 0.3s ease";
    card.style.transform = "translateX(-100vw) rotate(-15deg)";

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % flashcards.length;
        showCard(currentIndex);
        card.style.transition = "none";
        card.style.transform = "translateX(100vw) rotate(15deg)";
        
        setTimeout(() => {
            card.style.transition = "transform 0.3s ease";
            card.style.transform = "translateX(0) rotate(0)";
        }, 50);
    }, 300);
}

// ฟังก์ชันย้อนกลับไปการ์ดก่อนหน้า พร้อมแอนิเมชันเลื่อนออกทางขวา
function prevCard() {
    const card = document.querySelector('.flashcard');
    card.style.transition = "transform 0.3s ease";
    card.style.transform = "translateX(100vw) rotate(15deg)";

    setTimeout(() => {
        currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
        showCard(currentIndex);
        card.style.transition = "none";
        card.style.transform = "translateX(-100vw) rotate(-15deg)";
        
        setTimeout(() => {
            card.style.transition = "transform 0.3s ease";
            card.style.transform = "translateX(0) rotate(0)";
        }, 50);
    }, 300);
}

// โหลดเซตเริ่มต้น
fetchFlashcards();