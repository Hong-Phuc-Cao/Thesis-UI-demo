<template>
    <div class="container">
        <h1>Nhiệm vụ</h1>
        <div class="container__action">
            <div class="container__add">
                <b>Thêm nhiệm vụ</b>
                <button @click="mo_modal_them_nhiem_vu">➕</button>
            </div>
            <them-nhiem-vu-modal-vue
                :isOpen="hienModalThem"
                @close="dong_modal_them_nhiem_vu"
                @save="goi_api_them_nhiem_vu"
            />
            <div class="container__table">
                <table border="1">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã nhiệm vụ</th>
                            <th>Tên nhiệm vụ</th>
                            <th>Số tiết được miễn</th>
                            <th>Sửa</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(nhiemVu, index) in danhSachNhiemVu" :key="nhiemVu.MaNV">
                            <td>{{index + 1}}</td>
                            <td>{{nhiemVu.MaNV}}</td>
                            <td>{{nhiemVu.TenNV}}</td>
                            <td>{{nhiemVu.SoTietMien}}</td>
                            <td>
                                <button @click="mo_modal_sua_nhiem_vu(nhiemVu)">✏️</button>
                            </td>
                            <td>
                                <button @click="goi_api_xoa_nhiem_vu(nhiemVu.MaNV)">🗑️</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <sua-nhiem-vu-modal-vue
                    :isOpen="hienModalSua"
                    :nhiemVu="nhiemVuDangChinhSua"
                    @close="dong_modal_sua_nhiem_vu"
                    @save="goi_api_sua_nhiem_vu"
                />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import ThemNhiemVuModalVue from '../../components/admin/them-nhiem-vu-modal.vue'
import SuaNhiemVuModalVue from '../../components/admin/sua-nhiem-vu-modal.vue'
import {API_BASE_URL} from '../../config'

export default {
    components:{
        ThemNhiemVuModalVue,
        SuaNhiemVuModalVue
    },

    data(){
        return{
            danhSachNhiemVu: [],
            hienModalThem: false,
            hienModalSua: false,
            nhiemVuDangChinhSua: null,
        }
    },

    async created(){
        await this.hien_danh_sach_nhiem_vu()
    }, 

    methods:{
        async hien_danh_sach_nhiem_vu(){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/nhiem-vu/danh-sach-nhiem-vu
                `)
                if(response.data.success){
                    this.danhSachNhiemVu = response.data.data
                }
            }catch(error){
                console.error("Lỗi khi lấy danh sách nhiệm vụ:", error)
            }
        },

        async goi_api_them_nhiem_vu(nhiemVu){
            console.log('Nhiệm vụ từ modal:')
            console.log(nhiemVu)
            try{
                const response = await axios.post(`
                    ${API_BASE_URL}/nhiem-vu/them-nhiem-vu    
                `, nhiemVu)
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
                    await this.hien_danh_sach_nhiem_vu()
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

        async goi_api_sua_nhiem_vu(nhiemVu){
            const MaNV = nhiemVu.MaNV
            const data = {
                TenNV: nhiemVu.TenNV,
                SoTietMien: nhiemVu.SoTietMien
            }
            console.log(data)
            try{
                const response = await axios.put(`
                    ${API_BASE_URL}/nhiem-vu/sua-nhiem-vu?MaNV=${MaNV}`,
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
                    await this.hien_danh_sach_nhiem_vu();
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
                console.error("Lỗi khi cập nhật nhiệm vụ:", error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi sửa dữ liệu!");
            }
        },

        async goi_api_xoa_nhiem_vu(id){
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
                        ${API_BASE_URL}/nhiem-vu/xoa-nhiem-vu?MaNV=${id}
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
                        await this.hien_danh_sach_nhiem_vu();                        
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

        mo_modal_them_nhiem_vu(){
            console.log('Open modal button works')
            this.hienModalThem = true
        },

        dong_modal_them_nhiem_vu(){
            console.log('Close modal button works')
            this.hienModalThem = false
        },

        mo_modal_sua_nhiem_vu(nhiemVu){
            this.nhiemVuDangChinhSua = {...nhiemVu}
            this.hienModalSua = true
        },

        dong_modal_sua_nhiem_vu(){
            this.hienModalSua = false
        }
    },
}
</script>

<style scoped>
h1{
    color: #007bff;
    text-align: center;
    margin: 10px 0px;
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