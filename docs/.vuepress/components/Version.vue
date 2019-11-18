<template>
  <select name="" id="" @click="changeVersion" class="select">
    <option value="1">1</option>
    <option value="2">2</option>
  </select>
</template>
<script>
export default {
  props: {
    options: Array
  },
  data() {
    return {
      selectedIndex: null
    };
  },
  mounted() {},
  methods: {
    changeVersion(e) {
      let index = e.target.selectedIndex;
      let versionDom = document.getElementsByClassName(`tip`);
      for (let i = 0; i < versionDom.length; i++) {
        versionDom[i].style.display = "none";
      }
      index ? (versionDom[index].style.display = "block") : "";
    }
  }
};
</script>
<style>
.select {
  width: 200px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #ccc;
  color: #333;
 
}
 option{
       height: 30px;
  line-height: 30px;
  }
</style>
