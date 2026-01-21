<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm năm học</h2>
                <label>
                    Năm học
                    <input 
                        v-model="NamHoc" 
                        type="text"
                        placeholder="YYYY-YYYY"
                        pattern="\d{4}-\d{4}"
                        title="Vui lòng nhập theo định dạng YYYY-YYYY (ví dụ: 2025-2026)"
                        @input="kiem_tra_nam_hoc"            
                    >
                </label>
                <label>
                    Số tiết chuẩn:
                    <input v-model="SoTietChuan" type="number" min="1">
                </label>
                <label>
                    Ngày đầu năm:
                    <input v-model="NgayDauNam" type="date" name="" id="">
                </label>
                <label>
                    Ngày cuối năm:
                    <input v-model="NgayCuoiNam" type="date" name="" id="">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_nam_hoc">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/create-modal.css'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    props:{
        isOpen: Boolean
    },

    data(){
        return{
            NamHoc: "",
            SoTietChuan: "",
            NgayDauNam: "",
            NgayCuoiNam: ""

        }
    },

    methods: {
        kiem_tra_nam_hoc(){
            const regex = /^\d{4}-\d{4}$/;
            if (this.NamHoc && !regex.test(this.NamHoc)) {
                this.NamHoc = this.NamHoc.replace(/[^\d-]/g, ''); // Số và dấu -
                
                // Tự động thêm dấu - sau 4 số đầu
                if (this.NamHoc.length === 4 && !this.NamHoc.includes('-')) {
                    this.NamHoc += '-';
                }
            }
        },

        async them_nam_hoc(){
            const regex = /^\d{4}-\d{4}$/;
            if (!regex.test(this.NamHoc)) {
                Swal.fire({
                    title: "Định dạng năm học không hợp lệ!",
                    text: "Vui lòng nhập theo định dạng YYYY-YYYY (ví dụ: 2025-2026)",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return;
            }

            const [startYear, endYear] = this.NamHoc.split('-').map(Number);
            if (endYear - startYear !== 1) {
                Swal.fire({
                    title: "Năm học không hợp lệ!",
                    text: "Năm thứ hai phải lớn hơn năm thứ nhất đúng 1 năm",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return;
            }            
            
            if(!this.NamHoc || !this.SoTietChuan || !this.NgayDauNam || !this.NgayCuoiNam){
                    Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            const namHocMoi = {
                NamHoc: this.NamHoc,
                SoTietChuan: this.SoTietChuan,
                NgayDauNam: this.NgayDauNam,
                NgayCuoiNam: this.NgayCuoiNam
            }
            this.$emit('save', namHocMoi)
        }
    },
}
</script>