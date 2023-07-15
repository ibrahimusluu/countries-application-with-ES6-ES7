document.querySelector("#btnSearch").addEventListener("click", () => {
  let text = document.querySelector("#txtSearch").value;
  document.querySelector("#details").style.opacity = 0;
  getCountry(text);
});

function getCountry(country) {
  // const request = fetch("https://restcountries.com/v3.1/name/türkiye");
  // console.log(request);

  /* FIRST WAY OF FETCH */

  // fetch("https://restcountries.com/v3.1/name/" + country)
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     renderCountry(data[0]);
  //     const countries = data[0].borders.toString();
  //     return fetch("https://restcountries.com/v3.1/alpha?codes=" + countries);
  //   })
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     renderNeighbours(data);
  //   });

  /* SECOND WAY OF FETCH */
  fetch("https://restcountries.com/v3.1/name/" + country)
    .then((response) => {
      console.log(response);
      if (!response.ok) throw new Error("country not found!");
      return response.json();
    })
    .then((data) => {
      renderCountry(data[0]);
      const countries = data[0].borders;
      if (!countries) throw new Error("neighbour country not found!");
      return fetch(
        "https://restcountries.com/v3.1/alpha?codes=" + countries.toString()
      );
    })
    .then((response) => response.json())
    .then((data) => renderNeighbours(data))
    .catch((err) => renderError(err));
}

function renderCountry(data) {
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
