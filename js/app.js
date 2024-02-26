class CalorieTracker {
  constructor() {
      this._calorieLimit = 0;
      this._calorieTotal = 0;
      this._meals = [];
      this._workouts = [];
  }

  setLimit(limit) {
    console.log(limit);
    this._calorieLimit = limit;
    Storage.setCalorieLimit(limit);
    this._render();
      
  }

  addMeals (meal) {
      this._meals.push(meal);
      this._calorieTotal += +meal.calories;
      this._displayNewMeal(meal);
      this._render();
  }

  addWorkout(workout){
      this._workouts.push(workout);
      this._calorieTotal -= +workout.calories;
      this._displayNewWorkout(workout);
      this._render();
  }
  
  removeMeals (mealId) {
      this._meals = this._meals.filter((meal) => meal.id !== mealId)
      this._calorieTotal = this._meals.reduce((total, meal) => total + +meal.calories, 0) - this._workouts.reduce((total, workout) => total + +workout.calories, 0);
      this._render();
      
  }
  
  removeWorkouts (workoutId) {
      this._workouts = this._workouts.filter((workout) => workout.id !== workoutId)
      this._calorieTotal = this._meals.reduce((total, meal) => total + +meal.calories, 0) - this._workouts.reduce((total, workout) => total + +workout.calories, 0);
      this._render();
      
  }
  
  _displayTotalCalories() {
      document.querySelector('#calories-total').innerHTML = this._calorieTotal;
      
  }

  _displayLimitCalories() {
      const limitCalories = document.querySelector('#calories-limit');
      this._calorieLimit = localStorage.getItem(`calorieLimit`);
      limitCalories.innerHTML = this._calorieLimit;


  }
  
  _displayConsumedCalories() {
      const consumedCalories = document.querySelector('#calories-consumed');
      consumedCalories.innerHTML = this._meals.reduce((total, meal) => total + +meal.calories, 0);
  }
  
  _displayBurnedCalories() {
      const burnedCalories = document.querySelector('#calories-burned');
      burnedCalories.innerHTML = this._workouts.reduce((total, workout) => total + +workout.calories, 0);
  }

  _displayRemainingCalories() {
      const remainingCalories = document.querySelector('#calories-remaining');
      remainingCalories.innerHTML = this._calorieLimit - this._calorieTotal;
  }

  _displayCaloriesProgress() {
      const progress = (this._calorieTotal/this._calorieLimit)*100;
      const caloriesProgress = document.querySelector('#calorie-progress');
      const remainingCalories = document.querySelector('#calories-remaining')
      if (progress > 100) {
          caloriesProgress.classList.remove("bg-success");
          caloriesProgress.classList.add("bg-danger");
          remainingCalories.parentElement.classList.remove("bg-light");
          remainingCalories.parentElement.classList.add("bg-danger");
          
      }
      else {
          caloriesProgress.classList.remove("bg-danger");
          caloriesProgress.classList.add("bg-success");
          remainingCalories.parentElement.classList.remove("bg-danger");
          remainingCalories.parentElement.classList.add("bg-light");

      }
      caloriesProgress.style.width = `${Math.min(progress, 100)}%`;
  }

  _displayNewMeal (meal) {
      const showMeals = document.querySelector('#meal-items');
      const newMeal = document.createElement('div');
      newMeal.classList.add('card', 'my-2')
      newMeal.setAttribute('data-id', meal.id)
      newMeal.innerHTML = `
      <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
              class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
              ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
              <i class="fa-solid fa-xmark"></i>
          </button>
          </div>
      </div>`
      showMeals.appendChild(newMeal);
  }

  _displayNewWorkout (workout) {
      const showWorkouts = document.querySelector('#workout-items');
      const newWorkout = document.createElement('div');
      newWorkout.classList.add('card', 'my-2')
      newWorkout.setAttribute('data-id', workout.id)

      newWorkout.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`
      showWorkouts.appendChild(newWorkout);
  }
  
  reset() {
      this._calorieTotal = 0;
      this._meals = [];
      this._workouts = [];
      this._render();
  }


  _render() {
      this._displayLimitCalories();
      this._displayConsumedCalories();
      this._displayBurnedCalories();
      this._displayTotalCalories();
      this._displayRemainingCalories();
      this._displayCaloriesProgress();
      this._displayNewMeal();
      this._displayNewWorkout();
      this.removeMeals();
      this.removeWorkouts();
      this.reset();
      this.setLimit();
  }
    
    
}

class Meal {
    constructor(name, calories){
        
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {

        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}


class Storage {
    static getCalorieLimit(defaultLimit = 2000) {
      let calorieLimit;
      if (localStorage.getItem('calorieLimit') === null) {
        calorieLimit = defaultLimit;
      }
      else {
        calorieLimit = +localStorage.getItem('calorieLimit');
        console.log("gET");
      }
      return calorieLimit;
    }
  
    static setCalorieLimit(calorieLimit) {
      localStorage.setItem('calorieLimit', calorieLimit);
    }
  
    static getTotalCalories(defaultCalories = 0) {
      let totalCalories;
      if (localStorage.getItem('totalCalories') === null) {
        totalCalories = defaultCalories;
      } else {
        totalCalories = +localStorage.getItem('totalCalories');
      }
      return totalCalories;
    }
  
    static updateTotalCalories(calories) {
      localStorage.setItem('totalCalories', calories);
    }
  
    static getMeals() {
      let meals;
      if (localStorage.getItem('meals') === null) {
        meals = [];
      } else {
        meals = JSON.parse(localStorage.getItem('meals'));
      }
      return meals;
    }
  
    static saveMeal(meal) {
      const meals = Storage.getMeals();
      meals.push(meal);
      localStorage.setItem('meals', JSON.stringify(meals));
    }
  
    static removeMeal(id) {
      const meals = Storage.getMeals();
      meals.forEach((meal, index) => {
        if (meal.id === id) {
          meals.splice(index, 1);
        }
      });
  
      localStorage.setItem('meals', JSON.stringify(meals));
    }
  
    static getWorkouts() {
      let workouts;
      if (localStorage.getItem('workouts') === null) {
        workouts = [];
      } else {
        workouts = JSON.parse(localStorage.getItem('workouts'));
      }
      return workouts;
    }
  
    static saveWorkout(workout) {
      const workouts = Storage.getWorkouts();
      workouts.push(workout);
      localStorage.setItem('workouts', JSON.stringify(workouts));
    }
  
    static removeWorkout(id) {
      const workouts = Storage.getWorkouts();
      workouts.forEach((workout, index) => {
        if (workout.id === id) {
          workouts.splice(index, 1);
        }
      });
  
      localStorage.setItem('workouts', JSON.stringify(workouts));
    }
  
    static clearAll() {
      localStorage.removeItem('totalCalories');
      localStorage.removeItem('meals');
      localStorage.removeItem('workouts');
  
      // If you want to clear the limit
      // localStorage.clear();
    }
  }

class App {
    constructor () {
        // const limitCalories = document.querySelector('#calories-limit');
        this._tracker = new CalorieTracker();
        // limitCalories.innerHTML = this._tracker._calorieLimit;
        document.querySelector('#meal-form').addEventListener('submit', this._newMeal.bind(this._tracker));
        document.querySelector('#workout-form').addEventListener('submit', this._newWorkout.bind(this._tracker));
        document.querySelector('#meal-items').addEventListener('click', this._removeMeal.bind(this._tracker));
        document.querySelector('#workout-items').addEventListener('click', this._removeWorkout.bind(this._tracker));
        document.querySelector("#filter-meals").addEventListener('input', this._filterMeal.bind(this._tracker))
        document.querySelector("#filter-workouts").addEventListener('input', this._filterWorkout.bind(this._tracker));
        document.getElementById('reset').addEventListener('click', this._resetDay.bind(this._tracker));
        document.querySelector("#limit-form").addEventListener("submit", this._setLimit.bind(this._tracker));
        const showAllMeals = document.querySelector('#meal-items').querySelectorAll(".card-body");
        showAllMeals.forEach((meal) => {
            meal.style.display = 'block';
        })
        const showAllWorkouts = document.querySelector('#workout-items').querySelectorAll(".card-body");
        showAllWorkouts.forEach((workout) => {
            workout.style.display = 'block';
        })
        
        
    }
    
    _newMeal (e) {
        e.preventDefault();
        const mealName = document.querySelector("#meal-name");
        const mealCalories = document.querySelector("#meal-calories");
        const meal = new Meal(mealName.value, mealCalories.value);
        this.addMeals(meal);
    }
    
    _newWorkout (e) {
        e.preventDefault();
        const workoutName = document.querySelector("#workout-name");
        const workoutcalories = document.querySelector("#workout-calories");
        const workout = new Workout(workoutName.value, workoutcalories.value);
        this.addWorkout(workout);
    }

    _removeMeal (e) {

        if (e.target.classList.contains('delete')){
            if(confirm("Are you sure?")) {
                
                const deleteMeal = e.target.parentElement.parentElement.parentElement;
                deleteMeal.remove();
                this.removeMeals(deleteMeal.getAttribute('data-id'));
            }
        }
        else if (e.target.classList.contains('fa-xmark')) {
            if(confirm("Are you sure?")) {
                
                const deleteMeal = e.target.parentElement.parentElement.parentElement.parentElement;
                deleteMeal.remove();
                this.removeMeals(deleteMeal.getAttribute('data-id'));
            }
        }
    }
    _removeWorkout (e) {
        
        if (e.target.classList.contains('delete')){
            if(confirm("Are you sure?")) {
                
                const deleteWorkout = e.target.parentElement.parentElement.parentElement;
                deleteWorkout.remove();
                this.removeWorkouts(deleteWorkout.getAttribute('data-id'));
            }
        }
        else if (e.target.classList.contains('fa-xmark')) {
            if(confirm("Are you sure?")) {
                
                const deleteWorkout = e.target.parentElement.parentElement.parentElement.parentElement;
                deleteWorkout.remove();
                this.removeWorkouts(deleteWorkout.getAttribute('data-id'));
            }
        }
    }
    
    _filterMeal (e) {
        const showMeals = document.querySelector('#meal-items');
        const showAllMeals = showMeals.querySelectorAll('.card-body');
        showAllMeals.forEach(meal => {
            if (meal.querySelector('h4').textContent.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
                meal.style.display = 'none';
            }
            else{
                meal.style.display = 'block';
            }
        });
    }
    
    _filterWorkout (e) {
        const showWorkouts = document.querySelector('#workout-items');
        const showAllWorkouts = showWorkouts.querySelectorAll('.card-body');
        showAllWorkouts.forEach(workout => {
            if (workout.querySelector('h4').textContent.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
                workout.style.display = 'none';
            }
            else{
                workout.style.display = 'block';
            }
        });
    }
    
    _resetDay (e) {
        const showMeals = document.querySelector('#meal-items');
        const showWorkouts = document.querySelector('#workout-items');
        const filterMeal = document.querySelector("#filter-meals");
        const filterWorkout = document.querySelector("#filter-workouts");

        if(e.target) {
            if (confirm ("Are you sure?")) {
                showMeals.innerHTML = '';
                showWorkouts.innerHTML = '';
                filterMeal.innerHTML = '';
                filterWorkout.innerHTML = '';
                this.reset();
            }
        }
    }

    _setLimit(e) {
        e.preventDefault();
        this.setLimit(e.target.querySelector('#limit').value);
    }
    
}

const app = new App();
