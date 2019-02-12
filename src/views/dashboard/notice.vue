<template>
  <div class="app-container">
    <div class="jumbotron" style="background: #ffffff;">
      <div class="container">
        <div class="detail-title text-center">
          <div class="page-header">
            <h2 class="tetle">
              {{ data.tetle }}</h2>
            <small class="addtime">
              {{ data.addtime }}</small>
          </div>
        </div>
        <p class="content" v-html="data.content"/>
      </div>
    </div>
  </div>
</template>

<script>
import { searchNotice } from '@/api/data'
export default {
  name: 'Notice',
  data() {
    return {
      data: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      searchNotice({ id: this.$route.query.id }).then(res => {
        if (+res.status !== 0) {
          return false
        }
        this.data = res.data.rows[0]
      })
    }
  }
}
</script>
<style scoped>
@media screen and (min-width: 768px) {
  .jumbotron {
    padding-top: 48px;
    padding-bottom: 48px;
  }
  .container {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}
h2 {
  font-weight: 500;
  font-size: 30px;
  line-height: 1.1;
  margin-top: 20px;
  margin-bottom: 10px;
}
.page-header {
  padding-bottom: 9px;
  margin: 40px 0 20px;
  border-bottom: 1px solid #eee;
}
.text-center {
  text-align: center;
}
.jumbotron {
  padding-top: 30px;
  padding-bottom: 30px;
  margin-bottom: 30px;
  color: inherit;
  background-color: #ffffff;
}
.jumbotron .container {
  max-width: 100%;
}
.jumbotron p {
  margin-bottom: 15px;
  font-size: 21px;
  font-weight: 200;
 line-height: 1.42857143;
}

p {
  margin: 0 0 10px;
}
.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
</style>

