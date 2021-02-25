<template>
    <div class="searchPost">
        <h1>Busqueda</h1>
        <div class="input-group mb-3">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{ searchItem.name }}</button>
            <ul class="dropdown-menu">
                <li v-for="option in searchOptions"
                    :key="option.value">
                    <a class="dropdown-item" @click="searchItem = option">{{ option.name }}</a>
                </li>
            </ul>
            <input type="text" class="form-control" aria-label="searchText" aria-describedby="searchButton" v-model="searchValue" v-if="searchItem.value != 'date'">
            <date-picker class="form-control" v-model="dates" type="date" range placeholder="Select date range" v-else></date-picker>
            <button class="btn btn-outline-secondary" type="button" id="searchButton" @click="search"><i class="bi bi-search"></i></button>
        </div>
        <router-view/>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
export default {
    name:'search-post',
    components: {
        DatePicker
    },
    data() {
        return {
            searchOptions: [{name:'Autor', value:'author'}, {name:'Titulo', value:'title'}, {name:'Contenido', value:'message'}, {name:'Fecha', value:'date'}],
            searchItem: '',
            searchValue: '',
            dates: []
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.searchItem = this.searchOptions.find((option) => option.value == to.query.search)
        if(!this.searchItem) {
            this.searchItem = this.searchOptions[0]
        }
        if(to.query.date1) {
            this.dates[0] = to.query.date1
            this.dates[1] = to.query.date2
        }
        this.searchValue = to.query.value
        next()
    },
    methods: {
        search() {
            let query = {
                search: this.searchItem.value
            }
            if(this.searchItem.value == this.searchOptions[3].value) {
                query['date1'] = this.dates[0].toISOString().split('T')[0];
                query['date2'] = this.dates[1].toISOString().split('T')[0];
            } else {
                query['value'] = this.searchValue
            }
            this.$router.push({
                name:'SearchResult', 
                query: query,
                params: {
                    page: 1
                }
            })
        }
    },
    beforeMount() {
        this.searchItem = this.searchOptions[0]
    }
}
</script>