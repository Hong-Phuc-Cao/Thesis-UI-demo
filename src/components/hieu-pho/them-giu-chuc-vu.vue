<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm giữ chức vụ</h2>
                <label for="">
                    Tìm giáo viên:
                    <input v-model="tuKhoaTimKiem" type="text" placeholder="Nhập mã giáo viên hoặc tên giáo viên">
                    <button id="search-button" @click="goi_api_tim_giao_vien">🔍</button>
                </label>

                <label v-if="hienKetQua" for="">
                    Kết quả:
                
                    <div class="container__table">
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã giáo viên</th>
                                    <th>Tên giáo viên</th>
                                    <th>Mã bộ môn</th>
                                    <th>Tên bộ môn</th>
                                    <th>Chọn</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(gv, index) in ketQuaTimKiem" :key="gv.MaGV">
                                    <td>{{index + 1}}</td>
                                    <td>{{gv.MaGV}}</td>
                                    <td>{{gv.HoTenGV}}</td>
                                    <td>{{gv.MaBM}}</td>
                                    <td>{{gv.TenBM}}</td>
                                    <td>
                                        <button id="add-button" @click="them_vao_the_input(gv.MaGV)" title="Chọn giáo viên này">➕</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </label>

                <label for="">
                    Nhập mã giáo viên:
                    <input v-model="MaGV" type="text" name="" id="" placeholder="Nhập mã giáo viên muốn phân công">
                </label>

                <label for="">
                    Chọn chức vụ:
                    <select v-model="MaCV" name="" id="">
                        <option disabled value="">-- Chọn chức vụ --</option>
                        <option v-for="chucVu in danhSachChucVu" :key="chucVu.MaCV" :value="chucVu.MaCV">
                            {{chucVu.TenCV}}
                        </option>
                    </select>
                </label>

                <label for="">
                    Năm học:
                    <select v-model="namHocDuocChon" name="" id="">
                        <option disabled value="">-- Chọn năm học --</option>
                        <option v-for="nh in danhSachNamHoc" :key="nh.NamHoc" :value="nh.NamHoc">
                            {{nh.NamHoc}}
                        </option>
                    </select>
                </label>
                
                <label for="">
                    Học kỳ:
                    <select v-model="hocKyDuocChon" name="" id="">
                        <option disabled value="">-- Chọn học kỳ --</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_giu_chuc_vu">Thêm</button>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import {lay_nam_hoc, lay_hoc_ky} from '../../utils/lay_nam_hoc_va_hoc_ky'
import {so_sanh_nam_hoc} from '../../utils/so-sanh-nam'
import {API_BASE_URL} from '../../config'

