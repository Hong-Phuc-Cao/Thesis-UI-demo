<template>
    <div class="container">
        <h1>Tài khoản</h1>
        <div class="container__table">
            <table border="1">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã giáo viên</th>
                        <th>Tên giáo viên</th>
                        <th>Sửa mật khẩu</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(taiKhoan, index) in danhSachTaiKhoan" :key="taiKhoan">
                        <td>{{index + 1}}</td>
                        <td>{{taiKhoan.MaGV}}</td>
                        <td>{{taiKhoan.HoTenGV}}</td>
                        <td>
                            <button @click="mo_modal_sua_tai_khoan(taiKhoan)">✏️</button>
                        </td>
                    </tr>
                </tbody>

            </table>
            <sua-tai-khoan-modal
                :isOpen="hienModalSua"
                :taiKhoan="taiKhoanDangChinhSua"
                @close="dong_modal_sua_tai_khoan"
                @save="goi_api_sua_mat_khau"
            />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import SuaTaiKhoanModal from '../../components/admin/sua-tai-khoan-modal.vue'
import {API_BASE_URL} from '../../config'
export default {
    components:{
        SuaTaiKhoanModal

    },

    data(){
        return{
            danhSachTaiKhoan: [],
            hienModalSua: false,
            taiKhoanDangChinhSua: null,
        }
        
    },

    async created(){
        await this.hien_danh_sach_tai_khoan()
    },

    methods:{
        async hien_danh_sach_tai_khoan(){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/nguoi-dung/danh-sach-nguoi-dung
                `)
                if(response.data.success){
                    this.danhSachTaiKhoan = response.data.data
                }
            }catch(error){
                console.error("Lỗi khi lấy danh sách tk:", error)
            }
        },

        async goi_api_tim_giao_vien(keyword){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giao-vien/tim-giao-vien?keyword=${keyword}
                `)
                if(response.data.success){
                    return response.data.data[0].Mail
                }
            }catch(error){
                console.error("Lỗi khi lấy danh sách GV theo bộ môn:", error)
            }
        },

        mo_modal_sua_tai_khoan(taiKhoan){
            // console.log('Edit Button works')
            // console.log('Dữ liệu tài khoản:', taiKhoan);
            this.taiKhoanDangChinhSua = {... taiKhoan}
            this.hienModalSua = true
        },

        dong_modal_sua_tai_khoan(){
            this.hienModalSua = false
        },

        async goi_api_sua_mat_khau(taiKhoan){
            const MaGV = taiKhoan.MaGV
            const Data = {
                MatKhau: taiKhoan.MatKhau
            }
            try{
                const response = await axios.put(`${API_BASE_URL}/nguoi-dung/sua-nguoi-dung?MaGV=${MaGV}`, Data)
                if(response.data.success){
                    Swal.fire({
                        icon: 'success',
                        title: 'Sửa thành công!',
                        text: 'Dữ liệu đã được cập nhật thành công.',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end',
                        background: '#f0fff4',
                        iconColor: '#2ecc71',
                        customClass: {
                            popup: 'success-toast',
                            title: 'success-title',
                            content: 'success-content'
                        }
                    });
                    await this.hien_danh_sach_tai_khoan()
                    const email = await this.goi_api_tim_giao_vien(taiKhoan.MaGV)
                    this.goi_api_gui_email_mat_khau_moi(taiKhoan, email)
                    this.dong_modal_sua_tai_khoan()
                }
            }catch(error){
                console.error("Lỗi khi cập nhật tài khoản: ", error)
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật dữ liệu!");
            }
        },
        
        async goi_api_gui_email_mat_khau_moi(taiKhoan, email){
            const MaGV = taiKhoan.MaGV
            const MatKhauMoi = taiKhoan.MatKhau
            console.log(taiKhoan.MaGV, email);
            const thongTin = {
                to: email,
                subject: "Tài khoản và mật khẩu hệ thống",
                text: "Chào thầy/cô, đây là thông tin tài khoản của thầy/cô sau khi thay đổi mật khẩu:",
                html:`
                    <div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                        <h2 style="color: #0066cc;">Thông tin tài khoản hệ thống</h2>
                        <p>Chào thầy/cô,</p>
                        <p>Đây là thông tin tài khoản sau khi thay đổi mật khẩu:</p>
                        <ul>
                            <li><strong>Mã giáo viên:</strong> ${MaGV}</li>
                            <li><strong>Mật khẩu:</strong> ${MatKhauMoi}</li>
                        </ul>
                        <p>Trân trọng,</p>
                        <p><strong>Ban quản trị hệ thống</strong></p>
                    </div>                
                ` 
            }
            try{
                const response = await axios.post(`${API_BASE_URL}/email/gui-email`, thongTin)
                if(response.data.success){
                    this.hien_danh_sach_tai_khoan()
                    this.hienModalSua = false
                }
            }catch(error){
                console.log(error)
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi gửi email cho giáo viên mới")
            }
        },
    },
}
</script>

<style scoped>
.container{
    display: flex;
    flex-direction: column;
    padding: 0px 20px;
}

.container__table{
    display: block;
    height: 90vh;
    width: 169vh;
    scrollbar-color: #ADD8E6 #f0f0f0;
    scrollbar-highlight-color: #ADD8E6;    
}

.container__table button{
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 4px;
    margin: 0 2px;
    transition: transform 0.2s ease;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin: 10px 1px;
    overflow: hidden;
}


th, td {
    padding: 8px 0px;
    border: 1px solid #ccc;
    text-align: center;
}

th {
    background: linear-gradient(to bottom, #5d95cf, #0b3e82);
    color: white;
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #f9f9f9;
}

tr:nth-child(odd) {
    background-color: #ffffff;
}
</style>