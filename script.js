if (!localStorage.getItem("favouritesList")) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

async function fetchMeals(url) {
  const response = await fetch(url);
  return await response.json();
}

async function showMealList() {
  const input = document.getElementById("search").value.trim();
  if (!input) return;

  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`;
  const data = await fetchMeals(url);
  const container = document.getElementById("recipe-list");
  container.innerHTML = "";

  if (!data.meals) {
    container.innerHTML = `<h4 class="text-center">No meals found 😔</h4>`;
    return;
  }

  data.meals.forEach(meal => {
    container.innerHTML += `
      <div class="card m-3 p-3" style="width: 20rem;">
        <img src="${meal.strMealThumb}" class="card-img-top rounded">
        <div class="card-body text-center">
          <h5>${meal.strMeal}</h5>
          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-warning"
              onclick="showMealDetails(${meal.idMeal})">
              Recipe
            </button>
            <button class="btn btn-light"
              onclick="addRemoveToFavList(${meal.idMeal})">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
      </div>`;
  });
}

async function showMealDetails(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const data = await fetchMeals(url);
  const meal = data.meals[0];

  document.getElementById("recipe-list").innerHTML = `
    <div class="container mt-4">
      <div class="card p-4">
        <div class="row">
          <div class="col-md-4">
            <img src="${meal.strMealThumb}" class="w-100 rounded">
          </div>
          <div class="col-md-8">
            <h2>${meal.strMeal}</h2>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            <h5>Instructions</h5>
            <p>${meal.strInstructions}</p>
            <a href="${meal.strYoutube}" target="_blank"
              class="btn btn-warning">Watch Video</a>
          </div>
        </div>
      </div>
    </div>`;
}

function addRemoveToFavList(id) {
  let favList = JSON.parse(localStorage.getItem("favouritesList"));

  if (favList.includes(id)) {
    favList = favList.filter(item => item !== id);
    alert("Removed from favorites");
  } else {
    favList.push(id);
    alert("Added to favorites");
  }

  localStorage.setItem("favouritesList", JSON.stringify(favList));
}

async function showFavMealList() {
  const favList = JSON.parse(localStorage.getItem("favouritesList"));
  const container = document.getElementById("favorite-list");

  container.innerHTML = "";

  if (favList.length === 0) {
    container.innerHTML = `<h4>No favorite meals yet ❤️</h4>`;
    return;
  }

  for (let id of favList) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const data = await fetchMeals(url);
    const meal = data.meals[0];

    container.innerHTML += `
      <div class="card m-3 p-3" style="width: 20rem;">
        <img src="${meal.strMealThumb}" class="card-img-top rounded">
        <div class="card-body text-center">
          <h5>${meal.strMeal}</h5>
          <button class="btn btn-danger mt-2"
            onclick="addRemoveToFavList(${meal.idMeal}); location.reload();">
            Remove
          </button>
        </div>
      </div>`;
  }
}