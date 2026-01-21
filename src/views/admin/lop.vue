<template>
    <div class="container">
        <h1>Lớp</h1>
        <!-- <div class="container__year_info">
            Học kỳ: <span class="highlight">{{this.HocKy}}</span>
            Năm học: <span class="highlight">{{this.NamHoc}}</span>
        </div> -->
        <div class="container__action">
            <div class="container__add">
                <b>Thêm nhiều lớp</b>
                <button @click="mo_modal_them_lop">➕</button>
            </div>
            <div class="container__filter">
                <b>Năm học</b>
                <select v-model="namHocDuocChon" name="" id="">
                    <option disabled value="">Chọn năm học</option>
                    <option v-for="nh in danhSachNamHoc" :key="nh.NamHoc" :value="nh.NamHoc">
                        {{nh.NamHoc}}
                    </option> 
                </select>
                <button id="filter-button" @click="hien_danh_sach_lop(this.namHocDuocChon)">
                    Liệt kê
                </button>
            </div>
            <them-lop-modal-vue
                :isOpen="hienModalThem"
                @close="dong_modal_them_lop"
            />
        </div>
        <div class="container__table">
                <table border="1">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên lớp</th>
                            <th>Tên GVCN</th>
                            <th>Mã GVCN</th>
                            <th>Sửa</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(l, index) in danhSachLop" 
                        :key="JSON.stringify([l.STTLop, l.KyHieu, l.Khoi, l.NamHoc])">
                            <td>{{index + 1}}</td>
                            <td>{{l.TenLop}}</td>
                            <td>{{l.HoTenGV}}</td>
                            <td>{{l.MaGV}}</td>
                            <td>
                                <button v-if="duocXoa" @click="mo_modal_sua_lop(l)">
                                    ✏️
                                </button>
                            </td>
                            <td>
                                <button v-if="duocXoa" @click="goi_api_xoa_lop(l.STTLop, l.Khoi, l.KyHieu, l.NamHoc)">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            <sua-lop-modal-vue
                :isOpen="hienModalSua"
                :Lop="lopDangChinhSua"
                @save="goi_api_sua_lop"
                @close="dong_modal_sua_lop"
            />    
        </div>
    </div>
</template>

<script>

import axios from 'axios'
import Swal from 'sweetalert2'
import ThemLopModalVue from '../../components/admin/them-lop-modal.vue'
import SuaLopModalVue from '../../components/admin/sua-lop-modal.vue'
import {so_sanh_nam_hoc} from '../../utils/so-sanh-nam'
import {lay_nam_hoc, lay_hoc_ky } from '../../utils/lay_nam_hoc_va_hoc_ky'
import {API_BASE_URL} from '../../config'
export default {
    components: {
        ThemLopModalVue,
        SuaLopModalVue
    },

    data(){
        return{
            NamHoc: '',
            HocKy: '',
            danhSachLop: [],
            danhSachNamHoc: [],
            hienModalThem: false,
            hienModalSua: false,
            hocKyDuocChon: '',
            namHocDuocChon: '',
            duocXoa: false, // nếu năm và HK đc chọn là hiện tại thì mới đc xóa 
            lopDangChinhSua: null,
        }
    },

    async created(){
        await this.lay_nam_hoc_va_hoc_ky()
        await this.hien_danh_sach_nam_hoc() 
    },

    methods: {
        async lay_nam_hoc_va_hoc_ky(){
            try{
                this.NamHoc = await lay_nam_hoc()
                this.HocKy = await lay_hoc_ky()
            }catch(error){
                console.log('Lỗi lấy năm học và học kỳ: ', error);
            }
        },

        async hien_danh_sach_nam_hoc(){
            try{
                const respone = await axios.get(`${API_BASE_URL}/nam-hoc/danh-sach-nam-hoc`)
                if(respone.data.success){
                    this.danhSachNamHoc = respone.data.data
                }
            }catch(error){
                console.log(error);
                throw error
            }
        },

        async hien_danh_sach_lop(namhoc){
            try{
                const response = await axios.get(`${API_BASE_URL}/lop/danh-sach-lop?NamHoc=${namhoc}`)
                if(response.data.success){
                    this.danhSachLop = response.data.data
                    // Cập nhật duocXoa sau khi lấy danh sách lớp
                    const ketQua = so_sanh_nam_hoc(this.NamHoc, namhoc)
                    this.duocXoa = ketQua == 'nam_hien_tai' || ketQua == 'nam_sau'
                }
            }catch(error){
                console.log('Lỗi lấy API lấy DS lớp', error)
                throw error
            }
        },

        async goi_api_sua_lop({ request_body, request_query }) {
            try {
                const response = await axios.put(
                    `${API_BASE_URL}/lop/sua-lop?STTLop=${request_query.STTLop}&Khoi=${request_query.Khoi}&KyHieu=${request_query.KyHieu}&NamHoc=${request_query.NamHoc}`,
                    request_body
                );
                if (response.data.success) {
                    await this.hien_danh_sach_lop(this.namHocDuocChon);
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
                    this.dong_modal_sua_lop();
                }else
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
            } catch (error) {
                console.error('Lỗi khi sửa lớp:', error);
                Swal.fire('Lỗi', 'Không thể cập nhật lớp!', 'error');
            }
        },
        
        async goi_api_xoa_lop(STTLop, Khoi, KyHieu, NamHoc){
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
                        ${API_BASE_URL}/lop/xoa-lop?STTLop=${STTLop}&Khoi=${Khoi}&KyHieu=${KyHieu}&NamHoc=${NamHoc}
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
                        this.hien_danh_sach_lop(this.namHocDuocChon)            
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
                    console.log('Lỗi khi xóa lớp:', error);
                    Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa dữ liệu!");
                }
            }
        },

        mo_modal_them_lop(){
            this.hienModalThem = true
        },

        dong_modal_them_lop(){
            this.hienModalThem = false
        },

        mo_modal_sua_lop(lop){
            this.lopDangChinhSua = {...lop}
            this.hienModalSua = true
        },

        dong_modal_sua_lop(){
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
    flex-direction: row;
    margin-bottom: 10px;
}

#filter-button{
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: 0 10px;
    transition: transform 0.2s ease;
}

.container__year_info{
    margin: 5px 20px;
    
}

.highlight{
    color: blue;
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

.container__filter select{
    padding: 6px 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 130px;
    transition: box-shadow 0.3s ease;
}
</style>