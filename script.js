let flashcards = [];
let currentIndex = 0;
let isFlipped = false;
let startX = 0;

// ดึงข้อมูลจาก Google Sheets ตามเซตที่เลือก
async function fetchFlashcards() {
    const category = document.getElementById("category").value;
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
    document.getElementById('answer').textContent = flashcards[index].answer;
    document.querySelector('.flashcard').style.transform = 'rotateY(0deg)';
    isFlipped = false;
}

// พลิกการ์ด
function flipCard() {
    const card = document.querySelector('.flashcard');
    card.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
    isFlipped = !isFlipped;
}

// เปลี่ยนการ์ด
function nextCard() {
    currentIndex = (currentIndex + 1) % flashcards.length;
    showCard(currentIndex);
}

function prevCard() {
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    showCard(currentIndex);
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
    } else if (diffX < -50) {
        prevCard();
    }
});

// โหลดเซตเริ่มต้น
fetchFlashcards();