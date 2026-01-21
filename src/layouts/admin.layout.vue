<template>
    <div class="container">
        <div class="admin-sidebar">
            <admin-sidebar/>
        </div>
        <div class="route-content">
            <div class="route-content__welcome" v-if="$route.path === '/admin'">
                <h1>WELCOME</h1>
                <p>Chào mừng thầy/cô đến hệ thống phân công THPT</p>
            </div>
            <router-view class="router-view"></router-view>
        </div>
    </div>
</template>

<script>
import adminSidebar from '../components/admin/admin-sidebar.vue'
export default {
    components: { adminSidebar }
}
</script>

<style scoped>
.container{
    display: flex;
    width: 100%;
    height: 100vh;
}

.admin-sidebar {
    width: 250px; 
    min-width: 250px;
    height: 100vh;
    position: fixed; 
    left: 0;
    top: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}


.route-content {
    margin-left: 250px; 
    width: calc(100% - 250px);

}

.route-content__welcome {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: #f0f4f8;
    height: 100vh;
}

.route-content__welcome h1 {
    color: blue;
}
</style>