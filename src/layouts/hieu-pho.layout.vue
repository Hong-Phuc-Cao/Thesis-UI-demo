<template>
    <div class="container">
        <hieu-pho-sidebar-vue
            :is-open="isSidebarOpen"
            @toggle-sidebar="toggleSidebar"
        />
        <div :class="['route-content', { 'full-screen': !isSidebarOpen }]">
            <div class="route-content__welcome" v-if="$route.path === '/hieu-pho'">
                <h1>WELCOME</h1>
                <p>Chào mừng thầy/cô đến hệ thống phân công THPT</p>
            </div>
            <router-view class="router-view"></router-view>
        </div>
    </div>
</template>

<script>
import HieuPhoSidebarVue from '../components/hieu-pho/hieu-pho-sidebar.vue'
import '@/assets/layout.css'
export default {
    components: {
        HieuPhoSidebarVue  
    },
    
    data(){
        return{
            isSidebarOpen: true,

        }
    },
    
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
    },
}
</script>

<style scoped>
.container{
    display: flex;
    width: 100%;
    height: 100vh;
}

.sidebar {
  width: 250px;
  min-width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease, min-width 0.3s ease; /* Smooth transition */
}

.sidebar-collapsed {
  width: 60px;
  min-width: 60px;
}

.route-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  transition: margin-left 0.3s ease, width 0.3s ease; /* Smooth transition */
  overflow-y: auto; /* Allow scrolling for content */
}

.full-screen {
  margin-left: 50px; /* Match collapsed sidebar width */
  width: calc(100% - 50px);
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