<template>
    <div class="sidebar">
        <h2>Giáo viên bộ môn</h2>

        <div class="sidebar-main">
            <div class="sidebar-content">
                <div class="dropdown-single">
                    <router-link to="/giao-vien-bo-mon/thong-tin-ca-nhan" class="dropdown-single-button">
                        <span>Thông tin cá nhân</span>    
                    </router-link>
                </div>

                <div class="dropdown-single">
                    <router-link to="/giao-vien-bo-mon/xem-phan-cong" class="dropdown-single-button">
                        <span>Xem phân công</span>
                    </router-link>
                </div>

                <div class="dropdown-single">
                    <router-link to="/giao-vien-bo-mon/sua-mat-khau" class="dropdown-single-button">
                        <span>Sửa mật khẩu</span>
                    </router-link>
                </div>
                
                <div class="dropdown-single" v-if="hienNutChonVaiTro">
                    <router-link to="/giao-vien-bo-mon/chon-vai-tro" class="dropdown-single-button">
                        <span>Chuyên môn</span>
                    </router-link>
                </div>
                
            </div>
        </div>
        <button @click="dangXuat" class="logout-button">Đăng xuất</button>
    </div>
</template>

<script>
import '@/assets/sidebar.css'
import axios from 'axios'
import dangXuat from '../../utils/dang-xuat'
import {API_BASE_URL} from '../../config'

export default {
    name: 'giao-vien-bo-mon',
    data(){
        return{
            MaCV: null,
            MaGV: '',
            danhSachCoQuyenCuaGV: [],
            hienNutChonVaiTro: false,
        }
    },

    async created(){
        await this.goi_api_lay_thong_tin_session()
    },

    watch:{
        danhSachCoQuyenCuaGV(newVal){
            this.hienNutChonVaiTro = newVal.some(item => 
                ['ADMIN', 'HIEU_TRUONG', 'HIEU_PHO', 'TO_TRUONG'].includes(item.MaQuyen)
            );
        }
    },

    methods:{
        async goi_api_lay_thong_tin_session(){
            try{
                const response = await axios.get(`${API_BASE_URL}/dang-nhap/lay-thong-tin-session`, {
                    withCredentials: true
                })
                if(response.data.success){
                    this.MaCV = response.data.thongTinSession.MaCV
                    this.MaGV = response.data.thongTinSession.MaGV
                    this.danhSachCoQuyenCuaGV = response.data.thongTinSession.danhSachCoQuyenCuaGV
                }
                console.log('this.danhSachCoQuyenCuaGV', this.danhSachCoQuyenCuaGV);
            }catch(error){
                console.error('Lỗi gọi api lấy thông tin session:', error)
                throw error
            }
        },

        dangXuat(){
          localStorage.removeItem('user');
          this.$router.push('/login');
        }
    }
}
</script>