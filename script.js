const calendar = document.querySelector("#calendar");
const displayMonth = document.querySelector("#displayMonth");
const displayYear = document.querySelector("#displayYear");
const modal = document.querySelector("#modal");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thusday",
  "Friday",
  "Saturday",
];
const today = new Date();

let year = today.getFullYear();
let month = today.getMonth();
let date = today.getDate();
// It stores the day of 1st date of the month
let firstDateDay = new Date(year, month, 1).getDay();
// It count the number of days in the month
// 0 represents the last day in the month
let daysInMonth = new Date(year, (month + 1) % 11, 0).getDate();
const countImages = document.querySelector("#countImages");
let totalCount = 0;
const drawCalendar = async () => {
  totalCount = 0;
  date = today.getDate();
  calendar.innerHTML = "";
  displayMonth.innerHTML = months[month];
  displayYear.innerHTML = year;
  firstDateDay = new Date(year, month, 1).getDay();
  daysInMonth = new Date(year, (month + 1) % 11, 0).getDate();
  let drawDate = 0;
  for (let i = 0; i < 42; i++) {
    if (i >= firstDateDay && i < daysInMonth + firstDateDay) {
      drawDate++;
      await new Promise(async (next) => {
        let newMonth = month + 1;
        if (newMonth < 10) {
          newMonth = "0" + newMonth;
        }
        let eventDate = `${year}-${newMonth}-${drawDate}`;
        let count = 0;
        await db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM events WHERE date=? ",
            [eventDate],
            function (tx, results) {
              count = results.rows.length;
              totalCount += count;
              countImages.innerHTML = totalCount;
              if (
                drawDate == date &&
                today.getMonth() == month &&
                today.getFullYear() == year
              ) {
                calendar.innerHTML += `
                <div class="box today" onclick="openModal(${drawDate},${month},${year})">
                  ${drawDate}
                </div>`;
              } else {
                if (count > 0) {
                  calendar.innerHTML += `
                  <div class="box event" onclick="openModal(${drawDate},${month},${year})">
                    ${drawDate}
                  </div>`;
                } else {
                  calendar.innerHTML += `
                  <div class="box " onclick="openModal(${drawDate},${month},${year})">
                    ${drawDate}
                  </div>`;
                }
              }
              next();
            }
          );
        });
      });
    } else {
      calendar.innerHTML += `<div class="box hide"></div>`;
    }
  }
};
const countData = async (value) => {};
let mDate = document.querySelector("#mDate");
let mMonth = document.querySelector("#mMonth");
let mYear = document.querySelector("#mYear");
let mDay = document.querySelector("#mDay");
const openModal = (d, m, y) => {
  modal.classList.toggle("hide-modal");
  mDate.innerHTML = d;
  mMonth.innerHTML = months[m];
  mYear.innerHTML = y;
  let newMonth = m + 1;
  if (newMonth < 10) {
    newMonth = "0" + newMonth;
  }
  let eventDate = `${y}-${newMonth}-${d}`;
  let temp = new Date(eventDate);
  mDay.innerHTML = fullDays[temp.getDay()];
  date = d;
  month = m;
  year = year;
  getEvents();
};
const hideModal = () => {
  modal.classList.toggle("hide-modal");
  drawCalendar();
};
let allEvents = document.querySelector("#allEvents");

const getEvents = async () => {
  allEvents.innerHTML = "";
  let newMonth = month + 1;
  if (newMonth < 10) {
    newMonth = "0" + newMonth;
  }
  let eventDate = `${year}-${newMonth}-${date}`;
  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM events WHERE date=?  ORDER BY id DESC",
      [eventDate],
      function (tx, results) {
        let len = results.rows.length;
        for (let i = 0; i < len; i++) {
          allEvents.innerHTML += `
          <div class="event-card">
            <button class="delete">
              <span class="material-symbols-outlined " onclick="deleteEvent(${
                results.rows.item(i).id
              })">
                delete
              </span>
            </button>
            <img src="${results.rows.item(i).image}"/>
          </div>`;
        }
      }
    );
  });
};
const deleteEvent = async (id) => {
  await db.transaction((tx) => {
    tx.executeSql("DELETE FROM events WHERE id=?", [id]);
  });
  getEvents();
};
let eventImg = document.getElementById("eventImg");
const addEvent = () => {
  let newMonth = month + 1;
  if (newMonth < 10) {
    newMonth = "0" + newMonth;
  }
  let eventDate = `${year}-${newMonth}-${date}`;
  let image = "";
  let reader = new FileReader();

  reader.addEventListener("load", () => {
    image = reader.result;
    db.transaction((tx) => {
      tx.executeSql("INSERT INTO events (date,image) VALUES(?,?)", [
        eventDate,
        image,
      ]);
    });
    eventImg.value = "";
    getEvents();
  });
  reader.readAsDataURL(eventImg.files[0]);
};

drawCalendar();

// For displaying week names
const week = document.querySelector("#week");

const displayWeek = () => {
  week.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    week.innerHTML += `<div class="box week">${days[i]}</div>`;
  }
};
displayWeek();
const prevMonth = () => {
  if (month == 0) {
    year--;
    month = 11;
  } else {
    month--;
  }
  drawCalendar();
};
const nextMonth = () => {
  if (month == 11) {
    year++;
    month = 0;
  } else {
    month++;
  }
  drawCalendar();
};
