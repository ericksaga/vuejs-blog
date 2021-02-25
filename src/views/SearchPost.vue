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
            <input type="text" class="form-control" aria-label="searchText" aria-describedby="searchButton" v-model="searchValue">
            <button class="btn btn-outline-secondary" type="button" id="searchButton" @click="search"><i class="bi bi-search"></i></button>
        </div>
        <router-view/>
    </div>
</template>

<script>
export default {
    name:'search-post',
    data() {
        return {
            searchOptions: [{name:'Autor', value:'author'}, {name:'Titulo', value:'title'}, {name:'Contenido', value:'message'}, {name:'Fecha', value:'date'}],
            searchItem: '',
            searchValue: '',
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.searchItem = this.searchOptions.find((option) => option.value == to.query.search)
        if(!this.searchItem) {
            this.searchItem = this.searchOptions[0]
        }
        this.searchValue = to.query.value
        next()
    },
    methods: {
        search() {
            this.$router.push({
                name:'SearchResult', 
                query: {
                    search: this.searchItem.value, 
                    value: this.searchValue
                },
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