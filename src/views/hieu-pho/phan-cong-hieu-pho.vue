<template>
    <div class="container">
        <h1>Phân công chuyên môn</h1>
        <!-- <div class="container__year_info">
            Phân công chuyên môn tổ bộ môn: <span class="highlight">{{TenBM}}</span>
        </div> -->
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
                <button v-if="duocXoa" id="save-button" @click="luu_phan_cong">
                    Lưu
                </button>
            </div>
        </div>

        <div class="assignment-wrapper">
            <div class="teacher-list">
                <h3>Danh sách giáo viên</h3>
                <div 
                    class="teacher-item" 
                    v-for="gv in danhSachGiaoVien" 
                    :key="gv.MaGV"
                    draggable="true"
                    @dragstart="dragStart($event, gv)" 
                >
                    {{gv.MaGV}} - {{gv.HoTenGV}}
                </div>
            </div>

            <div class="assignment-table">
                <table class="semester-table">
                    <caption>Học kỳ I</caption>
                    <thead>
                        <tr>
                            <th>Lớp / Môn</th>
                            <th v-for="mon in danhSachMon" :key="mon.MaMon">
                                {{mon.TenMon}}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="lop in danhSachLop" :key="lop">
                            <td>{{lop.TenLop}}</td>
                            <td
                                v-for="mon in danhSachMon" 
                                :key="`${lop.TenLop}-${mon.MaMon}-1`"
                                class="assignment-cell"
                                @dragover.prevent
                                @dragenter.prevent
                                @drop="onDrop($event, lop, mon, '1')"
                            >
                                <div v-if="getAssignedTeacher(lop, mon, '1')" class="assigned-teacher">
                                    {{getAssignedTeacher(lop, mon, '1')}}
                                    <button @click="removeAssignment(lop, mon, '1')" >×</button>
                                </div>

                                <div v-else class="empty-slot">
                                     
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table class="semester-table">
                    <caption>Học kỳ II</caption>
                    <thead>
                        <tr>
                            <th>Lớp / Môn</th>
                            <th v-for="mon in danhSachMon" :key="mon.MaMon">
                                {{mon.TenMon}}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="lop in danhSachLop" :key="lop">
                            <td>{{lop.TenLop}}</td>
                            <td
                                v-for="mon in danhSachMon" 
                                :key="`${lop.TenLop}-${mon.MaMon}-2`"
                                class="assignment-cell"
                                @dragover.prevent
                                @dragenter.prevent
                                @drop="onDrop($event, lop, mon, '2')"
                            >
                                <div v-if="getAssignedTeacher(lop, mon, '2')" class="assigned-teacher">
                                    {{getAssignedTeacher(lop, mon, '2')}}
                                    <button @click="removeAssignment(lop, mon, '2')">×</button>
                                </div>
                                <div v-else class="empty-slot">
                                     
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="result-table">
            <h2>Kết quả phân công</h2>
            <div><strong>Số tuần HK 1: </strong>{{SoTuanHK1}}</div>
            <div><strong>Số tuần HK 2: </strong> {{SoTuanHK2}}</div>
            <div class="formula-info">
                <strong>Số tiết vượt giờ</strong> = (Tổng tiết HK I - Số tiết chuẩn) * Số tuần HK I + (Tổng tiết HK II - Số tiết chuẩn) * Số tuần HK II
            </div>
            <table border="1">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã giáo viên</th>
                        <th>Họ tên giáo viên</th>
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
                    <tr v-for="(gv, index) in danhSachGiaoVien" :key="gv.MaGV">
                        <td class="table-display-other">{{index + 1}}</td>
                        <td class="table-display-other">{{gv.MaGV}}</td>
                        <td class="table-display-other">{{gv.HoTenGV}}</td>
                        <td class="table-display-other">{{SoTietChuan || 0}}</td>
                        <td @click="showPopup(gv.MaGV, '1', 'ChucVu')" :class="{'red-text': hien_so_tiet_mien_cv(gv.MaGV, '1') > 0}" class="table-display-term1">
                            {{hien_so_tiet_mien_cv(gv.MaGV, '1')}}
                        </td>
                        <td @click="showPopup(gv.MaGV, '1', 'KiemNhiem')" :class="{'red-text': hien_so_tiet_mien_kn(gv.MaGV, '1') > 0}" class="table-display-term1">
                            {{hien_so_tiet_mien_kn(gv.MaGV, '1')}}
                        </td>
                        <td class="table-display-term1">{{hien_so_tiet_phan_cong(gv.MaGV, '1')}}</td>
                        <td @click="showPopup(gv.MaGV, '2', 'ChucVu')" :class="{'red-text': hien_so_tiet_mien_cv(gv.MaGV, '2') > 0}" class="table-display-term2">
                            {{hien_so_tiet_mien_cv(gv.MaGV, '2')}}
                        </td>
                        <td @click="showPopup(gv.MaGV, '2', 'KiemNhiem')" :class="{'red-text': hien_so_tiet_mien_kn(gv.MaGV, '2') > 0}" class="table-display-term2">
                            {{hien_so_tiet_mien_kn(gv.MaGV, '2')}}
                        </td>
                        <td class="table-display-term2">{{hien_so_tiet_phan_cong(gv.MaGV, '2')}}</td>
                        <td class="table-display-term1">{{hien_tong_so_tiet(gv.MaGV, '1')}}</td>
                        <td class="table-display-term2">{{hien_tong_so_tiet(gv.MaGV, '2')}}</td>
                        <td :class="{'red-text': hien_tong_so_tiet_vuot_gio(gv.MaGV) > 200}" class="table-display-other">
                            {{hien_tong_so_tiet_vuot_gio(gv.MaGV)}}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="download-button">
                <button @click="tai_thong_ke">
                    Tải thống kê
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import {so_sanh_nam_hoc} from '../../utils/so-sanh-nam'
import {lay_nam_hoc, lay_hoc_ky} from '../../utils/lay_nam_hoc_va_hoc_ky'
import {API_BASE_URL} from '../../config'

