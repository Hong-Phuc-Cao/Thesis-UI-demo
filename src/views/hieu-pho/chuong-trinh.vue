<template>
    <div class="container">
        <h1>Chương trình</h1>    
        <div class="container__action">
            <div class="container__add">
                <b>Thêm chương trình</b>
                <button @click="mo_modal_them_chuong_trinh">➕</button>
            </div>
            <them-chuong-trinh-vue
                :isOpen="hienModalThem"
                @save="goi_api_them_chuong_trinh"
                @close="dong_modal_them_chuong_trinh"
            />  
            <div class="container__filter">
                <label for="">
                    <b>Khối</b>
                    <select v-model="khoiDuocChon" name="" id="">
                        <option disabled value="">-- Chọn khối --</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </label>
                <label for="">
                    <b>Học kỳ</b>
                    <select v-model="hocKyDuocChon" id="">
                        <option disabled value="">-- Chọn học kỳ --</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </label>
                <button id="filter-button" @click="hien_thong_tin(this.hocKyDuocChon, this.khoiDuocChon)">
                    Liệt kê
                </button>
            </div>
        </div>
        <div class="container__table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên nhóm</th>
                            <th>Tên môn</th>
                            <th>Số tiết tuần</th>
                            <th>Sửa</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ct, index) in danhSachChuongTrinh" :key="`${ct.MaMon}-${ct.MaNhom}-${ct.HocKy}`">
                            <td>{{index + 1}}</td>
                            <td>{{ct.TenNhom}}</td>
                            <td>{{ct.TenMon}}</td>
                            <td>{{ct.SoTietTuan}}</td>
                            <td>
                                <button @click="mo_modal_sua_chuong_trinh(ct)">✏️</button>
                            </td>
                            <td>
                                <button @click="goi_api_xoa_chuong_trinh(ct.Khoi, ct.MaNhom, ct.HocKy, ct.MaMon)">🗑️</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
        </div>
        <sua-chuong-trinh-vue
            :isOpen="hienModalSua"
            :chuongTrinh="chuongTrinhDangChinhSua"
            @save="goi_api_sua_chuong_trinh"
            @close="dong_modal_sua_chuong_trinh"
        />
    </div>
    
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import ThemChuongTrinhVue from '../../components/hieu-pho/them-chuong-trinh.vue'
import SuaChuongTrinhVue from '../../components/hieu-pho/sua-chuong-trinh.vue'
import {API_BASE_URL} from '../../config'

