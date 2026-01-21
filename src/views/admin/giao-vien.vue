<template>
    <div class="container">
        <h1>Giáo viên</h1>
        <div class="container__action">
            <div class="container__add">
                <b>Thêm giáo viên</b>
                <button @click="mo_modal_them_giao_vien">➕</button>
            </div>
            <div class="container__search">
                <b>Tìm giáo viên</b>
                <input v-model="tuKhoaTimKiem" type="text">
                <button @click="goi_api_tim_giao_vien(tuKhoaTimKiem)" 
                @keyup.enter="goi_api_tim_giao_vien(tuKhoaTimKiem)">
                    Tìm
                </button>
            </div>
            <div class="container__filter">
                <b>Lọc</b>
                <select v-model="MaBM" id="">
                    <option disabled value="">-- Chọn bộ môn --</option>
                    <option value="">Tất cả</option>
                    <option v-for="boMon in danhSachToBoMon" :key="boMon.id" :value="boMon.MaBM">
                        {{boMon.TenBM}}
                    </option>
                </select>
            </div>
        </div>
        <them-giao-vien
            :isOpen="hienModalThem"
            @close="dong_modal_them_giao_vien"
            @save="xu_ly_them_gv"
        />  
        <div class="container__table">
            <table border="1">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã giáo viên</th>
                        <th>Tên giáo viên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Địa chỉ</th>
                        <th>Bộ môn</th>
                        <th>Sửa</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(giaoVien, index) in danhSachGiaoVien" :key="giaoVien.MaGV">
                        <td>{{index + 1}}</td>
                        <td>{{giaoVien.MaGV}}</td>
                        <td>{{giaoVien.HoTenGV}}</td>
                        <td>{{format_ngay(giaoVien.NgaySinh)}}</td>
                        <td>{{hien_gioi_tinh(giaoVien.GioiTinh)}}</td>
                        <td>{{giaoVien.SoDT}}</td>
                        <td>{{giaoVien.Mail}}</td>
                        <td>{{giaoVien.DiaChi}}</td>
                        <td>{{giaoVien.TenBM}}</td>
                        <td>
                            <button @click="mo_modal_sua_giao_vien(giaoVien)">✏️</button>
                            
                        </td>
                        <td>
                            <button @click="goi_api_xoa_giao_vien(giaoVien.MaGV)">🗑️</button>
                        </td>

                    </tr>
                </tbody>
            </table>
            <sua-giao-vien
                :isOpen="hienModalSua"
                :giaoVien="giaoVienDangChinhSua"
                @close="dong_modal_sua_giao_vien"
                @save="goi_api_sua_giao_vien"
            />
        </div>
    </div>
    
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import ThemGiaoVien from '../../components/admin/them-giao-vien-modal.vue'
import SuaGiaoVien from '../../components/admin/sua-giao-vien-modal.vue'
import {API_BASE_URL} from '../../config'

