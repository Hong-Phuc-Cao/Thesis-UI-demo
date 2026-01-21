<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="add-modal">
            <div class="add-modal__content">
                <h2>Thêm nhóm môn học</h2>
                <label>
                    Tên nhóm môn học:
                    <input v-model="TenNhom" type="text">
                </label>
                <div class="modal-actions">
                    <button @click="$emit('close')">Đóng</button>
                    <button @click="them_nhom_mon_hoc">Thêm</button>
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
        isOpen: Boolean,
    },

    data() {
        return {
            MaNhom: "",
            TenNhom: "",
        }
    },

    methods: {
        async tao_ma_nhom(){
            try {
                const response = await axios.get(`
                    ${API_BASE_URL}/nhom-mon-hoc/danh-sach-nhom-mon-hoc
                `);
                if (!response.data.success) throw new Error("Lỗi khi lấy danh sách môn học");
                const danhSachNhomMonHoc = response.data.data;
            
                let maxNumber = 0;
                danhSachNhomMonHoc.forEach(nmh => {
                    const match = nmh.MaNhom.match(/\d+/); // Lấy phần số từ chuỗi GVxxx
                    if (match) {
                        const num = parseInt(match[0], 10);
                        if (num > maxNumber) maxNumber = num;
                    }
                });

                const newNumber = maxNumber + 1;
                return newNumber < 10 ? `NM00${newNumber}` : `NM0${newNumber}`

            } catch (error) {
                console.error("Lỗi khi tạo mã môn học:", error);
                return "MON01";
            }
        },

        async them_nhom_mon_hoc(){
            if(!this.TenNhom){
                    Swal.fire({
                    title: "Thiếu thông tin!",
                    text: "Vui lòng nhập đủ thông tin trước khi lưu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6"
                });
                return 
            }
            const maMoi = await this.tao_ma_nhom()
            const nhomMonHoc = {
                MaNhom: maMoi,
                TenNhom: this.TenNhom,
            }
            this.$emit('save', nhomMonHoc)
        }
    },
}
</script>