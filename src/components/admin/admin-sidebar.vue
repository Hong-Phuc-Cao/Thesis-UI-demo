<template>
  <div class="sidebar">
    <h2>Quản trị viên</h2>
    <div class="sidebar-main">
      <div class="sidebar-content">
        <!-- Dropdown Giáo viên - Tài khoản -->
        <div class="dropdown" :class="{ 'dropdown-expanded': dropdownOpen_GV }">
          <button class="dropdown-button" @click.stop="toggleDropdown_GV">
            <span>Giáo viên - Tài khoản</span>
            <span class="dropdown-icon">▼</span>
          </button>
          
          <transition name="dropdown">
            <div v-show="dropdownOpen_GV" class="dropdown-content">
              <router-link to="/admin/giao-vien" class="dropdown-item">Giáo viên</router-link>
              <router-link to="/admin/tai-khoan" class="dropdown-item">Tài khoản</router-link>
            </div>
          </transition>
        </div>

        <!-- Dropdown Chức vụ - Giữ chức vụ -->
        <div class="dropdown" :class="{ 'dropdown-expanded': dropdownOpen_CV }">
          <button class="dropdown-button" @click.stop="toggleDropdown_CV">
            <span>Chức vụ - Phân quyền</span>
            <span class="dropdown-icon">▼</span>
          </button>
          
          <transition name="dropdown">
            <div v-show="dropdownOpen_CV" class="dropdown-content">
              <router-link to="/admin/chuc-vu" class="dropdown-item">Chức vụ</router-link>
              <router-link to="/admin/quyen" class="dropdown-item">Phân quyền</router-link>
            </div>
          </transition>
        </div>

        <div class="dropdown" :class="{ 'dropdown-expanded': dropdownOpen_MH }">
          <button class="dropdown-button" @click.stop="toggleDropdown_MH">
            <span>Môn học - Nhóm môn học</span>
            <span class="dropdown-icon">▼</span>
          </button>
          
          <transition name="dropdown">
            <div v-show="dropdownOpen_MH" class="dropdown-content">
              <router-link to="/admin/mon-hoc" class="dropdown-item">Môn học</router-link>
              <router-link to="/admin/nhom-mon-hoc" class="dropdown-item">Nhóm môn học</router-link>
            </div>
          </transition>
        </div>

        <div class="dropdown-single">
          <router-link to="/admin/lop" class="dropdown-single-button">
            <span>Lớp</span>
          </router-link>
        </div>

        <!-- Các mục đơn - Đã điều chỉnh để giống dropdown -->
        <div class="dropdown-single">
          <router-link to="/admin/nhiem-vu" class="dropdown-single-button">
            <span>Nhiệm vụ</span>
          </router-link>
        </div>

        <div class="dropdown-single">
          <router-link to="/admin/to-bo-mon" class="dropdown-single-button">
            <span>Tổ bộ môn</span>
          </router-link>
        </div>

        <!-- Dropdown Năm học - Học kỳ -->
        <div class="dropdown" :class="{ 'dropdown-expanded': dropdownOpen_NH }">
          <button class="dropdown-button" @click.stop="toggleDropdown_NH">
            <span>Năm học - Học kỳ</span>
            <span class="dropdown-icon">▼</span>
          </button>
          
          <transition name="dropdown">
            <div v-show="dropdownOpen_NH" class="dropdown-content">
              <router-link to="/admin/nam-hoc" class="dropdown-item">Năm học</router-link>
              <router-link to="/admin/hoc-ky" class="dropdown-item">Học kỳ</router-link>
            </div>
          </transition>
        </div>
        <div class="dropdown-single">
          <router-link to="/giao-vien-bo-mon/chon-vai-tro" class="dropdown-single-button">
              <span>Trở lại: GVBM</span>
            </router-link>
        </div>
      </div>
      <button @click="dangXuat" class="logout-button">Đăng xuất</button>
    </div>
  </div>
</template>

<script>
import dangXuat from '../../utils/dang-xuat'
import { API_BASE_URL} from '../../config.js'
export default {
  name: 'Sidebar',
  data() {
    return {
      MaCV: '',
      dropdownOpen_GV: false,
      dropdownOpen_CV: false,
      dropdownOpen_NH: false,
      dropdownOpen_MH: false
    }
  },
  methods: {
    async lay_thong_tin_session(){
      try{
        const response = await axios.get(`${API_BASE_URL}/dang-nhap/lay-thong-tin-session`,{
          withCredentials: true
        })
        if(response.data.success){
          this.MaCV = response.data.thongTinSession.MaCV
        }
        console.log('Thông tin từ sesison: ', response.data);
          console.log(this.MaCV);
        }catch(error){
          console.log(error);
            throw error
      }
    },
    toggleDropdown_GV() {
      this.dropdownOpen_GV = !this.dropdownOpen_GV
      if (this.dropdownOpen_GV) {
        this.dropdownOpen_CV = false
        this.dropdownOpen_NH = false
      }
    },
    toggleDropdown_CV() {
      this.dropdownOpen_CV = !this.dropdownOpen_CV
      if (this.dropdownOpen_CV) {
        this.dropdownOpen_GV = false
        this.dropdownOpen_NH = false
      }
    },
    toggleDropdown_NH() {
      this.dropdownOpen_NH = !this.dropdownOpen_NH
      if (this.dropdownOpen_NH) {
        this.dropdownOpen_GV = false
        this.dropdownOpen_CV = false
      }
    },
    toggleDropdown_MH() {
      this.dropdownOpen_MH = !this.dropdownOpen_MH
      if (this.dropdownOpen_MH) {
        this.dropdownOpen_GV = false
        this.dropdownOpen_CV = false
        this.dropdownOpen_NH = false
      }
    },

    dangXuat(){
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }

}
</script>

<style scoped>
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
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.sidebar-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 10px;
}

/* Nút dropdown */
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

/* Nội dung dropdown */
.dropdown-content {
  padding: 5px 0;
  background-color: #f8f9fa;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* Hiệu ứng mở dropdown */
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Các item trong dropdown */
.dropdown-item {
  padding: 8px 15px 8px 25px;
  color: #495057;
  text-decoration: none;
  font-size: 0.9em;
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

/* Nút đăng xuất */
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