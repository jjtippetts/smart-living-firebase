// Handles found food items
Vue.component("food-item", {
  props: ["food"],
  template: `<a v-on:click='addFood' class="list-group-item list-group-item-action">
    <div class="d-flex flex-row">
      <h5 class="text-primary"> {{food.name}}</h5>
    </div>
    <span> {{food.brand}} </span>
    <span> &#x25CF Cal: {{food.calories}} </span>
    <span> &#x25CF Carbs: {{food.carbs}} </span>
    <span> &#x25CF Fat: {{food.fat}} </span>
    <span> &#x25CF Protein: {{food.protein}} </span>
  </a>`,
  methods: {
    addFood: addFoodToDietPlan,
  },
});

// Handles found food items
Vue.component("diet-item", {
  props: ["diet"],
  template: `<a v-on:click='selectDiet' class="list-group-item list-group-item-action">
    <h5 class="text-primary"> {{diet.dietName}} </h5>
  </a>`,
  methods: {
    selectDiet: function() {
      diet = JSON.parse(JSON.stringify(this.diet));
      app.dietPlanList = diet;
      app.dietPlanID = getUserEmail() + " " + this.diet.dietName

      app.resetDietTotals();

      // Update Diet total
      diet.foods.forEach(function(food){
        app.dietTotalsList.calories += food.calories;
        app.dietTotalsList.carbs += food.carbs;
        app.dietTotalsList.fat += food.fat;
        app.dietTotalsList.protein += food.protein;
      })
    }
  }
});

// Handles food items in the diet plan displayed on the table
Vue.component("tr-food", {
  props: ["food"],
  template: `<tr>
    <td> {{food.name}} </td>
    <td> {{food.calories}} </td>
    <td> {{food.carbs}} </td>
    <td> {{food.fat}} </td>
    <td> {{food.protein}} </td>
  </tr>`,
});

let foundFood = [
  {
    name: "popcorn",
    brand: "kellogs",
    calories: 180,
    carbs: 10,
    fat: 4,
    protein: 3,
  },
];

let dietPlan = {
  dietName: "",
  foods: [],
};

let dietTotals = {
  calories: 0,
  carbs: 0,
  fat: 0,
  protein: 0,
};

var app = new Vue({
  el: "#app",
  data: {
    message: "hello",
    foundFoodList: foundFood,
    foundDietList: [],
    dietPlanList: dietPlan,
    dietPlanID: '',
    dietTotalsList: dietTotals,
  },
  methods: {
    searchFoodByName: searchApiByFoodName,
    createNewDiet: function () {
      console.log("CREATING NEW DIET")
      if (!isUserSignedIn()) {
        console.log("You need to sign in!");
      } else {
        this.dietPlanList.dietName = $("#diet-name").val();
        this.dietPlanList.foods = []
        this.dietPlanID = getUserEmail() + " " + $("#diet-name").val();
        this.resetDietTotals();
      }
    },
    resetDietTotals: function() {
      this.dietTotalsList.calories = 0;
      this.dietTotalsList.carbs = 0;
      this.dietTotalsList.fat = 0;
      this.dietTotalsList.protein = 0;
    },
  },
});

// Loop through list of found foods and convert each to java object
function updateFoodsFound(listOfFoundFoodsFromApi) {
  let listOfReformatedFoods = [];

  for (let i = 0; i < listOfFoundFoodsFromApi.length; i++) {
    listOfReformatedFoods.push(reformatFood(listOfFoundFoodsFromApi[i]));
  }

  return listOfReformatedFoods;
}

// Convert food returned in api to a food object that can be inserted into firebase database
function reformatFood(foodFromApi) {
  let convertedFood = {
    brand: "",
    name: "",
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  };

  convertedFood.name = foodFromApi.description;
  convertedFood.brand = foodFromApi.brandOwner;

  // Loop through the food nutrients and find carbs, fat, and protein
  for (let i = 0; i < foodFromApi.foodNutrients.length; i++) {
    if (foodFromApi.foodNutrients[i].nutrientId == 1008) {
      convertedFood.calories = foodFromApi.foodNutrients[i].value;
    } else if (foodFromApi.foodNutrients[i].nutrientId == 1005) {
      convertedFood.carbs = foodFromApi.foodNutrients[i].value;
    } else if (foodFromApi.foodNutrients[i].nutrientId == 1004) {
      convertedFood.fat = foodFromApi.foodNutrients[i].value;
    } else if (foodFromApi.foodNutrients[i].nutrientId == 1003) {
      convertedFood.protein = foodFromApi.foodNutrients[i].value;
    }
  }

  return convertedFood;
}

// Searches the api by food name
function searchApiByFoodName() {
  // Get Food name from form
  userSearchedFood = $("#search-food-name").val();

  // Make Request
  $.ajax({
    type: "POST",
    url: "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY",
    data: '{"query":"' + userSearchedFood + '", "pageSize": 10}',

    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: function (data) {
      console.log(data.foods)
      let listOfReformatedFoods = [];
      app.foundFoodList = updateFoodsFound(data.foods);
    },
    error: function (error) {
      console.log("ERROR");
    },
  });
}

// Adds a food item to a diet plan
function addFoodToDietPlan() {
  // If diet plan has been created, add item
  if (app.dietPlanList.dietName === "") {
    return;
  } else {
    food = JSON.parse(JSON.stringify(this.food));

    app.dietTotalsList.calories += food.calories;
    app.dietTotalsList.carbs += food.carbs;
    app.dietTotalsList.fat += food.fat;
    app.dietTotalsList.protein += food.protein;

    app.dietPlanList.foods.push(food);
  }
}
