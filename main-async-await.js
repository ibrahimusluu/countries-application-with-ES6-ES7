import { MY_OPENCAGE_API_ACCESS_KEY } from "./env.js"; // file extensions do matter here! otherwise an error occured

document.querySelector("#btnSearch").addEventListener("click", () => {
  let text = document.querySelector("#txtSearch").value;
  document.querySelector("#details").style.opacity = 0;
  document.querySelector("#loading").style.display = "block";
  getCountry(text);
});

document.querySelector("#btnLocation").addEventListener("click", () => {
  if (navigator.geolocation) {
    document.querySelector("#loading").style.display = "block";
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
});

async function onSuccess(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  //   API, google, "opencagedata" are options to do this.
  const api_key = MY_OPENCAGE_API_ACCESS_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

  const response = await fetch(url);
  const data = await response.json();

  const country = data.results[0].components.country;

  document.querySelector("#txtSearch").value = country;
  document.querySelector("#btnSearch").click();
}

function onError(err) {
  console.log(err);
  document.querySelector("#loading").style.display = "none";
}

async function getCountry(country) {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/name/" + country
    );

    if (!response.ok) throw new Error("country not found!");

    const data = await response.json();
    renderCountry(data[0]);

    const countries = data[0].borders;
    if (!countries) throw new Error("neighbour country not found!");

    const response2 = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" + countries.toString()
    );
    const neighbours = await response2.json();

    renderNeighbours(neighbours);
  } catch (err) {
    renderError(err);
  }
}

function renderCountry(data) {
  document.querySelector("#loading").style.display = "none";
  document.querySelector("#country-details").innerHTML = "";
  document.querySelector("#neighbours").innerHTML = "";
  console.log(data);
  document.querySelector("#details").style.opacity = 0;
  let html = `
       <div class="col-4">
                <img src="${data.flags.png}" alt="tr" class="img-fluid" />
                </div>
                <div class="col-8">
                <h3 class="card-title">${data.name.common}</h3>
                <hr />
                <div class="row">
                    <div class="col-4">Population: </div>
                    <div class="col-8">${(data.population / 1000000).toFixed(
                      1
                    )}</div>
                </div>
                <div class="row">
                    <div class="col-4">Official Language:</div>
                    <div class="col-8">${Object.values(data.languages)}</div>
                </div>
                <div class="row">
                    <div class="col-4">Capital:</div>
                    <div class="col-8">${data.capital[0]}</div>
                </div>
                <div class="row">
                    <div class="col-4">Currency:</div>
                    <div class="col-8">${
                      Object.values(data.currencies)[0].name
                    } (${Object.values(data.currencies)[0].symbol})</div>
                </div>
    `;
  //   const html = `
  //               <div class="col-3">
  //                   <div class="card h-100">
  //                       <img src="${
  //                         country.flags.png
  //                       }" alt="" class="card-img-top">
  //                       <div class="card-body">
  //                           <h5 class="card-title">${country.name.common}</h5>
  //                       </div>
  //                       <ul class="list-group list-group-flush">
  //                           <li class="list-group-item">Population: ${(
  //                             country.population / 1000000
  //                           ).toFixed(1)}</li>
  //                           <li class="list-group-item">Population: ${
  //                             country.capital[0]
  //                           }</li>
  //                           <li class="list-group-item">Population: ${Object.values(
  //                             country.languages
  //                           )}</li>
  //                       </ul>
  //                   </div>
  //               </div>
  //         `;

  //   document.querySelector(".container").insertAdjacentHTML("beforeend", html);
  document.querySelector("#details").style.opacity = 1;
  document.querySelector("#country-details").innerHTML = html;
}

function renderNeighbours(data) {
  let html = "";
  console.log(data);
  for (let country of data) {
    html += `
            <div class="col-2 mt-2">
                <div class="card">
                    <img src="${country.flags.png}" class=card-img-top" alt="image">
                    <div class="card-body">
                        <h6 class=card-title">${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;
  }
  document.querySelector("#neighbours").innerHTML = html;
}

function renderError(err) {
  document.querySelector("#loading").style.display = "none";
  const html = `
        <div class="alert alert-danger">
          ${err.message}
        </div>
  `;
  setTimeout(function () {
    document.querySelector("#errors").innerHTML = "";
  }, 3000);
  document.querySelector("#errors").innerHTML = html;
}