export default {
    data(){
        return{
            NamHoc: '',
            HocKy: '',
            danhSachNamHoc: [{NamHoc: '2021-2022'},{NamHoc: '2022-2023'}, {NamHoc: '2023-2024'}, {NamHoc: '2024-2025'}],
            danhSachToBoMon: [
                {MaBM: 'BM001', TenBM: 'Toán - tin'},
                {MaBM: 'BM002', TenBM: 'Ngữ Văn - GDCD'},
                {MaBM: 'BM003', TenBM: 'Lịch Sử - Địa Lý'},
                {MaBM: 'BM004', TenBM: 'Vật Lý - Hóa Học'},
                {MaBM: 'BM005', TenBM: 'Sinh Học - Công Nghệ'},
            ],
            namHocDuocChon: '',
            danhSachGiaoVien: [
                {MaGV: 'GV001', HoTenGV: 'Nguyễn Văn A'},
                {MaGV: 'GV002', HoTenGV: 'Nguyễn Văn B'},
                {MaGV: 'GV003', HoTenGV: 'Nguyễn Văn C'},
                {MaGV: 'GV004', HoTenGV: 'Nguyễn Văn D'},
                {MaGV: 'GV005', HoTenGV: 'Nguyễn Văn E'},
            ],
            MaBM: '',
            toBoMonDuocChon: '',
            TenBM: '',
            SoTietChuan: '17',
            danhSachMon: [
                {MaMon: 'MON01', TenMon: 'Toán'},
                {MaMon: 'MON02', TenMon: 'Tin Học'},
            ],
            danhSachLop: [
                {TenLop: '10A1'},
                {TenLop: '10A2'},
                {TenLop: '10A3'},
                {TenLop: '10A4'},
                {TenLop: '10A5'},
                {TenLop: '11A1'},
                {TenLop: '11A2'},
                {TenLop: '11A3'},
                {TenLop: '11A4'},
                {TenLop: '11A5'},
                {TenLop: '12A1'},
                {TenLop: '12A2'},
                {TenLop: '12A3'},
                {TenLop: '12A4'},
                {TenLop: '12A5'},                                
            ],
            phanCong: [],
            phanCongBanDau: [],
            draggedTeacher: null,
            danhSachGiaoVienKiemNhiem: [],
            danhSachGiaoVienGiuChucVu: [],
            danhSachChuongTrinh: [
                // HK1
                {       
                    MaMon: 'MON01',
                    SoTietTuan: 3,
                    Khoi: '10',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '1',
                    MaBM: 'BM001'
                },
                {       
                    MaMon: 'MON01',
                    SoTietTuan: 3,
                    Khoi: '11',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '1',
                    MaBM: 'BM001'
                }, 
                {       
                    MaMon: 'MON01',
                    SoTietTuan: 3,
                    Khoi: '12',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '1',
                    MaBM: 'BM001'
                }, 
                {       
                    MaMon: 'MON02',
                    SoTietTuan: 3,
                    Khoi: '10',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '1',
                    MaBM: 'BM001'
                },
                {       
                    MaMon: 'MON02',
                    SoTietTuan: 3,
                    Khoi: '11',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '1',
                    MaBM: 'BM001'
                }, 
                {       
                    MaMon: 'MON02',
                    SoTietTuan: 3,
                    Khoi: '12',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '1',
                    MaBM: 'BM001'
                },
                // HK 2
                {       
                    MaMon: 'MON01',
                    SoTietTuan: 3,
                    Khoi: '10',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '2',
                    MaBM: 'BM001'
                },
                {       
                    MaMon: 'MON01',
                    SoTietTuan: 3,
                    Khoi: '11',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '2',
                    MaBM: 'BM001'
                }, 
                {       
                    MaMon: 'MON01',
                    SoTietTuan: 3,
                    Khoi: '12',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '2',
                    MaBM: 'BM001'
                }, 
                {       
                    MaMon: 'MON02',
                    SoTietTuan: 3,
                    Khoi: '10',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '2',
                    MaBM: 'BM001'
                },
                {       
                    MaMon: 'MON02',
                    SoTietTuan: 3,
                    Khoi: '11',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '2',
                    MaBM: 'BM001'
                }, 
                {       
                    MaMon: 'MON02',
                    SoTietTuan: 3,
                    Khoi: '12',
                    TenMon: 'Toán',
                    MaNhom: '',
                    TenNhom: '',
                    HocKy: '2',
                    MaBM: 'BM001'
                },                                              
            ],
            SoTuanHK1: '',
            SoTuanHK2: '',
            duocXoa: false,
        }
    },

    async created() {
        const ngayhn = new Date();
        console.log("Hôm nay:",ngayhn);
        try {
            await this.lay_thong_tin_session();
            this.NamHoc = await lay_nam_hoc();
            this.HocKy = await lay_hoc_ky();
            //this.HocKy = '1'
            this.namHocDuocChon = this.NamHoc;
            await Promise.all([
                this.hien_danh_sach_giao_vien_theo_bo_mon(),
                this.hien_danh_sach_chuong_trinh(),
                this.lay_so_tuan_hoc_ky('1').then(soTuan => { this.SoTuanHK1 = soTuan; }),
                this.lay_so_tuan_hoc_ky('2').then(soTuan => { this.SoTuanHK2 = soTuan; })                
            ]);
        } catch (error) {
            console.error('Lỗi trong created:', error);
        }
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

        async hien_thong_tin(namhoc, tobomon){
            console.log(this.NamHoc, this.HocKy);
            console.log("namhoc:", namhoc);
            const ketQua = so_sanh_nam_hoc(this.NamHoc, namhoc);
            console.log("ketqua:", ketQua);
            this.duocXoa = ketQua == 'nam_sau' || ketQua == 'nam_hien_tai';
            await Promise.all([
                this.hien_danh_sach_lop(),
                this.hien_danh_sach_giao_vien_theo_bo_mon(),
                this.hien_danh_sach_mon_theo_to_bo_mon(),
                this.hien_danh_sach_phan_cong(namhoc, '1', tobomon),
                this.hien_danh_sach_phan_cong(namhoc, '2', tobomon),
                this.hien_danh_sach_giao_vien_giu_chuc_vu(namhoc, '1', tobomon),
                this.hien_danh_sach_giao_vien_giu_chuc_vu(namhoc, '2', tobomon),
                this.hien_danh_sach_giao_vien_kiem_nhiem(namhoc, '1', tobomon),
                this.hien_danh_sach_giao_vien_kiem_nhiem(namhoc, '2', tobomon),
                this.lay_so_tiet_chuan(namhoc),
            ]);
        },

        // duocXoaHocKy(hocKy){
        //     if (!this.duocXoa) return false;
        //     const ketQua = so_sanh_nam_hoc(this.NamHoc, this.namHocDuocChon);
        //     if (ketQua == 'nam_sau') {
        //         return true;
        //     } else if (ketQua == 'nam_hien_tai') {
        //         if(this.HocKy == '1')
        //             return true
        //         if(this.HocKy == '2'){
        //             if(hocKy == '1')
        //                 return false
        //             else return true
        //         }
        //     }
        //     return false;
        // },

        async onDrop(event, lop, mon, hocKy) {
            event.preventDefault();
            if (!this.draggedTeacher) {
                return;
            }
            // if (!this.duocXoaHocKy(hocKy)) {
            //     Swal.fire('Lỗi!', `Không thể chỉnh sửa phân công cho học kỳ ${hocKy} trong năm ${this.namHocDuocChon}!`, 'error');
            //     return;
            // }
            try {
                const { Khoi } = this.tachTenLop(lop.TenLop);
                const chuongTrinh = this.danhSachChuongTrinh.find(
                    ct => ct.MaMon === mon.MaMon && ct.Khoi === Khoi && ct.HocKy === hocKy
                );

                if (!chuongTrinh || !chuongTrinh.SoTietTuan) {
                    Swal.fire('Lỗi!', `Không tìm thấy số tiết tuần cho môn ${mon.TenMon} khối ${Khoi}!`, 'error');
                    return;
                }

                const soTietTuan = chuongTrinh.SoTietTuan;

                const existingIndex = this.phanCong.findIndex(
                    pc => pc.lop.TenLop === lop.TenLop && 
                          pc.mon.MaMon === mon.MaMon && 
                          pc.hocKy === hocKy
                );

                if (existingIndex === -1) {
                    this.phanCong.push({
                        maGV: this.draggedTeacher.MaGV,
                        lop: { TenLop: lop.TenLop },
                        mon: { MaMon: mon.MaMon, TenMon: mon.TenMon },
                        soTietTuan,
                        hocKy
                    });
                } else {
                    this.phanCong[existingIndex] = {
                        ...this.phanCong[existingIndex],
                        maGV: this.draggedTeacher.MaGV,
                        soTietTuan
                    };
                }
                this.draggedTeacher = null;
            } catch (error) {
                console.error('Lỗi trong onDrop:', error);
                Swal.fire('Lỗi!', 'Không thể thực hiện phân công!', 'error');
            }
        },

        removeAssignment(lop, mon, hocKy) {    
            // if (!this.duocXoaHocKy(hocKy)) {
            //     Swal.fire('Lỗi!', `Không thể xóa phân công cho học kỳ ${hocKy} trong năm ${this.namHocDuocChon}!`, 'error');
            //     return;
            // }
            this.phanCong = this.phanCong.filter(
                item => !(item.lop.TenLop == lop.TenLop && 
                         item.mon.MaMon == mon.MaMon && 
                         item.hocKy == hocKy)
            );
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

        async lay_so_tiet_chuan(namhoc){
            try{
                const res = await axios.get(`${API_BASE_URL}/nam-hoc/lay-so-tiet-chuan?NamHoc=${namhoc}`)
                if(res.data.success){
                    this.SoTietChuan = res.data.data[0].SoTietChuan
                }
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

        async hien_danh_sach_mon_theo_to_bo_mon(){
            if (!this.toBoMonDuocChon) {
                console.error('Mã bộ môn không hợp lệ');
                this.danhSachMon = [];
                return;
            }
            try{
                const response = await axios.get(`${API_BASE_URL}/mon-hoc/danh-sach-mon-hoc-theo-bo-mon?MaBM=${this.toBoMonDuocChon}`)
                if(response.data.success){
                    this.danhSachMon = response.data.data
                }
            }catch(error){
                console.error(error);
                throw error
            }
        },

        async hien_danh_sach_giao_vien_theo_bo_mon(){
            try{
                const response = await axios.get(`${API_BASE_URL}/giao-vien/danh-sach-giao-vien-bm?MaBM=${this.toBoMonDuocChon}`)
                if(response.data.success){
                    this.danhSachGiaoVien = response.data.data
                }
            }catch(error){
                console.error(error);
                throw error
            }
        },

        async hien_danh_sach_lop(){
            try{
                const response = await axios.get(`${API_BASE_URL}/lop/danh-sach-lop?NamHoc=${this.namHocDuocChon}`)
                if(response.data.success){
                    this.danhSachLop = response.data.data
                }
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
                    this.phanCongBanDau = [
                        ...this.phanCongBanDau.filter(pc => pc.hocKy != hocky),
                        ...phanCongData
                    ]
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
                }
            }catch(error){
                console.error(error)
                throw error
            }
        },

        async hien_danh_sach_chuong_trinh() {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/chuong-trinh/danh-sach-chuong-trinh`
                );
                if (response.data.success) {
                    this.danhSachChuongTrinh = response.data.data.map(item => ({
                        MaMon: item.MaMon,
                        SoTietTuan: item.SoTietTuan,
                        Khoi: item.Khoi,
                        TenMon: item.TenMon,
                        MaNhom: item.MaNhom,
                        TenNhom: item.TenNhom,
                        HocKy: item.HocKy,
                        MaBM: item.MaBM
                    }));
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách chương trình:', error);
                throw error;
            }
        },

        showPopup(magv, hocky, noidung) {
            if (noidung == 'ChucVu') {
                const giaovien = this.danhSachGiaoVienGiuChucVu.filter(gv => gv.MaGV == magv && gv.HocKy == hocky);
                const danhSachChucVu = giaovien.length > 0
                    ? giaovien.map(gv => `<li>${gv.TenCV} (${gv.SoTietMien || 0} tiết)</li>`).join('')
                    : '<li>Không có chức vụ</li>';
                const soTietMien = giaovien.reduce((total, gv) => total + (gv.SoTietMien || 0), 0);

                Swal.fire({
                    title: `Thông tin chức vụ học kỳ ${hocky}`,
                    html: `
                        <ul class="custom-list">
                            <li><strong>Mã giáo viên:</strong> ${magv}</li>
                            <li><strong>Danh sách chức vụ:</strong>
                                <ul>${danhSachChucVu}</ul>
                            </li>
                            <li><strong>Số tiết chức vụ:</strong> ${soTietMien}</li>
                        </ul>
                    `,
                    icon: 'info',
                    confirmButtonText: 'Đóng',
                    customClass: {
                        popup: 'custom-popup'
                    }
                });
            } else if (noidung == 'KiemNhiem') {
                const giaovien = this.danhSachGiaoVienKiemNhiem.filter(gv => gv.MaGV == magv && gv.HocKy == hocky);
                const danhSachKiemNhiem = giaovien.length > 0
                    ? giaovien.map(gv => `<li>${gv.TenNV} (${gv.SoTietMien || 0} tiết)</li>`).join('')
                    : '<li>Không có kiêm nhiệm</li>';
                const soTietMien = giaovien.reduce((total, gv) => total + (gv.SoTietMien || 0), 0);

                Swal.fire({
                    title: `Thông tin kiêm nhiệm học kỳ ${hocky}`,
                    html: `
                        <ul class="custom-list">
                            <li><strong>Mã giáo viên:</strong> ${magv}</li>
                            <li><strong>Danh sách kiêm nhiệm:</strong>
                                <ul>${danhSachKiemNhiem}</ul>
                            </li>
                            <li><strong>Tổng số tiết kiêm nhiệm:</strong> ${soTietMien}</li>
                        </ul>
                    `,
                    icon: 'info',
                    confirmButtonText: 'Đóng',
                    customClass: {
                        popup: 'custom-popup'
                    }
                });
            } else {
                console.log('Có lỗi hiển thị thông tin bảng kết quả');
            }
        },

        hien_so_tiet_mien_cv(maGV, hocKy) {
            const giaoVien = this.danhSachGiaoVienGiuChucVu.filter(gv => gv.MaGV == maGV && gv.HocKy == hocKy);
            return giaoVien.reduce((total, gv) => total + (gv.SoTietMien || 0), 0);
        },

        hien_so_tiet_mien_kn(maGV, hocKy) {
            const giaoVien = this.danhSachGiaoVienKiemNhiem.filter(gv => gv.MaGV == maGV && gv.HocKy == hocKy);
            return giaoVien.reduce((total, gv) => total + (gv.SoTietMien || 0), 0);
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
            
            return tietDay + tietMienCV + tietMienKN;
        },

        hien_tong_so_tiet_vuot_gio(maGV) {
            const tongTietHKI = this.hien_tong_so_tiet(maGV, '1');
            const tongTietHKII = this.hien_tong_so_tiet(maGV, '2');
            const tietChuan = this.SoTietChuan;
            const SoTuanHK1 = this.SoTuanHK1
            const SoTuanHK2 = this.SoTuanHK2
            return Math.max(0, (tongTietHKI - tietChuan)*SoTuanHK1 + (tongTietHKII - tietChuan)*SoTuanHK2);
            //return (tongTietHKI - tietChuan)*SoTuanHK1 + (tongTietHKII - tietChuan)*SoTuanHK2
        },

        getAssignedTeacher(lop, mon, hocKy) {
            const pc = this.phanCong.find(
                item => item.lop.TenLop === lop.TenLop && 
                        item.mon.MaMon === mon.MaMon && 
                        item.hocKy === hocKy
            );
            
            if (pc) {
                const gv = this.danhSachGiaoVien.find(g => g.MaGV === pc.maGV);
                return gv ? `${gv.MaGV} - ${gv.HoTenGV}` : pc.maGV;
            }
            return null;
        },

        async luu_phan_cong() {
            try {
                const semesters = ['1', '2'];
                for (const hocKy of semesters) {
                    // Chỉ lưu học kỳ được phép chỉnh sửa
                    // if (!this.duocXoaHocKy(hocKy)) continue;

                    const phanCongMoi = this.phanCong.filter(pc => 
                        pc.hocKy === hocKy &&
                        !this.phanCongBanDau.some(oldPc => 
                            oldPc.lop.TenLop === pc.lop.TenLop && 
                            oldPc.mon.MaMon === pc.mon.MaMon && 
                            oldPc.hocKy === pc.hocKy
                        )
                    );

                    const phanCongSua = this.phanCong.filter(pc => {
                        const oldPc = this.phanCongBanDau.find(
                            old => old.lop.TenLop === pc.lop.TenLop && 
                                   old.mon.MaMon === pc.mon.MaMon && 
                                   old.hocKy === pc.hocKy
                        );
                        return oldPc && oldPc.maGV !== pc.maGV && pc.hocKy === hocKy;
                    });

                    const phanCongXoa = this.phanCongBanDau.filter(oldPc =>
                        oldPc.hocKy === hocKy &&
                        !this.phanCong.some(pc => 
                            pc.lop.TenLop === oldPc.lop.TenLop && 
                            pc.mon.MaMon === oldPc.mon.MaMon && 
                            pc.hocKy === oldPc.hocKy
                        )
                    );

                    // Save new assignments
                    for (const pc of phanCongMoi) {
                        const { Khoi, KyHieu, STTLop } = this.tachTenLop(pc.lop.TenLop);
                        await axios.post(
                            `${API_BASE_URL}/giang-day/them-giang-day`,
                            {
                                MaGV: pc.maGV,
                                MaMon: pc.mon.MaMon,
                                STTLop: STTLop,
                                Khoi: Khoi,
                                KyHieu: KyHieu,
                                NamHoc: this.namHocDuocChon,
                                HocKy: hocKy,
                            },
                            { withCredentials: true }
                        );
                    }

                    // Update modified assignments
                    for (const pc of phanCongSua) {
                        const { Khoi, KyHieu, STTLop } = this.tachTenLop(pc.lop.TenLop);
                        await axios.put(
                            `${API_BASE_URL}/giang-day/sua-giang-day?MaMon=${pc.mon.MaMon}&STTLop=${STTLop}&Khoi=${Khoi}&KyHieu=${KyHieu}&NamHoc=${this.namHocDuocChon}&HocKy=${hocKy}`,
                            {
                                MaGV: pc.maGV,
                            },
                            { withCredentials: true }
                        );
                    }

                    // Delete removed assignments
                    for (const pc of phanCongXoa) {
                        const { Khoi, KyHieu, STTLop } = this.tachTenLop(pc.lop.TenLop);
                        await axios.delete(
                            `${API_BASE_URL}/giang-day/xoa-giang-day?MaMon=${pc.mon.MaMon}&STTLop=${STTLop}&Khoi=${Khoi}&KyHieu=${KyHieu}&NamHoc=${this.namHocDuocChon}&HocKy=${hocKy}`,
                            { withCredentials: true }
                        );
                    }
                }

                this.phanCongBanDau = [...this.phanCong];
                Swal.fire({
                    icon: 'success',
                    title: 'Lưu thành công!',
                    text: 'Dữ liệu đã được lưu vào hệ thống.',
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
            } catch (error) {
                console.error('Lỗi lưu phân công:', error);
                Swal.fire("Lỗi!", "Có lỗi xảy ra khi lưu dữ liệu!");
            }
        },

        tachTenLop(tenLop) {
            if (!tenLop || typeof tenLop !== 'string') {
                throw new Error('TenLop không hợp lệ');
            }
            const regex = /^(\d+)([A-Z])(\d+)$/;
            const match = tenLop.match(regex);
            if (!match) {
                throw new Error(`TenLop "${tenLop}" không đúng định dạng (VD: 10A3)`);
            }
            return {
                Khoi: match[1],
                KyHieu: match[2],
                STTLop: match[3]
            };
        },

        dragStart(event, gv){
            this.draggedTeacher = gv
            event.dataTransfer.setData('text/plain', gv.MaGV)
        },

        tai_thong_ke() {
            this.luu_phan_cong()
            const title = "Bảng thống kê phân công chuyên môn"
            const header = [
                'STT', 'Mã giáo viên', 'Họ tên giáo viên', 'Số tiết chuẩn',
                'Số tiết CV (HK I)', 'Số tiết KN (HK I)', 'Số tiết dạy (HK I)',
                'Số tiết CV (HK II)', 'Số tiết KN (HK II)', 'Số tiết dạy (HK II)',
                'TS tiết HK I', 'TS tiết HK II', 'TS tiết vượt giờ'
            ];
            
            const data = this.danhSachGiaoVien.map((gv, index) => [
                index + 1,
                gv.MaGV,
                gv.HoTenGV,
                this.SoTietChuan,
                this.hien_so_tiet_mien_cv(gv.MaGV, '1'),
                this.hien_so_tiet_mien_kn(gv.MaGV, '1'),
                this.hien_so_tiet_phan_cong(gv.MaGV, '1'),
                this.hien_so_tiet_mien_cv(gv.MaGV, '2'),
                this.hien_so_tiet_mien_kn(gv.MaGV, '2'),
                this.hien_so_tiet_phan_cong(gv.MaGV, '2'),
                this.hien_tong_so_tiet(gv.MaGV, '1'),
                this.hien_tong_so_tiet(gv.MaGV, '2'),
                this.hien_tong_so_tiet_vuot_gio(gv.MaGV)
            ]);

            const csvContent = [
                title,
                '',
                header.join(','),
                ...data.map(row => row.join(',')),
                '',
                'Hiệu phó'
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `PhanCong_${this.namHocDuocChon}.csv`);
            link.click();
            URL.revokeObjectURL(url);
        }
    }
}
</script>


<style> 
/* Phần style toàn cục để CSS cho Swal, 
bởi vì các thông báo của Swal nằm ở 1 cây DOM khác nên style scoped khong quản lý được */
.custom-list li {
    list-style-type: none !important; /* Ghi đè style của SweetAlert2 */
    margin-bottom: 2px;
}
</style>

<style scoped>
b{
    margin-left: 10px;
    margin-right: 10px;
    font-size: 20px;
}

.container {
    padding: 0px 0px 0px 20px;
    display: flex;
    flex-direction: column;
}

.container__year_info{
    align-items: center;
    margin: 5px 10px;
}

.assignment-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  
}

.semester-table caption {
    font-size: 1.2em;
    font-weight: bold;
    padding: 5px;
    background: #e6f7ff;
    text-align: center;
}

.teacher-list {
  width: 250px;
  height: 60vh;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #e6f7ff;
  /* background-color: aliceblue; */
  overflow-y: auto;
  position: sticky;
  top: 20px;
}

.teacher-list h3 {
  margin-top: 0;
  text-align: center;
  color: #333;
}

.teacher-item {
  padding: 8px;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  text-align: center;
  
}

.teacher-item:hover {
  background-color: #f0f0f0;
}

.assignment-table {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow-x: auto;
  margin-bottom: 20px;
  
}

.semester-table{
    margin: 0px 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    font-family: Arial, sans-serif;
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

.table-display-term1{
    background-color: oklch(96.2% 0.044 156.743);
}

.table-display-term2{
    background-color: oklch(93.2% 0.032 255.585);
}

.table-display-other{
    background-color: #e6f7ff;
}

.assignment-cell {
  min-width: 100px;
  height: 50px;
  position: relative;
}

.assignment-cell:hover {
  background-color: #f5f5f5;
}

.assigned-teacher {
  background-color: #e6f7ff;
  padding: 5px 3px;
  border-radius: 3px;
  position: relative;
}

.assigned-teacher button {
  position: absolute;
  right: 2px;
  top: 2px;
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  padding: 0 4px;
}

.empty-slot {
  color: #ccc;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.formula-info{
    margin-bottom: 10px;
}

.highlight{
    color: blue;
}

#filter-button, #save-button{
    background-color: #e9ecef;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: 0 10px;
    transition: transform 0.2s ease;
}

.download-button{
    display: flex;
    flex-direction: row-reverse;
}

.download-button button{
    color: white;
    background-color: blue;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    padding: 10px;
    margin: 20px 0px;
    transition: transform 0.2s ease;
}

select{
    padding: 6px 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 130px;
    transition: box-shadow 0.3s ease;
    margin-right: 10px;
}

.red-text {
    color: red;
    font-weight: bold;
}


</style>