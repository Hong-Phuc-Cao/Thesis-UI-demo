<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm nhiệm vụ</h2>
                <label>
                    Tên nhiệm vụ:
                    <input v-model="TenNV" type="text">
                </label>
                <label>
                    Số tiết được miễn:
                    <input v-model="SoTietMien" type="number" name="" id="" min="0">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_nhiem_vu">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/create-modal.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import {API_BASE_URL} from '../../config'
export default {
    props:{
        isOpen: Boolean
    },

    data() {
        return {
            MaNV: "",
            TenNV: "",
            SoTietMien: "",
        }
    },

    methods: {
        async tao_ma_nhiem_vu(){
            try {
                const response = await axios.get(`
                    ${API_BASE_URL}/nhiem-vu/danh-sach-nhiem-vu
                `);
                if (!response.data.success) throw new Error("Lỗi khi lấy danh sách giáo viên");
                const danhSachNV = response.data.data;
            
                let maxNumber = 0;
                danhSachNV.forEach(nv => {
                    const match = nv.MaNV.match(/\d+/); // Lấy phần số từ chuỗi GVxxx
                    if (match) {
                        const num = parseInt(match[0], 10);
                        if (num > maxNumber) maxNumber = num;
                }
                });

                const newNumber = maxNumber + 1;
                return newNumber < 10 ? `NV00${newNumber}` : newNumber < 100 ? `NV0${newNumber}` : `NV${newNumber}`;

            } catch (error) {
                console.error("Lỗi khi tạo mã nhiệm vụ:", error);
                return "NV001";
            }
        },

        async them_nhiem_vu(){
            if(!this.TenNV || !this.SoTietMien){
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
            const nhiemVuMoi = {
                MaNV: maMoi,
                TenNV: this.TenNV,
                SoTietMien: this.SoTietMien
            }
            this.$emit('save', nhiemVuMoi)
        }
    },
}
</script>