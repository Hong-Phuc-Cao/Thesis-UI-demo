<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="edit-modal">
            <div class="edit-modal__content">
                <h2>Sửa thông tin giáo viên</h2>
                <label>
                    Tên giáo viên:
                    <input v-model="HoTenGV" type="text" @input="xuLyNhap" required>
                </label>
                <label>
                    Ngày sinh:
                    <input v-model="NgaySinh" type="date">
                </label>
                <label class="gender-label">
                    Giới tính:
                    <div class="radio-group">
                        <label class="radio-option">
                            Nam:
                            <input name="GioiTinh" type="radio" value="1" v-model="GioiTinh">
                        </label>
                        <label class="radio-option">
                            Nữ:
                            <input name="GioiTinh" type="radio" value="0" v-model="GioiTinh">
                        </label>
                    </div>
                </label>
                <label>
                    Số điện thoại:
                    <input v-model="SoDT" type="text">
                </label>
                <label>
                    Email:
                    <input v-model="Mail" type="email">
                </label>
                <label>
                    Địa chỉ:
                    <input v-model="DiaChi" type="text">
                </label>
                <label>
                    Bộ môn:
                    <select v-model="MaBM">
                        <option disabled value="">-- Chọn bộ môn --</option>
                        <option v-for="boMon in danhSachBoMon" :key="boMon.MaBM" :value="boMon.MaBM">
                            {{ boMon.TenBM }}
                        </option>
                    </select>
                </label>    
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="luu_thong_tin">Lưu</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import '@/assets/edit-modal.css'
import {API_BASE_URL} from '../../config'
export default {
    props:{
        isOpen: Boolean,
        giaoVien: Object,
    },

    data(){
        return {
            HoTenGV: "",
            NgaySinh: "",
            GioiTinh: "",
            SoDT: "",
            Mail: "",
            DiaChi: "",
            MaBM: "",
            danhSachBoMon: [],
        }
    },

    watch:{
        giaoVien:{
            immediate: true,
            deep: true,
            handler(newVal){
                if (newVal) {
                    this.HoTenGV = newVal.HoTenGV || "";
                    this.NgaySinh = this.formatDateForInput(this.giaoVien.NgaySinh) || "";
                    this.GioiTinh = newVal.GioiTinh?.toString() || "1";
                    this.SoDT = newVal.SoDT || "";
                    this.Mail = newVal.Mail || "";
                    this.DiaChi = newVal.DiaChi || "";
                    this.MaBM = newVal.MaBM || "";
                }
            }
        }
    },

    async created(){
        await this.hien_danh_sach_bo_mon()
    },

    methods: {
        formatDateForInput(dateString) {
            if (!dateString) return null;
            
            // Nếu ngày đã ở định dạng yyyy-mm-dd (đúng cho input date)
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }
            
            // Xử lý các định dạng ngày khác
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null;
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        },

        async hien_danh_sach_bo_mon(){
            try{
                const response = await axios.get(`${API_BASE_URL}/bo-mon/danh-sach-bo-mon`)
                if(response.data.success){
                    this.danhSachBoMon = response.data.data
                }
            }catch(error){
                console.log('Lỗi hiện DS bộ môn')
                console.log(error)
            }
        },

        luu_thong_tin(){

            const giaoVienDaSua = {
                HoTenGV: this.HoTenGV,
                NgaySinh: this.NgaySinh,
                GioiTinh: this.GioiTinh,
                SoDT: this.SoDT,
                Mail: this.Mail,
                DiaChi: this.DiaChi,
                MaBM: this.MaBM,
                MaGV: this.giaoVien.MaGV
            }
            this.$emit('save', giaoVienDaSua);
        },

        xuLyNhap() {
            // Tự động xóa ký tự không hợp lệ khi nhập
            this.HoTenGV = this.HoTenGV.replace(/[^A-Za-zÀ-ỹ\s]/g, '');
        }
    }
}
</script>