<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm giáo viên</h2>
                <label>
                    Tên giáo viên:
                    <input v-model="HoTenGV" type="text" @input="xuLyNhap">
                </label>
                <label>
                    Ngày sinh:
                    <input v-model="NgaySinh" type="date" :max="maxDate">
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
                    <select v-model="MaBM" id="">
                        <option disabled value="">-- Chọn bộ môn --</option>
                        <option v-for="boMon in danhSachBoMon" :key="boMon.id" :value="boMon.MaBM">
                            {{boMon.TenBM}}
                        </option>
                    </select>
                </label>    
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_giao_vien">Thêm</button>
                </div>
                
            </div>            
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import '@/assets/create-modal.css'
import {API_BASE_URL} from '../../config'

export default {
    props:{
        isOpen: Boolean,
    },

    data(){
        return{
            HoTenGV: "",
            NgaySinh: "",
            GioiTinh: "",
            SoDT: "",
            Mail: "",
            DiaChi: "",
            MaBM: "",
            danhSachBoMon: [],
            maxDate: new Date().toISOString().split('T')[0]
        }
    },

    async created(){
      await this.hien_danh_sach_bo_mon()
    },

    methods:{
        async hien_danh_sach_bo_mon(){
            try{
              const response = await axios.get(`
                ${API_BASE_URL}/bo-mon/danh-sach-bo-mon
              `)
              if(response.data.success){
                this.danhSachBoMon = response.data.data
              }
            }catch(error){
                console.log('Lỗi hiện DS bộ môn')
                console.log(error)
            }
        },

        lam_moi_form() {
            this.HoTenGV = "";
            this.NgaySinh = "";
            this.GioiTinh = "1";
            this.SoDT = "";
            this.Mail = "";
            this.DiaChi = "";
            this.MaBM = "";
        },

        async tao_ma_giao_vien(){
            try {
                const response = await axios.get(`
                    ${API_BASE_URL}/giao-vien/danh-sach-giao-vien
                `);
                if (!response.data.success) throw new Error("Lỗi khi lấy danh sách giáo viên");
                const danhSachGV = response.data.data;
            
                let maxNumber = 0;
                danhSachGV.forEach(gv => {
                    const match = gv.MaGV.match(/\d+/); // Lấy phần số từ chuỗi GVxxx
                    if (match) {
                        const num = parseInt(match[0], 10);
                        if (num > maxNumber) maxNumber = num;
                }
                });

                const newNumber = maxNumber + 1;
                return newNumber < 10 ? `GV00${newNumber}` : newNumber < 100 ? `GV0${newNumber}` : `GV${newNumber}`;

            } catch (error) {
                console.error("Lỗi khi tạo mã giáo viên:", error);
                return "GV001";
            }
        },

        async them_giao_vien(){
            if(this.NgaySinh){
                const ngayDuocChon = new Date(this.NgaySinh)
                const today = new Date()
                today.setHours(0,0,0,0)
                if (ngayDuocChon > today) {
                    Swal.fire({
                        title: "Ngày sinh không hợp lệ!",
                        text: "Ngày sinh không được là ngày trong tương lai.",
                        icon: "error",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#3085d6"
                    });
                    return;
                }
            }
            if(!this.HoTenGV || !this.NgaySinh || !this.GioiTinh ||
                !this.SoDT || !this.Mail || !this.DiaChi || !this.MaBM
            ){
                Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            const maMoi = await this.tao_ma_giao_vien()
            const giaoVienMoi = {
                MaGV: maMoi,
                HoTenGV: this.HoTenGV,
                NgaySinh: this.NgaySinh,
                GioiTinh: this.GioiTinh,
                SoDT: this.SoDT,
                Mail: this.Mail,
                DiaChi: this.DiaChi,
                MaBM: this.MaBM
            };
            
            this.$emit('save', giaoVienMoi);
            this.lam_moi_form();
        },
        
        xuLyNhap() {
            // Tự động xóa ký tự không hợp lệ khi nhập
            this.HoTenGV = this.HoTenGV.replace(/[^A-Za-zÀ-ỹ\s]/g, '');
        }        
    }
}
</script>
