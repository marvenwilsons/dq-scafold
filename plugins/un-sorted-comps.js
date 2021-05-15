import Vue from "vue";

// import component here
import lazy from './components/lazy'
import objectify from '@/components/globals/objectify/objectify'
import table from '@/components/globals/table/table.vue'


Vue.component("lazy", lazy);
Vue.component("Objectify", objectify);
Vue.component("Table", table)
