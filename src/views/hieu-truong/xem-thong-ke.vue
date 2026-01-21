<template>
    <div class="container">
        <h1>Xem thống kê</h1>
        <div class="container__action">
            <div class="container__filter">
                <b>Năm học</b>
                <select v-model="namHocDuocChon" name="namHoc" id="namHoc">
                    <option disabled value="">Chọn năm học</option>
                    <option v-for="nh in danhSachNamHoc" :key="nh.NamHoc" :value="nh.NamHoc">
                        {{nh.NamHoc}}
                    </option> 
                </select>
                <b>Tổ bộ môn</b>
                <select v-model="toBoMonDuocChon" name="toBoMonDuocChon" id="toBoMonDuocChon">
                    <option disabled value="">Chọn tổ bộ môn</option>
                    <option v-for="tbm in danhSachToBoMon" :key="tbm.MaBM" :value="tbm.MaBM">
                        {{tbm.TenBM}}
                    </option>
                </select>
                <button id="filter-button" @click="hien_thong_tin(namHocDuocChon, toBoMonDuocChon)">
                    Liệt kê
                </button>
            </div>
        </div>
        <div v-if="showCharts" class="chart-container">
            <div class="chart">
                <Pie :data="chartData" :options="chartOptions" />
            </div>
        </div>
        <div v-if="showCharts" class="container__pie-result">
            <table>
                <thead>
                    <tr>
                        <th>Tiêu chí</th>
                        <th>Mã GV</th>
                        <th>Họ tên GV</th>
                        <th>Số tiết</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Giáo viên dư tiết nhiều nhất</td>
                        <td>{{giaoVienVuotCaoNhat.MaGV}}</td>
                        <td>{{giaoVienVuotCaoNhat.HoTenGV}}</td>
                        <td>{{giaoVienVuotCaoNhat.SoTietVuotGio}}</td>
                    </tr>
                    <tr>
                        <td>Giáo viên dư tiết ít nhất</td>
                        <td>{{giaoVienVuotThapNhat.MaGV}}</td>
                        <td>{{giaoVienVuotThapNhat.HoTenGV}}</td>
                        <td>{{giaoVienVuotThapNhat.SoTietVuotGio}}</td>
                    </tr>
                    <tr>
                        <td>Giáo viên thiếu tiết nhiều nhất</td>
                        <td>{{giaoVienThieuCaoNhat.MaGV}}</td>
                        <td>{{giaoVienThieuCaoNhat.HoTenGV}}</td>
                        <td>{{Math.abs(giaoVienThieuCaoNhat.SoTietThieuGio)}}</td>
                    </tr>
                    <tr>
                        <td>Giáo viên thiếu tiết ít nhất</td>
                        <td>{{giaoVienThieuThapNhat.MaGV}}</td>
                        <td>{{giaoVienThieuThapNhat.HoTenGV}}</td>
                        <td>{{Math.abs(giaoVienThieuThapNhat.SoTietThieuGio)}}</td>
                    </tr>
                    <tr>
                        <td>Trung bình dư tiết</td>
                        <td colspan="3">{{trungBinhVuotGio}}</td>
                    </tr>
                    <tr>
                        <td>Trung bình thiếu tiết</td>
                        <td colspan="3">{{trungBinhThieuGio}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Pie } from 'vue-chartjs'