export default {
    components:{
        ThemGiaoVien,
        SuaGiaoVien,
    },

    data(){
        return{
            danhSachGiaoVien: [],
            danhSachToBoMon: [],
            hienModalThem: false,
            hienModalSua: false,
            giaoVienDangChinhSua: null,
            MaBM: "",
            tuKhoaTimKiem: "",
        }
    },

    async created(){
        await this.hien_danh_sach_giao_vien()
        await this.hien_danh_sach_to_bo_mon()
    },

    watch:{
        MaBM(newVal){
            if(newVal == "") this.hien_danh_sach_giao_vien()
            else this.hien_danh_sach_giao_vien_theo_bo_mon(newVal)
        }
    },

    methods: {

        async hien_danh_sach_to_bo_mon(){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/bo-mon/danh-sach-bo-mon
                `)
                if(response.data.success){
                    this.danhSachToBoMon = response.data.data
                }
            }catch(error){
                console.error("Lỗi khi lấy danh sách GV theo bộ môn:", error)
            }
        },

        async hien_danh_sach_giao_vien(){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giao-vien/danh-sach-giao-vien
                `)
                if(response.data.success){
                    this.danhSachGiaoVien = response.data.data
                }
            }catch(error){
                console.log("Lỗi API hiện GV")
                console.log(error)
            }
        },

        async hien_danh_sach_giao_vien_theo_bo_mon(MaBM){
            this.tuKhoaTimKiem = ""
            try{
                
                const response = await axios.get(`
                    ${API_BASE_URL}/giao-vien/danh-sach-giao-vien-bm?MaBM=${MaBM}
                `)
                if(response.data.success){
                    this.danhSachGiaoVien = response.data.data
                }
            }catch(error){
                console.log("Lỗi API hiện GV")
                console.log(error)
            }
        },

        mo_modal_them_giao_vien(){
            console.log('Button works')
            this.hienModalThem = true
        },

        dong_modal_them_giao_vien(){
            this.hienModalThem = false
        },

        mo_modal_sua_giao_vien(giaoVien){
            this.giaoVienDangChinhSua = {...giaoVien}
            this.hienModalSua = true
        },

        dong_modal_sua_giao_vien(){
            this.hienModalSua = false
        },

        format_ngay(isoString){
            const date = new Date(isoString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        hien_gioi_tinh(number){
            if(number == 1) return 'Nam'
            else return 'Nữ'
        },

        async goi_api_them_giao_vien(giaoVien){
            console.log(giaoVien)
            try{
                const response = await axios.post(`
                    ${API_BASE_URL}/giao-vien/them-giao-vien
                `,giaoVien)
                if(response.data.success){
                    Swal.fire({
                        icon: 'success',
                        title: 'Thêm thành công!',
                        text: 'Dữ liệu đã được thêm vào hệ thống.',
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
                    await this.hien_danh_sach_giao_vien()
                    this.hienModalThem = false
                }else
                    Swal.fire({
                        icon: 'error',
                        title: 'Thêm thất bại!',
                        text: 'Không thể thêm dữ liệu vào hệ thống.',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end',
                        background: '#fff1f2',
                        iconColor: '#e74c3c',
                        customClass: {
                            popup: 'error-toast',
                            title: 'error-title',
                            content: 'error-content'
                        }
                    });                           
            }catch(error){
                console.error(error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm dữ liệu!");               
            }
        },

        async goi_api_gui_email(giaovien){
            const req_body = {
                to: giaovien.Mail,
                subject: "Tài khoản và mật khẩu hệ thống",
                text: "Chào thầy/cô, đây là thông tin tài khoản của thầy/cô để đăng nhập vào hệ thống:",
                html:`
                    <div style="font-family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                        <h2 style="color: #0066cc;">Thông tin tài khoản hệ thống</h2>
                        <p>Chào thầy/cô,</p>
                        <p>Đây là thông tin tài khoản sau khi tạo tài khoản:</p>
                        <ul>
                            <li><strong>Mã giáo viên:</strong> ${giaovien.MaGV}</li>
                            <li><strong>Mật khẩu:</strong> 123 </li>
                        </ul>
                        <p>Trân trọng,</p>
                        <p><strong>Ban quản trị hệ thống</strong></p>
                    </div>                
                `
            }
            try{
                const response = await axios.post(`${API_BASE_URL}/email/gui-email`, req_body)
                if(response.data.success){
                    await this.hien_danh_sach_giao_vien()
                    this.hienModalThem = false
                }
            }catch(error){
                console.log(error)
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi gửi email cho giáo viên mới")
            }
        },

        async goi_api_them_co_quyen(giaovien) {
            const req_body = {
                MaGV: giaovien.MaGV,
                MaQuyen: 'GIAO_VIEN'
            }
            console.log('req_body:', req_body);
            try {
                const res = await axios.post(`${API_BASE_URL}/co-quyen/them-co-quyen`, req_body)
                if (res.data.success) {
                    this.hienModalThem = false
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm dữ liệu!");
            }
        },

        async xu_ly_them_gv(giaoVien){
            try{
                await this.goi_api_them_giao_vien(giaoVien)
                await this.goi_api_gui_email(giaoVien)
                await this.goi_api_them_co_quyen(giaoVien)
                this.dong_modal_them_giao_vien()
            }catch(error){
                console.error("Lỗi hàm xử lý thêm gv: ",error)
            }

        },

        async goi_api_sua_giao_vien(giaoVien){
            const MaGV = giaoVien.MaGV
            const data = {
                HoTenGV: giaoVien.HoTenGV,
                NgaySinh: giaoVien.NgaySinh,
                GioiTinh: giaoVien.GioiTinh,
                SoDT: giaoVien.SoDT,
                Mail: giaoVien.Mail,
                DiaChi: giaoVien.DiaChi,
                MaBM: giaoVien.MaBM
            }
            console.log(data)
            try{
                const response = await axios.put(`
                    ${API_BASE_URL}/giao-vien/sua-giao-vien?MaGV=${MaGV}`,
                data)
                    if (response.data.success) {
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
                    await this.hien_danh_sach_giao_vien();
                    this.hienModalSua  = false;
                } else 
                    Swal.fire({
                        icon: 'error',
                        title: 'Sửa thất bại!',
                        text: 'Không thể cập nhật dữ liệu.',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                        toast: true,
                        position: 'top-end',
                        background: '#fff1f2',
                        iconColor: '#e74c3c',
                        customClass: {
                            popup: 'error-toast',
                            title: 'error-title',
                            content: 'error-content'
                        }
                    });
            }catch(error){
                console.error("Lỗi khi cập nhật giáo viên:", error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi sửa dữ liệu!");   
            }
        },

        async goi_api_tim_giao_vien(keyword){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giao-vien/tim-giao-vien?keyword=${keyword}
                `)
                if(response.data.success){
                    this.danhSachGiaoVien = response.data.data
                }
            }catch(error){
                console.error("Lỗi khi lấy danh sách GV theo bộ môn:", error)
            }
        },

        async goi_api_xoa_giao_vien(id){
            const result = await Swal.fire({
                title: "Xác nhận xóa",
                text: "Bạn có chắc chắn muốn xóa dữ liệu này không?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            });  
            if(result.isConfirmed){
                try{
                    const response = await axios.delete(`
                        ${API_BASE_URL}/giao-vien/xoa-giao-vien?MaGV=${id}
                    `)
                    if(response.data.success){
                        Swal.fire({
                            icon: 'success',
                            title: 'Xóa thành công!',
                            text: 'Dữ liệu đã được xóa khỏi hệ thống.',
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
                        await this.hien_danh_sach_giao_vien();                        
                    }else
                        Swal.fire({
                            icon: 'error',
                            title: 'Xóa thất bại!',
                            text: 'Không thể xóa dữ liệu khỏi hệ thống.',
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            toast: true,
                            position: 'top-end',
                            background: '#fff1f2',
                            iconColor: '#e74c3c',
                            customClass: {
                                popup: 'error-toast',
                                title: 'error-title',
                                content: 'error-content'
                            }
                        });                    
                }catch(error){
                    console.log(error)
                    Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa dữ liệu!");
                }                
            }            
        },
    },
}
</script>



<style scoped>
h1{
    color: #007bff;
    text-align: center;
    margin: 20px 0px;
}

b{
    margin-right: 10px;
    font-size: 20px;
}

.container{
    display: flex;
    flex-direction: column;
    padding: 0px 20px;
}

.container__add button,
.container__search button{
  color: #007bff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0px 5px;
}

.container__action{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.container__table{
    display: block;
    height: 90vh;
    width: 169vh;
    scrollbar-color: #ADD8E6 #f0f0f0;
    scrollbar-highlight-color: #ADD8E6;    
}

.container__search input{
    padding: 6px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 200px;
    transition: box-shadow 0.3s ease;    
}

.container__search input:focus{
  outline: none;
  box-shadow: 0 0 4px #66afe9;
  border-color: #66afe9;    
}

.container__filter select{
    padding: 6px 5px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 200px;
    transition: box-shadow 0.3s ease;
    margin-right: 15px;
}

table {
    padding: 20px;
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin: 10px 1px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    overflow: hidden;
}

th, td {
    padding: 5px 4px;
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

.container__table button{
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 4px;
    margin: 0 2px;
    transition: transform 0.2s ease;
}
</style>