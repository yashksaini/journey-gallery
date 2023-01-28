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
const modal = document.querySelector("#modal");
let allImages = document.querySelector("#allImages");
const displayImage = document.querySelector("#displayImage");
const download = document.querySelector("#download");
const defaultImg = document.querySelector("#default");
const getImages = async () => {
  allImages.innerHTML = "";

  await db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM events ORDER BY date DESC",
      [],
      function (tx, results) {
        let len = results.rows.length;
        if (len > 0) {
          defaultImg.style.display = "none";
        }
        for (let i = 0; i < len; i++) {
          let data = results.rows.item(i).date.split("-");
          allImages.innerHTML += `
          <div class="event-card">
            <img src="${results.rows.item(i).image}" onclick="openModal(${
            data[2]
          },${data[1]},${data[0]},'${
            results.rows.item(i).image
          }')" loading="lazy"/>
          </div>`;
        }
      }
    );
  });
};
getImages();

const openModal = (d, m, y, url) => {
  modal.classList.toggle("hide-modal");
  mDate.innerHTML = d;
  mMonth.innerHTML = months[m - 1];
  mYear.innerHTML = y;
  displayImage.src = url;
  download.href = url;
};

const hideModal = () => {
  modal.classList.toggle("hide-modal");
};