import {API_BASE_URL} from '../../config'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
    components:{
        Pie
    },

    data(){
        return{
            NamHoc: '',
            namHocDuocChon: '',
            MaBM: '',
            toBoMonDuocChon: '',
            danhSachNamHoc: [],
            danhSachToBoMon: [],
            phanCong: [],
            danhSachGiaoVienGiuChucVu: [],
            danhSachGiaoVienKiemNhiem: [],
            SoTietChuan: 0,
            SoTuanHK1: 0,
            SoTuanHK2: 0,
            showCharts: false,
            chartData: {
            labels: ['Đủ tiết', 'Dư tiết', 'Thiếu tiết'],
            datasets: [{
                data: [0, 0, 0],
                    backgroundColor: [
                        'oklch(79.2% 0.209 151.711)', 
                        'oklch(85.2% 0.199 91.936)', 
                        'oklch(70.4% 0.191 22.216)'  
                    ],
                    hoverBackgroundColor: [
                        'oklch(79.2% 0.209 151.711)', 
                        'oklch(85.2% 0.199 91.936)', 
                        'oklch(70.4% 0.191 22.216)'  
                    ],
                }]
            }, 
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels:{
                            padding: 10,
                            boxWidth: 12
                        },
                    },
                    title: {
                        display: true,
                        text: 'Thống kê tiết dạy theo năm'
                    }
                }
            },
            giaoVienVuotCaoNhat: {
                MaGV: '---',
                HoTenGV: '---',
                SoTietVuotGio: 0
            },
            giaoVienVuotThapNhat: {
                MaGV: '---',
                HoTenGV: '---',
                SoTietVuotGio: 9999
            },  
            giaoVienThieuCaoNhat: {
                MaGV: '---',
                HoTenGV: '---',
                SoTietThieuGio: 0
            },
            giaoVienThieuThapNhat: {
                MaGV: '---',
                HoTenGV: '---',
                SoTietThieuGio: 0
            },        
            trungBinhVuotGio: 0,
            trungBinhThieuGio: 0,
        }
    },

    async created(){
        await this.lay_thong_tin_session()
        await this.hien_danh_sach_nam_hoc()
        await this.hien_danh_sach_to_bo_mon()
        this.SoTuanHK1 = await this.lay_so_tuan_hoc_ky('1')
        this.SoTuanHK2 = await this.lay_so_tuan_hoc_ky('2')
    },

    methods: {
        async lay_thong_tin_session(){
            try{
                const response = await axios.get(`${API_BASE_URL}/dang-nhap/lay-thong-tin-session`,{
                    withCredentials: true
                })
                if(response.data.success){
                    this.MaBM = response.data.thongTinSession.MaBM
                    this.TenBM = response.data.thongTinSession.TenBM
                }
            }catch(error){
                console.error(error);
                throw error
            }
        },

        async hien_danh_sach_nam_hoc(){
            try{
                const res = await axios.get(`${API_BASE_URL}/nam-hoc/danh-sach-nam-hoc`)
                if(res.data.success){
                    this.danhSachNamHoc = res.data.data
                }
            }catch(error){
                console.error(error);
                throw error
            }
        },

        async hien_danh_sach_to_bo_mon(){
            try{
                const res = await axios.get(`${API_BASE_URL}/bo-mon/danh-sach-bo-mon`)
                if(res.data.success){
                    this.danhSachToBoMon = res.data.data
                }
                this.toBoMonDuocChon = this.MaBM
            }catch(error){
                console.error(error);
                throw error
            }
        },

        async lay_nam_hoc(){
            const NgayHomNay = new Date()
            try{
                const response_nam_hoc = await axios.get(`${API_BASE_URL}/nam-hoc/lay-nam-hoc-hien-tai?NgayHomNay=${this.format_ngay(NgayHomNay)}`)
                if(response_nam_hoc.data){
                    this.NamHoc = response_nam_hoc.data.result.NamHoc
                    this.namHocDuocChon = this.NamHoc
                }
            }catch(error){
                console.error('Lỗi lấy API năm học', error)
                throw error
            }
        },

        async lay_so_tiet_chuan(namhoc){
            try{
                const res = await axios.get(`${API_BASE_URL}/nam-hoc/lay-so-tiet-chuan?NamHoc=${namhoc}`)
                if(res.data.success){
                    this.SoTietChuan = res.data.data[0].SoTietChuan
                }
                //console.log('Số tiết chuẩn: ', this.SoTietChuan);
            }catch(error){
                console.error(error);
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

        async hien_thong_tin(namhoc, tobomon){
            try{
                await Promise.all([      
                    this.hien_danh_sach_giao_vien_theo_bo_mon(),      
                    this.hien_danh_sach_phan_cong(namhoc, '1', tobomon),
                    this.hien_danh_sach_phan_cong(namhoc, '2', tobomon),
                    this.hien_danh_sach_giao_vien_giu_chuc_vu(namhoc, '1', tobomon),
                    this.hien_danh_sach_giao_vien_giu_chuc_vu(namhoc, '2', tobomon),
                    this.hien_danh_sach_giao_vien_kiem_nhiem(namhoc, '1', tobomon),
                    this.hien_danh_sach_giao_vien_kiem_nhiem(namhoc, '2', tobomon),
                    this.lay_so_tiet_chuan(namhoc),
                ]);
                this.updateCharts()
                this.showCharts = true
            }catch(error){
                console.log('Lỗi hiện thông tin:', error);
                this.showCharts = false
            }

        },

        async hien_danh_sach_giao_vien_theo_bo_mon(){
            try{
                const response = await axios.get(`${API_BASE_URL}/giao-vien/danh-sach-giao-vien-bm?MaBM=${this.toBoMonDuocChon}`)
                if(response.data.success){
                    this.danhSachGiaoVien = response.data.data
                }
                //console.log(this.danhSachGiaoVien);
            }catch(error){
                console.error(error);
                throw error
            }
        },

        async hien_danh_sach_phan_cong(namhoc, hocky, tobomon){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giang-day/danh-sach-giang-day?NamHoc=${namhoc}&HocKy=${hocky}&MaBM=${tobomon}
                `)
                if(response.data.success){
                    const phanCongData = response.data.danhSach.map(item=>({
                        maGV: item.MaGV,
                        lop: {TenLop: item.TenLop},
                        mon: {MaMon: item.MaMon, TenMon: item.TenMon},
                        soTietTuan: item.SoTietTuan,
                        hocKy: hocky
                    }))
                    this.phanCong = [
                        ...this.phanCong.filter(pc => pc.hocKy != hocky),
                        ...phanCongData
                    ]
                    //console.log('DS phân công: ', this.phanCong);
                }
            }catch(error){
                console.error(error)
                throw error
            }
        },

        async hien_danh_sach_giao_vien_giu_chuc_vu(namhoc, hocky, tobomon){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giang-day/lay-so-tiet-mien-giu-chuc-vu?NamHoc=${namhoc}&HocKy=${hocky}&MaBM=${tobomon}
                `)
                if(response.data.success){
                    const data = response.data.data.map(item => ({
                        ...item,
                        HocKy: hocky,
                        TenCV: item.TenCV || 'Không giữ chức vụ'
                    }))
                    this.danhSachGiaoVienGiuChucVu = [
                        ...this.danhSachGiaoVienGiuChucVu.filter(gv => gv.HocKy != hocky),
                        ...data
                    ]
                    //console.log('GCV: ', this.danhSachGiaoVienGiuChucVu);
                }
            }catch(error){
                console.error(error)
                throw error
            }
        },

        async hien_danh_sach_giao_vien_kiem_nhiem(namhoc, hocky, tobomon){
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giang-day/lay-so-tiet-mien-kiem-nhiem?NamHoc=${namhoc}&HocKy=${hocky}&MaBM=${tobomon}
                `)
                if(response.data.success){
                    const data = response.data.data.map(item => ({
                        ...item,
                        HocKy: hocky,
                        TenNV: item.TenNV || 'Không kiêm nhiệm'
                    }))
                    this.danhSachGiaoVienKiemNhiem = [
                        ...this.danhSachGiaoVienKiemNhiem.filter(gv => gv.HocKy !== hocky),
                        ...data
                    ]
                    //console.log('KN: ', this.danhSachGiaoVienKiemNhiem);
                }
            }catch(error){
                console.error(error)
                throw error
            }
        },

        lam_moi_bang_thong_ke() {
            // Reset giáo viên vượt cao nhất (số dương lớn nhất)
            this.giaoVienVuotCaoNhat = {
                MaGV: '---',
                HoTenGV: '---',
                SoTietVuotGio: 0
            };

            // Reset giáo viên vượt thấp nhất (số dương nhỏ nhất)
            this.giaoVienVuotThapNhat = {
                MaGV: '---',
                HoTenGV: '---',
                SoTietVuotGio: 9999
            };

            // Reset giáo viên thiếu nhiều nhất (số âm nhỏ nhất, tức Math.abs lớn nhất)
            this.giaoVienThieuCaoNhat = {
                MaGV: '---',
                HoTenGV: '---',
                SoTietThieuGio: 0
            };

            // Reset giáo viên thiếu ít nhất (số âm lớn nhất, tức Math.abs nhỏ nhất)
            this.giaoVienThieuThapNhat = {
                MaGV: '---',
                HoTenGV: '---',
                SoTietThieuGio: 0
            };

            // Reset các biến thống kê khác
            this.duGio = 0; // Số giáo viên dư giờ
            this.thieuGio = 0; // Số giáo viên thiếu giờ
            this.soLuongGiaoVienVuotGio = 0; // Số lượng giáo viên vượt giờ
            this.soLuongGiaoVienThieuGio = 0; // Số lượng giáo viên thiếu giờ
            this.danhSachSoTietVuotGio = []; // Danh sách số tiết vượt giờ
            this.danhSachSoTietThieuGio = []; // Danh sách số tiết thiếu giờ
            this.tongSoTietVuotGio = 0; // Tổng số tiết vượt giờ
            this.tongSoTietThieuGio = 0; // Tổng số tiết thiếu giờ
            this.trungBinhVuotGio = 0; // Trung bình số tiết vượt giờ
            this.trungBinhThieuGio = 0; // Trung bình số tiết thiếu giờ
        },

        hien_so_tiet_mien_cv(maGV, hocKy) {
            const giaoVien = this.danhSachGiaoVienGiuChucVu.filter(gv => gv.MaGV == maGV && gv.HocKy == hocKy);
            return giaoVien.reduce((total, gv)=> total + (gv.SoTietMien || 0), 0)
        },

        hien_so_tiet_mien_kn(maGV, hocKy) {
            const giaoVien = this.danhSachGiaoVienKiemNhiem.filter(gv => gv.MaGV == maGV && gv.HocKy == hocKy);
            return giaoVien.reduce((total, gv)=> total + (gv.SoTietMien || 0), 0)
        },

        hien_so_tiet_phan_cong(maGV, hocKy) {
            return this.phanCong
                .filter(pc => pc.maGV == maGV && pc.hocKy == hocKy)
                .reduce((total, pc) => total + (pc.soTietTuan || 0), 0);
        },

        hien_tong_so_tiet(maGV, hocKy) {
            const tietDay = this.hien_so_tiet_phan_cong(maGV, hocKy);
            const tietMienCV = this.hien_so_tiet_mien_cv(maGV, hocKy);
            const tietMienKN = this.hien_so_tiet_mien_kn(maGV, hocKy);
            console.log(maGV);
            console.log('tietDay + tietMienCV + tietMienKN:', tietDay, tietMienCV, tietMienKN);
            return tietDay + tietMienCV + tietMienKN;
        },

        hien_tong_so_tiet_vuot_gio(maGV) {
            const tongTietHKI = this.hien_tong_so_tiet(maGV, '1');
            const tongTietHKII = this.hien_tong_so_tiet(maGV, '2');
            const tietChuan = this.SoTietChuan;
            const SoTuanHK1 = this.SoTuanHK1 // 17
            const SoTuanHK2 = this.SoTuanHK2 // 18
            // console.log(SoTuanHK1, SoTuanHK2);
            // console.log(tongTietHKI, tongTietHKII);
            console.log('Vượt giờ ', maGV);
            console.log(tongTietHKI, tongTietHKII);
            console.log((tongTietHKI - tietChuan)*SoTuanHK1 + (tongTietHKII - tietChuan)*SoTuanHK2);
            return (tongTietHKI - tietChuan)*SoTuanHK1 + (tongTietHKII - tietChuan)*SoTuanHK2
        },

        updateCharts() {
            this.lam_moi_bang_thong_ke()
            console.log('Tổ bộ môn: ', this.toBoMonDuocChon);
            // Tính toán số lượng giáo viên
            const result = this.tinh_so_luong_giao_vien_theo_gio();

            // Gán giá trị với fallback về 0 nếu undefined
            const duGio = result.duGio || 0;
            const thieuGio = result.thieuGio || 0;


            // console.log('duGio, thieuGio', { duGio, thieuGio });
            // console.log('Hàm update tính SL giáo viên theo giờ', this.tinh_so_luong_giao_vien_theo_gio());
            // console.log('Danh sách gv:', this.danhSachGiaoVien);
            // console.log('Danh sách phân công:', this.phanCong);
            this.chartData = {
                labels: ['Đủ tiết', 'Dư tiết', 'Thiếu tiết'],
                datasets: [{
                    data: [
                        this.danhSachGiaoVien.length - duGio - thieuGio,
                        duGio,
                        thieuGio
                    ],
                    backgroundColor: [
                        'oklch(79.2% 0.209 151.711)', 
                        'oklch(85.2% 0.199 91.936)', 
                        'oklch(70.4% 0.191 22.216)'  
                    ],
                    hoverBackgroundColor: [
                        'oklch(79.2% 0.209 151.711)', 
                        'oklch(85.2% 0.199 91.936)', 
                        'oklch(70.4% 0.191 22.216)'  
                    ],
                }]
            };

        },

        tinh_so_luong_giao_vien_theo_gio() {
            let duGio = 0;
            let thieuGio = 0;
            const danhSachSoTietVuotGio = []
            const danhSachSoTietThieuGio = []

            let tongSoTietVuotGio = 0
            let soLuongGiaoVienVuotGio = 0

            let tongSoTietThieuGio = 0
            let soLuongGiaoVienThieuGio = 0
            this.danhSachGiaoVien.forEach(gv => {
                const soTietVuotGio = this.hien_tong_so_tiet_vuot_gio(gv.MaGV);
    
                if (soTietVuotGio > 0) {
                    duGio++;
                    // console.log('GV dư giờ: ',gv.MaGV);
                    danhSachSoTietVuotGio.push(soTietVuotGio)
                    tongSoTietVuotGio += soTietVuotGio;
                    soLuongGiaoVienVuotGio++

                    if(soTietVuotGio > this.giaoVienVuotCaoNhat.SoTietVuotGio){
                        this.giaoVienVuotCaoNhat.SoTietVuotGio = soTietVuotGio
                        this.giaoVienVuotCaoNhat.MaGV = gv.MaGV
                        this.giaoVienVuotCaoNhat.HoTenGV = gv.HoTenGV
                    }
                    if(soTietVuotGio < this.giaoVienVuotThapNhat.SoTietVuotGio){
                        this.giaoVienVuotThapNhat.SoTietVuotGio = soTietVuotGio
                        this.giaoVienVuotThapNhat.MaGV = gv.MaGV
                        this.giaoVienVuotThapNhat.HoTenGV = gv.HoTenGV
                    }
                    //this.giaoVienVuotCaoNhat.SoTietVuotGio = Math.max(this.giaoVienVuotCaoNhat.SoTietVuotGio, soTietVuotGio)
                    //this.giaoVienVuotThapNhat.SoTietVuotGio = Math.min(this.giaoVienVuotThapNhat.SoTietVuotGio, soTietVuotGio)

                    // console.log('Vượt giờ cao nhất: ', this.giaoVienVuotCaoNhat.SoTietVuotGio);
                    // console.log('Vượt giờ thấp nhất: ', this.giaoVienVuotThapNhat.SoTietVuotGio);

                } else if (soTietVuotGio < 0) {
                    thieuGio++;
                    // console.log('GV thiếu giờ: ',gv.MaGV);
                    // console.log(this.hien_tong_so_tiet_vuot_gio(gv.MaGV));
                    danhSachSoTietThieuGio.push(soTietVuotGio)
                    tongSoTietThieuGio += soTietVuotGio
                    soLuongGiaoVienThieuGio++

                    if(soTietVuotGio < this.giaoVienThieuCaoNhat.SoTietThieuGio || this.giaoVienThieuCaoNhat.SoTietThieuGio  == 0){
                        this.giaoVienThieuCaoNhat.SoTietThieuGio = soTietVuotGio
                        this.giaoVienThieuCaoNhat.MaGV = gv.MaGV
                        this.giaoVienThieuCaoNhat.HoTenGV = gv.HoTenGV

                        console.log('Lặp; thiếu nhiều nhất:',this.giaoVienThieuCaoNhat.SoTietThieuGio);
                    }
                    if(soTietVuotGio > this.giaoVienThieuThapNhat.SoTietThieuGio ||  this.giaoVienThieuThapNhat.SoTietThieuGio == 0){
                        this.giaoVienThieuThapNhat.SoTietThieuGio = soTietVuotGio
                        this.giaoVienThieuThapNhat.MaGV = gv.MaGV
                        this.giaoVienThieuThapNhat.HoTenGV = gv.HoTenGV

                        console.log('Lặp; thiếu thấp nhất:', this.giaoVienThieuThapNhat.SoTietThieuGio);
                    }
                    //this.giaoVienThieuCaoNhat.SoTietVuotGio = Math.max(this.giaoVienThieuCaoNhat.SoTietThieuGio, soTietVuotGio)
                    //this.giaoVienThieuThapNhat.SoTietVuotGio = Math.min(this.giaoVienThieuThapNhat.SoTietThieuGio, soTietVuotGio)
                    
                }


            });
            // console.log('Dư giờ, thiếu giờ: ', duGio, thieuGio);
            this.trungBinhVuotGio = Math.round(soLuongGiaoVienVuotGio > 0 ? (tongSoTietVuotGio / soLuongGiaoVienVuotGio) : 0)
            console.log('Trung bình vượt giờ: ', this.trungBinhVuotGio);

            this.trungBinhThieuGio = Math.round(soLuongGiaoVienThieuGio > 0 ? (tongSoTietThieuGio / soLuongGiaoVienThieuGio) : 0)
            console.log('Trung bình thiếu giờ: ', this.trungBinhThieuGio);
            return { duGio, thieuGio };
        },

    },
}
</script>

<style scoped>
b{
    margin-left: 2rem;
    margin-right: 10px;
    font-size: 20px;
}

.container {
    padding: 0px 0px 0px 20px;
    display: flex;
    flex-direction: column;
}

.container__action{
    display: flex;
    justify-content: center;
}

.container__filter {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

select{
    padding: 6px 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 140px;
    transition: box-shadow 0.3s ease;
    margin-right: 10px;
}

.chart-container{
    display: flex;
    justify-content: center;
}

.chart{
    width: 45%; 
    aspect-ratio: 1; 
    max-width: 350px;
}

button{
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: 0 10px;
    transition: transform 0.2s ease;
}

.container__pie-result{
    padding: 20px 50px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    font-size: 14px;
    overflow: hidden;
}

th, td {
  border: 1px solid #ddd;
  padding: 7px;
  text-align: center;
}


th {
  background: linear-gradient(to bottom, #5d95cf, #0b3e82);
  color: white;
  font-weight: bold;
}


</style>