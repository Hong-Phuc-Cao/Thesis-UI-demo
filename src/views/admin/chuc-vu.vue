<template>
    <div class="container">
        <h1>Chức vụ</h1>
        <div class="container__action">
            <div class="container__add">
                <b>Thêm chức vụ</b>
                <button @click="mo_modal_them_chuc_vu">➕</button>
            </div>
            <them-chuc-vu-modal
                :isOpen="hienModalThem"
                @close="dong_modal_them_chuc_vu"
                @save="goi_api_them_chuc_vu"
            />
            <div class="container__table">
                <table border="1">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã chức vụ</th>
                            <th>Tên chức vụ</th>
                            <th>Số tiết được miễn</th>
                            <th>Sửa</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(chucVu, index) in danhSachChucVu" :key="chucVu.MaCV">
                            <td>{{index + 1}}</td>
                            <td>{{chucVu.MaCV}}</td>
                            <td>{{chucVu.TenCV}}</td>
                            <td>{{chucVu.SoTietMien}}</td>
                            <td>
                                <button @click="mo_modal_sua_chuc_vu(chucVu)">✏️</button>
                            </td>
                            <td>
                                <button @click="goi_api_xoa_nhiem_vu(chucVu.MaCV)">🗑️</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <sua-chuc-vu-modal
                :isOpen="hienModalSua"
                :chucVu="chucVuDangChinhSua"
                @close="dong_modal_sua_chuc_vu"
                @save="goi_api_sua_chuc_vu"
            />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import ThemChucVuModal from '../../components/admin/them-chuc-vu-modal.vue'
import SuaChucVuModal from '../../components/admin/sua-chuc-vu-modal.vue'
import {API_BASE_URL} from '../../config'
export default {
    components:{
        ThemChucVuModal,
        SuaChucVuModal
    },

    data(){
        return{
            danhSachChucVu: [],
            hienModalThem: false,
            hienModalSua: false,
            chucVuDangChinhSua: null,
        }
    },

    async created(){
        await this.hien_danh_sach_chuc_vu()
    },

    methods:{
        async hien_danh_sach_chuc_vu(){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/chuc-vu/danh-sach-chuc-vu
                `)
                if(response.data.success){
                    this.danhSachChucVu = response.data.data
                }
            }catch(error){
                console.log("Lỗi khi lấy danh sách chức vụ: ", error)
            }
        },

        async goi_api_them_chuc_vu(chucVu){
            console.log('Chức vụ từ modal:')
            console.log(chucVu)
            try{
                const response = await axios.post(`
                    ${API_BASE_URL}/chuc-vu/them-chuc-vu
                `, chucVu)
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
                    await this.hien_danh_sach_chuc_vu()
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

        async goi_api_sua_chuc_vu(chucVu){
            const MaCV = chucVu.MaCV
            const data = {
                TenCV: chucVu.TenCV,
                SoTietMien: chucVu.SoTietMien
            }
            console.log(data)
            try{
                const response = await axios.put(`
                    ${API_BASE_URL}/chuc-vu/sua-chuc-vu?MaCV=${MaCV}`,
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
                    await this.hien_danh_sach_chuc_vu();
                    this.hienModalSua  = false;
                } else {
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
                }
            }catch(error){
                console.error("Lỗi khi cập nhật chức vụ:", error);
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
                        ${API_BASE_URL}/chuc-vu/xoa-chuc-vu?MaCV=${id}
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
                        await this.hien_danh_sach_chuc_vu();                        
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

        mo_modal_them_chuc_vu(){
            console.log('Open modal button works')
            this.hienModalThem = true
        },

        dong_modal_them_chuc_vu(){
            console.log('Close modal button works')
            this.hienModalThem = false
        },

        mo_modal_sua_chuc_vu(chucVu){
            this.chucVuDangChinhSua = {...chucVu}
            this.hienModalSua = true
        },

        dong_modal_sua_chuc_vu(){
            this.hienModalSua = false
        }
    }
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
    font-size: 14px;
    overflow: hidden;
}

th, td {
    padding: 5px;
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