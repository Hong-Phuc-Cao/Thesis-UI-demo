<template>
    <div class="container">
        <div class="giao-vien-bo-mon-sidebar">
            <giao-vien-bo-mon-sidebar/>
        </div>
        <div class="route-content">
            <div class="route-content__welcome" v-if="$route.path === '/giao-vien-bo-mon'">
                <h1>WELCOME</h1>
                <p>Chào mừng thầy/cô đến hệ thống phân công THPT</p>
            </div>
            <router-view class="router-view"></router-view>
        </div>
    </div>
</template>

<script>
// import '@/assets/layout.css'
import giaoVienBoMonSidebar from '../components/giao-vien-bo-mon/giao-vien-bo-mon-sidebar.vue'
export default {
    components: { giaoVienBoMonSidebar }
}
</script>
