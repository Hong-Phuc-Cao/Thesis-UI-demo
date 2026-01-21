<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm chức vụ</h2>
                <label>
                    Tên chức vụ:
                    <input v-model="TenCV" type="text">
                </label>
                <label>
                    Số tiết được miễn:
                    <input v-model="SoTietMien" type="text">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_chuc_vu">Thêm</button>
                </div>                
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/create-modal.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import {API_BASE_URL} from '../../config'
export default {
    props:{
        isOpen: Boolean
    },

    data(){
        return{
            MaCV: "",
            TenCV: "",
            SoTietMien: "",
            danhSachChucVu: [],
        }
    },

    methods: {
        async tao_ma_nhiem_vu(){
            try {
                const response = await axios.get(`
                    ${API_BASE_URL}/chuc-vu/danh-sach-chuc-vu
                `);
                if (!response.data.success) throw new Error("Lỗi khi lấy danh sách giáo viên");
                const danhSachChucVu = response.data.data;
            
                let maxNumber = 0;
                danhSachChucVu.forEach(cv => {
                    const match = cv.MaCV.match(/\d+/); // Lấy phần số từ chuỗi GVxxx
                    if (match) {
                        const num = parseInt(match[0], 10);
                        if (num > maxNumber) maxNumber = num;
                    }
                });

                const newNumber = maxNumber + 1;
                return newNumber < 10 ? `CV00${newNumber}` : newNumber < 100 ? `CV0${newNumber}` : `C${newNumber}`;

            } catch (error) {
                console.error("Lỗi khi tạo mã chức vụ:", error);
                return "CV001";
            }
        }, 

        async them_chuc_vu(){
            if(!this.TenCV || !this.SoTietMien){
                Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            const maMoi = await this.tao_ma_nhiem_vu()
            const chucVuMoi = {
                MaCV: maMoi,
                TenCV: this.TenCV,
                SoTietMien: this.SoTietMien
            }
            this.$emit('save', chucVuMoi)
        }
    },
}
</script>