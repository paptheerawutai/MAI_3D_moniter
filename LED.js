// ฟังก์ชันสำหรับอัปเดตสถานะไฟ
function updateLights(A, B) {
    const greenLight = document.getElementById('light-green');
    const orangeLight = document.getElementById('light-orange');
    const redLight = document.getElementById('light-red');

    // รีเซ็ตไฟทั้งหมด
    greenLight.classList.remove('active');
    orangeLight.classList.remove('active');
    redLight.classList.remove('active');

    // เงื่อนไขการเปิดไฟ
    if (A === 1) {
        orangeLight.classList.add('active'); // เปิดไฟสีส้ม
    } else if (B === 1) {
        redLight.classList.add('active'); // เปิดไฟสีแดง
    } else {
        greenLight.classList.add('active'); // เปิดไฟสีเขียวเมื่อสถานะปกติ
    }
}

// ตัวอย่างการเรียกใช้ฟังก์ชันด้วยค่าของ A และ B
let A = 0;
let B = 0;
updateLights(A, B); // เรียกใช้ฟังก์ชันเพื่อเริ่มต้นสถานะ

// ทดสอบการเปลี่ยนสถานะ
setTimeout(() => { A = 1; B = 0; updateLights(A, B); }, 2000); // ไฟสีส้ม
setTimeout(() => { A = 0; B = 1; updateLights(A, B); }, 4000); // ไฟสีแดง
setTimeout(() => { A = 0; B = 0; updateLights(A, B); }, 6000); // กลับไปไฟสีเขียว