export default {
    props:{
        isOpen: Boolean,
    },

    data(){ 
        return{
            hienKetQua: false,
            MaGV: "",
            MaCV: "",
            HocKy: "",
            NamHoc: "",
            namHocDuocChon: "",
            hocKyDuocChon: "",
            danhSachChucVu: [],
            danhSachNamHoc: [],
            tuKhoaTimKiem: "",
            ketQuaTimKiem: [],
            duocThem: false,
        }
    },

    watch:{
        namHocDuocChon(newVal) {
            this.updateDuocThem();
        },
        hocKyDuocChon() {
            this.updateDuocThem();
        },
        HocKy() {
            this.updateDuocThem();
        },
        NamHoc() {
            this.updateDuocThem();
        },
    },

    async created() {
        await this.lay_nam_hoc_va_hoc_ky()
        await this.hien_danh_sach_chuc_vu()
        await this.hien_danh_sach_nam_hoc()
    },

    methods: {
        updateDuocThem() {
            const ketQua = so_sanh_nam_hoc(this.NamHoc, this.namHocDuocChon);
            if (ketQua == 'nam_truoc') {
                this.duocThem = false;
            } else if (ketQua == 'nam_sau') {
                this.duocThem = true;
            } else if (ketQua == 'nam_hien_tai') {
                // Chuyển đổi sang số để so sánh
                const hocKy = parseInt(this.HocKy) || 0;
                const hocKyDuocChon = parseInt(this.hocKyDuocChon) || 0;
                this.duocThem = hocKyDuocChon >= hocKy;
            } else {
                this.duocThem = false; // Trường hợp không hợp lệ
            }
        },

        async lay_nam_hoc_va_hoc_ky(){
            try{
                this.NamHoc = await lay_nam_hoc()
                this.HocKy = await lay_hoc_ky()
            }catch(error){
                console.log('Lỗi lấy năm học và học kỳ: ', error);
            }
        },

        async hien_danh_sach_chuc_vu(){
            try{
                const response = await axios.get(`${API_BASE_URL}/chuc-vu/danh-sach-chuc-vu`)
                if(response.data.success){
                    this.danhSachChucVu = response.data.data
                }
                //console.log(this.danhSachChucVu);
            }catch(error){
                console.log(error)
                throw error
            }
        },

        async hien_danh_sach_nam_hoc(){
            try{
                const response = await axios.get(`${API_BASE_URL}/nam-hoc/danh-sach-nam-hoc`)
                if(response.data.success){
                    this.danhSachNamHoc = response.data.data
                }
            }catch(error){
                console.log(error);
                throw error
            }
        },

        async goi_api_tim_giao_vien(){
            this.hienKetQua = true
            //console.log(this.tuKhoaTimKiem);
            this.MaGV = ""
            try{
                const response = await axios.get(`
                    ${API_BASE_URL}/giao-vien/tim-giao-vien?keyword=${this.tuKhoaTimKiem}
                `)
                if(response.data.success){
                    this.ketQuaTimKiem = response.data.data
                }
                //console.log(this.ketQuaTimKiem);
                
            }catch(error){
                console.log('Lỗi tìm gv: ',error);
                throw error
            }
        },

        them_vao_the_input(magv){
            this.MaGV = magv
            //console.log(this.MaGV);
        },

        reset(){
            this.hienKetQua = false
            this.tuKhoaTimKiem = ''
            this.ketQuaTimKiem = ''
            this.MaGV = ''
            this.MaCV = ''
        },

        them_giu_chuc_vu(){
            if(!this.duocThem){
                Swal.fire({
                    title: "Thông tin không hợp lệ!",
                    text: "Vui lòng chọn năm học hợp lệ, không thể chọn năm học - học kỳ cũ",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                console.log(this.NamHoc);
                console.log(this.namHocDuocChon);
                return 
            } 

            if(!this.MaGV || !this.MaCV){
                Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }

            const giuChucVuMoi = {
                MaGV: this.MaGV.toUpperCase(),
                MaCV: this.MaCV,
                HocKy: this.HocKy,
                NamHoc: this.NamHoc
            }
            //console.log(giuChucVuMoi)
            this.$emit('save', giuChucVuMoi)
            this.reset()
        }
    },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Khung modal */
.add-modal {
    gap: 10px;
    background: white;
    width: 500px;
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Nội dung modal */
.add-modal__content {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-modal h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  text-align: center;
  font-size: 1.5rem;
}

/* Style chung cho các input */
.add-modal__content label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 500;
  color: #34495e;
}

/* Style cho label chứa thanh tìm kiếm và nút kính lúp */
.add-modal__content label:has(#search-button) {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.add-modal__content label:has(#search-button) input[type="text"] {
  flex-grow: 1;
}

.add-modal__content label:has(#search-button) button#search-button {
  padding: 7px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #f1f1f1;
  cursor: pointer;
  transition: all 0.2s;
}

.add-modal__content input,
.add-modal__content select {
  padding: 7px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.add-modal__content input:focus,
.add-modal__content select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

/* Radio button group */
.gender-label {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.radio-group {
    display: flex;
    gap: 20px;
    margin-top: 5px;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    margin: 0;
    width: auto;
}

/* Nút thêm và đóng */
.modal-actions {
    display: flex;
    justify-content: space-between;
}

.add-modal__content button {
  padding: 10px 15px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  align-self: flex-end;
}

.add-modal__content button:hover:first-child {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.add-modal__content button:hover:last-child {
  background-color: green;
  color: white;
  border-color: green;
}

#search-button:hover,
#add-button:hover {
    background-color: #e9ecef;
    color: white;
    border-color: #e9ecef;
}

table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin: 10px 1px;
    overflow: hidden;
}

#add-button {
    position: relative;
}

#add-button:hover:after {
    content: attr(title);
    position: absolute;
    top: -30px;
    left: 5%;
    transform: translateX(-50%);
    background-color: #34495e;
    color: white;
    padding: 5px;
    border-radius: 4px;
    font-size: 10px;
    white-space: nowrap;
    z-index: 10;
}

th, td {
    padding: 8px 7px;
    border: 1px solid #ccc;
    text-align: center;
}

th {
    background: linear-gradient(to bottom, #3c8dbc, #367fa9);
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

</style>