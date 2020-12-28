<template>
  <section class="col-9 mt-3">
    <div class="d-flex justify-content-between">
      <h5>{{dietPlanList.dietName}}</h5>
      <button id="diet-form" type="submit" class="btn btn-primary">
        Save Diet Plan
      </button>
    </div>
    <table class="table table-striped table-hover">
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Calories</th>
        <th scope="col">Carbs</th>
        <th scope="col">Fat</th>
        <th scope="col">Protein</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(item,index) in dietPlanList.foods"
        is="tr-food"
        :food="item"
        v-bind:key="index + '-food-in-diet'"
      ></tr>
      </tbody>
      <tfoot>
      <tr>
        <th scope="col">Totals</th>
        <td scope="col">{{dietTotalsList.calories}}</td>
        <td scope="col">{{dietTotalsList.carbs}}</td>
        <td scope="col">{{dietTotalsList.fat}}</td>
        <td scope="col">{{dietTotalsList.protein}}</td>
      </tr>
      </tfoot>
    </table>
  </section>
</template>

<script>
export default {
  name: 'diet-dashboard',
  data () {
    return {

    }
  }
}
</script>
