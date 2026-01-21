<template>
    <div class="container">
        <h1>Xem Phân Công Giảng Dạy</h1>
        <div class="container__filter">
            <b>Năm học</b>
            <select v-model="namHocDuocChon">
                <option disabled value="">Chọn năm học</option>
                <option v-for="nh in danhSachNamHoc" :key="nh.NamHoc" :value="nh.NamHoc">
                    {{ nh.NamHoc }}
                </option>
            </select>
            <button id="filter-button" @click="hien_thong_tin(namHocDuocChon)">
                Liệt kê
            </button>
        </div>

        <div class="result-table">
            <div><strong>Số tuần HK 1: </strong>{{SoTuanHK1}}</div>
            <div><strong>Số tuần HK 2: </strong> {{SoTuanHK2}}</div>
            <div class="formula-info">
                <strong>Số tiết vượt giờ</strong> = (Tổng tiết HK I - Số tiết chuẩn) * Số tuần HK I + (Tổng tiết HK II - Số tiết chuẩn) * Số tuần HK II
            </div>
            <div class="semester-table">
                <table>
                    <caption>Học kỳ I</caption>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Lớp</th>
                            <th>Môn</th>
                            <th>Số tiết/tuần</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(pc, index) in phanCongHK1" :key="`${pc.lop.TenLop}-${pc.mon.MaMon}`">
                            <td>{{ index + 1 }}</td>
                            <td>{{ pc.lop.TenLop }}</td>
                            <td>{{ pc.mon.TenMon }}</td>
                            <td>{{ pc.soTietTuan }}</td>
                        </tr>
                        <tr v-if="phanCongHK1.length == 0">
                            <td colspan="4">Không có phân công nào</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="semester-table">
                <table>
                    <caption>Học kỳ II</caption>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Lớp</th>
                            <th>Môn</th>
                            <th>Số tiết/tuần</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(pc, index) in phanCongHK2" :key="`${pc.lop.TenLop}-${pc.mon.MaMon}`">
                            <td>{{ index + 1 }}</td>
                            <td>{{ pc.lop.TenLop }}</td>
                            <td>{{ pc.mon.TenMon }}</td>
                            <td>{{ pc.soTietTuan }}</td>
                        </tr>
                        <tr v-if="phanCongHK2.length == 0">
                            <td colspan="4">Không có phân công nào</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="summary-table">
            <table>
                <thead>
                    <tr>
                        <th>Số tiết chuẩn</th>
                        <th>Số tiết CV HK I</th>
                        <th>Số tiết KN HK I</th>
                        <th>Số tiết dạy HK I</th>
                        <th>Số tiết CV HK II</th>
                        <th>Số tiết KN HK II</th>
                        <th>Số tiết dạy HK II</th>
                        <th>TS tiết HK I</th>
                        <th>TS tiết HK II</th>
                        <th>TS tiết vượt giờ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="table-display-other">{{ SoTietChuan }}</td>
                        <td class="table-display-term1" :class="{'red-text': SoTietCVHK1 > 0}">{{ SoTietCVHK1 }}</td>
                        <td class="table-display-term1" :class="{'red-text': SoTietKNHK1 > 0}">{{ SoTietKNHK1 }}</td>
                        <td class="table-display-term1">{{ SoTietDayHK1 }}</td>
                        <td class="table-display-term2" :class="{'red-text': SoTietCVHK2 > 0}">{{ SoTietCVHK2 }}</td>
                        <td class="table-display-term2" :class="{'red-text': SoTietKNHK2 > 0}">{{ SoTietKNHK2 }}</td>
                        <td class="table-display-term2">{{ SoTietDayHK2 }}</td>
                        <td class="table-display-term1">{{ TongSoTietHK1 }}</td>
                        <td class="table-display-term2">{{ TongSoTietHK2 }}</td>
                        <td class="table-display-other" :class="{'red-text': TongSoTietVuotGio > 200}">{{ TongSoTietVuotGio}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import {API_BASE_URL} from '../../config'
export default {
    data() {
        return {
            NamHoc: '',
            HocKy: '',
            danhSachNamHoc: [],
            danhSachGiuChucVu: [],
            danhSachKiemNhiem: [],
            namHocDuocChon: '',
            hocKyDuocChon: '',
            MaGV: '',
            SoTuanHK1: 0,
            SoTuanHK2: 0,
            phanCongHK1: [],
            phanCongHK2: [],
            SoTietChuan: 0,
            SoTietCVHK1: 0,
            SoTietCVHK2: 0,
            SoTietKNHK1: 0,
            SoTietKNHK2: 0,
            SoTietDayHK1: 0,
            SoTietDayHK2: 0,
            TongSoTietHK1: 0,
            TongSoTietHK2: 0,
            TongSoTietVuotGio: 0,
        }
    },

    async created() {
        try {
            await this.lay_thong_tin_session()
            await this.lay_nam_hoc()
            await this.lay_hoc_ky()
            await this.hien_danh_sach_nam_hoc()
            this.SoTuanHK1 = await this.lay_so_tuan_hoc_ky('1'),
            this.SoTuanHK2 = await this.lay_so_tuan_hoc_ky('2')
        } catch (error) {
            console.error('Lỗi trong created:', error)
            Swal.fire('Lỗi!', 'Không thể tải dữ liệu ban đầu!', 'error')
        }
    },

    methods: {
        async lay_thong_tin_session() {
            try {
                const response = await axios.get(`${API_BASE_URL}/dang-nhap/lay-thong-tin-session`, {
                    withCredentials: true
                })
                if (response.data.success) {
                    this.MaGV = response.data.thongTinSession.MaGV
                }
            } catch (error) {
                console.error('Lỗi lấy thông tin session:', error)
                throw error
            }
        },

        format_ngay(date) {
            const nam = date.getFullYear()
            const thang = String(date.getMonth() + 1).padStart(2, '0')
            const ngay = String(date.getDate()).padStart(2, '0')
            return `${nam}-${thang}-${ngay}`
        },

        async lay_nam_hoc() {
            const NgayHomNay = new Date()
            try {
                const response = await axios.get(`${API_BASE_URL}/nam-hoc/lay-nam-hoc-hien-tai?NgayHomNay=${this.format_ngay(NgayHomNay)}`)
                if (response.data.success) {
                    this.NamHoc = response.data.result.NamHoc
                }
                this.namHocDuocChon = this.NamHoc
            } catch (error) {
                console.error('Lỗi lấy năm học:', error)
                throw error
            }
        },

        async lay_hoc_ky() {
            const NgayHomNay = new Date()
            try {
                const response = await axios.get(`${API_BASE_URL}/hoc-ky/lay-hoc-ky-hien-tai?NgayHomNay=${this.format_ngay(NgayHomNay)}`)
                if (response.data.success) {
                    this.HocKy = response.data.data
                }
                this.hocKyDuocChon = this.HocKy
            } catch (error) {
                console.error('Lỗi lấy học kỳ:', error)
                throw error
            }
        },

        async lay_so_tiet_chuan() {
            try {
                const res = await axios.get(`${API_BASE_URL}/nam-hoc/lay-so-tiet-chuan?NamHoc=${this.namHocDuocChon}`)
                if (res.data.success) {
                    this.SoTietChuan = res.data.data[0].SoTietChuan || 0
                }
                return this.SoTietChuan
            } catch (error) {
                console.error(error)
                throw error                
            }
        },

        async lay_so_tuan_hoc_ky(hocky){
            try{
                const res = await axios.get(`${API_BASE_URL}/hoc-ky/lay-so-tuan?HocKy=${hocky}`)
                if(res.data.success){
                    const soTuan = res.data.data[0].SoTuan
                    return soTuan
                }
            }catch(error){
                console.error(error);
                throw error                
            }
        },

        async hien_danh_sach_nam_hoc() {
            try {
                const response = await axios.get(`${API_BASE_URL}/nam-hoc/danh-sach-nam-hoc`)
                if (response.data.success) {
                    this.danhSachNamHoc = response.data.data
                }
                this.namHocDuocChon = this.NamHoc
            } catch (error) {
                console.error('Lỗi lấy danh sách năm học:', error)
                throw error
            }
        },

        async hien_thong_tin(namHoc) {
            if (!namHoc) return
            try {
                const [PCHK1, PCHK2, CV1, CV2, KN1, KN2, soTietChuan] = await Promise.all([
                    this.hien_danh_sach_phan_cong('1'),
                    this.hien_danh_sach_phan_cong('2'),
                    this.hien_so_tiet_cv('1'),
                    this.hien_so_tiet_cv('2'),
                    this.hien_so_tiet_kn('1'),
                    this.hien_so_tiet_kn('2'),
                    this.lay_so_tiet_chuan()
                ])

                this.phanCongHK1 = PCHK1 || []
                this.phanCongHK2 = PCHK2 || []
                this.SoTietCVHK1 = CV1 || 0
                this.SoTietCVHK2 = CV2 || 0
                this.SoTietKNHK1 = KN1 || 0
                this.SoTietKNHK2 = KN2 || 0
                this.SoTietDayHK1 = this.hien_so_tiet_phan_cong('1')
                this.SoTietDayHK2 = this.hien_so_tiet_phan_cong('2')
                this.TongSoTietHK1 = await this.hien_tong_so_tiet('1')
                this.TongSoTietHK2 = await this.hien_tong_so_tiet('2')
                this.TongSoTietVuotGio = this.hien_tong_so_tiet_vuot_gio() || 0
            } catch (error) {
                console.error('Lỗi lấy thông tin:', error)
                Swal.fire('Lỗi!', 'Không thể tải dữ liệu phân công!', 'error')
            }
        },

        async hien_danh_sach_phan_cong(hocKy) {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/giang-day/giang-day-giao-vien?NamHoc=${this.namHocDuocChon}&HocKy=${hocKy}&MaGV=${this.MaGV}`
                )
                if (response.data.success) {
                    const danhSachPhanCong = response.data.danhSach.map(item => ({
                        lop: { TenLop: item.TenLop },
                        mon: { MaMon: item.MaMon, TenMon: item.TenMon },
                        soTietTuan: item.SoTietTuan
                    }))
                    return danhSachPhanCong
                }
                return []
            } catch (error) {
                console.error('Lỗi lấy danh sách phân công:', error)
                return []
            }
        },

        async hien_so_tiet_cv(hocKy) {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/giang-day/so-tiet-mien-giu-chuc-vu-giao-vien?NamHoc=${this.namHocDuocChon}&HocKy=${hocKy}&MaGV=${this.MaGV}`
                )
                if (response.data.success) {
                    const data = response.data.data.map(item => ({
                        ...item,
                        HocKy: hocKy,
                        TenCV: item.TenCV || 'Không giữ chức vụ'
                    }));
                    this.danhSachGiuChucVu = [...data];
                    const soTietMien = data.reduce((total, item) => total + (item.SoTietMien || 0), 0);
                    return soTietMien;
                }
                this.danhSachGiuChucVu = [];
                return 0;
            } catch (error) {
                console.error('Lỗi lấy số tiết CV:', error);
                this.danhSachGiuChucVu = [];
                return 0;
            }
        },

        async hien_so_tiet_kn(hocKy) {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/giang-day/so-tiet-mien-kiem-nhiem-giao-vien?NamHoc=${this.namHocDuocChon}&HocKy=${hocKy}&MaGV=${this.MaGV}`
                )
                if (response.data.success) {
                    const data = response.data.data.map(item => ({
                        ...item,
                        HocKy: hocKy,
                        TenNV: item.TenNV || 'Không có kiêm nhiệm'
                    }));
                    this.danhSachKiemNhiem = [...data];
                    const soTietMien = data.reduce((total, item) => total + (item.SoTietMien || 0), 0);
                    return soTietMien;
                }
                this.danhSachKiemNhiem = [];
                return 0;
            } catch (error) {
                console.error('Lỗi lấy số tiết miễn KN:', error);
                this.danhSachKiemNhiem = [];
                return 0;
            }
        },

        hien_so_tiet_phan_cong(hocKy) {
            if (hocKy === '1') {
                return this.phanCongHK1.reduce((total, pc) => total + (pc.soTietTuan || 0), 0)
            } else {
                return this.phanCongHK2.reduce((total, pc) => total + (pc.soTietTuan || 0), 0)
            }
        },

        async hien_tong_so_tiet(hocKy) {
            const tietDay = this.hien_so_tiet_phan_cong(hocKy);
            const tietMienCV = await this.hien_so_tiet_cv(hocKy);
            const tietMienKN = await this.hien_so_tiet_kn(hocKy);
            return tietDay + tietMienCV + tietMienKN;
        },

        hien_tong_so_tiet_vuot_gio() {
            const tongTietHKI = this.TongSoTietHK1
            const tongTietHKII = this.TongSoTietHK2
            const tietChuan = this.SoTietChuan;
            const SoTuanHK1 = this.SoTuanHK1
            const SoTuanHK2 = this.SoTuanHK2
            
            console.log(tongTietHKI, tongTietHKII);
            return Math.max(0, (tongTietHKI - tietChuan) * SoTuanHK1 + (tongTietHKII - tietChuan) * SoTuanHK2);
        }
    }
}
</script>

<style scoped>
.container{
    display: flex;
    flex-direction: column;
    padding: 0px 20px;
}

.container__year_info {
    margin: 5px 10px;
}

.container__filter {
    margin: 20px 0px;
}

b {
    margin-right: 10px;
    font-size: 20px;
}

select {
    padding: 6px 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 130px;
    margin-right: 10px;
}

#filter-button {
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: 0 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    font-size: 14px;
    margin: 20px 0px;
}

.semester-table caption {
    font-size: 1.2em;
    font-weight: bold;
    padding: 5px;
    background: #e6f7ff;
    text-align: center;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

th {
    background: linear-gradient(to bottom, #5d95cf, #0b3e82);
    color: white;
    font-weight: bold;
}

.table-display-term1{
    background-color: oklch(96.2% 0.044 156.743);
}

.table-display-term2{
    background-color: oklch(93.2% 0.032 255.585);
}

.table-display-other{
    background-color: #e6f7ff;
}

.highlight {
    color: blue;
}

.red-text {
    color: red;
    font-weight: bold;
}
</style>