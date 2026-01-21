<template>
    <div class="container">
        <h1>Phân công chức vụ</h1>
        <div class="container__action">
            <div class="container__add">
                <b>Phân công mới</b>
                <button @click="mo_modal_them_giu_chuc_vu">➕</button>
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
                <button id="filter-button" @click="hien_danh_sach_giu_chuc_vu(this.hocKyDuocChon, this.namHocDuocChon)">
                    Liệt kê
                </button>
            </div>
        </div>
        <them-giu-chuc-vu-vue
                :isOpen="hienModalThem"
                :hocky="parseInt(this.HocKy)"
                :namhoc="this.NamHoc"
                @close="dong_modal_them_giu_chuc_vu"
                @save="goi_api_them_giu_chuc_vu"
        />
        <div class="container__table">
                <table border="1">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã giáo viên</th>
                            <th>Tên giáo viên</th>
                            <th>Mã chức vụ</th>
                            <th>Tên chức vụ</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="danhSachGiuChucVu.length === 0">
                            <td colspan="6">Không có dữ liệu giữ chức vụ cho học kỳ và năm học đã chọn.</td>
                        </tr>
                        <tr v-for="(gcv, index) in danhSachGiuChucVu" :key="`${gcv.MaGV}-${gcv.MaCV}`">
                            <td>{{index + 1}}</td>
                            <td>{{gcv.MaGV}}</td>
                            <td>{{gcv.HoTenGV}}</td>
                            <td>{{gcv.MaCV}}</td>
                            <td>{{gcv.TenCV}}</td>
                            <td>
                                <button v-if="duocXoa"
                                @click="goi_api_xoa_giu_chuc_vu(gcv.MaGV, gcv.MaCV, gcv.HocKy, gcv.NamHoc)">
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
import ThemGiuChucVuVue from '../../components/hieu-pho/them-giu-chuc-vu.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import {so_sanh_nam_hoc} from '../../utils/so-sanh-nam'
import {API_BASE_URL} from '../../config'
export default {
    components: {
        ThemGiuChucVuVue
    },

    data() {
        return {
            NamHoc: '',
            HocKy: '',
            danhSachGiuChucVu: [],
            danhSachNamHoc: [],
            hienModalThem: false,
            hocKyDuocChon: '',
            namHocDuocChon: '',
            duocXoa: false,
        }
    },

    async created() {
        await this.lay_hoc_ky()
        await this.lay_nam_hoc()
        await this.hien_danh_sach_nam_hoc()
    },

    methods: {
        format_ngay(date) {
            const nam = date.getFullYear()
            const thang = date.getMonth() + 1
            const ngay = date.getDate()
            return `${nam}-${thang}-${ngay}`
        },

        async hien_danh_sach_nam_hoc() {
            try {
                const response = await axios.get(`${API_BASE_URL}/nam-hoc/danh-sach-nam-hoc`)
                if (response.data.success) {
                    this.danhSachNamHoc = response.data.data
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách năm học:', error)
                throw error
            }
        },

        async lay_nam_hoc() {
            const NgayHomNay = new Date()
            try {
                const response_nam_hoc = await axios.get(`${API_BASE_URL}/nam-hoc/lay-nam-hoc-hien-tai?NgayHomNay=${this.format_ngay(NgayHomNay)}`)
                if (response_nam_hoc.data) {
                    this.NamHoc = response_nam_hoc.data.result.NamHoc
                    this.namHocDuocChon = this.NamHoc
                }
            } catch (error) {
                console.error('Lỗi lấy API năm học:', error)
                throw error
            }
        },

        async lay_hoc_ky() {
            const NgayHomNay = new Date()
            try {
                const response_hoc_ky = await axios.get(`${API_BASE_URL}/hoc-ky/lay-hoc-ky-hien-tai?NgayHomNay=${this.format_ngay(NgayHomNay)}`)
                if (response_hoc_ky.data) {
                    this.HocKy = response_hoc_ky.data.data
                    this.hocKyDuocChon = this.HocKy
                }
            } catch (error) {
                console.error('Lỗi lấy API học kỳ:', error)
                throw error
            }
        },

        async hien_danh_sach_giu_chuc_vu(hocky, namhoc) {
            try {
                const response = await axios.get(`${API_BASE_URL}/giu-chuc-vu/danh-sach-giu-chuc-vu?HocKy=${hocky}&NamHoc=${namhoc}`)
                if (response.data) {
                    this.danhSachGiuChucVu = response.data.data
                    const ketQua = so_sanh_nam_hoc(this.NamHoc, namhoc)
                    this.duocXoa = (ketQua == 'nam_hien_tai' && hocky == this.HocKy) || ketQua == 'nam_sau'
                }
            } catch (error) {
                console.error('Lỗi lấy API giữ chức vụ:', error)
                throw error
            }
        },

        async goi_api_them_giu_chuc_vu(gcv) {
            try {
                const response = await axios.post(`${API_BASE_URL}/giu-chuc-vu/them-giu-chuc-vu`, gcv)

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
                    this.hien_danh_sach_giu_chuc_vu(this.HocKy, this.NamHoc)
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
                console.error('Lỗi thêm chức vụ:', error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi thêm dữ liệu!");
            }
        },

        async goi_api_xoa_giu_chuc_vu(MaGV, MaCV, HocKy, NamHoc) {
            const maQuyenMapping = {
                'CV000': 'ADMIN',
                'CV001': 'HIEU_TRUONG',
                'CV002': 'HIEU_PHO',
                'CV004': 'TO_TRUONG'
            };
            const roleCounts = {
                CV000: 0, // Admin
                CV001: 0, // Hiệu trưởng
                CV002: 0, // Hiệu phó
            };

            this.danhSachGiuChucVu.forEach(cv => {
                if (cv.MaCV === 'CV000') roleCounts.CV000++;
                else if (cv.MaCV === 'CV001') roleCounts.CV001++;
                else if (cv.MaCV === 'CV002') roleCounts.CV002++;
            });

            if (roleCounts[MaCV] <= 1 && ['CV000', 'CV001', 'CV002'].includes(MaCV)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Không thể xóa!',
                    text: `Hệ thống phải có ít nhất 1 ${MaCV === 'CV000' ? 'Quản trị viên' : MaCV === 'CV001' ? 'Hiệu trưởng' : 'Hiệu phó'}.`,
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    toast: true,
                    position: 'top-end',
                    background: '#fff1f2',
                    iconColor: '#e74c3c'
                });
                return;
            }

            const otherRoles = this.danhSachGiuChucVu.filter(cv => cv.MaGV === MaGV && cv.MaCV !== MaCV);
            const canXoaQuyen = maQuyenMapping[MaCV] && otherRoles.every(cv => !Object.keys(maQuyenMapping).includes(cv.MaCV));

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

            if (result.isConfirmed) {
                try {
                    const requests = [
                        axios.delete(`${API_BASE_URL}/giu-chuc-vu/xoa-giu-chuc-vu?MaGV=${MaGV}&MaCV=${MaCV}&HocKy=${HocKy}&NamHoc=${NamHoc}`)
                    ];
                    if (canXoaQuyen) {
                        console.log('API xóa quyền:', { MaGV, MaQuyen: maQuyenMapping[MaCV] });
                        requests.push(axios.delete(`${API_BASE_URL}/co-quyen/xoa-co-quyen?MaGV=${MaGV}&MaQuyen=${maQuyenMapping[MaCV]}`))
                    }

                    const responses = await Promise.all(requests);
                    if (responses.every(res => res.data.success)) {
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
                        await this.hien_danh_sach_giu_chuc_vu(this.hocKyDuocChon, this.namHocDuocChon);
                    } else {
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
                    }
                } catch (error) {
                    console.error('Lỗi xóa chức vụ:', error);
                    Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa dữ liệu!");
                }
            }
        },

        mo_modal_them_giu_chuc_vu() {
            this.hienModalThem = true
        },

        dong_modal_them_giu_chuc_vu() {
            this.hienModalThem = false
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
    padding: 0px 20px;
    display: flex;
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