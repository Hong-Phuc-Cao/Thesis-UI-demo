<template>
    <div :class="['sidebar', { 'sidebar-collapsed': !isOpen }]">
        <div class="sidebar-header">
            <button class="toggle-button" @click="$emit('toggle-sidebar')">
                {{ isOpen ? ' ◀ ' : ' ▶ '}}
            </button>
            <h2 v-if="isOpen">Hiệu trưởng</h2>
        </div>
        <div class="sidebar-main" v-if="isOpen">
            <div class="sidebar-content">
                <div class="dropdown-single">
                    <router-link to="/hieu-truong/xem-phan-cong-chuyen-mon" class="dropdown-single-button">
                        <span>Xem phân công giảng dạy</span>
                    </router-link>
                </div>

                <div class="dropdown-single">
                    <router-link to="/hieu-truong/xem-thong-ke" class="dropdown-single-button">
                        <span>Xem thống kê giảng dạy</span>
                    </router-link>
                </div>

                <div class="dropdown-single">
                    <router-link to="/giao-vien-bo-mon/chon-vai-tro" class="dropdown-single-button">
                        <span>Trở lại: GVBM</span>
                    </router-link>
                </div>
                
            </div>
            <button v-if="isOpen" @click="dangXuat" class="logout-button">Đăng xuất</button>
        </div>
    </div>
</template>
<script>

export default {
    props:{
        isOpen:{
            tyoe: Boolean,
            default: true
        },
    },

    methods: {
        dangXuat(){
          localStorage.removeItem('user');
          this.$router.push('/login');
        }
    },
}
</script>

<style scoped>
h2{
  margin: 0;
  padding: 0;
}

.sidebar {
  width: 250px;
  min-width: 250px;
  height: 100vh;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 15px 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, min-width 0.3s ease; /* Smooth transition */
}

.sidebar-collapsed {
  width: 50px;
  min-width: 50px;
}

.sidebar-header {
    display: flex;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
}

.toggle-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #495057;
  padding: 5px 10px;
}

.sidebar-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Allow scrolling if content overflows */
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 10px;
}

.dropdown, .dropdown-single {
  position: relative;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin-bottom: 5px;
}

.dropdown-button, .dropdown-single-button {
  width: 100%;
  padding: 10px 15px;
  background-color: #e9ecef;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: #495057;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: left;
}

.dropdown-single-button {
  justify-content: flex-start;
}

.dropdown-icon {
  transition: transform 0.3s ease;
}

.dropdown-expanded .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-button:hover, .dropdown-single-button:hover {
  background-color: #dee2e6;
}

.dropdown-content {
  padding: 5px 0;
  background-color: #f8f9fa;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  max-height: 0;
}

.dropdown-item {
  padding: 8px 15px 8px 25px;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s;
  border-radius: 4px;
  margin: 0 5px;
}

.dropdown-item:hover, 
.dropdown-item.router-link-exact-active,
.dropdown-single-button.router-link-exact-active {
  background-color: #e9ecef;
  color: #007bff;
}

.logout-button {
  margin-top: auto;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  margin: 10px;
}

.logout-button:hover {
  background-color: #f5c6cb;
}
</style>