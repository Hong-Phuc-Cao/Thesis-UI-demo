<template>
    <div class="login-container">
        <img src="/favicon.png" alt="">
        <h1>Hệ thống quản lý phân công THPT</h1>
        <div class="login-form">
            
            <h2>Đăng nhập</h2>
            <input v-model="MaGV" type="text" placeholder="Mã giáo viên">
            <input v-model="MatKhau" type="password" placeholder="Mật khẩu" @keyup.enter="xu_ly_dang_nhap">
            <button class="login-form__button login-form__button--primary" @click="xu_ly_dang_nhap">
                Đăng nhập
            </button>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'Login',

  data() {
    return {
      MaGV: '',
      MatKhau: '',
    }
  },

  methods: {
    xu_ly_dang_nhap() {
      // Hardcoded demo credentials (you can add more if needed)
      const validCredentials = [
        { maGV: 'GV001', matKhau: '1' },
        { maGV: 'GV002', matKhau: '1' },
        { maGV: 'GV003', matKhau: '1' },
        { maGV: 'GV004', matKhau: '1' },
        { maGV: 'ADMIN', matKhau: '1' },  
      ]

      const isValid = validCredentials.some(
        cred => cred.maGV === this.MaGV.trim() && cred.matKhau === this.MatKhau
      )

      if (isValid) {
        // Simulate successful login
        const fakeUser = {
          MaGV: this.MaGV.trim(),
          loggedIn: true,
          roles: [],
        }

        if (this.MaGV.trim() === 'GV004') {
          fakeUser.roles = ['GIAO_VIEN'];
          this.$router.push('/giao-vien-bo-mon/thong-tin-ca-nhan');
        } else if (this.MaGV.trim() === 'GV001') {
          fakeUser.roles = ['HIEU_TRUONG', 'GIAO_VIEN'];
          this.$router.push('/hieu-truong');
        } else if (this.MaGV.trim() === 'GV002') {
          fakeUser.roles = ['HIEU_PHO', 'GIAO_VIEN'];
          this.$router.push('/hieu-pho');
        } else if (this.MaGV.trim() === 'GV003') {
          fakeUser.roles = ['TO_TRUONG', 'GIAO_VIEN'];
          this.$router.push('/to-truong');
        } else if (this.MaGV.trim() === 'ADMIN') {
          fakeUser.roles = ['ADMIN'];
          this.$router.push('/admin');
        } else {
          fakeUser.roles = ['GIAO_VIEN'];
          this.$router.push('/giao-vien-bo-mon/thong-tin-ca-nhan');
        }

        localStorage.setItem('user', JSON.stringify(fakeUser));

        // Then redirect
        
      } else {
        // Invalid credentials
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Sai mã giáo viên hoặc mật khẩu'
        })

        // Clear inputs for security/demo feel
        this.MatKhau = ''
      }
    }
  },

  // Optional: auto-login if already logged in (for demo convenience)
  created() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      if (user.loggedIn) {
        this.$router.push('/giao-vien-bo-mon/thong-tin-ca-nhan')
      }
    }
  }
}
</script>

<style scoped>
    img{
        height: 100px;
    }

    .login-container{
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: aliceblue;
    }
    h1{
        text-align: center;
        margin-bottom: 10px;
        color: blue;
        margin-bottom: 30px;
        font-size: 27px;
    }

    h2{
        text-align: center;
        margin-bottom: 10px;
        font-size: 20px;
        color: blue
    }

    .login-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        padding: 20px 40px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }    
    
    .login-form input {
        width: 100%;
        padding: 12px;
        margin: 3px 0;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 16px;
        box-sizing: border-box;
    }

    .login-form__button {
        width: 100%;
        padding: 8px;
        background-color: #409eff; /* Màu xanh dương */
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        box-sizing: border-box;
        margin: 3px;
    }

    .login-form__button:hover {
        background-color: #66b1ff; /* Hiệu ứng hover */
    }

    /* Link "Quên mật khẩu" */
    .login-form__link {
        display: inline-block;
        margin-top: 12px;
        text-align: center;
        font-size: 14px;
        color: #409eff;
        text-decoration: none;
        border: none;
    }

    .login-form__link:hover {
        text-decoration: underline;
    }
</style>

