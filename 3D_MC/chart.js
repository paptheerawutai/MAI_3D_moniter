// Function to fetch data for cards from API
// const api11 = "https://api2-one-iota.vercel.app/api/sta_c";
// const api12 = "https://api2-one-iota.vercel.app/api/Data_input";

// const api21 = "https://localhost:5005/api/sta_c";
// const api22 = "https://localhost:5005/api/Data_input";




async function fetchCardData() {
  try {
    const response = await fetch("https://api2-3jym.onrender.com/api/sta_c");
    const data = await response.json();
    return data[0].entries;
  } catch (error) {
    console.error('Error fetching card data:', error);
  }
}

// Function to fetch details data for modal from API
async function fetchDetailsData() {
  try {
    const response = await fetch("https://api2-3jym.onrender.com/api/Data_Alarm"); // Data_input  ||  Data_Alarm
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching details data:', error);
  }
}

// Function to show modal with filtered data by input ID

async function showDetails(inputID, name) {
  // document.getElementById('modalTitle').textContent = `Details for ${name}`;
  const modal = document.getElementById('detailsModal');
  modal.style.display = 'flex';

  const data = await fetchDetailsData();
  const tableBody = document.getElementById('detailsTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing data

  // Filter and limit data by input ID and the last 30 entries
  const filteredData = data.filter(item => item.input_ID === inputID).slice(-20);
  if (filteredData.length > 0) {
    filteredData.forEach(item => {
      const row = document.createElement('tr');    // <td>${item.input_ID}</td>
      row.innerHTML = `
        <td>${item.Type}</td> 
        <td>${item.Data}</td>
        <td>${item.time_Start}</td>
        <td>${item.time_Stop || 'N/A'}</td>
        <td>${item.time_End || 'N/A'}</td>
      `;
      tableBody.appendChild(row);
    });

    createChart(filteredData);
  } else {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="6" style="text-align: center;">No data available</td>`;
    tableBody.appendChild(row);
  }
}


function parseTimeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
}

function createChart(data) {
  const ctx = document.getElementById('lineChart').getContext('2d');

  // ลบกราฟเก่า (ถ้ามี)
  if (window.myLineChart) {
    window.myLineChart.destroy();
  }

  // จำกัดจำนวนข้อมูลที่ใช้ในกราฟ (เช่น ข้อมูล 20 จุดสุดท้าย)
  const maxDataPoints = 20; // เปลี่ยนเป็นจำนวนจุดที่ต้องการแสดงในกราฟ
  const limitedData = data.slice(-maxDataPoints);

  // Prepare labels and data for chart (only use limitedData)
  const labels = limitedData.map(item => item.Data); // ใช้วันที่เป็น label
  const startTime = limitedData.map(item => parseTimeToSeconds(item.time_Start));
  const stopTime = limitedData.map(item => item.time_Stop ? parseTimeToSeconds(item.time_Stop) : null);
  const endTime = limitedData.map(item => item.time_End ? parseTimeToSeconds(item.time_End) : null);

  // สร้างกราฟด้วยข้อมูลที่จำกัด
  window.myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        // {
        //   label: 'เวลาเริ่ม Time',
        //   data: startTime,
        //   borderColor: '#00d1ff',
        //   backgroundColor: 'rgba(0, 209, 255, 0.2)',
        //   fill: true,
        //   pointRadius: 5,
        //   pointHoverRadius: 7,
        // },
        // {
        //   label: 'เวลาสิ้นสุด',
        //   data: stopTime,
        //   borderColor: '#ff5c5c',
        //   backgroundColor: 'rgba(255, 92, 92, 0.2)',
        //   fill: true,
        //   pointRadius: 5,
        //   pointHoverRadius: 7,
        // },
        {
          label: 'ใช้เวลาไป',
          data: endTime,
          borderColor: '#00ff7f',
          backgroundColor: 'rgba(0, 255, 127, 0.2)',
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // ควบคุมการแสดงผล aspect ratio
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.raw;
              const hours = Math.floor(value / 3600);
              const minutes = Math.floor((value % 3600) / 60);
              const seconds = value % 60;
              const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
              return `${label}: ${formattedTime}`;
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Time (HH:MM:SS)'
          },
          ticks: {
            callback: function(value) {
              const hours = Math.floor(value / 3600);
              const minutes = Math.floor((value % 3600) / 60);
              const seconds = value % 60;
              return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
}


document.addEventListener("DOMContentLoaded", function() {
  generateCards();
});



// Function to generate cards based on fetched data
document.addEventListener("DOMContentLoaded", function() {
  generateCards();
});

async function generateCards() {
  const entries = await fetchCardData();
  const dashboard1 = document.getElementById('dashboard1');
  
  if (dashboard1) {  // ตรวจสอบการมีอยู่ขององค์ประกอบ
      dashboard1.innerHTML = ''; // Clear existing cards

      const inputIDMapping = {
          "ปั้มดับ": 1,
          "กระทุ่งไม่กลับ": 2,
          "แคมไม่ล็อก": 3,
          "ประตูหน้าเปิดค้าง": 4,
          "โมลไม่เปิด": 5,
          "ไม่กระทุ่ง": 6,
          "โมลไม่ปิด": 7,
          "Robot-3แกน ค้าง": 8,
          "Robot-6หยุด": 9,
      };

      entries.forEach(entry => {
          const card = document.createElement('div');
          card.className = 'card';
          const inputID = inputIDMapping[entry.name] || 0;
          card.onclick = () => showDetails(inputID, entry.name);

          card.innerHTML = `
              <h3>${entry.name}</h3>
              <div class="info">
                  <div><span>All</span> <span class="count">${entry.operational}</span></div>
                  <div><span>Chg</span> <span class="count">${entry.pending}</span></div>
                  <div><span>Pm</span> <span class="count">${entry.maintenance}</span></div>
              </div>
          `;

          dashboard1.appendChild(card);
      });
  } else {
      console.error("Element with id 'dashboard1' not found in chart.js.");
  }
}



// Close the modal
function closeDetails() {
  document.getElementById('detailsModal').style.display = 'none';
}

// Generate cards on page load
window.onload = generateCards;