export default {
    components:{
        ThemChuongTrinhVue,
        SuaChuongTrinhVue
    },

    data(){
        return{
            NamHoc: '',
            HocKy: '',
            hocKyDuocChon: '',
            khoiDuocChon: '',
            danhSachChuongTrinh: [],
            hienModalThem: false,
            hienModalSua: false,
            chuongTrinhDangChinhSua: null
        }
    },

    async created(){
        await this.lay_hoc_ky()
        await this.lay_nam_hoc()
    },

    methods: {
        format_ngay(date){
            const nam = date.getFullYear()
            const thang = date.getMonth() + 1
            const ngay = date.getDate()
            return `${nam}-${thang}-${ngay}`
        },

        async lay_nam_hoc(){
            const NgayHomNay = new Date()
            try{
                const response_nam_hoc = await axios.get(`${API_BASE_URL}/nam-hoc/lay-nam-hoc-hien-tai?NgayHomNay=${this.format_ngay(NgayHomNay)}`)
                if(response_nam_hoc.data){
                    //console.log('API:',response_nam_hoc.data.result.NamHoc);
                    this.NamHoc = response_nam_hoc.data.result.NamHoc
                }
                //console.log('NamHoc', this.NamHoc)
            }catch(error){
                console.log('Lỗi lấy API năm học')
                throw error
            }
        },

        async lay_hoc_ky(){
            const NgayHomNay = new Date()
            //console.log(this.format_ngay(NgayHomNay));
            try{
                const response_hoc_ky = await axios.get(`${API_BASE_URL}/hoc-ky/lay-hoc-ky-hien-tai?NgayHomNay=${this.format_ngay(NgayHomNay)}`)
                if(response_hoc_ky.data){
                    //console.log(response_hoc_ky.data)
                    this.HocKy = response_hoc_ky.data.data
                }
                //console.log('HocKy:', this.HocKy)
                this.hocKyDuocChon = this.HocKy
            }catch(error){
                console.log('Lỗi lấy API học kỳ', error)
                throw error
            }
        },

        async hien_danh_sach_chuong_trinh_theo_hoc_ky_va_khoi(hk, k){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/chuong-trinh/danh-sach-chuong-trinh-theo-hoc-ky-va-khoi?HocKy=${hk}&Khoi=${k}
                `)
                if(response.data.success){
                    this.danhSachChuongTrinh = response.data.data
                }
                console.log(this.danhSachChuongTrinh);
            }catch(error){
                console.log('Lỗi khi lấy danh sách ch trình theo hk: ', error);
                throw error
            }
        },

        async goi_api_them_chuong_trinh(chuongTrinhMoi){
            console.log(chuongTrinhMoi)
            try{
                const response = await axios.post(`
                    ${API_BASE_URL}/chuong-trinh/them-chuong-trinh
                `,chuongTrinhMoi)
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
                    this.hien_danh_sach_chuong_trinh_theo_hoc_ky_va_khoi(this.hocKyDuocChon, this.khoiDuocChon)
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
        
        async goi_api_sua_chuong_trinh(chuongTrinhDaSua){
            const Khoi = chuongTrinhDaSua.Khoi
            const MaNhom = chuongTrinhDaSua.MaNhom
            const HocKy = chuongTrinhDaSua.HocKy
            const MaMon = chuongTrinhDaSua.MaMon

            const SoTietTuan = chuongTrinhDaSua.SoTietTuan
            console.log('Thong tin tu API: ', Khoi, MaMon, MaNhom, HocKy, SoTietTuan);
            try{
                const res = await axios.put(`
                    ${API_BASE_URL}/chuong-trinh/sua-chuong-trinh?Khoi=${Khoi}&MaNhom=${MaNhom}&HocKy=${HocKy}&MaMon=${MaMon}
                `,{SoTietTuan})
                if (res.data.success) {
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
                console.error(error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi sửa dữ liệu!");
            }
        },

        async goi_api_xoa_chuong_trinh(Khoi, MaNhom, HocKy, MaMon){
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
            if(result.isConfirmed)
            try{
                const res = await axios.delete(`
                    ${API_BASE_URL}/chuong-trinh/xoa-chuong-trinh?Khoi=${Khoi}&MaNhom=${MaNhom}&HocKy=${HocKy}&MaMon=${MaMon}
                `)
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
                    this.hien_danh_sach_chuong_trinh_theo_hoc_ky_va_khoi(this.hocKyDuocChon, this.khoiDuocChon)
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
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa dữ liệu!");
            }
        },

        async hien_thong_tin(hk, k){
            await this.hien_danh_sach_chuong_trinh_theo_hoc_ky_va_khoi(hk, k)
        },

        mo_modal_them_chuong_trinh(){
            this.hienModalThem = true
        },

        dong_modal_them_chuong_trinh(){
            this.hienModalThem = false
        },

        mo_modal_sua_chuong_trinh(chuongTrinh){
            this.chuongTrinhDangChinhSua = {... chuongTrinh}
            this.hienModalSua = true
        },

        dong_modal_sua_chuong_trinh(){
            this.hienModalSua = false
        },
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
    /* justify-content: space-between; */
    margin-bottom: 5px;
    flex-direction: row;
}

.container__filter select{
    padding: 6px 5px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 150px;
    transition: box-shadow 0.3s ease;
    margin-right: 15px;
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
    display: flex;
    flex-direction: column;
    flex: 1;
    scrollbar-color: #ADD8E6 #f0f0f0;
    scrollbar-highlight-color: #ADD8E6;    
}

.container__year_info{
    margin: 1px 20px;

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
    font-size: 15px;
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

#filter-button{
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: 0 10px;
    transition: transform 0.2s ease;
}
</style>