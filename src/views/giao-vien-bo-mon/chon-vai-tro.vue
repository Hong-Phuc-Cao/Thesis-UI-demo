<template>
    <div class="container">
        <h2>Chọn vai trò</h2>
        <div class="container__role-selection">
            <div class="role" v-if="admin">
                <router-link to="/admin">
                    Quản trị hệ thống
                </router-link>
            </div>
            <div class="role" v-if="hieuTruong">
                <router-link to="/hieu-truong/xem-phan-cong-chuyen-mon">
                    Hiệu trưởng
                </router-link>
            </div>
            <div class="role" v-if="hieuPho">
                <router-link to="/hieu-pho/phan-cong-hieu-pho">
                    Hiệu phó
                </router-link>
            </div>
            <div class="role" v-if="toTruong">
                <router-link to="/to-truong/phan-cong-chuyen-mon">
                    Tổ trưởng bộ môn
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {API_BASE_URL} from '../../config'
export default {
    data(){
        return{
            MaGV: '',
            MaBM: '',
            TenBM: '',
            admin: false,
            hieuTruong: false,
            hieuPho: false,
            toTruong: false,
            danhSachCoQuyenCuaGV: [],
            NamHoc: '',
            HocKy: '',
        }
    },

    async created(){
        await this.lay_thong_tin_session()
        await this.goi_api_lay_danh_sach_quyen_gv()
        this.hien_thi_vai_tro()
    },

    methods: {
        async lay_thong_tin_session(){
            try{
                const response = await axios.get(`${API_BASE_URL}/dang-nhap/lay-thong-tin-session`,{
                    withCredentials: true
                })

                if(response.data.success){
                    this.MaGV = response.data.thongTinSession.MaGV
                    this.TenBM = response.data.thongTinSession.TenBM
                    this.MaBM = response.data.thongTinSession.MaBM
                }
                console.log(this.MaGV, this.MaBM, this.TenBM);
            }catch(error){
                console.error(error);
                throw error
            }
        },

        async goi_api_lay_danh_sach_quyen_gv(){
            try{
                const response = await axios.get(`${API_BASE_URL}/co-quyen/danh-sach-co-quyen-mot-giao-vien?MaGV=${this.MaGV}`)
                if(response.data.success){
                    this.danhSachCoQuyenCuaGV = response.data.data
                }
                console.log('Danh sách chức vụ: ',this.danhSachCoQuyenCuaGV);
            }catch(error){
                console.error(error);
                throw error
            }
        },

        hien_thi_vai_tro(){
            this.danhSachCoQuyenCuaGV.forEach(q => {
                if (q.MaQuyen == 'ADMIN') this.admin = true;
                else if (q.MaQuyen == 'HIEU_TRUONG') this.hieuTruong = true;
                else if (q.MaQuyen == 'HIEU_PHO') this.hieuPho = true;
                else if (q.MaQuyen == 'TO_TRUONG') this.toTruong = true;
            });
        }
    },
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #e6f7ff;
    padding: 20px;
}

/* Tiêu đề */
.container h2 {
    font-size: 2rem;
    color: #2c3e50;
    text-align: center;
    font-weight: bold;
}

/* Container cho các vai trò */
.container__role-selection {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 700px;
    padding: 20px;
}

/* Mỗi vai trò */
.role {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

/* Link bên trong vai trò */
.role a {
    display: block;
    padding: 1.5rem;
    text-align: center;
    text-decoration: none;
    color: #34495e;
    font-size: 1.1rem;
    font-weight: 500;
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* Hiệu ứng hover cho vai trò */
.role:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.role a:hover {
    background-color: #3498db;
    color: #ffffff;
}

/* Responsive design */
@media (max-width: 768px) {
    .container__role-selection {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .container h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .role a {
        padding: 1rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 10px;
    }

    .container h2 {
        font-size: 1.2rem;
    }

    .role a {
        font-size: 0.9rem;
    }
}
</style>