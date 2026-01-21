<template>
    <div class="container">
        <h1>Năm học</h1>
        <div class="container__actions">
            <div class="container__add">
                <b>Thêm năm học</b>
                <button @click="mo_modal_them_nam_hoc">➕</button>
            </div>
        </div>
        <them-nam-hoc-modal-vue
            :isOpen="hienModalThem"
            @close="dong_modal_them_nam_hoc"
            @save="goi_api_them_nam_hoc"
        />
        <div class="container__table">
            <table border="1">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Năm học</th>
                        <th>Số tiết chuẩn</th>
                        <th>Ngày đầu năm</th>
                        <th>Ngày cuối năm</th>
                        <th>Sửa</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(namHoc, index) in danhSachNamHoc" :key="namHoc.NamHoc">
                        <td>{{index + 1}}</td>
                        <td>{{namHoc.NamHoc}}</td>
                        <td>{{namHoc.SoTietChuan}}</td>
                        <td>{{format_ngay(namHoc.NgayDauNam)}}</td>
                        <td>{{format_ngay(namHoc.NgayCuoiNam)}}</td>
                        <td>
                            <button @click="mo_modal_sua_nam_hoc(namHoc)">✏️</button>
                        </td>
                        <td>
                            <button @click="goi_api_xoa_nam_hoc(namHoc.NamHoc)">🗑️</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <sua-nam-hoc-modal-vue
                :isOpen="hienModalSua"
                @close="dong_modal_sua_nam_hoc"
                :namHoc="namHocDangChinhSua"
                @save="goi_api_sua_nam_hoc"
            />
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import ThemNamHocModalVue from '../../components/admin/them-nam-hoc-modal.vue'
import SuaNamHocModalVue from '../../components/admin/sua-nam-hoc-modal.vue'
import {API_BASE_URL} from '../../config'

export default {
    components:{
        ThemNamHocModalVue,
        SuaNamHocModalVue
    },

    data(){
        return{
            danhSachNamHoc: [],
            hienModalThem: false,
            hienModalSua: false,
            namHocDangChinhSua: null,
        }
    },

    async created(){
        await this.hien_danh_sach_nam_hoc()
    },

    methods: {
        async hien_danh_sach_nam_hoc(){
            try{
                const response = await axios.get(`${API_BASE_URL}/nam-hoc/danh-sach-nam-hoc`)
                if(response.data.success)
                    this.danhSachNamHoc = response.data.data
            }catch(error){
                console.log("Lỗi khi lấy danh sách năm học: ")
                console.log(error)
            }
        },

        async goi_api_them_nam_hoc(namHoc){
            // console.log('Năm học từ modal:')
            // console.log(namHoc)
            try{
                const response = await axios.post(`
                    ${API_BASE_URL}/nam-hoc/them-nam-hoc
                `, namHoc)
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
                    await this.hien_danh_sach_nam_hoc()
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

        async goi_api_sua_nam_hoc(namHoc){
            
            const data = {
                "SoTietChuan": namHoc.SoTietChuan,
                "NgayDauNam": this.format_ngay(namHoc.NgayDauNam),
                "NgayCuoiNam": this.format_ngay(namHoc.NgayCuoiNam)
            }
            console.log(namHoc)
            try{
                const response = await axios.put(`
                    ${API_BASE_URL}/nam-hoc/sua-nam-hoc?NamHoc=${namHoc.NamHoc}
                `, data)
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
                    await this.hien_danh_sach_nam_hoc();
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
                console.error("Lỗi khi cập nhật tổ bộ môn:", error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi sửa dữ liệu!");
            }
        },

        format_ngay(isoString){
            const date = new Date(isoString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        async goi_api_xoa_nam_hoc(id){
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
                        ${API_BASE_URL}/nam-hoc/xoa-nam-hoc?NamHoc=${id}
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
                        await this.hien_danh_sach_nam_hoc();                        
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

        mo_modal_them_nam_hoc(){
            //console.log('Open modal button works')
            this.hienModalThem = true
        },

        dong_modal_them_nam_hoc(){
            //console.log("Close modal button works")
            this.hienModalThem = false
        },

        mo_modal_sua_nam_hoc(namHoc){
            this.namHocDangChinhSua = {...namHoc}
            this.hienModalSua = true
        },

        dong_modal_sua_nam_hoc(){
            this.hienModalSua = false
        },
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