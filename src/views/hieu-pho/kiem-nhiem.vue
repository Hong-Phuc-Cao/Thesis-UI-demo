<template>
    <div class="container">
        <h1>Phân công kiêm nhiệm</h1>
        <div class="container__action">
            <div class="container__add">
                <b>Phân công mới</b>
                <button @click="mo_modal_them_kiem_nhiem">➕</button> 
            </div>
            <div class="container__filter"> 
                <b>Học kỳ</b>
                <select v-model="hocKyDuocChon" name="" id="">
                    <option disabled value="">Chọn học kỳ</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                <b>Năm học</b>
                <select v-model="namHocDuocChon" name="" id="">
                    <option disabled value="">Chọn năm học</option>
                    <option v-for="nh in danhSachNamHoc" :key="nh.NamHoc" :value="nh.NamHoc">
                        {{nh.NamHoc}}
                    </option> 
                </select>
                <button id="filter-button" @click="hien_danh_sach_kiem_nhiem(this.hocKyDuocChon, this.namHocDuocChon)">
                    Liệt kê
                </button>
            </div>
            <them-kiem-nhiem-vue
                :isOpen="hienModalThem"
                :hocky="parseInt(this.HocKy)"
                :namhoc="this.NamHoc"
                @close="dong_modal_them_kiem_nhiem"
                @save="goi_api_them_kiem_nhiem"
            />
        </div>
        <div class="container__table">
                <table border="1">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã giáo viên</th>
                            <th>Tên giáo viên</th>
                            <th>Mã nhiệm vụ</th>
                            <th>Tên nhiệm vụ</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="danhSachKiemNhiem.length === 0">
                            <td colspan="6">Không có dữ liệu kiêm nhiệm cho học kỳ và năm học đã chọn.</td>
                        </tr>
                        <tr v-for="(kn, index) in danhSachKiemNhiem" :key="`${kn.MaGV}-${kn.MaNV}`">
                            <td>{{index + 1}}</td>
                            <td>{{kn.MaGV}}</td>
                            <td>{{kn.HoTenGV}}</td>
                            <td>{{kn.MaNV}}</td>
                            <td>{{kn.TenNV}}</td>
                            <td>
                                <button v-if="duocXoa" 
                                @click="goi_api_xoa_kiem_nhiem(kn.MaGV, kn.MaNV, kn.HocKy, kn.NamHoc)">
                                    🗑️
                                </button>
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
import ThemKiemNhiemVue from '../../components/hieu-pho/them-kiem-nhiem.vue'
import {so_sanh_nam_hoc} from '../../utils/so-sanh-nam'
import {lay_nam_hoc, lay_hoc_ky } from '../../utils/lay_nam_hoc_va_hoc_ky'
import {API_BASE_URL} from '../../config'
export default {
    components: {
        ThemKiemNhiemVue
    },

    data(){
        return{
            NamHoc: '',
            HocKy: '',
            danhSachKiemNhiem: [],
            danhSachNamHoc: [],
            hienModalThem: false,
            hocKyDuocChon: '',
            namHocDuocChon: '',
            duocXoa: false, // nếu năm và HK đc chọn là hiện tại thì mới đc xóa 
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
                //console.log('Năm học và học kỳ: ', this.NamHoc, this.HocKy);
                this.hocKyDuocChon = this.HocKy
                this.namHocDuocChon = this.NamHoc
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

        async hien_danh_sach_kiem_nhiem(hocky, namhoc){
            try{
                const response = await axios.get(`${API_BASE_URL}/kiem-nhiem/danh-sach-kiem-nhiem?HocKy=${hocky}&NamHoc=${namhoc}`)
                if(response.data){
                    //console.log(response.data.data)
                    this.danhSachKiemNhiem = response.data.data
                    const ketQua = so_sanh_nam_hoc(this.NamHoc, namhoc)
                    this.duocXoa = (ketQua == 'nam_hien_tai' && hocky == this.HocKy) || ketQua == 'nam_sau'
                }
            }catch(error){
                console.log('Lỗi lấy API giữ chức vụ', error)
                throw error
            }
        },

        async goi_api_them_kiem_nhiem(kn) {
            try {
                    const knData = { ...kn};
                    const response = await axios.post(`${API_BASE_URL}/kiem-nhiem/them-kiem-nhiem`, knData);

                    if (response.data.success) {
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
                        this.hienModalThem = false;
                        await this.hien_danh_sach_kiem_nhiem(this.hocKyDuocChon, this.namHocDuocChon);   
                    } else
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
            } catch (error) {
                console.error('Chi tiết lỗi:', error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm dữ liệu!");
            }
        },

        async goi_api_xoa_kiem_nhiem(MaGV, MaNV, HocKy, NamHoc){
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
                        ${API_BASE_URL}/kiem-nhiem/xoa-kiem-nhiem?MaGV=${MaGV}&MaNV=${MaNV}&HocKy=${HocKy}&NamHoc=${NamHoc}
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
                        await this.hien_danh_sach_kiem_nhiem(this.hocKyDuocChon, this.namHocDuocChon);                        
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

        mo_modal_them_kiem_nhiem(){
            this.hienModalThem = true
        },

        dong_modal_them_kiem_nhiem(){
            this.hienModalThem = false
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

.container__action{
    display: flex;
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
    font-size: 14px;
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

.container__filter select{
    padding: 6px 5px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 130px;
    transition: box-shadow 0.3s ease;
    margin-right: 15px;
}
</style>