<template>
    <div class="container">
        <h1>Phân quyền</h1>
        <div class="container__actions">
            <div class="container__add">
                <b>Thêm phân quyền</b>
                <button @click="mo_modal_them_co_quyen">➕</button>
            </div>
        </div>
        <them-co-quyen-modal-vue
            :isOpen="hienModalThem"
            @close="dong_modal_them_co_quyen"
            @save="goi_api_them_co_quyen"
        />
        <div class="container__table">
            <table border="1">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã giáo viên</th>
                        <th>Mã quyền</th>
                        <th>Tên giáo viên</th>
                        <th>Tổ bộ môn</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cq, index) in danhSachCoQuyen" :key="`${cq.MaGV}-${cq.MaQuyen}`">
                        <td>{{index + 1}}</td>
                        <td>{{cq.MaGV}}</td>
                        <td>{{cq.MaQuyen}}</td>
                        <td>{{cq.HoTenGV}}</td>
                        <td>{{cq.TenBM}}</td>
                        <td>
                            <button v-if="duoc_xoa(cq.MaQuyen)" @click="goi_api_xoa_co_quyen(cq.MaGV, cq.MaQuyen)">🗑️</button>
                            <span v-if="duoc_xoa(cq.MaQuyen) == 0" title="Quyền mặc định, không được xóa">🔒</span>
                        </td>
                    </tr>
                </tbody>
            </table>           
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import ThemCoQuyenModalVue from '../../components/admin/them-co-quyen-modal.vue'
import {API_BASE_URL} from '../../config'

export default {
    components:{
        ThemCoQuyenModalVue
    },

    async created(){
        await this.goi_api_lay_thong_tin_session()
        await this.hien_danh_sach_co_quyen()
    },

    data(){
        return{
            danhSachCoQuyen: [],
            hienModalThem: false, 
        }
    },

    methods: {
        async goi_api_lay_thong_tin_session(){
            try{
                const res = await axios.get(`${API_BASE_URL}/dang-nhap/lay-thong-tin-session`)
                if(res.data.success){
                    console.log('Phản hồi sủa session: ', res.data.thongTinSession);
                }
            }catch(error){
                console.log(error);
            }
        },

        async hien_danh_sach_co_quyen(){
            try{
                const res = await axios.get(`${API_BASE_URL}/co-quyen/danh-sach-co-quyen`)
                if(res.data.success){
                    console.log('Phản hồi sủa API: ', res.data.data)
                    this.danhSachCoQuyen = res.data.data
                }
            }catch(error){
                console.log(error);
            }    
        },        

        async goi_api_them_co_quyen(q) {
            
            try {
                const res = await axios.post(`${API_BASE_URL}/co-quyen/them-co-quyen`, q)
                if (res.data.success) {
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
                    this.hien_danh_sach_co_quyen()
                    this.hienModalThem = false
                } else {
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
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm dữ liệu!");
            }
        },

        async goi_api_xoa_co_quyen(magv, maquyen){
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
                    const res = await axios.delete(`${API_BASE_URL}/co-quyen/xoa-co-quyen?MaGV=${magv}&MaQuyen=${maquyen}`)
                    if(res.data.success){
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
                        this.hien_danh_sach_co_quyen()
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
                    console.error(error);
                    Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm dữ liệu!");
                }                
            }

        },

        duoc_xoa(MaQuyen){
            if(MaQuyen == 'GIAO_VIEN')
                return 0
            else return 1
        },

        mo_modal_them_co_quyen() {
            this.hienModalThem = true
        },

        dong_modal_them_co_quyen() {
            this.hienModalThem = false
        }
    }
}
</script>

<style scoped>

b{
    margin-right: 10px;
    font-size: 20px;
}

.container{
    display: flex;
    flex-direction: column;
    padding: 0px 20px;
}

.container__action{
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    flex-direction: column;
}

.container__add button{
  color: #007bff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0px 5px;
}

.container__table{
    display: block;
    height: 90vh;
    width: 169vh;
    scrollbar-color: #ADD8E6 #f0f0f0;
    scrollbar-highlight-color: #ADD8E6;    
}

.container__action{
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin: 10px 1px;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

th, td {
    padding: 8px 7px;
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